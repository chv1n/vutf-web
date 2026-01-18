// src/components/features/instructor/SubmissionTable.tsx
import React, { useState } from 'react';
import {
    FiCheckCircle,
    FiChevronLeft,
    FiChevronRight,
    FiEye,
    FiX,
    FiDownload
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
    const [selectedFile, setSelectedFile] = useState<{ url: string; downloadUrl: string; name: string; type: string } | null>(null);

    if (isLoading) return <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">กำลังโหลดข้อมูล...</div>;
    if (data.length === 0) return <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">ไม่พบข้อมูลการส่งงาน</div>;

    return (
        <>
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
                                                <button 
                                                    onClick={() => setSelectedFile({ 
                                                        url: item.file.url, 
                                                        downloadUrl: item.file.downloadUrl || item.file.url, 
                                                        name: item.file.name,
                                                        type: item.file.type 
                                                    })}
                                                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline text-left line-clamp-1 max-w-[150px] transition-colors cursor-pointer"
                                                    title={item.file.name}
                                                >
                                                    {item.file.name}
                                                </button>
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
                                    <td className="px-6 py-4 text-center">
                                        {item.canVerify ? (
                                            <button
                                                onClick={() => onVerify(item.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <FiCheckCircle size={14} /> Verify
                                            </button>
                                        ) : <span className="text-xs text-gray-300">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => onViewDetails(item.id)}
                                            className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
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
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                         แสดง {((meta.page - 1) * meta.limit) + 1} ถึง {Math.min(meta.page * meta.limit, meta.total)} จาก {meta.total} รายการ
                    </span>
                    <div className="flex items-center gap-2">
                         <button disabled={meta.page === 1} onClick={() => onPageChange(meta.page - 1)} className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"><FiChevronLeft /></button>
                         <span className="px-4 text-sm font-medium dark:text-gray-300">หน้า {meta.page} / {meta.lastPage}</span>
                         <button disabled={meta.page === meta.lastPage} onClick={() => onPageChange(meta.page + 1)} className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"><FiChevronRight /></button>
                    </div>
                </div>
            </div>

            {/* In-App Preview Modal */}
            {selectedFile && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/90 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between bg-gray-300 dark:bg-gray-800 p-4 rounded-t-2xl border-b dark:border-gray-700">
                        <div className="flex items-center gap-3 ">
                            <FaFilePdf className="text-red-500" size={24} />
                            <span className="font-semibold text-gray-900 dark:text-white truncate max-w-xs sm:max-w-md">
                                {selectedFile.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* ปุ่ม Download */}
                            <a 
                                href={selectedFile.downloadUrl} 
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <FiDownload /> <span className="hidden sm:inline">Download</span>
                            </a>
                            {/* ปุ่ม ปิด */}
                            <button 
                                onClick={() => setSelectedFile(null)}
                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Modal Body (Preview Content) */}
                    <div className="flex-1 bg-white dark:bg-gray-900 rounded-b-2xl overflow-hidden shadow-2xl relative">
                        {selectedFile.type?.includes('pdf') ? (
                            <iframe 
                                src={`${selectedFile.url}#toolbar=0`} 
                                className="w-full h-full border-none"
                                title="File Preview"
                            />
                        ) : selectedFile.type?.startsWith('image/') ? (
                            <div className="w-full h-full flex items-center justify-center p-4">
                                <img src={selectedFile.url} alt="Preview" className="max-w-full max-h-full object-contain rounded-md" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <p>ไม่รองรับการพรีวิวไฟล์ประเภทนี้</p>
                                <a href={selectedFile.downloadUrl} className="mt-4 text-blue-600 underline">ดาวน์โหลดไฟล์แทน</a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};