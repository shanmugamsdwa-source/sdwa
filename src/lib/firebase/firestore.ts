import { db } from './config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  WhereFilterOp,
} from 'firebase/firestore';
import { COLLECTIONS } from '@/types';
import type { AssociationSettings } from '@/types';

// ─── Firestore Operations (Client SDK) ─────────────────────────────────────
// Single, consistent data-access layer for both public reads and admin writes.
// Security is enforced by Firestore Security Rules, not by the SDK.

// ─── Local Demo Storage Helpers ──────────────────────────────────────────────
function getDemoStorage<T>(collectionName: string): (T & { id: string })[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`sdwa_demo_${collectionName}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setDemoStorage<T>(collectionName: string, items: (T & { id: string })[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`sdwa_demo_${collectionName}`, JSON.stringify(items));
  } catch {
    // ignore quota error
  }
}

/**
 * Get a single document by ID from a collection.
 */
export async function getDocument<T>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
    }
  } catch (err) {
    console.warn(`getDocument error for ${collectionName}/${id}, checking demo storage:`, err);
  }

  const demoItems = getDemoStorage<T>(collectionName);
  const found = demoItems.find((item) => item.id === id);
  return found || null;
}

/**
 * Get all documents from a collection, optionally ordered and filtered.
 */
export async function getCollection<T>(
  collectionName: string,
  options?: {
    orderBy?: string;
    direction?: 'asc' | 'desc';
    where?: [string, WhereFilterOp, unknown][];
    limit?: number;
  }
): Promise<(T & { id: string })[]> {
  let firestoreItems: (T & { id: string })[] = [];

  try {
    let q = query(collection(db, collectionName));

    if (options?.where) {
      for (const [field, op, value] of options.where) {
        q = query(q, where(field, op as WhereFilterOp, value));
      }
    }

    if (options?.orderBy) {
      try {
        let testQ = query(q, orderBy(options.orderBy, options.direction || 'asc'));
        if (options?.limit) {
          testQ = query(testQ, limit(options.limit));
        }
        const snapshot = await getDocs(testQ);
        firestoreItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as (T & { id: string })[];
      } catch (indexErr: any) {
        console.warn(
          `Index or query constraint warning for ${collectionName}, executing memory sort:`,
          indexErr?.message || indexErr
        );
      }
    }

    if (firestoreItems.length === 0) {
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }
      const snapshot = await getDocs(q);
      firestoreItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (T & { id: string })[];
    }
  } catch (err) {
    console.warn(`getCollection error for ${collectionName}, retrieving demo storage:`, err);
  }

  // Merge with local demo items
  const demoItems = getDemoStorage<T>(collectionName);
  const itemMap = new Map<string, T & { id: string }>();
  for (const item of firestoreItems) {
    itemMap.set(item.id, item);
  }
  for (const item of demoItems) {
    if (!itemMap.has(item.id)) {
      itemMap.set(item.id, item);
    }
  }
  let results = Array.from(itemMap.values());

  // Filter if options.where was passed and demo items were included
  if (options?.where && demoItems.length > 0) {
    for (const [field, op, value] of options.where) {
      results = results.filter((item: any) => {
        if (op === '==') return item[field] === value;
        if (op === '!=') return item[field] !== value;
        return true;
      });
    }
  }

  if (options?.orderBy) {
    const field = options.orderBy;
    const dir = options.direction || 'asc';
    results.sort((a: any, b: any) => {
      const valA = a[field] ?? 0;
      const valB = b[field] ?? 0;
      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  if (options?.limit && results.length > options.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

/**
 * Create a document in a collection.
 * Returns the new document ID.
 */
export async function createDocument<T extends Record<string, unknown>>(
  collectionName: string,
  data: T
): Promise<string> {
  const timestamp = new Date().toISOString();
  const newItem = {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const demoItems = getDemoStorage<T>(collectionName);
    setDemoStorage(collectionName, [{ id: docRef.id, ...newItem } as any, ...demoItems]);
    return docRef.id;
  } catch (err: any) {
    console.warn(`[Demo Mode] Storing createDocument locally for ${collectionName}:`, err?.message || err);
    const generatedId = `demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const demoItems = getDemoStorage<T>(collectionName);
    setDemoStorage(collectionName, [{ id: generatedId, ...newItem } as any, ...demoItems]);
    return generatedId;
  }
}

/**
 * Update a document in a collection.
 */
