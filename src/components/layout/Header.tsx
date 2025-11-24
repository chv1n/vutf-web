import { FiBell } from 'react-icons/fi';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  // ดึงข้อมูล User จาก LocalStorage ที่เราเก็บตอน Login
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { email: 'User', role: 'Student' };
  // สมมติชื่อ (ถ้าใน User object ไม่มี field name ให้ใช้ email แทนไปก่อน)
  const displayName = user.email.split('@')[0]; 

  return (
    <header className="h-20 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

      <div className="flex items-center gap-6">
        {/* Language Selector (Mock) */}
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer">
          <img src="https://flagcdn.com/w20/us.png" alt="US" className="w-5 rounded-sm" />
          Eng (US)
        </div>

        {/* Notification */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 bg-orange-50 rounded-full">
            <FiBell className="text-orange-400" size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <img 
            src={`https://ui-avatars.com/api/?name=${displayName}&background=random`} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-800 leading-none">{displayName}</p>
            <p className="text-xs text-gray-500 mt-1 capitalize">{user.role || 'Student'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};