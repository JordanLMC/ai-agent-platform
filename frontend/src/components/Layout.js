import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

/**
 * Main Layout Component
 * 
 * This component provides the overall application layout structure including
 * the header, sidebar navigation, and main content area. It serves as the
 * wrapper for all page components in the AI Agent Builder platform.
 * 
 * Key Features:
 * - Responsive layout with collapsible sidebar
 * - Consistent header across all pages
 * - Main content area with proper spacing and scrolling
 * - Mobile-first responsive design
 * - Accessibility support with proper semantic structure
 * 
 * Props:
 * - children: React nodes to render in the main content area
 * 
 * API Integration:
 * - User authentication state (passed to Header)
 * - Navigation state management
 * - Real-time notifications display
 */
function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  // Handle responsive behavior
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMobile ? 'mobile' : 'desktop'}`}>
      {/* Header with navigation controls */}
      <Header 
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
      />
      
      {/* Sidebar navigation */}
      <Sidebar 
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={() => isMobile && setSidebarOpen(false)}
      />
      
      {/* Main content area */}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
      
      {/* Mobile overlay for sidebar */}
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default Layout;
