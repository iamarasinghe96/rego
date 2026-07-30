// ---------------------------------------------------------------------------
// Personal details, baked into the app as the initial data.
//
// ⚠️  This file is committed to a public repo and deployed to a public URL.
//     Everything below is readable by anyone. To pull it back out, blank the
//     values here (the app falls back to empty fields) and rewrite git history
//     — deleting the file alone leaves it in every past commit.
//
// Sources: NSW Driver Licence, NSW Certificate of Registration (rec.
// 0458634981), Allianz CTP Green Slip (policy 7555568760TP).
// ---------------------------------------------------------------------------

import ownerPhoto from '../assets/owner.jpg';

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
    photo: ownerPhoto,
  },

  vehicle: {
    make: 'Mazda',
    model: 'Mazda2 Maxx (DE) 5-door hatchback',
    year: '2011',
    color: '',
    vin: 'JM0DE10Y2B0204909',
    engineNumber: 'ZY50550',
    engineCapacity: '1498 cc (1.5L)',
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

  // Comprehensive cover — the CTP certificate notes one exists on this
  // vehicle, but no policy document was provided.
  insurance: {
    provider: '',
    policyNumber: '',
    policyHolder: '',
    startDate: '',
    expiryDate: '',
    coverageType: 'Comprehensive',
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
