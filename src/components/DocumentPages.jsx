import { FileText } from 'lucide-react';

/**
 * Renders each document as inline page images. `variant` picks the framing:
 * "police" matches the dark section headers on the Police Check screen,
 * "card" matches the detail cards elsewhere.
 *
 * Pages are painted from CSS background rules rather than <img src>, because
 * the same document appears on two tabs and inlining the data twice would
 * double the file size. The build emits one rule per page and both tabs point
 * at it.
 */
export default function DocumentPages({
  documents,
  title = 'Documents',
  variant = 'card',
  iconClass = 'bg-slate-100 text-slate-700',
}) {
  if (!documents.length) return null;

  const body = (
    <div className="space-y-5">
      {documents.map((doc) => (
        <figure key={doc.id}>
          <figcaption className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {doc.label}
          </figcaption>
          <div className="space-y-2">
            {doc.pages.map((page, i) => (
              <div
                key={page.className}
                role="img"
                aria-label={`${doc.label} — page ${i + 1}`}
                className={`docpage ${page.className} w-full rounded-lg border border-gray-200 bg-white`}
              />
            ))}
          </div>
          {doc.pages.length > 1 && (
            <p className="text-xs text-gray-400 mt-1">{doc.pages.length} pages · pinch to zoom</p>
          )}
        </figure>
      ))}
    </div>
  );

  if (variant === 'police') {
    return (
      <section className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-wide uppercase">{title}</span>
        </div>
        <div className="p-4">{body}</div>
      </section>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${iconClass}`}>
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      {body}
    </div>
  );
}
