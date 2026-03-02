// src/components/features/instructor/report-detail/ReportHeaderCard.tsx
import React from 'react';
import { FiClock, FiCalendar, FiTag, FiCheckCircle } from 'react-icons/fi';
import { ReportDetail } from '@/types/report-detail';
import { ReportStatusBadge } from '../report/ReportStatusBadge';

interface Props {
    data: ReportDetail;
}

export const ReportHeaderCard: React.FC<Props> = ({ data }) => {

    // Helper: จัดรูปแบบวันที่
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('th-TH', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    // Helper: ดึง courseType
    const courseType = data.courseType;

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full opacity-50" />

            <div className="relative z-10">

                {/* Top Row: Tags & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    {/* Left: Project Code & Course Type */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                            <FiTag /> {data.project.code}
                        </span>

                        {courseType && (
                            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                <FiTag size={12} />
                                {courseType === 'PRE_PROJECT' ? 'Pre-Project' :
                                    courseType === 'PROJECT' ? 'Project' :
                                        courseType}
                            </span>
                        )}
                    </div>

                    {/* Right: Status Badges */}
                    <div className="flex items-center gap-3">
                        <ReportStatusBadge type="verification" status={data.verificationStatus} />
                        <span className="text-gray-300 dark:text-gray-600 h-4 border-l border-gray-300 dark:border-gray-600 mx-1"></span>
                        <ReportStatusBadge type="review" status={data.reviewStatus} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {data.project.nameEn}
                </h1>
                <h2 className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-6">
                    {data.project.nameTh}
                </h2>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                    {/* 1. Report Time Card (Blue Style) */}
                    <div className="flex flex-col justify-center p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white dark:bg-gray-700 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-100 dark:ring-blue-900/30 group-hover:scale-110 transition-transform duration-300">
                                <FiClock size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                                    วันที่ตรวจสอบ
                                </p>
                                <p className="text-base font-bold text-gray-900 dark:text-white font-mono">
                                    {new Date(data.createdAt).toLocaleString('th-TH', {
                                        dateStyle: 'medium',
                                        timeStyle: 'medium',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Round Info Card (Purple Style) */}
                    {data.inspectionRound ? (
                        <div className="flex flex-col justify-center p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 hover:border-purple-200 dark:hover:border-purple-800 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white dark:bg-gray-700 rounded-xl text-purple-600 dark:text-purple-400 shadow-sm ring-1 ring-purple-100 dark:ring-purple-900/30 shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                                    <FiCheckCircle size={22} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1 flex items-center gap-2">
                                        รอบการตรวจ: <span className="text-gray-900 dark:text-white normal-case text-sm truncate">{data.inspectionRound.title}</span>
                                    </p>
                                    
                                    {/* startDate / endDate และ format วันที่ */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg border border-purple-100 dark:border-purple-900/30 shadow-sm text-xs font-medium text-gray-600 dark:text-gray-300 mt-2">
                                        <FiCalendar className="text-purple-500 dark:text-purple-400" />
                                        <span>{formatDate(data.inspectionRound.startDate)}</span>
                                        <span className="text-purple-500 dark:text-purple-400"> - </span>
                                        <span>{formatDate(data.inspectionRound.endDate)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-4 opacity-50">
                                <FiCheckCircle size={22} />
                                <span className="text-sm">ไม่ระบุรอบการตรวจ</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};