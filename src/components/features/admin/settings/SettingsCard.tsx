import { ReactNode } from 'react';

interface SettingsCardProps {
  title: string;
  children: ReactNode;
}

export const SettingsCard = ({ title, children }: SettingsCardProps) => {
  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">
        {title}
      </h2>
      {children}
    </section>
  );
};