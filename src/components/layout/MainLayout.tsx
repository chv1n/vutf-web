import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FiMenu } from 'react-icons/fi';

export const MainLayout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State สำหรับมือถือ

    const getPageTitle = (path: string) => {
        if (path.includes('dashboard')) return 'Home';
        if (path.includes('profile')) return 'Profile';
        if (path.includes('report')) return 'Thesis Report';
        return 'Dashboard';
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">

            {/* Sidebar: ส่ง props ไปคุมการเปิดปิด */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            {/* md:ml-64 คือเว้นซ้าย 64 เฉพาะจอ Desktop ขึ้นไป (มือถือไม่ต้องเว้น) */}
            <div className="flex-1 flex flex-col transition-all duration-300 md:ml-64">

                {/* --- Mobile Header (แสดงเฉพาะจอมือถือ) --- */}
                <div className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        {/* ปุ่ม Hamburger Menu */}
                        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
                            <FiMenu size={24} />
                        </button>
                        {/* Logo ตรงกลาง (สำหรับ Mobile) */}
                        <span className="text-lg font-bold text-gray-800">Thesis Review</span>
                    </div>

                    {/* Avatar เล็กๆ ขวาสุด (Optional) */}
                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile" />
                    </div>
                </div>

                {/* Desktop Header (ซ่อนบนมือถือ เพราะเรามี Mobile Header แล้ว หรือจะใช้ร่วมกันก็ได้) */}
                <div className="hidden md:block">
                    <Header title={getPageTitle(location.pathname)} />
                </div>

                {/* เนื้อหาหลัก */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};