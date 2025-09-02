import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Application Entry Point
 * 
 * This is the main entry point for the AI Agent Builder platform React application.
 * It handles the initial rendering of the App component into the DOM and sets up
 * the root React application context.
 * 
 * Key Features:
 * - React 18 createRoot API for modern rendering
 * - Global CSS imports for base styles
 * - Application bootstrap and initialization
 * - Error boundary setup (TODO: implement)
 * - Performance monitoring hooks (TODO: implement)
 * 
 * API Integration:
 * - Global API client initialization (TODO: implement)
 * - Authentication token setup (TODO: implement)
 * - WebSocket connection establishment (TODO: implement)
 * 
 * Development vs Production:
 * - Development: Includes React DevTools support
 * - Production: Optimized bundle with performance monitoring
 */

// Get the root DOM element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// TODO: Add performance monitoring
// import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
// getCLS(console.log);
// getFID(console.log);
// getFCP(console.log);
// getLCP(console.log);
// getTTFB(console.log);
