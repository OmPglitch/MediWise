/**
 * MediWise Persistence Layer
 *
 * MIGRATED: This module previously used IndexedDB (idb).
 * It now proxies all reads and writes through the Express/MongoDB REST API.
 *
 * The exported function signatures are IDENTICAL to the old IndexedDB version
 * so App.tsx, usePersistedState.ts, and all consumers require no changes.
 *
 * Graceful fallback: if the server is unreachable (offline / not yet started),
 * each function returns an empty array / no-op rather than throwing, so the
 * frontend falls back to its in-memory mock data seamlessly.
 */

import { DeliveryOrder, AuditEvent, DrugItem } from '../types';
import { DrugsAPI, DeliveriesAPI, ComplianceAPI } from '../../../src/lib/apiClient';

// ─── helpers ─────────────────────────────────────────────────────────────────

async function safeCall<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    // Only warn — do not throw — so the UI stays functional without the server
    console.warn(`[DB→API] ${label}:`, err?.message ?? err);
    return fallback;
  }
}

// ─── Drugs ────────────────────────────────────────────────────────────────────

export async function getAllDrugs(): Promise<DrugItem[]> {
  return safeCall(() => DrugsAPI.getAll(), [], 'getAllDrugs');
}

export async function saveAllDrugs(drugs: DrugItem[]): Promise<void> {
  // Fire-and-forget upsert for each drug; errors are silently warned
  await Promise.all(
    drugs.map((drug) =>
      safeCall(
        () => DrugsAPI.update(drug.id, drug).catch(() => DrugsAPI.create(drug)),
        undefined as unknown as DrugItem,
        `saveAllDrugs[${drug.id}]`
      )
    )
  );
}

// ─── Deliveries ───────────────────────────────────────────────────────────────

export async function getAllDeliveries(): Promise<DeliveryOrder[]> {
  return safeCall(() => DeliveriesAPI.getAll(), [], 'getAllDeliveries');
}

export async function saveDelivery(order: DeliveryOrder): Promise<void> {
  await safeCall(
    () => DeliveriesAPI.update(order.id, order).catch(() => DeliveriesAPI.create(order)),
    undefined,
    `saveDelivery[${order.id}]`
  );
}

export async function saveAllDeliveries(orders: DeliveryOrder[]): Promise<void> {
  await Promise.all(orders.map((o) => saveDelivery(o)));
}

// ─── Audit Events ─────────────────────────────────────────────────────────────

export async function getAllAuditEvents(): Promise<AuditEvent[]> {
  const result = await safeCall(
    () => ComplianceAPI.getLedger({ limit: 200 }),
    { total: 0, skip: 0, limit: 200, events: [] },
    'getAllAuditEvents'
  );
  return result.events;
}

export async function saveAuditEvent(event: AuditEvent): Promise<void> {
  await safeCall(
    () => ComplianceAPI.addEvent(event),
    undefined as unknown as AuditEvent,
    `saveAuditEvent[${event.id}]`
  );
}

export async function saveAllAuditEvents(events: AuditEvent[]): Promise<void> {
  // Bulk save: POST each event; server deduplicates via eventId unique index
  await Promise.all(events.map((e) => saveAuditEvent(e)));
}

// ─── Preferences (localStorage — kept as-is, no server round-trip needed) ────

export async function getPreference<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const raw = localStorage.getItem(`mediwise_pref_${key}`);
    return raw !== null ? (JSON.parse(raw) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export async function setPreference(key: string, value: unknown): Promise<void> {
  try {
    localStorage.setItem(`mediwise_pref_${key}`, JSON.stringify(value));
  } catch {
    console.warn('[DB] setPreference: localStorage write failed for key:', key);
  }
}

// ─── Clear all data ───────────────────────────────────────────────────────────

/**
 * Clears all localStorage preference keys.
 * NOTE: The server-side MongoDB data is preserved — this only resets
 * client-side preferences. To reset the database, run `node server/seed/seed.js`.
 */
export async function clearAllLocalData(): Promise<void> {
  try {
    // Remove all mediwise preference keys from localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('mediwise_')) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Ignore storage errors
  }
}