export async function updateDocument<T extends Record<string, unknown>>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  const timestamp = new Date().toISOString();

  // Always update local demo storage
  const demoItems = getDemoStorage<T>(collectionName);
  const updatedDemo = demoItems.map((item) =>
    item.id === id ? { ...item, ...data, updatedAt: timestamp } : item
  );
  setDemoStorage(collectionName, updatedDemo);

  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (err: any) {
    console.warn(`[Demo Mode] Updated document locally for ${collectionName}/${id}`);
  }
}

/**
 * Delete a document from a collection.
 */
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  const demoItems = getDemoStorage<any>(collectionName);
  setDemoStorage(
    collectionName,
    demoItems.filter((item) => item.id !== id)
  );

  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.warn(`[Demo Mode] Deleted document locally for ${collectionName}/${id}`);
  }
}

/**
 * Set a document (create or overwrite) with a specific ID.
 */
export async function setDocument<T extends Record<string, unknown>>(
  collectionName: string,
  id: string,
  data: T,
  merge: boolean = true
): Promise<void> {
  const timestamp = new Date().toISOString();
  const demoItems = getDemoStorage<T>(collectionName);
  const existingIndex = demoItems.findIndex((item) => item.id === id);

  if (existingIndex >= 0) {
    demoItems[existingIndex] = merge
      ? { ...demoItems[existingIndex], ...data, updatedAt: timestamp }
      : ({ id, ...data, updatedAt: timestamp } as any);
  } else {
    demoItems.unshift({ id, ...data, createdAt: timestamp, updatedAt: timestamp } as any);
  }
  setDemoStorage(collectionName, demoItems);

  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data, { merge });
  } catch (err: any) {
    console.warn(`[Demo Mode] Set document locally for ${collectionName}/${id}`);
  }
}

/**
 * Batch update display orders for reordering.
 */
export async function batchUpdateOrder(
  collectionName: string,
  orders: { id: string; displayOrder: number }[]
): Promise<void> {
  const timestamp = new Date().toISOString();
  const demoItems = getDemoStorage<any>(collectionName);
  const orderMap = new Map(orders.map((o) => [o.id, o.displayOrder]));

  const updatedDemo = demoItems.map((item) => {
    if (orderMap.has(item.id)) {
      return { ...item, displayOrder: orderMap.get(item.id), updatedAt: timestamp };
    }
    return item;
  });
  setDemoStorage(collectionName, updatedDemo);

  try {
    const batch = writeBatch(db);
    for (const { id, displayOrder } of orders) {
      const ref = doc(db, collectionName, id);
      batch.update(ref, { displayOrder, updatedAt: new Date() });
    }
    await batch.commit();
  } catch (err: any) {
    console.warn(`[Demo Mode] Batch order updated locally for ${collectionName}`);
  }
}

// ─── Association Settings ───────────────────────────────────────────────────

export async function getAssociationSettings(): Promise<AssociationSettings | null> {
  return getDocument<AssociationSettings>(
    COLLECTIONS.SETTINGS,
    COLLECTIONS.SETTINGS_ASSOCIATION
  );
}

export async function updateAssociationSettings(
  data: Partial<AssociationSettings>
): Promise<void> {
  await setDocument(COLLECTIONS.SETTINGS, COLLECTIONS.SETTINGS_ASSOCIATION, data);
}

// ─── Query helpers for specific collections ─────────────────────────────────

export async function getPublishedCollection<T>(
  collectionName: string,
  orderByField: string = 'displayOrder'
): Promise<(T & { id: string })[]> {
  return getCollection<T>(collectionName, {
    where: [['isPublished', '==', true]],
    orderBy: orderByField,
  });
}

export async function getActiveCollection<T>(
  collectionName: string,
  orderByField: string = 'displayOrder'
): Promise<(T & { id: string })[]> {
  return getCollection<T>(collectionName, {
    where: [['isActive', '==', true]],
    orderBy: orderByField,
  });
}

/**
 * Get document by slug or ID fallback
 */
export async function getBySlugOrId<T>(
  collectionName: string,
  slugOrId: string
): Promise<(T & { id: string }) | null> {
  // First try querying by slug
  const bySlug = await getCollection<T>(collectionName, {
    where: [['slug', '==', slugOrId]],
    limit: 1,
  });
  if (bySlug.length > 0) {
    return bySlug[0];
  }

  // Fallback to direct document ID
  return getDocument<T>(collectionName, slugOrId);
}
