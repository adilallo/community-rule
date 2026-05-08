/**
 * IndexedDB staging for community avatar when the user picks a file before
 * a session exists. Cleared after successful upload or explicit clear.
 */

const DB_NAME = "community-rule-pending-uploads";
const DB_VERSION = 1;
const STORE = "communityAvatar";
const KEY = "pending";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error("indexedDB open failed"));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
  });
}

export async function storePendingCommunityAvatarFile(file: File): Promise<void> {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("indexedDB write failed"));
      tx.objectStore(STORE).put(file, KEY);
    });
  } finally {
    db.close();
  }
}

/** Read staged file without removing it (caller clears after successful upload). */
export async function readPendingCommunityAvatarFile(): Promise<File | null> {
  const db = await openDb();
  try {
    return await new Promise<File | null>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      tx.onerror = () => reject(tx.error ?? new Error("indexedDB read failed"));
      const getReq = tx.objectStore(STORE).get(KEY);
      getReq.onsuccess = () => {
        const v = getReq.result;
        resolve(v instanceof File ? v : null);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  } finally {
    db.close();
  }
}

export async function clearPendingCommunityAvatarFile(): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("indexedDB clear failed"));
      tx.objectStore(STORE).delete(KEY);
    });
  } catch {
    // ignore missing DB / quota
  } finally {
    db.close();
  }
}
