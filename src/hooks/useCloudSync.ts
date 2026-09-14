'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { syncWithCloud } from '@/lib/storage';

export function useCloudSync() {
  const { data: session, isPending } = useSession();
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !session.user || isPending) return;

    let isMounted = true;

    async function performSync() {
      setIsSyncing(true);
      try {
        const result = await syncWithCloud();
        if (isMounted) {
          if (result.synced) {
            setHasSynced(true);
            setSyncStatus(`Synced (${result.watchlistCount} saved)`);
          }
        }
      } catch (err) {
        console.error('Cloud sync error in useCloudSync:', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    }

    performSync();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, isPending]);

  const triggerSync = async () => {
    if (!session?.user) return;
    setIsSyncing(true);
    try {
      const result = await syncWithCloud();
      if (result.synced) {
        setHasSynced(true);
        setSyncStatus(`Synced (${result.watchlistCount} saved)`);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isAuthenticated: Boolean(session?.user),
    user: session?.user,
    isSyncing,
    hasSynced,
    syncStatus,
    triggerSync,
  };
}
