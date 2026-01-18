// src/components/features/instructor/SubmissionTable.tsx
import React from 'react';
import {
    FiFileText,
    FiCheckCircle,
    FiChevronLeft,
    FiChevronRight,
    FiEye
} from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa6';
import { SubmissionData } from '@/types/submission';
import { StatusBadge } from './StatusBadge';

interface Props {
    data: SubmissionData[];
    isLoading: boolean;
    onVerify: (id: number) => void;
    onViewDetails: (id: number) => void;
    meta: {
        page: number;
        total: number;
        lastPage: number;
        limit: number;
    };
    onPageChange: (newPage: number) => void;
}

export const SubmissionTable: React.FC<Props> = ({ data, isLoading, onVerify, onViewDetails, meta, onPageChange }) => {
    if (isLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">กำลังโหลดข้อมูล...</div>;
    if (data.length === 0) return <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">ไม่พบข้อมูลการส่งงาน</div>;

    return (
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">File Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uploaded By</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date/Time</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Verification</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                                            <FaFilePdf size={20} />
                                        </div>
                                        <div>
                                            <a href={item.file.url} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline line-clamp-1 max-w-[150px] cursor-pointer transition-colors" title={item.file.name}>
                                                {item.file.name}
                                            </a>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="uppercase">{item.file.type?.split('/')[1] || 'FILE'}</span>
                                                <span>{item.file.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {item.uploadedBy.avatar ? (
                                            <img src={item.uploadedBy.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300">
                                                {item.uploadedBy.name.charAt(0)}
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.uploadedBy.name}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="max-w-[200px]">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={item.project.nameEn}>
                                            {item.project.nameEn}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.project.code}</p>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(item.submittedAt).toLocaleDateString('th-TH', {
                                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </td>

                                <td className="px-6 py-4">
                                    <StatusBadge status={item.status as any} />
                                </td>

                                {/* Verification (ปุ่ม Verify) */}
                                <td className="px-6 py-4 text-center">
                                    {item.canVerify ? (
                                        <button
                                            onClick={() => onVerify(item.id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 dark:bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
                                        >
                                            <FiCheckCircle size={14} />
                                            Verify
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-300 dark:text-gray-600">-</span>
                                    )}
                                </td>

                                {/* Actions (ปุ่ม Details) */}
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onViewDetails(item.id)}
                                        className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                        title="ดูรายละเอียด"
                                    >
                                        <FiEye size={20} />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 transition-colors">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    แสดง {((meta.page - 1) * meta.limit) + 1} ถึง {Math.min(meta.page * meta.limit, meta.total)} จาก {meta.total} รายการ
                </span>

                <div className="flex items-center gap-2">
                    <button
                        disabled={meta.page === 1}
                        onClick={() => onPageChange(meta.page - 1)}
                        className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-400"
                    >
                        <FiChevronLeft />
                    </button>
                    <span className="px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        หน้า {meta.page} / {meta.lastPage}
                    </span>
                    <button
                        disabled={meta.page === meta.lastPage}
                        onClick={() => onPageChange(meta.page + 1)}
                        className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-400"
                    >
                        <FiChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
};