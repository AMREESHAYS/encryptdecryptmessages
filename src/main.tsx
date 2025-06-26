import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Enable React 18 concurrent features
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Performance monitoring
if ('performance' in window && 'measure' in window.performance) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      try {
        const paintEntries = performance.getEntriesByType('paint');
        const navigationEntries = performance.getEntriesByType('navigation');

        if (paintEntries.length > 0) {
          console.log('🎨 Paint Performance:', {
            'First Paint': `${paintEntries[0]?.startTime.toFixed(2)}ms`,
            'First Contentful Paint': `${paintEntries[1]?.startTime.toFixed(2)}ms`,
          });
        }

        if (navigationEntries.length > 0) {
          const nav = navigationEntries[0] as any;
          if ('navigationStart' in nav) {
            console.log('🚀 Navigation Performance:', {
              'DOM Content Loaded': `${(nav.domContentLoadedEventEnd - nav.navigationStart).toFixed(2)}ms`,
              'Load Complete': `${(nav.loadEventEnd - nav.navigationStart).toFixed(2)}ms`,
            });
          }
        }
      } catch (error) {
        console.warn('Performance monitoring failed:', error);
      }
    }, 1000);
  });
}

// Service Worker registration for offline support (future enhancement)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}