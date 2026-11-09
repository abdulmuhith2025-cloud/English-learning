import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {registerSW} from 'virtual:pwa-register';

// Register Service Worker for offline PWA capabilities
registerSW({
  immediate: true,
  onOfflineReady() {
    console.log('Laura-Personal Assistance siap digunakan secara offline.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
