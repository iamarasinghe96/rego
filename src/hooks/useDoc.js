import { useState, useEffect, useCallback } from 'react';
import { getDoc, toObjectURL } from '../utils/docStore';

// Loads a document and eagerly builds its object URL. The URL has to exist
// *before* the user taps the link — iOS Safari blocks window.open() once an
// await has broken the user-gesture chain.
export default function useDoc(key, refreshToken = 0) {
  const [record, setRecord] = useState(null);
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = null;

    setLoading(true);
    getDoc(key)
      .then((rec) => {
        if (cancelled) return;
        setRecord(rec || null);
        if (rec) {
          objectUrl = toObjectURL(rec);
          setUrl(objectUrl);
        } else {
          setUrl(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRecord(null);
          setUrl(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [key, refreshToken]);

  return { record, url, loading };
}

export function useRefresh() {
  const [token, setToken] = useState(0);
  return [token, useCallback(() => setToken((t) => t + 1), [])];
}
