// src/components/features/instructor/InspectionRoundHeader.tsx
import React from 'react';
import { FiCalendar, FiClock, FiInfo, FiLayers, FiFilter } from 'react-icons/fi';

export interface HeaderInfo {
    title: string;
    description: string;
    courseType?: string;
    startDate?: string;
    endDate?: string;
    isGeneric?: boolean;
}

interface Props {
    info?: HeaderInfo | null;
}

export const InspectionRoundHeader: React.FC<Props> = ({ info }) => {
    if (!info) return null;

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('th-TH', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

    // Helper Function
    const getBadgeStyle = (type?: string) => {
        // ใช้ toUpperCase() เผื่อค่าที่ส่งมาเป็นตัวเล็ก
        const normalizedType = type?.toUpperCase();
        
        switch (normalizedType) {
            case 'PROJECT':
                return {
                    style: 'bg-indigo-100 text-indigo-700',
                    label: 'Project',
                    bgDecoration: 'bg-indigo-500'
                };
            case 'PRE_PROJECT':
                return {
                    style: 'bg-orange-100 text-orange-700',
                    label: 'Pre-Project',
                    bgDecoration: 'bg-orange-500'
                };
            default: 
                return {
                    style: 'bg-purple-100 text-purple-700', 
                    label: 'All Courses',
                    bgDecoration: 'bg-purple-400'
                };
        }
    };

    const badge = getBadgeStyle(info.courseType);

    return (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-indigo-50 relative overflow-hidden transition-all">
            {/* Decorative Background */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 ${badge.bgDecoration}`} />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">

                {/* Left: Title & Description */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        {/* Badge Course Type */}
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${badge.style}`}>
                            {badge.label}
                        </span>

                        {/* Label: เปลี่ยนไอคอนตามบริบท */}
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                            {info.isGeneric ? <FiFilter className="text-gray-400" /> : <FiLayers className="text-gray-400" />}
                            <span>{info.isGeneric ? 'เงื่อนไขการแสดงผล' : 'รอบการตรวจ'}</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{info.title}</h2>

                    {/* Description Box */}
                    <div className={`flex items-start gap-2 p-3 rounded-lg text-sm max-w-2xl
             ${info.isGeneric ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'}
          `}>
                        <FiInfo className={`mt-0.5 shrink-0 ${info.isGeneric ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p>{info.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
                    </div>
                </div>

                {/* Right: Date Info */}
                {info.startDate && info.endDate && (
                    <div className="flex flex-col gap-3 min-w-[200px] bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-100">
                        {/* Date Info */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <FiCalendar />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">วันเริ่มการตรวจ</p>
                                <p className="text-sm font-semibold text-gray-800">{formatDate(info.startDate)}</p>
                            </div>
                        </div>
                        <div className="w-full h-px bg-gray-100" />
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                <FiClock />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">วันสิ้นสุด</p>
                                <p className="text-sm font-semibold text-gray-800">{formatDate(info.endDate)}</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};