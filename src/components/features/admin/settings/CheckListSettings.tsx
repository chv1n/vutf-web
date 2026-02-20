import type { CheckListConfig } from '@/types/doc-config';
import { SettingsCard } from './SettingsCard';

interface Props {
  data: CheckListConfig;
  onChange: (key: keyof CheckListConfig, value: boolean) => void;
}

export const CheckListSettings = ({ data, onChange }: Props) => {
  return (
    <SettingsCard title="Active Checks">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(Object.keys(data) as Array<keyof CheckListConfig>).map((key) => (
          <label key={key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition">
            <input
              type="checkbox"
              checked={data[key]}
              onChange={(e) => onChange(key, e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-200 capitalize font-medium">
              {key.replace('check_', '').replace(/_/g, ' ')}
            </span>
          </label>
        ))}
      </div>
    </SettingsCard>
  );
};