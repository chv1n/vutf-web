import type { IndentRulesConfig } from '@/types/doc-config';
import { SettingsCard } from './SettingsCard';

interface Props {
  data: IndentRulesConfig;
  onChange: (key: keyof IndentRulesConfig, value: number) => void;
}

export const IndentSettings = ({ data, onChange }: Props) => {
  return (
    <SettingsCard title="Indentation Rules (cm)">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(Object.keys(data) as Array<keyof IndentRulesConfig>).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize mb-1 truncate" title={key.replace(/_/g, ' ')}>
              {key.replace(/_/g, ' ')}
            </label>
            <input
              type="number"
              step="0.1"
              value={data[key]}
              onChange={(e) => onChange(key, parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
};