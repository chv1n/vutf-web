import { useEffect, useState } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';

// Import Types & Services
import { getDocConfig, updateDocConfig } from '../../../../services/doc-config.service';
import type { DocumentConfigData } from '../../../../types/doc-config';

// Import Components
import { MarginSettings } from './MarginSettings';
import { FontSettings } from './FontSettings';
import { IndentSettings } from './IndentSettings';
import { CheckListSettings } from './CheckListSettings';
import { SettingsCard } from './SettingsCard';

// Initial State
const INITIAL_CONFIG: DocumentConfigData = {
    margin_mm: { top: 0, bottom: 0, left: 0, right: 0 },
    font: { name: 'TH Sarabun New', size: 16, tolerance: 0 },
    indent_rules: {
        paragraph: 0, sub_section_num: 0, sub_section_text_1: 0,
        sub_section_text_2: 0, bullet_point: 0, bullet_text: 0, tolerance: 0
    },
    check_list: {
        check_font: true, check_margin: true, check_section_seq: true,
        check_page_seq: true, check_indentation: true, check_spacing: true
    },
    ignored_units: []
};

export const ThesisFormatSettings = () => {
    const [config, setConfig] = useState<DocumentConfigData>(INITIAL_CONFIG);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // --- 1. Fetch Data ---
    const fetchConfig = async () => {
        setLoading(true);
        try {
            const data = await getDocConfig();
            if (data) {
                setConfig((prev) => ({
                    ...prev,
                    ...data,
                    ignored_units: data.ignored_units || []
                }));
            }
        } catch (error) {
            console.error('Failed to load config', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    // --- 2. Handle Changes ---
    const updateSection = <K extends keyof DocumentConfigData>(
        section: K,
        key: keyof DocumentConfigData[K],
        value: any
    ) => {
        setConfig((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    // --- 3. Save Data ---
    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDocConfig(config);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save config', error);
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading configuration...</div>;

    return (
        <div className="space-y-6 pb-24 animate-fade-in">
             <div className="flex justify-end mb-2">
                <button onClick={fetchConfig} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition">
                    <FiRefreshCw size={16} /> Refresh Data
                </button>
            </div>

            <MarginSettings
                data={config.margin_mm}
                onChange={(k, v) => updateSection('margin_mm', k, v)}
            />

            <FontSettings
                data={config.font}
                onChange={(k, v) => updateSection('font', k, v)}
            />

            <IndentSettings
                data={config.indent_rules}
                onChange={(k, v) => updateSection('indent_rules', k, v)}
            />

            <CheckListSettings
                data={config.check_list}
                onChange={(k, v) => updateSection('check_list', k, v)}
            />

            <SettingsCard title="Ignored Units">
                <div className="space-y-2">
                    <label className="block text-sm text-gray-500 dark:text-gray-400">Separate values with commas (e.g., cm, inch, mm)</label>
                    <input
                        type="text"
                        value={(config.ignored_units || []).join(', ')}
                        onChange={(e) => setConfig(prev => ({ ...prev, ignored_units: e.target.value.split(',').map(s => s.trim()) }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            </SettingsCard>

            {/* Save Button */}
            <div className="fixed bottom-6 right-6 z-20">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    <FiSave size={20} />
                    <span className="font-bold">{saving ? 'Saving...' : 'Save Configuration'}</span>
                </button>
            </div>
        </div>
    );
};