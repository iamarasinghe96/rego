import { next } from '@vercel/edge';

// Runs at the edge before anything is served — HTML, JS bundle, PDFs, all of
// it. Nothing reaches the browser until the request is authenticated, so the
// hardcoded details in the bundle are never handed to an anonymous visitor.
//
// Excludes only Vercel's own internal paths.
export const config = {
  matcher: '/((?!_vercel/).*)',
};

// Constant-time comparison so a wrong password can't be narrowed down by
// timing the response.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function isAuthorized(header, user, password) {
  // Missing configuration fails closed — an unset env var must never mean
  // "let everyone in".
  if (!user || !password) return false;
  if (!header || !header.startsWith('Basic ')) return false;
  return safeEqual(header, `Basic ${btoa(`${user}:${password}`)}`);
}

export default function middleware(request) {
  const authorized = isAuthorized(
    request.headers.get('authorization'),
    process.env.SITE_USER,
    process.env.SITE_PASSWORD
  );

  if (authorized) return next();

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="VehicleVault", charset="UTF-8"',
      // Keep every gated response out of shared caches.
      'Cache-Control': 'no-store',
    },
  });
}
