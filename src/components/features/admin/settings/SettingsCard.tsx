import { ReactNode } from 'react';

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}

export const SettingsCard = ({ title, description, icon, children, action }: SettingsCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">

        {/* ส่วนฝั่งซ้าย (Icon + Text) */}
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        {action && (
          <div>{action}</div>
        )}
      </div>

      <div className="p-6">
        {children}
      </div>
    </div>
  );
};