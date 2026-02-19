import { useState } from 'react';
import { FiFileText, FiUsers } from 'react-icons/fi';
import { ThesisFormatSettings } from '../../components/features/admin/settings/ThesisFormatSettings';

type TabType = 'format' | 'permissions';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('format');

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">System Configuration</h1>

            {/* --- Tabs Header --- */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab('format')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
                        activeTab === 'format'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                    <FiFileText size={18} />
                    Thesis Format
                </button>

                <button
                    onClick={() => setActiveTab('permissions')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
                        activeTab === 'permissions'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                    <FiUsers size={18} />
                    Instructor Permissions
                </button>
            </div>

            {/* --- Tabs Content --- */}
            <div className="min-h-[400px]">
                {activeTab === 'format' && (
                    <ThesisFormatSettings />
                )}

                {activeTab === 'permissions' && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 border-dashed">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-full mb-3">
                            <FiUsers size={32} />
                        </div>
                        <p className="text-lg font-medium">Instructor Permission Management</p>
                        <p className="text-sm">Coming Soon...</p>
                    </div>
                )}
            </div>
        </div>
    );
}