'use client';

import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollManager() {
  /* 1️⃣  Tell the browser to STOP restoring scroll automatically. */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  /* 2️⃣  Hard-reset *before* paint when React commits a new page. */
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
}
