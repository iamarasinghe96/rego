import { PROFILE } from '../config/profile';

// Everything except the service log is hardcoded in the profile, so this is
// the only thing that needs persisting.
const SERVICE_KEY = 'vehicleVault_service';

// Opened straight from a file, WebKit gives the page an opaque origin and
// localStorage either throws or silently drops writes. Detect it up front so
// the Service tab can say so rather than pretending a record was saved.
export function isStorageAvailable() {
  try {
    const probe = '__vv_probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function loadService() {
  try {
    const raw = localStorage.getItem(SERVICE_KEY);
    if (!raw) return PROFILE.service || [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return PROFILE.service || [];
  }
}

export function saveService(records) {
  try {
    localStorage.setItem(SERVICE_KEY, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}
