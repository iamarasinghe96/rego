import { PROFILE } from '../config/profile';

// Bumped when the shape changes so older saved data doesn't hide new fields.
const STORAGE_KEY = 'vehicleVault_data_v2';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getDefaultData() {
  return clone(PROFILE);
}

// Saved values win, but any key missing from storage falls back to the
// hardcoded profile — so adding a field here doesn't require clearing data.
function mergeSection(defaults, saved) {
  if (Array.isArray(defaults)) return Array.isArray(saved) ? saved : defaults;
  if (!saved || typeof saved !== 'object') return defaults;
  const out = { ...defaults };
  for (const [key, value] of Object.entries(saved)) {
    out[key] = value;
  }
  return out;
}

export function loadData() {
  const defaults = getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const saved = JSON.parse(raw);
    const merged = {};
    for (const key of Object.keys(defaults)) {
      merged[key] = mergeSection(defaults[key], saved[key]);
    }
    return merged;
  } catch {
    return defaults;
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function resetToProfile() {
  localStorage.removeItem(STORAGE_KEY);
  return getDefaultData();
}
