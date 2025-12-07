// src/components/layout/MainLayout.tsx
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, STUDENT_MENU, INSTRUCTOR_MENU, ADMIN_MENU } from './Sidebar';
import { Header } from './Header';
import { FiMenu } from 'react-icons/fi';

export const MainLayout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State สำหรับมือถือ

    const getPageTitle = (path: string) => {
        // รวมเมนูทุก role เข้าด้วยกัน
        const allMenus = [...STUDENT_MENU, ...INSTRUCTOR_MENU, ...ADMIN_MENU];

        // ค้นหาเมนูที่มี path ตรงกับ URL ปัจจุบัน
        const found = allMenus.find(menu => menu.path === path);

        // ถ้าเจอ ให้ส่งชื่อ label กลับไป, ถ้าไม่เจอให้ใช้ค่า Default
        return found ? found.label : 'Thesis Review';
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Container ขวา: ให้ยืดเต็มพื้นที่ที่เหลือ */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-64">

                {/* --- Mobile Header --- */}
                <div className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-none">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
                            <FiMenu size={24} />
                        </button>
                        <span className="text-lg font-bold text-gray-800">Thesis Review</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile" />
                    </div>
                </div>

                {/* --- Desktop Header --- */}
                <div className="hidden md:block flex-none">
                    <Header title={getPageTitle(location.pathname)} />
                </div>

                {/* --- เนื้อหาหลัก --- */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};