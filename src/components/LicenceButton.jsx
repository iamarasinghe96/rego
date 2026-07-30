import { useState } from 'react';
import { IdCard, ChevronRight, Info } from 'lucide-react';
import { LICENCE_SHORTCUT, runShortcutUrl, isApplePlatform } from '../config/shortcuts';

export default function LicenceButton() {
  const [showHelp, setShowHelp] = useState(false);
  const apple = isApplePlatform();

  return (
    <div>
      <a
        href={runShortcutUrl(LICENCE_SHORTCUT.name)}
        className="w-full flex items-center gap-3 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-4 shadow-lg hover:from-red-700 hover:to-red-800 active:scale-[0.99] transition"
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

      <button
        onClick={() => setShowHelp((v) => !v)}
        className="mt-2 mx-auto flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition no-print"
      >
        <Info className="w-3 h-3" />
        Button not working?
      </button>

      {showHelp && (
        <div className="mt-2 bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-600 space-y-2 no-print">
          {apple ? (
            <>
              <p>
                This runs a Shortcut named{' '}
                <strong className="text-gray-900">“{LICENCE_SHORTCUT.name}”</strong>. If nothing
                happens, the Shortcut either isn’t installed or is named something else.
              </p>
              <a
                href={LICENCE_SHORTCUT.installUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-medium text-blue-700 hover:underline"
              >
                Install the Shortcut →
              </a>
              <p className="text-xs text-gray-500">
                Already installed under a different name? Rename it to match, or update{' '}
                <code className="bg-gray-100 px-1 rounded">src/config/shortcuts.js</code>.
              </p>
            </>
          ) : (
            <p>
              This button opens the Service NSW app through iOS Shortcuts, so it only works on an
              iPhone or iPad.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
