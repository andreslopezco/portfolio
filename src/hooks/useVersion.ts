import { useState, useEffect } from 'react';

interface VersionInfo {
  version: string;
  lastUpdate: string;
}

export function useVersion() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('/api/version');
        if (!response.ok) {
          throw new Error('Failed to fetch version');
        }
        const data = await response.json();
        setVersionInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchVersion();
  }, []);

  return { versionInfo, loading, error };
}
