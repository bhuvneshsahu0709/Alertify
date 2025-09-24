import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { notifications as mantineNotifications } from '@mantine/notifications';
import { getUserAlerts } from '../api';

const AlertsContext = createContext(null);

export const useAlerts = () => useContext(AlertsContext);

export default function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const previousUnreadIdsRef = useRef(new Set());
  const isRequestingRef = useRef(false);

  // Sound enablement (requires user gesture to unlock AudioContext)
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('alerts_sound_enabled') === 'true');
  const audioCtxRef = useRef(null);

  const ensureAudioUnlocked = useCallback(() => {
    try {
      if (audioCtxRef.current) return true;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      audioCtxRef.current = new AudioCtx();
      return true;
    } catch {
      return false;
    }
  }, []);

  const enableSound = useCallback(() => {
    const ok = ensureAudioUnlocked();
    if (ok) {
      setSoundEnabled(true);
      localStorage.setItem('alerts_sound_enabled', 'true');
    }
    return ok;
  }, [ensureAudioUnlocked]);

  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
      oscillator.connect(gainNode).connect(ctx.destination);
      gainNode.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.01);
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
      oscillator.stop(ctx.currentTime + 0.6);
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  const unreadAlerts = useMemo(() => alerts.filter(a => a.status === 'Unread'), [alerts]);
  const otherAlerts = useMemo(() => alerts.filter(a => a.status !== 'Unread'), [alerts]);
  const unreadCount = unreadAlerts.length;

  const fetchAlerts = useCallback(async () => {
    if (isRequestingRef.current) return;
    isRequestingRef.current = true;
    try {
      const res = await getUserAlerts();
      const nextAlerts = res.data || [];

      // Detect new unread alerts
      const nextUnreadIds = new Set(nextAlerts.filter(a => a.status === 'Unread').map(a => String(a._id)));
      const prevUnreadIds = previousUnreadIdsRef.current;
      const hasNewUnread = Array.from(nextUnreadIds).some(id => !prevUnreadIds.has(id));

      setAlerts(nextAlerts);

      // Notify on new unread
      if (hasNewUnread) {
        playBeep();
        const newCount = Array.from(nextUnreadIds).filter(id => !prevUnreadIds.has(id)).length;
        mantineNotifications.show({
          title: 'New alert',
          message: newCount > 1 ? `${newCount} new alerts arrived` : 'You have a new alert',
          color: 'teal',
        });
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Alert', { body: newCount > 1 ? `${newCount} new alerts` : 'You have a new alert' });
        }
      }

      previousUnreadIdsRef.current = nextUnreadIds;
    } catch (err) {
      // Optionally surface a one-time error
    } finally {
      isRequestingRef.current = false;
    }
  }, [playBeep]);

  useEffect(() => {
    // Request notification permission once
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    // Initial fetch
    fetchAlerts();

    // More frequent polling for near-real-time updates
    const interval = setInterval(fetchAlerts, 5000);

    // Refresh when window regains focus or becomes visible
    const onFocus = () => fetchAlerts();
    const onVisibility = () => { if (document.visibilityState === 'visible') fetchAlerts(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fetchAlerts]);

  const value = useMemo(() => ({
    alerts,
    unreadAlerts,
    otherAlerts,
    unreadCount,
    refreshAlerts: fetchAlerts,
    soundEnabled,
    enableSound,
  }), [alerts, unreadAlerts, otherAlerts, unreadCount, fetchAlerts, soundEnabled, enableSound]);

  return (
    <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>
  );
}
