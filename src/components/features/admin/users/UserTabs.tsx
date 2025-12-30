// src/components/features/admin/users/UserTabs.tsx
import { FiUser, FiUsers } from 'react-icons/fi';

interface UserTabsProps {
  activeTab: 'student' | 'instructor';
  onTabChange: (tab: 'student' | 'instructor') => void;
}

export const UserTabs = ({ activeTab, onTabChange }: UserTabsProps) => {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
      <button
        onClick={() => onTabChange('student')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
          activeTab === 'student'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <FiUser /> Student List
      </button>
      <button
        onClick={() => onTabChange('instructor')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
          activeTab === 'instructor'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <FiUsers /> Instructor List
      </button>
    </div>
  );
};