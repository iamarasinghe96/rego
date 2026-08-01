import { IdCard, ChevronRight, Info } from 'lucide-react';
import { LICENCE_SHORTCUT, runShortcutUrl } from '../config/shortcuts';

// <details> gives a collapsible help panel with no JavaScript, which matters
// because iOS previews local HTML with scripting disabled.
export default function LicenceButton() {
  return (
    <div>
      <a
        href={runShortcutUrl(LICENCE_SHORTCUT.name)}
        className="w-full flex items-center gap-3 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-4 shadow-lg active:from-red-700 active:to-red-800 transition"
      >
        <div className="bg-white/20 p-2.5 rounded-xl shrink-0">
          <IdCard className="w-6 h-6" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold text-base leading-tight">{LICENCE_SHORTCUT.label}</p>
          <p className="text-red-100 text-xs mt-0.5">{LICENCE_SHORTCUT.sublabel}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-red-200 shrink-0" />
      </a>

      <details className="mt-2 group">
        <summary className="flex items-center justify-center gap-1 text-xs text-gray-500 cursor-pointer list-none">
          <Info className="w-3 h-3" />
          Button not working?
        </summary>
        <div className="mt-2 bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-600 space-y-2">
          <p>
            This runs an iPhone Shortcut named{' '}
            <strong className="text-gray-900">“{LICENCE_SHORTCUT.name}”</strong>, which opens the
            Service NSW app. If nothing happens, the Shortcut isn’t installed, is named something
            else, or this page was opened somewhere that blocks app links — the Files preview does.
          </p>
          <p className="text-xs text-gray-500">
            Rename the Shortcut to match, or update{' '}
            <code className="bg-gray-100 px-1 rounded">src/config/shortcuts.js</code> and rebuild.
          </p>
        </div>
      </details>
    </div>
  );
}
