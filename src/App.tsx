import React, { useState, useEffect } from 'react';
import { EnterpriseHeader } from './components/EnterpriseHeader';
import { RailDrawer } from './components/RailDrawer';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { DrugCatalogScreen } from './components/screens/DrugCatalogScreen';
import { PartnerNetworkScreen } from './components/screens/PartnerNetworkScreen';
import { ComplianceScreen } from './components/screens/ComplianceScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { PatientPortalScreen } from './components/screens/PatientPortalScreen';
import { ConfigDiffModal } from './components/modals/ConfigDiffModal';
import { RollbackModal } from './components/modals/RollbackModal';
import { EmergencyOverrideModal } from './components/modals/EmergencyOverrideModal';
import { DoctorSlipModal } from './components/modals/DoctorSlipModal';
import { AuthModal } from './components/modals/AuthModal';
import { ProfileSettingsModal } from './components/modals/ProfileSettingsModal';
import { SessionLockModal } from './components/modals/SessionLockModal';
import { AuthScreen } from './components/screens/AuthScreen';
import { DeliveryManagementScreen } from './components/screens/DeliveryManagementScreen';
import { OrderDeliveryModal } from './components/modals/OrderDeliveryModal';
import { DeliveryTrackingModal } from './components/modals/DeliveryTrackingModal';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
// Phase 3 screens
import { FHIRIngestionScreen } from './components/screens/FHIRIngestionScreen';
import { IndiaStackScreen } from './components/screens/IndiaStackScreen';
// Phase 4 screen
import { CommerceScreen } from './components/screens/CommerceScreen';
// Phase 5 screens
import { FederatedCatalogScreen } from './components/screens/FederatedCatalogScreen';
import { FleetTelemetryScreen } from './components/screens/FleetTelemetryScreen';
import {
  INITIAL_DRUGS,
  INITIAL_PARTNERS,
  INITIAL_AUDIT_EVENTS,
  INITIAL_EVENT_BUS_LOGS,
  INITIAL_SERVICE_GATEWAYS,
  INITIAL_SYSTEM_CONFIG,
} from './data/mockData';
import { DEMO_USERS, ROLE_DETAILS } from './data/mockUsers';
import { MOCK_DELIVERIES } from './data/mockDeliveries';
import {
  ActiveTab,
  TenantScope,
  DrugItem,
  PartnerPharmacy,
  AuditEvent,
  EventBusMessage,
  UserProfile,
  UserRole,
  AuthMode,
  DeliveryOrder,
  ThemeMode,
  RxScanState,
  RxScanResult,
  WebSocketMessage,
} from './types';
import {
  getAllDeliveries, saveAllDeliveries,
  getAllAuditEvents, saveAllAuditEvents,
  getAllDrugs, saveAllDrugs,
  clearAllLocalData,
} from './lib/db';
import { usePersistedList } from './hooks/usePersistedState';
import { useWebSocket } from './hooks/useWebSocket';

