import { useState } from 'react';
import { Upload, FileText, Trash2, Eye, AlertCircle, Globe, Smartphone } from 'lucide-react';
import { putDoc, deleteDoc, formatSize } from '../../utils/docStore';
import useDoc, { useRefresh } from '../../hooks/useDoc';
import useRepoDoc from '../../hooks/useRepoDoc';

const MAX_BYTES = 25 * 1024 * 1024;

// Tailwind scans for complete class strings, so these can't be interpolated.
const ACCENTS = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
  green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
  purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
  red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
};

export default function DocumentSlot({ slot }) {
  const { id, label, file, hint, accent = 'blue' } = slot;
  const repo = useRepoDoc(file);
  const [token, refresh] = useRefresh();
  const { record, url, loading } = useDoc(id, token);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleFile(e) {
    const picked = e.target.files[0];
    e.target.value = '';
    if (!picked) return;

    if (picked.size > MAX_BYTES) {
      setError(`File is ${formatSize(picked.size)} — please keep documents under 25 MB.`);
      return;
    }

    setError('');
    setBusy(true);
    try {
      await putDoc(id, picked);
      refresh();
    } catch {
      setError('Could not save the document. Your device may be out of storage.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await deleteDoc(id);
      refresh();
    } finally {
      setBusy(false);
    }
  }

  const isImage = record?.type?.startsWith('image/');

  return (
    <div className="border border-gray-200 rounded-xl p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 text-sm">{label}</p>
          {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
        </div>
        {!record && !repo.exists && !repo.loading && (
          <label className={`cursor-pointer shrink-0 flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-sm font-medium transition ${ACCENTS[accent] || ACCENTS.blue}`}>
            <Upload className="w-4 h-4" />
            {busy ? 'Saving…' : 'Upload'}
            <input type="file" accept="application/pdf,image/*" className="hidden" onChange={handleFile} disabled={busy} />
          </label>
        )}
      </div>

      {/* Committed to the repo — deployed with the site */}
      {repo.exists && (
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5 flex items-center gap-3 hover:bg-gray-100 transition"
        >
          <div className="w-10 h-10 rounded bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Published with site
            </p>
          </div>
          <Eye className="w-4 h-4 text-gray-400 shrink-0" />
        </a>
      )}

      {/* Stored in this browser only */}
      {record && (
        <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5 flex items-center gap-3">
          {isImage && url ? (
            <img src={url} alt={record.name} className="w-10 h-10 rounded object-cover shrink-0 border border-gray-200" />
          ) : (
            <div className="w-10 h-10 rounded bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{record.name}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> {formatSize(record.size)} · this device only
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-blue-600 transition" title="View document">
                <Eye className="w-4 h-4" />
              </a>
            )}
            <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 transition" title="Remove document">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!repo.exists && !repo.loading && !record && !loading && (
        <p className="text-xs text-gray-400 mt-2">
          Or commit it to <code className="bg-gray-100 px-1 rounded text-gray-600">public/documents/{file}</code>
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
