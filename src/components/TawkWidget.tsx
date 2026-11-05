import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const TAWK_PROPERTY_ID: string =
  import.meta.env.VITE_TAWK_PROPERTY_ID || '6a1110e0db67011c34f8515a';
export const TAWK_WIDGET_ID: string =
  import.meta.env.VITE_TAWK_WIDGET_ID || '1jp9ajrpi';
export const TAWK_MOBILE_OFFSET_Y: number = Number.parseInt(
  import.meta.env.VITE_TAWK_MOBILE_OFFSET_Y || '88',
  10
);

export const isTawkConfigured: boolean = Boolean(TAWK_PROPERTY_ID && TAWK_WIDGET_ID);

/**
 * Programmatically open / maximize the Tawk.to live chat window.
 */
export const openTawkChat = (): void => {
  if (typeof window !== 'undefined' && window.Tawk_API) {
    try {
      window.Tawk_API.showWidget?.();
      window.Tawk_API.maximize?.();
    } catch {
      // Ignore if script is still initializing
    }
  }
};

/**
 * Toggle the Tawk.to chat widget.
 */
export const toggleTawkChat = (): void => {
  if (typeof window !== 'undefined' && window.Tawk_API) {
    try {
      window.Tawk_API.toggle?.();
    } catch {
      // Ignore if script is still initializing
    }
  }
};

export const TawkWidget: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!isTawkConfigured || typeof window === 'undefined') return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const mobileY = Number.isNaN(TAWK_MOBILE_OFFSET_Y) ? 88 : TAWK_MOBILE_OFFSET_Y;

    window.Tawk_API.customStyle = {
      visibility: {
        desktop: {
          position: 'br',
          xOffset: 15,
          yOffset: 20,
        },
        mobile: {
          position: 'br',
          xOffset: 15,
          yOffset: mobileY,
        },
      },
    };

    if (isAdmin) {
      window.Tawk_API.onLoad = () => {
        try {
          window.Tawk_API?.hideWidget?.();
        } catch {
          // ignore
        }
      };
    }

    const scriptId = 'tawk-to-script';
    if (!document.getElementById(scriptId)) {
      const s1 = document.createElement('script');
      s1.id = scriptId;
      s1.async = true;
      s1.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');

      const s0 = document.getElementsByTagName('script')[0];
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      } else {
        document.head.appendChild(s1);
      }
    }
  }, []);

  // Update widget visibility when transitioning between admin and storefront routes
  useEffect(() => {
    if (!isTawkConfigured || typeof window === 'undefined' || !window.Tawk_API) return;

    if (isAdmin) {
      try {
        window.Tawk_API.hideWidget?.();
      } catch {
        // ignore
      }
    } else {
      try {
        window.Tawk_API.showWidget?.();
      } catch {
        // ignore
      }
    }
  }, [isAdmin]);

  return null;
};

