// The Service NSW app has no public URL scheme, so the licence is opened
// through an iOS Shortcut instead. `name` MUST match the shortcut's name on
// the device exactly — that string is what shortcuts://run-shortcut looks up.
export const LICENCE_SHORTCUT = {
  name: 'Show driver licence',
  label: 'Show my licence',
  sublabel: 'Opens NSW Driver Licence',
  installUrl: 'https://www.icloud.com/shortcuts/88d6c6a293314a8aade3546627173d95',
};

export function runShortcutUrl(name) {
  return `shortcuts://run-shortcut?name=${encodeURIComponent(name)}`;
}

export function isApplePlatform() {
  if (typeof navigator === 'undefined') return false;
  // iPadOS 13+ reports itself as a Mac, so the touch check catches it.
  return (
    /iPad|iPhone|iPod/.test(navigator.platform || '') ||
    /iPad|iPhone|iPod/.test(navigator.userAgent || '') ||
    (/Mac/.test(navigator.userAgent || '') && navigator.maxTouchPoints > 1)
  );
}
