import registrationPdf from '../documents/registration.pdf';
import ctpPdf from '../documents/ctp.pdf';

// The PDFs are inlined into the build as base64 data URIs. Safari refuses to
// navigate to a top-level data: URL, so each one is turned into a blob URL
// once at startup — that both works and keeps the tap synchronous, which
// matters because iOS blocks link opens that happen after an await.
function toBlobUrl(source) {
  if (typeof source !== 'string' || !source.startsWith('data:')) return source;
  try {
    const [meta, base64] = source.split(',');
    const mime = meta.match(/:(.*?);/)?.[1] || 'application/pdf';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  } catch {
    return source;
  }
}

export const DOC_SLOTS = [
  {
    id: 'registration',
    section: 'vehicle',
    label: 'Registration Papers',
    url: toBlobUrl(registrationPdf),
  },
  {
    id: 'ctp',
    section: 'insurance',
    label: 'CTP / Green Slip',
    url: toBlobUrl(ctpPdf),
  },
];

export function slotsFor(section) {
  return DOC_SLOTS.filter((s) => s.section === section);
}
