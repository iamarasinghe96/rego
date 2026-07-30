// Document storage backed by IndexedDB.
// localStorage caps out around 5 MB and PDFs blow through that fast, so
// scanned documents live here instead of alongside the form data.

const DB_NAME = 'vehicleVault';
const STORE = 'documents';
const VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run(mode, fn) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        tx.oncomplete = () => {
          db.close();
          resolve(req?.result);
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
      })
  );
}

// Stored as an ArrayBuffer rather than a Blob — older iOS Safari versions
// refuse to persist Blobs in IndexedDB.
export async function putDoc(key, file) {
  const buffer = await file.arrayBuffer();
  return run('readwrite', (store) =>
    store.put(
      {
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        addedAt: new Date().toISOString(),
        buffer,
      },
      key
    )
  );
}

export function getDoc(key) {
  return run('readonly', (store) => store.get(key));
}

export function deleteDoc(key) {
  return run('readwrite', (store) => store.delete(key));
}

export function listDocKeys() {
  return run('readonly', (store) => store.getAllKeys());
}

export function toObjectURL(record) {
  if (!record) return null;
  return URL.createObjectURL(new Blob([record.buffer], { type: record.type }));
}

export function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
