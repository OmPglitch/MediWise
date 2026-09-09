import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3 rounded-lg border shadow-xl flex items-start gap-2.5 text-xs animate-in slide-in-from-bottom-2 fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-[#0d1424] border-emerald-500/60 text-white'
              : toast.type === 'warning'
              ? 'bg-[#0d1424] border-amber-500/60 text-white'
              : toast.type === 'error'
              ? 'bg-[#0d1424] border-red-500/60 text-white'
              : 'bg-[#0d1424] border-cyan-500/60 text-white'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}

          <div className="flex-1">
            <span className="font-bold text-white font-['Hanken_Grotesk'] block leading-tight">
              {toast.title}
            </span>
            <span className="text-[#cbd5e1] text-[11px] leading-tight block mt-0.5">
              {toast.message}
            </span>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#64748b] hover:text-white p-0.5 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
