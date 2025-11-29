// src/components/layout/Header.tsx
import { FiBell } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext'; 

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  // ดึง user จาก Context
  const { user } = useAuth();

  // สร้างชื่อที่จะแสดง
  const displayName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}` 
    : user?.email?.split('@')[0] || 'User';

  const role = user?.role || 'Guest';

  return (
    <header className="h-20 bg-white flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
          <img src="https://flagcdn.com/w20/us.png" alt="US" className="w-5 rounded-sm shadow-sm" />
          Eng (US)
        </div>

        {/* Notification */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
          <FiBell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
           {/* UI Avatars จะสร้างรูปจากตัวอักษรแรกของชื่อให้เอง (เช่น Somsak Dee -> SD) */}
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ff914d&color=fff&bold=true`} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-orange-100"
          />
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-800 leading-none truncate max-w-[150px]">
                {displayName}
            </p>
            <p className="text-xs text-gray-500 mt-1 capitalize">
                {role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};