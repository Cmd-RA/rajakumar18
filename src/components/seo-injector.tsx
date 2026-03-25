
"use client";

import { useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * SEOInjector fetches the AdSense/Meta code from Firestore 
 * and injects it into the document head in real-time.
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
      // 1. Cleanup: Remove any previously injected code to avoid duplicates
      const existing = document.querySelectorAll('[data-injected-seo]');
      existing.forEach(el => el.remove());

      // 2. Create a temporary container to parse the injected string
      const parser = new DOMParser();
      const doc = parser.parseFromString(config.adsenseCode, 'text/html');
      
      // Extract all script tags
      const scripts = doc.getElementsByTagName('script');
      Array.from(scripts).forEach(oldScript => {
        const newScript = document.createElement('script');
        // Copy all attributes
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        // Copy internal script content
        newScript.textContent = oldScript.textContent;
        // Mark for later cleanup
        newScript.setAttribute('data-injected-seo', 'true');
        document.head.appendChild(newScript);
      });

      // Extract all meta tags
      const metas = doc.getElementsByTagName('meta');
      Array.from(metas).forEach(oldMeta => {
        const newMeta = document.createElement('meta');
        Array.from(oldMeta.attributes).forEach(attr => newMeta.setAttribute(attr.name, attr.value));
        newMeta.setAttribute('data-injected-seo', 'true');
        document.head.appendChild(newMeta);
      });

      // Extract any link tags (for CSS or icons if provided)
      const links = doc.getElementsByTagName('link');
      Array.from(links).forEach(oldLink => {
        const newLink = document.createElement('link');
        Array.from(oldLink.attributes).forEach(attr => newLink.setAttribute(attr.name, attr.value));
        newLink.setAttribute('data-injected-seo', 'true');
        document.head.appendChild(newLink);
      });
    }
  }, [config]);

  return null;
}
