import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const ThesisFormatSection: React.FC = () => {
    const formats = [
        { type: 'PDF', label: 'Thesis Format Sample', size: '2.4 MB', iconColor: 'text-red-500', bgColor: 'bg-red-50' },
        { type: 'Word', label: 'Thesis Format Sample', size: '2.4 MB', iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
    ];

    return (
        <div className="w-full">
            <h3 className="text-center text-lg font-bold text-gray-800 mb-6">Thesis Format Sample File</h3>

            {/* ใช้ grid-cols-1 ในมือถือ เพื่อให้การ์ดเรียงลงมา */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {formats.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors gap-3">

                        {/* ส่วนข้อมูลไฟล์ (ซ้าย) */}
                        <div className="flex items-center space-x-3 md:space-x-4 overflow-hidden">
                            <div className={`w-10 h-10 md:w-12 md:h-12 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <span className={`font-bold text-xs ${item.iconColor}`}>{item.type}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-700 text-sm truncate">{item.label}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-gray-400">{item.type}</span>
                                    <span className="text-xs text-gray-300">•</span>
                                    <span className="text-xs text-gray-400">{item.size}</span>
                                </div>
                            </div>
                        </div>

                        {/* ปุ่ม Download (ขวา) */}
                        <button className="flex items-center justify-center space-x-2 p-2 md:px-4 md:py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors flex-shrink-0">
                            <ArrowDownTrayIcon className="w-5 h-5 md:w-4 md:h-4" />

                            {/* ซ่อน Text ในมือถือ */}
                            <span className="hidden md:inline">Download</span>

                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThesisFormatSection;