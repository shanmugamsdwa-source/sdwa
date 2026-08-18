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
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
  } catch (err) {
    console.error(`getDocument error for ${collectionName}/${id}:`, err);
    return null;
  }
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
  try {
    let q = query(collection(db, collectionName));

    if (options?.where) {
      for (const [field, op, value] of options.where) {
        q = query(q, where(field, op as WhereFilterOp, value));
      }
    }

    if (options?.orderBy) {
      q = query(q, orderBy(options.orderBy, options.direction || 'asc'));
    }

    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (T & { id: string })[];
  } catch (err) {
    console.error(`getCollection error for ${collectionName}:`, err);
    return [];
  }
}

/**
 * Create a document in a collection.
 * Returns the new document ID.
 */
export async function createDocument<T extends Record<string, unknown>>(
  collectionName: string,
  data: T
): Promise<string> {
  const timestamp = new Date();
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return docRef.id;
}

/**
 * Update a document in a collection.
 */
export async function updateDocument<T extends Record<string, unknown>>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  const timestamp = new Date();
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: timestamp,
  });
}

/**
 * Delete a document from a collection.
 */
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
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
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, data, { merge });
}

/**
 * Batch update display orders for reordering.
 */
export async function batchUpdateOrder(
  collectionName: string,
  orders: { id: string; displayOrder: number }[]
): Promise<void> {
  const batch = writeBatch(db);
  for (const { id, displayOrder } of orders) {
    const ref = doc(db, collectionName, id);
    batch.update(ref, { displayOrder, updatedAt: new Date() });
  }
  await batch.commit();
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
