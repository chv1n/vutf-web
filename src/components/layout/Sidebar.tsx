import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiFileText, FiCalendar, FiBell, FiSettings, FiLogOut, FiX } from 'react-icons/fi';
import { authService } from '../../services/auth.service';

// 1. กำหนดเมนูสำหรับ Student
const STUDENT_MENU = [
    { icon: FiHome, label: 'Home', path: '/student/dashboard' },
    { icon: FiUser, label: 'Profile', path: '/student/profile' },
    { icon: FiFileText, label: 'Thesis Report', path: '/student/report' },
    { icon: FiCalendar, label: 'Calendar', path: '/student/calendar' },
    { icon: FiBell, label: 'Announcements', path: '/student/announcements' },
    { icon: FiSettings, label: 'Settings', path: '/student/settings' },
];

// 2. กำหนดเมนูสำหรับ Instructor
const INSTRUCTOR_MENU = [
    { icon: FiHome, label: 'Home', path: '/instructor/dashboard' },
    { icon: FiUser, label: 'Profile', path: '/instructor/profile' },
    { icon: FiFileText, label: 'Thesis Report', path: '/instructor/report' },
    { icon: FiCalendar, label: 'Calendar', path: '/instructor/calendar' },
    { icon: FiBell, label: 'Announcements', path: '/instructor/announcements' },
    { icon: FiSettings, label: 'Settings', path: '/instructor/settings' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};
    const isInstructor = user.role === 'instructor';
    const currentMenuItems = isInstructor ? INSTRUCTOR_MENU : STUDENT_MENU;

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <>
            {/* Backdrop (ฉากดำมืดๆ เวลาเปิดเมนูบนมือถือ) */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity"
                    onClick={onClose} // กดที่ว่างๆ แล้วปิดเมนู
                />
            )}

            {/* ตัว Sidebar หลัก */}
            <aside
                className={`
          fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
        `}
            >
                {/* Header ของ Sidebar */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            Th
                        </div>
                        <span className="text-xl font-bold text-gray-800">Thesis</span>
                    </div>

                    {/* ปุ่มปิด (X) แสดงเฉพาะบนมือถือ */}
                    <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Menu List */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {currentMenuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose()} // กดลิ้งค์แล้วปิดเมนู (สำหรับมือถือ)
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Sign Out */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 w-full transition-colors"
                    >
                        <FiLogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};