// src/layouts/MainLayout.tsx
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, STUDENT_MENU, INSTRUCTOR_MENU, ADMIN_MENU } from './Sidebar';
import { Header } from './Header';
import { FiMenu, FiBell, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '@/hooks/useTheme';

export const MainLayout = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme(); // ดึง state ธีมมาใช้
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getPageTitle = (path: string) => {
        const allMenus = [...STUDENT_MENU, ...INSTRUCTOR_MENU, ...ADMIN_MENU];
        const found = allMenus.find(menu => menu.path === path);
        return found ? found.label : 'Thesis Review';
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans overflow-hidden transition-colors duration-200">

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-64">

                {/* --- Mobile Header (ปรับปรุงให้มีปุ่มเปลี่ยนโหมดและแจ้งเตือน) --- */}
                <div className="md:hidden h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 flex-none transition-colors">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 dark:text-gray-400 p-1">
                            <FiMenu size={24} />
                        </button>
                        <span className="text-lg font-bold text-gray-800 dark:text-white">Thesis Review</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* ปุ่มเปลี่ยนโหมดสำหรับมือถือ */}
                        <button 
                            onClick={toggleTheme}
                            className="p-2 text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
                        >
                            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
                        </button>

                        {/* แจ้งเตือนสำหรับมือถือ */}
                        <button className="relative p-2 text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
                            <FiBell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
                        </button>

                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-100 dark:border-gray-600 ml-1">
                            <img src="https://ui-avatars.com/api/?name=User&background=ff914d&color=fff" alt="Profile" />
                        </div>
                    </div>
                </div>

                {/* --- Desktop Header --- */}
                <div className="hidden md:block flex-none">
                    <Header title={getPageTitle(location.pathname)} />
                </div>

                {/* --- เนื้อหาหลัก --- */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth dark:bg-gray-900 transition-colors">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};