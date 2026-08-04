'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export default function ClarityProvider() {
  useEffect(() => {
    Clarity.init('xx1xr88w8n');
  }, []);

  return null;
}