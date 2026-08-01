// ---------------------------------------------------------------------------
// Personal details, baked into the app as the initial data.
//
// The built VehicleVault.html is local-only and never leaves your device,
// but this source file still lives in git history — see the README if the
// repo was ever public.
//
// Sources: NSW Driver Licence, NSW Certificate of Registration (rec.
// 0458634981), Allianz CTP Green Slip (policy 7555568760TP).
// ---------------------------------------------------------------------------

export const PROFILE = {
  owner: {
    fullName: 'Lokunekathige Indika Deshapriya Amarasinghe',
    licenseNumber: '26207483',
    licenseExpiry: '2036-07-20',
    licenseClass: 'C',
    licenseConditions: 'None',
    dateOfBirth: '1996-04-23',
    address: 'Unit 7, 634 Loma Pl, Albury NSW 2640',
    phone: '',
    email: '',
    photo: '', // injected at build time from src/assets/owner.jpg
  },

  vehicle: {
    make: 'Mazda',
    model: 'Mazda2 Maxx (DE) 5-door hatchback',
    year: '2011',
    color: '',
    vin: 'JM0DE10Y2B0204909',
    engineNumber: 'ZY750550',
    engineCapacity: '1498 cc (1.5L)',
    tareWeight: '1005 kg',
    seatingCapacity: '5',
    registrationNumber: 'DQ13XH',
    registrationExpiry: '2027-02-26',
    registrationState: 'NSW',
    // The licence holder and the registered operator are different people —
    // shown separately so a roadside check isn't a surprise.
    registeredOperator: 'Guvani Gaveshika Amarasinghe',
    customerNumber: '23636068',
    garagedAt: 'Albury NSW 2640',
    vehicleType: 'Hatchback',
    photo: '',
  },

  // Compulsory Third Party — personal injury only. Does not cover damage.
  ctp: {
    provider: 'Allianz Australia Insurance Limited',
    policyNumber: '7555568760TP',
    ctpNumber: '7555568760',
    insurerCode: '32',
    insuredName: 'Guvani Amarasinghe',
    startDate: '2026-02-22',
    expiryDate: '2027-02-22',
    useByDate: '2026-05-23',
    receiptNumber: '10100118606635',
    assistNumber: '1300 656 919',
    contactNumber: '13 1000',
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
