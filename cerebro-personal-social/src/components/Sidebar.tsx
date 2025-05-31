import React from 'react';
import Link from 'next/link';
import QuickCapture from './QuickCapture'; // Import QuickCapture
import ThemeSwitcher from './ThemeSwitcher'; // Import ThemeSwitcher

const Sidebar: React.FC = () => {
  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/projects', label: 'Proyectos' },
    { href: '/contacts', label: 'Contactos' },
    { href: '/events', label: 'Eventos' },
  ];

  return (
    <aside className="w-64 bg-gray-800 dark:bg-gray-900 text-white p-5 flex flex-col h-full">
      <div> {/* Wrapper for logo and nav to allow QuickCapture to push to bottom */}
        <div className="mb-10">
          <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 dark:hover:text-gray-400">
            CerebroApp
          </Link>
        </div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.label} className="mb-3">
                <Link href={item.href} className="block text-lg text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-700 p-2 rounded transition-colors duration-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-700 dark:border-gray-600"> {/* Added padding and border for separation */}
        <div className="mb-4"> {/* Margin bottom for ThemeSwitcher */}
          <ThemeSwitcher />
        </div>
        <QuickCapture />
      </div>
    </aside>
  );
};

export default Sidebar;
