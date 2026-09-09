/**
 * MediWise API Client
 * Thin fetch-based client that talks to the Express/MongoDB server.
 * All paths are relative so they work through Vite's /api proxy in dev
 * and directly against the Express server in production.
 */

import type {
  DrugItem,
  PartnerPharmacy,
  DeliveryOrder,
  AuditEvent,
  UserProfile,
  RegistrationPayload,
  StripeEscrowPayout,
  GSTInvoice,
} from '../types';

// ─── base fetch helper ────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let message = `API ${options.method || 'GET'} ${path} failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.error || message;
    } catch { /* no JSON body */ }
    const err = new Error(message);
    (err as any).status = res.status;
    throw err;
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ─── Drug API ─────────────────────────────────────────────────────────────────

export const DrugsAPI = {
  getAll: (params?: { category?: string; q?: string }): Promise<DrugItem[]> => {
    const qs = new URLSearchParams(params as Record<string, string> ?? {}).toString();
    return apiFetch<DrugItem[]>(`/api/drugs${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string): Promise<DrugItem> =>
    apiFetch<DrugItem>(`/api/drugs/${id}`),

  create: (drug: Partial<DrugItem>): Promise<DrugItem> =>
    apiFetch<DrugItem>('/api/drugs', { method: 'POST', body: JSON.stringify(drug) }),

  update: (id: string, drug: Partial<DrugItem>): Promise<DrugItem> =>
    apiFetch<DrugItem>(`/api/drugs/${id}`, { method: 'PUT', body: JSON.stringify(drug) }),

  delete: (id: string): Promise<{ success: boolean }> =>
    apiFetch<{ success: boolean }>(`/api/drugs/${id}`, { method: 'DELETE' }),

  parityCheck: (payload: { drugId: string; cmaxValue?: number; aucValue?: number }) =>
    apiFetch<{
      drugId: string;
      cmaxParityScore: number;
      aucParityScore: number;
      compositeConfidence: number;
      meetsThreshold: boolean;
    }>('/api/drugs/parity-check', { method: 'POST', body: JSON.stringify(payload) }),
};

// ─── Partners API ─────────────────────────────────────────────────────────────

export const PartnersAPI = {
  getAll: (params?: { category?: string; feedStatus?: string }): Promise<PartnerPharmacy[]> => {
    const qs = new URLSearchParams(params as Record<string, string> ?? {}).toString();
    return apiFetch<PartnerPharmacy[]>(`/api/partners${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string): Promise<PartnerPharmacy> =>
    apiFetch<PartnerPharmacy>(`/api/partners/${id}`),

  patch: (id: string, updates: Partial<PartnerPharmacy>): Promise<PartnerPharmacy> =>
    apiFetch<PartnerPharmacy>(`/api/partners/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),

  sync: (id: string): Promise<{ success: boolean; partner: PartnerPharmacy }> =>
    apiFetch<{ success: boolean; partner: PartnerPharmacy }>(`/api/partners/${id}/sync`, { method: 'POST' }),

  getCommissions: () =>
    apiFetch<{ totalAccruedINR: number; partners: PartnerPharmacy[] }>('/api/partners/commissions'),
};

// ─── Deliveries API ───────────────────────────────────────────────────────────

export interface DeliveriesListResponse {
  // Server returns plain array
  [index: number]: DeliveryOrder;
  length: number;
}

export const DeliveriesAPI = {
  getAll: (params?: { status?: string; drugId?: string }): Promise<DeliveryOrder[]> => {
    const qs = new URLSearchParams(params as Record<string, string> ?? {}).toString();
    return apiFetch<DeliveryOrder[]>(`/api/deliveries${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string): Promise<DeliveryOrder> =>
    apiFetch<DeliveryOrder>(`/api/deliveries/${id}`),

  track: (id: string): Promise<Partial<DeliveryOrder>> =>
    apiFetch<Partial<DeliveryOrder>>(`/api/deliveries/${id}/track`),

  create: (order: Partial<DeliveryOrder>): Promise<DeliveryOrder> =>
    apiFetch<DeliveryOrder>('/api/deliveries', { method: 'POST', body: JSON.stringify(order) }),

  update: (id: string, order: Partial<DeliveryOrder>): Promise<DeliveryOrder> =>
    apiFetch<DeliveryOrder>(`/api/deliveries/${id}`, { method: 'PUT', body: JSON.stringify(order) }),

  updateTemp: (id: string, tempCelsius: number, sensorStatus?: string) =>
    apiFetch<{ success: boolean; currentTempCelsius: number; sensorStatus: string }>(
      `/api/deliveries/${id}/temp`,
      { method: 'PATCH', body: JSON.stringify({ tempCelsius, sensorStatus }) }
    ),

  delete: (id: string): Promise<{ success: boolean }> =>
    apiFetch<{ success: boolean }>(`/api/deliveries/${id}`, { method: 'DELETE' }),
};

// ─── Compliance / Audit API ───────────────────────────────────────────────────

export interface AuditLedgerResponse {
  total: number;
  skip: number;
  limit: number;
  events: AuditEvent[];
}

export const ComplianceAPI = {
  getLedger: (params?: {
    actorRole?: string;
    statusType?: string;
    limit?: number;
    skip?: number;
  }): Promise<AuditLedgerResponse> => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params ?? {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return apiFetch<AuditLedgerResponse>(`/api/compliance/ledger${qs ? `?${qs}` : ''}`);
  },

  addEvent: (event: Partial<AuditEvent>): Promise<AuditEvent> =>
    apiFetch<AuditEvent>('/api/compliance/ledger', { method: 'POST', body: JSON.stringify(event) }),

  logOverride: (payload: { actor: string; reason: string; complianceCode?: string; ip?: string }) =>
    apiFetch<AuditEvent>('/api/compliance/override', { method: 'POST', body: JSON.stringify(payload) }),

  logRollback: (payload: { actor: string; targetVersion: string; ip?: string }) =>
    apiFetch<AuditEvent>('/api/compliance/rollback', { method: 'POST', body: JSON.stringify(payload) }),
};

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const AuthAPI = {
  login: (email: string, password: string): Promise<{ user: UserProfile; sessionToken: string }> =>
    apiFetch<{ user: UserProfile; sessionToken: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (payload: RegistrationPayload): Promise<{ user: UserProfile; sessionToken: string }> =>
    apiFetch<{ user: UserProfile; sessionToken: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getProfile: (sessionToken: string): Promise<UserProfile> =>
    apiFetch<UserProfile>('/api/auth/profile', {
      headers: { 'x-session-token': sessionToken },
    }),

  listUsers: (): Promise<UserProfile[]> =>
    apiFetch<UserProfile[]>('/api/auth/users'),
};

// ─── Commerce API ─────────────────────────────────────────────────────────────

export const CommerceAPI = {
  // Escrow Payouts
  getPayouts: (params?: { status?: string; partnerId?: string }): Promise<StripeEscrowPayout[]> => {
    const qs = new URLSearchParams(params as Record<string, string> ?? {}).toString();
    return apiFetch<StripeEscrowPayout[]>(`/api/commerce/escrow-payouts${qs ? `?${qs}` : ''}`);
  },

  patchPayout: (id: string, updates: Partial<StripeEscrowPayout>): Promise<StripeEscrowPayout> =>
    apiFetch<StripeEscrowPayout>(`/api/commerce/escrow-payouts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  disbursePayout: (payload: {
    payoutId: string;
    partnerId: string;
    amount: number;
    cmioApproved?: boolean;
    complianceApproved?: boolean;
  }): Promise<{ status: string; transferId: string; disbursedAt: string }> =>
    apiFetch('/api/stripe/escrow-payout', { method: 'POST', body: JSON.stringify(payload) }),

  // GST Invoices
  getInvoices: (params?: { status?: string; partnerId?: string }): Promise<GSTInvoice[]> => {
    const qs = new URLSearchParams(params as Record<string, string> ?? {}).toString();
    return apiFetch<GSTInvoice[]>(`/api/commerce/gst-invoices${qs ? `?${qs}` : ''}`);
  },

  patchInvoice: (id: string, updates: Partial<GSTInvoice>): Promise<GSTInvoice> =>
    apiFetch<GSTInvoice>(`/api/commerce/gst-invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
};

// ─── Health check ─────────────────────────────────────────────────────────────

export const HealthAPI = {
  check: () =>
    apiFetch<{
      status: string;
      database: string;
      geminiConfigured: boolean;
      activeWsClients: number;
    }>('/api/health'),
};
