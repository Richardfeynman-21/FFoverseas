import { useState, useEffect } from 'react';

type LogoPaths = Record<string, string>;

let cachedData: LogoPaths | null = null;
let fetchPromise: Promise<LogoPaths> | null = null;

export function useLogoData() {
  const [data, setData] = useState<LogoPaths | null>(cachedData);
  const [loading, setLoading] = useState<boolean>(!cachedData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = fetch('/logo-paths.json')
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch logo paths: ${res.status}`);
          }
          return res.json() as Promise<LogoPaths>;
        })
        .then((jsonData) => {
          cachedData = jsonData;
          return jsonData;
        })
        .catch((err) => {
          fetchPromise = null; // Reset promise so we can retry if it fails
          throw err;
        });
    }

    let isMounted = true;
    fetchPromise
      .then((jsonData) => {
        if (isMounted) {
          setData(jsonData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
