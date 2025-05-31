import React from 'react';
import Sidebar from './Sidebar'; // Import the Sidebar component

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-800"> {/* Adjusted for dark mode */}
      {/* Actual Sidebar component */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