export function App() {
  // Visual Theme State (Dark / Light Mode)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mediwise_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  // Apply .light class to document.documentElement and persist to localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    try {
      localStorage.setItem('mediwise_theme', theme);
    } catch {
      // Ignore quota errors
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      addToast(
        'info',
        next === 'light' ? 'Sterile Light Mode' : 'Clinical Dark Mode',
        `Switched display ergonomics to ${next} theme.`
      );
      return next;
    });
  };

  const handleSelectTheme = (mode: ThemeMode) => {
    setTheme(mode);
    addToast(
      'info',
      mode === 'light' ? 'Sterile Light Mode' : 'Clinical Dark Mode',
      `Switched display ergonomics to ${mode} theme.`
    );
  };

  // Authentication & Identity State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_USERS.cmio);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSessionLocked, setIsSessionLocked] = useState<boolean>(false);

  // Deliveries & Prescription Tracking State (Amazon-Style & IndexedDB Persisted)
  const [deliveries, setDeliveries] = usePersistedList<DeliveryOrder>(
    getAllDeliveries,
    saveAllDeliveries,
    MOCK_DELIVERIES
  );
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [orderModalDrug, setOrderModalDrug] = useState<DrugItem | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);
  const [trackingOrder, setTrackingOrder] = useState<DeliveryOrder | null>(null);

  // Navigation & Scope
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [tenantScope, setTenantScope] = useState<TenantScope>('all');

  // Core Data (IndexedDB Persisted)
  const [drugs, setDrugs] = usePersistedList<DrugItem>(
    getAllDrugs,
    saveAllDrugs,
    INITIAL_DRUGS
  );
  const [selectedDrugId, setSelectedDrugId] = useState<string>('drug-atorvastatin');
  const [partners, setPartners] = useState<PartnerPharmacy[]>(INITIAL_PARTNERS);
  const [auditEvents, setAuditEvents] = usePersistedList<AuditEvent>(
    getAllAuditEvents,
    saveAllAuditEvents,
    INITIAL_AUDIT_EVENTS
  );
  const [eventLogs, setEventLogs] = useState<EventBusMessage[]>(INITIAL_EVENT_BUS_LOGS);
  const [gateways, setGateways] = useState(INITIAL_SERVICE_GATEWAYS);
  const [systemConfig, setSystemConfig] = useState(INITIAL_SYSTEM_CONFIG);

  // Sprint 2.1 — Gemini Prescription Scanner State
  const [rxScanState, setRxScanState] = useState<RxScanState>({
    isScanning: false,
    result: null,
    error: null,
    uploadedImageUrl: null,
  });

  const handleScanPrescription = async (file: File) => {
    setRxScanState({ isScanning: true, result: null, error: null, uploadedImageUrl: URL.createObjectURL(file) });
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '');
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/rx/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type || 'image/jpeg' }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({ error: 'Server error' }));
        throw new Error(errBody.error || `HTTP ${response.status}`);
      }

      const result: RxScanResult = await response.json();
      // Cross-reference against formulary
      const matched = drugs.find(
        (d) =>
          d.brandName.toLowerCase().includes(result.drugName.toLowerCase()) ||
          d.activeSalt.toLowerCase().includes(result.drugName.toLowerCase())
      );
      if (matched && !result.matchedDrugId) {
        result.matchedDrugId = matched.id;
        result.matchedDrugName = `${matched.activeSalt} (${matched.strength}) — Generic of ${matched.brandName}`;
      }
      setRxScanState({ isScanning: false, result, error: null, uploadedImageUrl: URL.createObjectURL(file) });
      addToast('success', 'Prescription Scanned', `Extracted: ${result.drugName} (${(result.confidence * 100).toFixed(0)}% confidence)`);
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to analyze prescription. Please try again.';
      setRxScanState({ isScanning: false, result: null, error: errMsg, uploadedImageUrl: null });
      addToast('error', 'Scan Failed', errMsg);
    }
  };

  const handleResetScan = () => {
    setRxScanState({ isScanning: false, result: null, error: null, uploadedImageUrl: null });
  };

  // Sprint 2.3 — WebSocket Gateway Integration
  const handleWebSocketMessage = React.useCallback((msg: WebSocketMessage) => {
    if (msg.channel === 'event-bus') {
      setEventLogs((prev) => [msg.payload, ...prev.slice(0, 49)]);
    } else if (msg.channel === 'cold-chain-temp') {
      const reading = msg.payload;
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === reading.orderId
            ? {
                ...d,
                coldChain: {
                  ...d.coldChain,
                  currentTempCelsius: reading.tempCelsius,
                  sensorStatus: reading.sensorStatus,
                },
              }
            : d
        )
      );
    } else if (msg.channel === 'partner-sync') {
      const sync = msg.payload;
      setPartners((prev) =>
        prev.map((p) =>
          p.id === sync.partnerId
            ? {
                ...p,
                feedStatus: sync.feedStatus,
                syncInfo: {
                  ...p.syncInfo,
                  latencyMs: sync.latencyMs,
                  skuCount: sync.skuCount,
                  lastSyncTime: 'Just now (WSS Push)',
                },
              }
            : p
        )
      );
    } else if (msg.channel === 'delivery-status') {
      const update = msg.payload;
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === update.orderId
            ? {
                ...d,
                status: update.newStatus,
                statusLabel: update.statusLabel,
              }
            : d
        )
      );
    }
  }, [setDeliveries, setPartners]);

  const { connectionState } = useWebSocket(handleWebSocketMessage);

  // Rollback state (triggers Screen 9 behavior)
  const [isRollbackActive, setIsRollbackActive] = useState<boolean>(false);

  // Action status indicators
  const [isAuditing, setIsAuditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pingingId, setPingingId] = useState<string | null>(null);
  const [savedRefills, setSavedRefills] = useState<string[]>(['drug-atorvastatin']);

  // Modals
  const [showConfigDiffModal, setShowConfigDiffModal] = useState(false);
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showDoctorSlipModal, setShowDoctorSlipModal] = useState(false);
  const [doctorSlipDrug, setDoctorSlipDrug] = useState<DrugItem | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'info' | 'error', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut listener: Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        addToast('info', 'Command Bar Active', 'Filtering clinical mesh entities: NDC, Salt, or Pharmacy Partner.');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Action Handlers
  const handleInspectDrug = (drugId: string) => {
    setSelectedDrugId(drugId);
    setActiveTab('catalog');
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      const newAudit: AuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
        hash: '0x3C9A...41e8',
        actor: 'dr.v.rao@mediwise.io',
        actorRole: 'CLINICAL_LEAD',
        action: 'Manual Compliance Audit Cycle',
        resource: 'Mesh: 18,924 Active Compositions',
        complianceCode: '21 CFR Part 320',
        ip: '10.128.0.1 (K8s Control Plane)',
        status: 'Verified Pass',
        statusType: 'success',
      };
      setAuditEvents((prev) => [newAudit, ...prev]);
      addToast('success', 'Compliance Audit Complete', '18,924 mapped formulations and partner SLAs validated with 0 discrepancies.');
    }, 1500);
  };

  const handleSyncFeeds = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const newLog: EventBusMessage = {
        id: `ev-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString() + 'Z',
        source: 'BROADCAST_SYNC',
        title: 'Full Network Catalog Synchronized',
        description: '142 partner pharmacy inventory feeds refreshed with 4.2M live SKUs.',
        badge: 'HTTP 200 OK',
        badgeType: 'emerald',
        meta: 'P95: 112ms',
      };
      setEventLogs((prev) => [newLog, ...prev]);
      addToast('success', 'Stock Feeds Synchronized', 'Real-time pricing delta updated across Apollo, 1mg, Netmeds, and MedPlus.');
    }, 1200);
  };

  const handleExportTelemetry = () => {
    const telemetryData = {
      cluster: 'production-east-us1',
      timestamp: new Date().toISOString(),
      activeNodes: '24/24 Online',
      uptimeSla: '99.98%',
      metrics: {
        totalReferralGMV: '₹482,910',
        substitutionsDriven: '128,450 Rx',
        searchLatencyP95: '186ms',
        partnerPharmacies: 142,
      },
      auditHeight: 4829102,
      version: isRollbackActive ? 'v4.11.9-STABLE' : systemConfig.configVersion,
    };
    const blob = new Blob([JSON.stringify(telemetryData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mediwise-telemetry-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('info', 'Telemetry Exported', 'Downloaded cluster telemetry snapshot JSON.');
  };

  const handleTestPing = (gatewayId: string) => {
    setPingingId(gatewayId);
    setTimeout(() => {
      setPingingId(null);
      const gw = gateways.find((g) => g.id === gatewayId);
      addToast('success', 'Gateway Ping Succeeded', `${gw?.name || 'Gateway'} responded with ${gw?.latency || '32ms'} roundtrip TLS 1.3 handshakes.`);
    }, 800);
  };

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      addToast('success', 'Merkle Root Cryptographically Verified', 'Audit ledger block #4,829,102 matches root HSM signature (FIPS 140-2 L3).');
    }, 1400);
  };

  const handleDeployConfigDiff = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setShowConfigDiffModal(false);
      setIsRollbackActive(false);
      setSystemConfig((prev) => ({
        ...prev,
        configVersion: 'v4.12.0-STABLE',
        bioeqConfidenceFloor: 0.9800,
        vaultRotationInterval: '14d',
      }));
      const newAudit: AuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
        hash: '0x8A92...f001',
        actor: 'v.raman.sec@mediwise.io',
        actorRole: 'SUPER_ADMIN',
        action: 'Hotfix Manifest Deployed',
        resource: 'ClusterConfig: v4.12.0-STABLE',
        complianceCode: 'SOC2 CC6.1',
        ip: '10.128.0.5 (Deployment Daemon)',
        status: 'Verified Pass',
        statusType: 'success',
      };
      setAuditEvents((prev) => [newAudit, ...prev]);
      addToast('success', 'Hotfix v4.12.0 Deployed', 'Rolling restart completed across 16 worker pods with zero downtime.');
    }, 1500);
  };

  const handleConfirmRollback = () => {
    setIsRollingBack(true);
    setTimeout(() => {
      setIsRollingBack(false);
      setShowRollbackModal(false);
      setIsRollbackActive(true);
      setSystemConfig((prev) => ({
        ...prev,
        configVersion: 'v4.11.9-STABLE',
        bioeqConfidenceFloor: 0.9750,
        vaultRotationInterval: '30d',
      }));
      const rollbackAudit: AuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
        hash: '0x1C22...99ee',
        actor: 'dr.v.rao@mediwise.io',
        actorRole: 'SUPER_ADMIN',
        action: 'Emergency Production Reversion',
        resource: 'ClusterConfig: Reverted to v4.11.9-STABLE',
        complianceCode: '21 CFR Part 320',
        ip: '10.128.0.1 (Emergency Console)',
        status: 'Action Required',
        statusType: 'warning',
      };
      setAuditEvents((prev) => [rollbackAudit, ...prev]);
      addToast('warning', 'Production Rollback Executed', 'Cluster successfully reverted to v4.11.9-STABLE. Pods synchronized.');
    }, 1500);
  };

  const handleClearLocalData = async () => {
    try {
      await clearAllLocalData();
      setDeliveries(MOCK_DELIVERIES);
      setDrugs(INITIAL_DRUGS);
      setAuditEvents(INITIAL_AUDIT_EVENTS);
      addToast('success', 'Local Data Cleared', 'IndexedDB stores purged and reset to factory defaults.');
    } catch (err) {
      addToast('error', 'Clear Failed', 'Could not clear local data. Please try again.');
    }
  };
    const overrideAudit: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
      hash: '0xEE44...81a0',
      actor: 'dr.v.rao@mediwise.io',
      actorRole: 'SUPER_ADMIN',
      action: `Emergency Override: ${reason}`,
      resource: 'ClusterSecurity: Elevated Privileges Granted',
      complianceCode: 'HIPAA Sec. 164.312',
      ip: '10.128.0.1 (Attending CMIO)',
      status: 'Action Required',
      statusType: 'warning',
    };
    setAuditEvents((prev) => [overrideAudit, ...prev]);
    addToast('error', 'Emergency Override Activated', `Reason logged to cryptographic ledger: "${reason}". Cloudflare rate bypass active.`);
  };

  const handleOpenDoctorSlip = (drug: DrugItem) => {
    setDoctorSlipDrug(drug);
    setShowDoctorSlipModal(true);
  };

  const handleToggleRefill = (drugId: string) => {
    if (savedRefills.includes(drugId)) {
      setSavedRefills((prev) => prev.filter((id) => id !== drugId));
      addToast('info', 'Refill Removed', 'Generic removed from monthly subscription list.');
    } else {
      setSavedRefills((prev) => [...prev, drugId]);
      addToast('success', 'Generic Refill Saved', 'Added to monthly automated delivery list with 87% savings.');
    }
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    // Append cryptographic audit log
    const authAudit: AuditEvent = {
      id: `audit-auth-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
      hash: `0x${Math.random().toString(16).substring(2, 6).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toLowerCase()}`,
      actor: user.email,
      actorRole: user.role === 'cmio' ? 'CLINICAL_LEAD' : user.role === 'compliance_officer' ? 'SUPER_ADMIN' : 'PHARMACY_WEBHOOK',
      action: `Identity Auth: Signed in via ${user.twoFactorEnabled ? '2FA TOTP/FIDO2' : 'Password Credentials'}`,
      resource: `Workstation Session (${user.device})`,
      complianceCode: 'HIPAA Sec. 164.312(d)',
      ip: user.ipAddress,
      status: 'Verified Pass',
      statusType: 'success',
    };
    setAuditEvents((prev) => [authAudit, ...prev]);
    addToast('success', 'Session Authorized', `Signed in as ${user.name} (${user.roleTitle}).`);

    // Auto navigate to role recommended view
    if (user.role === 'patient') {
      setActiveTab('patient');
    } else if (user.role === 'pharmacy_partner') {
      setActiveTab('partners');
    } else if (user.role === 'compliance_officer') {
      setActiveTab('compliance');
    } else {
      setActiveTab('overview');
    }
  };

  const handleRegisterSuccess = (newUser: UserProfile) => {
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    // Append cryptographic audit log
    const regAudit: AuditEvent = {
      id: `audit-reg-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
      hash: `0x${Math.random().toString(16).substring(2, 6).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toLowerCase()}`,
      actor: newUser.email,
      actorRole: newUser.role === 'cmio' ? 'CLINICAL_LEAD' : 'SUPER_ADMIN',
      action: `Identity Provisioned: New ${newUser.role.toUpperCase()} Account Registered`,
      resource: `Clinical Key Vault (${newUser.organization})`,
      complianceCode: 'HIPAA Sec. 164.308(a)(3)',
      ip: newUser.ipAddress,
      status: 'Verified Pass',
      statusType: 'success',
    };
    setAuditEvents((prev) => [regAudit, ...prev]);
    addToast('success', 'Account Provisioned', `Welcome ${newUser.name}! Identity verified with FIPS 140-2.`);

    if (newUser.role === 'patient') {
      setActiveTab('patient');
    } else if (newUser.role === 'pharmacy_partner') {
      setActiveTab('partners');
    } else if (newUser.role === 'compliance_officer') {
      setActiveTab('compliance');
    } else {
      setActiveTab('overview');
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      const logoutAudit: AuditEvent = {
        id: `audit-logout-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
        hash: '0x00FF...00AA',
        actor: currentUser.email,
        actorRole: 'CLINICAL_LEAD',
        action: 'Session Terminated: Complete Workstation Sign-Out & Memory Flush',
        resource: 'Local Memory & Session Storage Cleared',
        complianceCode: 'HIPAA Sec. 164.312(a)(2)(iii)',
        ip: currentUser.ipAddress,
        status: 'Verified Pass',
        statusType: 'success',
      };
      setAuditEvents((prev) => [logoutAudit, ...prev]);
    }

    // Completely purge local and session storage keys
    try {
      localStorage.removeItem('mediwise_auth_user');
      localStorage.removeItem('mediwise_auth_token');
      localStorage.removeItem('mediwise_session');
      localStorage.removeItem('mediwise_last_role');
      sessionStorage.clear();
    } catch (err) {
      // Safe fallback
    }

    // Completely clear authentication state
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsSessionLocked(false);
    setActiveTab('overview');
    addToast('info', 'Completely Signed Out', 'You have been signed out. All active session keys, cookies, and local data buffers have been purged.');
  };

  // Delivery & Tracking Handlers (Amazon-Style)
  const handleOpenOrderModal = (drug: DrugItem) => {
    setOrderModalDrug(drug);
    setIsOrderModalOpen(true);
  };

  const handleTrackOrder = (order: DeliveryOrder) => {
    setTrackingOrder(order);
    setIsTrackingModalOpen(true);
  };

  const handleConfirmNewOrder = (newOrder: DeliveryOrder) => {
    setDeliveries((prev) => [newOrder, ...prev]);
    const orderAudit: AuditEvent = {
      id: `audit-order-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
      hash: `0x${Math.random().toString(16).substring(2, 6).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toLowerCase()}`,
      actor: currentUser?.email || 'patient@mediwise.io',
      actorRole: 'PHARMACY_WEBHOOK',
      action: `Prescription Order Dispatched: ${newOrder.drugName} (${newOrder.orderNumber})`,
      resource: `${newOrder.pharmacyPartner} • Cold-Chain FIPS Validated`,
      complianceCode: 'FDA CFR Part 11 / USP <797>',
      ip: currentUser?.ipAddress || '127.0.0.1',
      status: 'Verified Pass',
      statusType: 'success',
    };
    setAuditEvents((prev) => [orderAudit, ...prev]);
    addToast('success', 'Prescription Order Placed!', `${newOrder.drugName} scheduled for ${newOrder.expectedDeliveryDate} (${newOrder.expectedDeliveryTimeWindow}). Tracking: ${newOrder.trackingNumber}`);
    setTrackingOrder(newOrder);
    setIsTrackingModalOpen(true);
  };

  const handleUpdateDeliveryInstructions = (orderId: string, newInstructions: string) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === orderId
          ? {
              ...d,
              deliveryAddress: {
                ...d.deliveryAddress,
                instructions: newInstructions,
              },
            }
          : d
      )
    );
    addToast('success', 'Instructions Updated', 'Courier delivery notes successfully updated.');
  };

  const handleSwitchPersona = (role: UserRole) => {
    const nextUser = DEMO_USERS[role];
    setCurrentUser(nextUser);
    setIsAuthenticated(true);
    addToast('info', 'Identity Switched', `Active role switched to ${nextUser.name} (${ROLE_DETAILS[role].label}).`);
    setActiveTab(ROLE_DETAILS[role].recommendedView);
  };

  const handleLockSession = () => {
    setIsSessionLocked(true);
    addToast('warning', 'Workstation Locked', 'HIPAA ePHI lock active. Display obscured.');
  };

  const handleUnlockSession = () => {
    setIsSessionLocked(false);
    addToast('success', 'Session Resumed', `Welcome back, ${currentUser?.name || 'User'}.`);
  };

  // If user is explicitly not authenticated, show dedicated full-screen auth portal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090d16] text-[#e2e8f0]">
        <AuthScreen
          initialMode="login"
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          onContinueAsGuest={() => {
            setCurrentUser(DEMO_USERS.cmio);
            setIsAuthenticated(true);
            addToast('info', 'Guest Console Session', 'Exploring MediWise Operations Console in read-only mode.');
          }}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
        <NotificationToast toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Enterprise Top Navigation Bar */}
      <EnterpriseHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tenantScope={tenantScope}
        setTenantScope={setTenantScope}
        onOpenEmergencyModal={() => setShowEmergencyModal(true)}
        onTriggerTelemetryExport={handleExportTelemetry}
        onOpenNotifications={() => addToast('info', 'System Status', 'All 24 worker nodes and 142 partner webhooks are operational.')}
        isRollbackActive={isRollbackActive}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onLockSession={handleLockSession}
        onLogout={handleLogout}
        onSwitchPersona={handleSwitchPersona}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Structural Layout */}
      {activeTab === 'patient' ? (
        /* Standalone Customer Comparison Portal Layout */
        <main className="flex-1 pt-18 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <PatientPortalScreen
            drugs={drugs}
            onBackToConsole={() => setActiveTab('overview')}
            onOpenDoctorSlip={handleOpenDoctorSlip}
            savedRefills={savedRefills}
            onToggleRefill={handleToggleRefill}
            onOpenOrderModal={handleOpenOrderModal}
            onViewDeliveries={() => setActiveTab('deliveries')}
            activeOrdersCount={deliveries.filter((d) => d.status !== 'delivered').length}
            onSignOut={handleLogout}
            currentUser={currentUser}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            rxScanState={rxScanState}
            onScanPrescription={handleScanPrescription}
            onResetScan={handleResetScan}
          />
        </main>
      ) : (
        /* Ops Command Center Suite Layout with Left Rail Drawer */
        <div className="flex flex-1 pt-14">
          {/* Left Navigation Rail Drawer */}
          <RailDrawer
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onRunAudit={handleRunAudit}
            isAuditing={isAuditing}
            isRollbackActive={isRollbackActive}
            currentUser={currentUser}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onLockSession={handleLockSession}
            onOpenAuthModal={(mode) => {
              setAuthModalMode(mode);
              setIsAuthModalOpen(true);
            }}
          />

          {/* Main Operational Viewport (offset 60 = 240px for RailDrawer) */}
          <main className="flex-1 ml-60 p-5 lg:p-6 overflow-x-hidden min-h-[calc(100vh-3.5rem)]">
            {activeTab === 'overview' && (
              <OverviewScreen
                drugs={drugs}
                onInspectDrug={handleInspectDrug}
                eventLogs={eventLogs}
                onSyncFeeds={handleSyncFeeds}
                isSyncing={isSyncing}
                onExportReport={handleExportTelemetry}
              />
            )}

            {activeTab === 'catalog' && (
              <DrugCatalogScreen
                drugs={drugs}
                selectedDrugId={selectedDrugId}
                setSelectedDrugId={setSelectedDrugId}
                onAddNewSalt={() => addToast('info', 'Pharmacopeia Ingest Ready', 'Connect USP-NF or CDSCO delta feed API to import new active salts.')}
                onAuditEquivalence={handleRunAudit}
                onExportFDA={() => addToast('success', 'FDA Form 356h Generated', 'Prepared regulatory in-vivo & in-vitro bioequivalence dossier.')}
              />
            )}

            {activeTab === 'partners' && (
              <PartnerNetworkScreen
                partners={partners}
                eventLogs={eventLogs}
                onSyncAllFeeds={handleSyncFeeds}
                isSyncing={isSyncing}
                onAddPartner={() => addToast('info', 'New Partner Onboarding', 'Launch FHIR REST or Kafka consumer bridge for new retail chain.')}
                onExportPartnerReport={handleExportTelemetry}
                onAuditPartnerPayout={(partnerId) => {
                  const p = partners.find((item) => item.id === partnerId);
                  addToast('success', 'Stripe Escrow Verified', `Attribution verified for ${p?.name || 'Partner'}: ₹${p?.cpaAccrued.toFixed(2)}.`);
                }}
              />
            )}

            {activeTab === 'deliveries' && (
              <DeliveryManagementScreen
                deliveries={deliveries}
                drugs={drugs}
                onTrackOrder={handleTrackOrder}
                onReorderDrug={(drugId) => {
                  const d = drugs.find((item) => item.id === drugId);
                  if (d) handleOpenOrderModal(d);
                }}
                onOpenDoctorSlip={handleOpenDoctorSlip}
                onNavigateToCatalog={() => setActiveTab('patient')}
              />
            )}

            {activeTab === 'compliance' && (
              <ComplianceScreen
                auditEvents={auditEvents}
                onExportAuditLedger={handleExportTelemetry}
                onVerifyLedgerIntegrity={handleVerifyChain}
                isVerifying={isVerifying}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsScreen
                gateways={gateways}
                systemConfig={systemConfig}
                setSystemConfig={setSystemConfig}
                onOpenConfigDiffModal={() => setShowConfigDiffModal(true)}
                onOpenRollbackModal={() => setShowRollbackModal(true)}
                isRollbackActive={isRollbackActive}
                onBackupSnapshot={handleExportTelemetry}
                onTestPing={handleTestPing}
                pingingId={pingingId}
                theme={theme}
                onSelectTheme={handleSelectTheme}
                onClearLocalData={handleClearLocalData}
              />
            )}

            {/* ── Phase 3: Healthcare Ecosystem Integrations ── */}
            {activeTab === 'fhir' && (
              <FHIRIngestionScreen
                onAddAuditEvent={(event) => setAuditEvents((prev) => [event, ...prev])}
                onNavigateToCatalog={(drugId) => {
                  setSelectedDrugId(drugId);
                  setActiveTab('catalog');
                }}
              />
            )}

            {activeTab === 'indiastack' && (
              <IndiaStackScreen currentUserName={currentUser?.name} />
            )}

            {/* ── Phase 4: Commerce & Financial Settlement ── */}
            {activeTab === 'commerce' && (
              <CommerceScreen
                onAddAuditEvent={(event) => setAuditEvents((prev) => [event, ...prev])}
                currentUserRole={currentUser?.role}
              />
            )}

            {/* ── Phase 5: Scale, Reliability & Global Expansion ── */}
            {activeTab === 'federated' && (
              <FederatedCatalogScreen />
            )}

            {activeTab === 'fleet' && (
              <FleetTelemetryScreen
                onAddAuditEvent={(event) => setAuditEvents((prev) => [event, ...prev])}
              />
            )}
          </main>
        </div>
      )}

      {/* Modals */}
      <ConfigDiffModal
        isOpen={showConfigDiffModal}
        onClose={() => setShowConfigDiffModal(false)}
        onConfirmDeploy={handleDeployConfigDiff}
        isDeploying={isDeploying}
      />

      <RollbackModal
        isOpen={showRollbackModal}
        onClose={() => setShowRollbackModal(false)}
        onConfirmRollback={handleConfirmRollback}
        isRollingBack={isRollingBack}
      />

      <EmergencyOverrideModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        onTriggerOverride={handleEmergencyOverride}
      />

      <DoctorSlipModal
        isOpen={showDoctorSlipModal}
        onClose={() => setShowDoctorSlipModal(false)}
        drug={doctorSlipDrug}
      />

      {/* Amazon-Style Delivery & Tracking Modals */}
      <OrderDeliveryModal
        isOpen={isOrderModalOpen}
        drug={orderModalDrug}
        onClose={() => setIsOrderModalOpen(false)}
        onConfirmOrder={handleConfirmNewOrder}
        userEmail={currentUser?.email}
        userName={currentUser?.name}
      />

      <DeliveryTrackingModal
        isOpen={isTrackingModalOpen}
        order={trackingOrder}
        onClose={() => setIsTrackingModalOpen(false)}
        onUpdateInstructions={handleUpdateDeliveryInstructions}
      />

      {/* Auth & Identity Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {currentUser && (
        <ProfileSettingsModal
          isOpen={isProfileModalOpen}
          currentUser={currentUser}
          onClose={() => setIsProfileModalOpen(false)}
          onLogout={handleLogout}
          onSwitchPersona={handleSwitchPersona}
          onLockSession={handleLockSession}
          theme={theme}
          onSelectTheme={handleSelectTheme}
        />
      )}

      {currentUser && isSessionLocked && (
        <SessionLockModal
          isOpen={isSessionLocked}
          currentUser={currentUser}
          onUnlock={handleUnlockSession}
          onLogout={handleLogout}
        />
      )}

      {/* Toast Notification Container */}
      <NotificationToast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
