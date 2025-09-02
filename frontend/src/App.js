import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AgentCatalogPage from './pages/AgentCatalogPage';
import ConnectorManagementPage from './pages/ConnectorManagementPage';
import AgentRunHistoryPage from './pages/AgentRunHistoryPage';
import WorkspaceSettingsPage from './pages/WorkspaceSettingsPage';
import KernelDocsPage from './pages/KernelDocsPage';
import './App.css';

/**
 * Main Application Component
 * 
 * This is the root React component that handles routing and layout for the
 * AI Agent Builder platform frontend. It provides navigation between different
 * sections of the application including agent catalog, connector management,
 * run history, workspace settings, and documentation.
 * 
 * Key Features:
 * - React Router for single-page application navigation
 * - Shared Layout component with sidebar and header
 * - Route-based code splitting ready
 * - Integration points for authentication and global state
 * 
 * API Integration:
 * - Will connect to backend APIs through individual page components
 * - Authentication state management (TODO: implement)
 * - Global error boundary (TODO: implement)
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            {/* Main application routes */}
            <Route path="/" element={<AgentCatalogPage />} />
            <Route path="/agents" element={<AgentCatalogPage />} />
            <Route path="/connectors" element={<ConnectorManagementPage />} />
            <Route path="/history" element={<AgentRunHistoryPage />} />
            <Route path="/settings" element={<WorkspaceSettingsPage />} />
            <Route path="/docs" element={<KernelDocsPage />} />
            
            {/* TODO: Add additional routes */}
            {/* <Route path="/agents/:id" element={<AgentDetailPage />} /> */}
            {/* <Route path="/connectors/:id" element={<ConnectorDetailPage />} /> */}
            {/* <Route path="/runs/:id" element={<RunDetailPage />} /> */}
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
