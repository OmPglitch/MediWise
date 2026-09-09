import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DeliveryOrder, AuditEvent, DrugItem } from '../types';

interface MediWiseDB extends DBSchema {
  deliveries: {
    key: string;
    value: DeliveryOrder;
  };
  auditEvents: {
    key: string;
    value: AuditEvent;
  };
  drugs: {
    key: string;
    value: DrugItem;
  };
  preferences: {
    key: string;
    value: {
      key: string;
      value: any;
      updatedAt: string;
    };
  };
}

const DB_NAME = 'mediwise-ops';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<MediWiseDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<MediWiseDB>> {
  if (!dbPromise) {
    dbPromise = openDB<MediWiseDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('deliveries')) {
          db.createObjectStore('deliveries', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('auditEvents')) {
          db.createObjectStore('auditEvents', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('drugs')) {
          db.createObjectStore('drugs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

// Deliveries
export async function getAllDeliveries(): Promise<DeliveryOrder[]> {
  try {
    const db = await getDB();
    return await db.getAll('deliveries');
  } catch (err) {
    console.warn('[IndexedDB] Failed to load deliveries:', err);
    return [];
  }
}

export async function saveDelivery(order: DeliveryOrder): Promise<void> {
  try {
    const db = await getDB();
    await db.put('deliveries', order);
  } catch (err) {
    console.warn('[IndexedDB] Failed to save delivery:', err);
  }
}

export async function saveAllDeliveries(orders: DeliveryOrder[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('deliveries', 'readwrite');
    for (const order of orders) {
      await tx.store.put(order);
    }
    await tx.done;
  } catch (err) {
    console.warn('[IndexedDB] Failed to bulk save deliveries:', err);
  }
}

// Audit Events
export async function getAllAuditEvents(): Promise<AuditEvent[]> {
  try {
    const db = await getDB();
    return await db.getAll('auditEvents');
  } catch (err) {
    console.warn('[IndexedDB] Failed to load audit events:', err);
    return [];
  }
}

export async function saveAuditEvent(event: AuditEvent): Promise<void> {
  try {
    const db = await getDB();
    await db.put('auditEvents', event);
  } catch (err) {
    console.warn('[IndexedDB] Failed to save audit event:', err);
  }
}

export async function saveAllAuditEvents(events: AuditEvent[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('auditEvents', 'readwrite');
    for (const event of events) {
      await tx.store.put(event);
    }
    await tx.done;
  } catch (err) {
    console.warn('[IndexedDB] Failed to bulk save audit events:', err);
  }
}

// Drugs
export async function getAllDrugs(): Promise<DrugItem[]> {
  try {
    const db = await getDB();
    return await db.getAll('drugs');
  } catch (err) {
    console.warn('[IndexedDB] Failed to load drugs:', err);
    return [];
  }
}

export async function saveAllDrugs(drugs: DrugItem[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('drugs', 'readwrite');
    for (const drug of drugs) {
      await tx.store.put(drug);
    }
    await tx.done;
  } catch (err) {
    console.warn('[IndexedDB] Failed to bulk save drugs:', err);
  }
}

// Preferences
export async function getPreference<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const db = await getDB();
    const entry = await db.get('preferences', key);
    return entry ? (entry.value as T) : defaultValue;
  } catch (err) {
    return defaultValue;
  }
}

export async function setPreference(key: string, value: any): Promise<void> {
  try {
    const db = await getDB();
    await db.put('preferences', {
      key,
      value,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[IndexedDB] Failed to set preference:', key, err);
  }
}

// Reset / Clear
export async function clearAllLocalData(): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(['deliveries', 'auditEvents', 'drugs', 'preferences'], 'readwrite');
    await tx.objectStore('deliveries').clear();
    await tx.objectStore('auditEvents').clear();
    await tx.objectStore('drugs').clear();
    await tx.objectStore('preferences').clear();
    await tx.done;
    localStorage.clear();
  } catch (err) {
    console.error('[IndexedDB] Failed to clear data:', err);
    throw err;
  }
}
