// src/components/features/admin/users/UserTabs.tsx
import { FiUser, FiUsers, FiLayers } from 'react-icons/fi';

interface UserTabsProps {
  activeTab: 'student' | 'instructor' | 'section';
  onTabChange: (tab: 'student' | 'instructor' | 'section') => void;
}

export const UserTabs = ({ activeTab, onTabChange }: UserTabsProps) => {
  
  const tabs = [
    { id: 'student', label: 'Student List', icon: <FiUser /> },
    { id: 'instructor', label: 'Instructor List', icon: <FiUsers /> },
    { id: 'section', label: 'Class Sections', icon: <FiLayers /> },
  ] as const;

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6 overflow-x-auto max-w-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeTab === tab.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
};