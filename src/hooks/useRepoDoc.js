import { useState, useEffect } from 'react';
import { repoDocUrl } from '../config/documents';

// Checks whether a document has been committed to public/documents/.
// A dev server or a 404 page can answer with HTML, so the content type is
// verified too — otherwise every missing file would look like it exists.
export default function useRepoDoc(file) {
  const [state, setState] = useState({ exists: false, loading: true, url: repoDocUrl(file) });

  useEffect(() => {
    let cancelled = false;
    const url = repoDocUrl(file);

    fetch(url, { method: 'HEAD', cache: 'no-cache' })
      .then((res) => {
        const type = res.headers.get('content-type') || '';
        const ok = res.ok && !type.includes('text/html');
        if (!cancelled) setState({ exists: ok, loading: false, url });
      })
      .catch(() => {
        if (!cancelled) setState({ exists: false, loading: false, url });
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  return state;
}
