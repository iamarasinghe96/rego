// Documents committed to the repo live in public/documents/ and are deployed
// with the site. Filenames are fixed so the app can find them without any
// backend — drop a file with the matching name and it appears automatically.
//
// NOTE: anything in public/ is published with the site and is publicly
// readable by anyone who has the URL. Use the on-device upload instead for
// anything you do not want exposed.

const BASE = import.meta.env.BASE_URL || './';

export const DOC_SLOTS = [
  {
    id: 'registration',
    section: 'vehicle',
    label: 'Registration Papers',
    file: 'registration.pdf',
    hint: 'Certificate of registration / renewal notice',
    accent: 'green',
  },
  {
    id: 'insurance',
    section: 'insurance',
    label: 'Certificate of Currency',
    file: 'insurance.pdf',
    hint: 'Insurance certificate or policy schedule',
    accent: 'purple',
  },
  {
    id: 'ctp',
    section: 'insurance',
    label: 'CTP / Green Slip',
    file: 'ctp.pdf',
    hint: 'Compulsory third party certificate',
    accent: 'purple',
  },
  {
    id: 'roadworthy',
    section: 'vehicle',
    label: 'Safety / Roadworthy Certificate',
    file: 'roadworthy.pdf',
    hint: 'Pink slip or safety inspection report',
    accent: 'green',
  },
];

export function slotsFor(section) {
  return DOC_SLOTS.filter((s) => s.section === section);
}

export function repoDocUrl(file) {
  return `${BASE}documents/${file}`;
}
