
"use client";

import { useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * SEOInjector fetches the AdSense/Meta code from Firestore 
 * and injects it into the document head.
 */
export function SEOInjector() {
  const { firestore } = useFirestore();

  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site_config');
  }, [firestore]);

  const { data: config } = useDoc(configRef);

  useEffect(() => {
    if (config?.adsenseCode) {
      // Remove any previously injected AdSense code to avoid duplication
      const existing = document.getElementById('adsense-injected-code');
      if (existing) existing.remove();

      // Create a container to hold the injected HTML
      const container = document.createElement('div');
      container.id = 'adsense-injected-code';
      container.style.display = 'none';
      container.innerHTML = config.adsenseCode;

      // Extract scripts and meta tags to place them in the head
      const fragment = document.createDocumentFragment();
      
      // Handle Scripts
      const scripts = container.getElementsByTagName('script');
      Array.from(scripts).forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        fragment.appendChild(newScript);
      });

      // Handle Meta tags
      const metas = container.getElementsByTagName('meta');
      Array.from(metas).forEach(oldMeta => {
        const newMeta = document.createElement('meta');
        Array.from(oldMeta.attributes).forEach(attr => newMeta.setAttribute(attr.name, attr.value));
        fragment.appendChild(newMeta);
      });

      document.head.appendChild(fragment);
    }
  }, [config]);

  return null;
}
