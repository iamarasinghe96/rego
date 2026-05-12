const STORAGE_KEY = 'vehicleVault_data';

const defaultData = {
  owner: {
    fullName: '',
    licenseNumber: '',
    licenseExpiry: '',
    dateOfBirth: '',
    address: '',
    phone: '',
    email: '',
    photo: '',
  },
  vehicle: {
    make: '',
    model: '',
    year: '',
    color: '',
    vin: '',
    engineNumber: '',
    registrationNumber: '',
    registrationExpiry: '',
    registrationState: '',
    vehicleType: 'Sedan',
    photo: '',
  },
  insurance: {
    provider: '',
    policyNumber: '',
    policyHolder: '',
    startDate: '',
    expiryDate: '',
    coverageType: '',
    contactNumber: '',
    claimsNumber: '',
  },
  service: [],
  medical: {
    bloodType: '',
    allergies: '',
    conditions: '',
    emergencyContact: '',
    emergencyPhone: '',
    medications: [],
    certificates: [],
  },
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return defaultData;
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getDefaultData() {
  return defaultData;
}
