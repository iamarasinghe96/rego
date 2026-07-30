import { useState, useCallback, useEffect } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { DOC_SLOTS } from '../config/documents';
import useRepoDoc from '../hooks/useRepoDoc';
import useDoc from '../hooks/useDoc';

function DocLink({ slot, onResolve }) {
  const repo = useRepoDoc(slot.file);
  const device = useDoc(slot.id);

  // A committed file wins over a device copy — it's the one kept current
  // in the repo.
  const href = repo.exists ? repo.url : device.url;

  useEffect(() => {
    onResolve(slot.id, Boolean(href));
  }, [slot.id, href, onResolve]);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition"
    >
      <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-red-600" />
      </div>
      <span className="flex-1 font-medium text-gray-900 text-sm">{slot.label}</span>
      <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
    </a>
  );
}

export default function PoliceDocs() {
  const [available, setAvailable] = useState({});

  const handleResolve = useCallback((id, ok) => {
    setAvailable((prev) => (prev[id] === ok ? prev : { ...prev, [id]: ok }));
  }, []);

  const anyAvailable = Object.values(available).some(Boolean);

  // Children stay mounted so their lookups keep running; the wrapper just
  // collapses until at least one document resolves.
  return (
    <section className={anyAvailable ? 'bg-white rounded-2xl shadow overflow-hidden' : 'hidden'}>
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span className="font-semibold text-sm tracking-wide uppercase">Documents</span>
      </div>
      <div className="p-4 space-y-2">
        {DOC_SLOTS.map((slot) => (
          <DocLink key={slot.id} slot={slot} onResolve={handleResolve} />
        ))}
      </div>
    </section>
  );
}
