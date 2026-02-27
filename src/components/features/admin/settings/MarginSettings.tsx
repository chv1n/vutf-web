import type { MarginConfig } from '@/types/doc-config';
import { SettingsCard } from './SettingsCard';

interface Props {
  data: MarginConfig;
  onChange: (key: keyof MarginConfig, value: number) => void;
}

export const MarginSettings = ({ data, onChange }: Props) => {
  return (
    <SettingsCard title="Page Margins (mm)">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(data) as Array<keyof MarginConfig>).map((side) => (
          <div key={side}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize mb-1">
              {side}
            </label>
            <input
              type="number"
              value={data[side]}
              onChange={(e) => onChange(side, parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
};