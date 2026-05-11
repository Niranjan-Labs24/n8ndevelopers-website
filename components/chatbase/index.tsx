'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    chatbase?: any;
  }
}

export default function ChatbaseScript() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      (!window.chatbase || (typeof window.chatbase === 'function' && window.chatbase('getState') !== 'initialized'))
    ) {
      const chatbaseFunc = (...args: any[]) => {
        if (!(chatbaseFunc as any).q) (chatbaseFunc as any).q = [];
        (chatbaseFunc as any).q.push(args);
      };

      (window as any).chatbase = new Proxy(chatbaseFunc, {
        get(target, prop) {
          if (prop === 'q') return (target as any).q;
          return (...args: any[]) => (target as any)(prop, ...args);
        },
      });
    }

    const onLoad = () => {
      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.id = process.env.NEXT_PUBLIC_CHATBASE_ID || '';
      (script as any).domain = 'www.chatbase.co';
      document.body.appendChild(script);
    };

    const delayedLoad = () => {
      const timer = setTimeout(onLoad, 3000);
      return () => clearTimeout(timer);
    };

    if (document.readyState === 'complete') {
      return delayedLoad();
    } else {
      window.addEventListener('load', delayedLoad);
      return () => {
        window.removeEventListener('load', delayedLoad);
      };
    }
  }, []);

  return null;
}
