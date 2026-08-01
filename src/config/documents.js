// Documents are rasterised to page images at build time and embedded as
// inline <img> data URIs. iOS previews HTML without running JavaScript, so a
// PDF can't be opened from a blob URL or fetched — an image is the only form
// that reliably displays. Pinch-to-zoom still works for reading the fine print.
//
// Regenerate the pages with scripts/rasterize.mjs after replacing a PDF.
export const DOC_META = [
  {
    id: 'registration',
    section: 'vehicle',
    label: 'Certificate of Registration',
    files: ['registration-1.jpg'],
  },
  {
    id: 'ctp',
    section: 'insurance',
    label: 'CTP Green Slip Certificate',
    files: ['ctp-1.jpg', 'ctp-2.jpg'],
  },
];

export function documentsFor(documents, section) {
  return documents.filter((d) => d.section === section);
}
