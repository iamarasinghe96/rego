import { PROFILE } from '../config/profile';

// Everything except the service log is hardcoded in the profile, so this is
// the only thing that needs persisting.
const SERVICE_KEY = 'vehicleVault_service';

export function loadService() {
  try {
    const raw = localStorage.getItem(SERVICE_KEY);
    if (!raw) return PROFILE.service || [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
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
