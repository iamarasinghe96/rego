import { Check, Save } from 'lucide-react';

export default function SaveButton({ saved, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition ${
        saved
          ? 'bg-green-600 text-white'
          : 'bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900'
      }`}
    >
      {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
      {saved ? 'Saved!' : 'Save Changes'}
    </button>
  );
}
