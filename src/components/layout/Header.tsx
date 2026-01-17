// src/components/layout/Header.tsx
import { FiBell, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext'; 
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const displayName = user?.firstName 
    ? `${user.firstName}` 
    : user?.email?.split('@')[0] || 'User';

  const role = user?.role || 'Guest';

  return (
    // ปรับ px-4 (มือถือ) -> md:px-8 (จอใหญ่)
    <header className="h-20 bg-white dark:bg-gray-900 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm transition-colors duration-200">
      
      {/* ปรับขนาดตัวอักษร Title ให้เล็กลงในมือถือ (text-lg -> md:text-2xl) */}
      <h1 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white transition-colors truncate">
        {title}
      </h1>

      {/* ปรับ gap ให้ชิดกันมากขึ้นในมือถือ (gap-2 -> md:gap-6) */}
      <div className="flex items-center gap-2 md:gap-6">
        
        {/* --- Theme Toggle Button --- */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
        >
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
        {/* ------------------------------------- */}

        {/* Language Selector: ซ่อนบนมือถือ (hidden) แสดงบนจอใหญ่ (md:flex) */}
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
          <img src="https://flagcdn.com/w20/us.png" alt="US" className="w-5 rounded-sm shadow-sm" />
          Eng (US)
        </div>

        {/* Notification */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
          <FiBell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
        </button>

        {/* User Profile: ปรับ padding-left ให้ลดลงในมือถือ */}
        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-200 dark:border-gray-700">
           {/* UI Avatars */}
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ff914d&color=fff&bold=true`} 
            alt="Profile" 
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-orange-100 dark:border-gray-600"
          />
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-none truncate max-w-[150px]">
                {displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                {role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};