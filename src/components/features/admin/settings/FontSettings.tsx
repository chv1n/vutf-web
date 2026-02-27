import type { FontConfig } from '../../../../types/doc-config';
import { SettingsCard } from './SettingsCard';

interface Props {
  data: FontConfig;
  onChange: (key: keyof FontConfig, value: any) => void;
}

const SUPPORTED_FONTS = [
  { label: 'TH Sarabun New', value: 'sarabun' }, 
  { label: 'TH Sarabun PSK', value: 'THSarabunPSK' },
  { label: 'Angsana New', value: 'angsana' },
  { label: 'Browallia New', value: 'browallia' },
  { label: 'Cordia New', value: 'cordia' },
];

export const FontSettings = ({ data, onChange }: Props) => {
  return (
    <SettingsCard title="Font Settings">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Font Name
          </label>
          
          <div className="relative">
            <select
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer"
            >
              <option value="" disabled>-- Select Font --</option>
              {SUPPORTED_FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label} ({font.value})
                </option>
              ))}
              {/* Option สำรองกรณีค่าเดิมไม่อยู่ใน List */}
              {!SUPPORTED_FONTS.some(f => f.value === data.name) && data.name && (
                 <option value={data.name}>{data.name} (Custom)</option>
              )}
            </select>
            
            {/* Arrow Icon ตกแต่ง (Optional) */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Size (pt)
          </label>
          <input
            type="number"
            value={data.size}
            onChange={(e) => onChange('size', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
    </SettingsCard>
  );
};