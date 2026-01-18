import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    FiHome, FiUser, FiFileText, FiBell, FiUsers,
    FiSettings, FiLogOut, FiX, FiList, FiFolder,
    FiTrendingUp, FiClipboard,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { IoSchool } from "react-icons/io5";

// 1. เมนู Student
export const STUDENT_MENU = [
    { icon: FiHome, label: 'Home', path: '/student/dashboard' },
    { icon: FiUser, label: 'Profile', path: '/student/profile' },
    { icon: FiFileText, label: 'Thesis Report', path: '/student/report' },
    { icon: FiUsers, label: 'Group Management', path: '/student/group-management' },
    { icon: FiClipboard, label: 'Inspection Round', path: '/student/inspections' },
    { icon: FiSettings, label: 'Settings', path: '/student/settings' },
];

// 2. เมนู Instructor
export const INSTRUCTOR_MENU = [
    { icon: FiHome, label: 'Home', path: '/instructor/dashboard' },
    { icon: FiUser, label: 'Profile', path: '/instructor/profile' },
    { icon: FiUsers, label: 'Advised Groups', path: '/instructor/groups' },
    { icon: FiFileText, label: 'Thesis Report', path: '/instructor/report' },
    { icon: FiBell, label: 'Announcements', path: '/instructor/announcements' },
    { icon: FiSettings, label: 'Settings', path: '/instructor/settings' },
];

// 3. เมนู Admin
export const ADMIN_MENU = [
    { icon: FiHome, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FiUser, label: 'User', path: '/admin/users' },
    { icon: FiList, label: 'Thesis Topic', path: '/admin/topics' },
    { icon: FiFolder, label: 'Thesis File', path: '/admin/files' },
    { icon: FiTrendingUp, label: 'Thesis Report', path: '/admin/reports' },
    { icon: FiClipboard, label: 'Inspection Round', path: '/admin/inspections' },
    { icon: FiBell, label: 'Announcements', path: '/admin/announcements' },
    { icon: FiSettings, label: 'Settings', path: '/admin/settings' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation(); // เรียกใช้ hook นี้เพื่อให้ logic isHomeActive ทำงาน
    const { user, logout } = useAuth();

    const role = user?.role?.toLowerCase() || '';

    let currentMenuItems = STUDENT_MENU;
    if (role === 'instructor') currentMenuItems = INSTRUCTOR_MENU;
    if (role === 'admin') currentMenuItems = ADMIN_MENU;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
          fixed top-0 left-0 z-30 h-screen w-64 
          bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 
          flex flex-col transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
        `}
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
                            <IoSchool size={18} />
                        </div>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">Thesis</span>
                    </div>
                    <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Menu List */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {currentMenuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose()}
                            className={({ isActive }) => {
                                const isHomeActive =
                                    item.path === '/student/dashboard' &&
                                    location.pathname === '/student/upload';

                                const shouldBeActive = isActive || isHomeActive;

                                return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${shouldBeActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none translate-x-1'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400'
                                    }`;
                            }}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Info & Sign Out */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-500 w-full transition-colors rounded-lg hover:bg-red-50 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                        <FiLogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};