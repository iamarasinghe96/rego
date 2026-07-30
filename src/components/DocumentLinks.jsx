import { useState, useCallback, useEffect } from 'react';
import { FileText, ExternalLink, FolderOpen } from 'lucide-react';
import useRepoDoc from '../hooks/useRepoDoc';

function DocLink({ slot, onResolve }) {
  const { exists, url } = useRepoDoc(slot.file);

  useEffect(() => {
    onResolve(slot.id, exists);
  }, [slot.id, exists, onResolve]);

  if (!exists) return null;

  return (
    <a
      href={url}
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

/**
 * Lists whichever of `slots` have a file committed under public/documents/.
 * `variant` picks the framing: "police" matches the dark section headers on
 * the Police Check screen, "card" matches the detail cards elsewhere.
 */
export default function DocumentLinks({
  slots,
  title = 'Documents',
  variant = 'card',
  iconClass = 'bg-slate-100 text-slate-700',
}) {
  const [available, setAvailable] = useState({});

  const handleResolve = useCallback((id, ok) => {
    setAvailable((prev) => (prev[id] === ok ? prev : { ...prev, [id]: ok }));
  }, []);

  const anyAvailable = Object.values(available).some(Boolean);

  // The links stay mounted even when hidden so their lookups keep running —
  // the wrapper is what collapses until at least one document resolves.
  const links = slots.map((slot) => <DocLink key={slot.id} slot={slot} onResolve={handleResolve} />);

  if (variant === 'police') {
    return (
      <section className={anyAvailable ? 'bg-white rounded-2xl shadow overflow-hidden' : 'hidden'}>
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-wide uppercase">{title}</span>
        </div>
        <div className="p-4 space-y-2">{links}</div>
      </section>
    );
  }

  return (
    <div className={anyAvailable ? 'bg-white rounded-2xl shadow p-5' : 'hidden'}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${iconClass}`}>
          <FolderOpen className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-2">{links}</div>
    </div>
  );
}
