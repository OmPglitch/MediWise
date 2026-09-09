import { useState, useEffect, useRef, useCallback } from 'react';
import { WebSocketMessage } from '../types';

export interface UseWebSocketReturn {
  isConnected: boolean;
  connectionState: 'connected' | 'reconnecting' | 'disconnected';
  lastMessage: WebSocketMessage | null;
  sendMessage: (data: any) => void;
}

export function useWebSocket(
  onMessageReceived?: (msg: WebSocketMessage) => void
): UseWebSocketReturn {
  const [connectionState, setConnectionState] = useState<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  const connect = useCallback(() => {
    if (!isMounted.current) return;

    // In dev: Vite proxies /ws → Express server (port 5000).
    // Use the same origin as the Vite dev server (port 3000) so the proxy works.
    // In production: connect directly to the same host/port serving the app.
    const isSecure = window.location.protocol === 'https:';
    const wsProto  = isSecure ? 'wss:' : 'ws:';
    const wsUrl    = `${wsProto}//${window.location.host}/ws`;

    try {
      setConnectionState((prev) => (prev === 'disconnected' ? 'reconnecting' : prev));
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMounted.current) return;
        setConnectionState('connected');
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        if (!isMounted.current) return;
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.channel && parsed.payload) {
            const typedMsg = parsed as WebSocketMessage;
            setLastMessage(typedMsg);
            onMessageReceived?.(typedMsg);
          }
        } catch (e) {
          // ignore non-json messages
        }
      };

      ws.onerror = () => {
        // Will trigger ws.onclose
      };

      ws.onclose = () => {
        if (!isMounted.current) return;
        setConnectionState('reconnecting');
        wsRef.current = null;

        // Exponential backoff reconnect
        const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts.current), 15000);
        reconnectAttempts.current += 1;
        reconnectTimer.current = setTimeout(() => {
          connect();
        }, delay);
      };
    } catch (err) {
      if (!isMounted.current) return;
      setConnectionState('disconnected');
    }
  }, [onMessageReceived]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return {
    isConnected: connectionState === 'connected',
    connectionState,
    lastMessage,
    sendMessage,
  };
}
