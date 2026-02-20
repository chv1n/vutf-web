// src/components/features/submission/SubmissionList.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFile, FiDownload, FiCalendar, FiLoader, FiInbox, FiEye, FiX } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa6';
import { useSubmissions } from '@/hooks/useSubmission';
import { SubmissionStatusBadge } from './SubmissionStatusBadge';
import { formatFileSize } from '@/types/submission';
import { submissionService } from '@/services/submission.service';

interface SubmissionListProps {
    groupId: string;
    inspectionId: number;
    refreshTrigger?: number;
    compact?: boolean;
}

// Helper สำหรับเดา mimeType
const getFileType = (fileName: string): string => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'application/pdf';
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return 'image/' + ext;
    return 'application/octet-stream';
};

export const SubmissionList: React.FC<SubmissionListProps> = ({
    groupId,
    inspectionId,
    refreshTrigger,
    compact = false,
}) => {
    const { submissions, loading, error, fetchSubmissions, downloadFile } = useSubmissions(groupId, inspectionId);

    // State สำหรับเก็บไฟล์ที่เลือกดู (Preview)
    const [previewFile, setPreviewFile] = useState<{ url: string; downloadUrl: string; name: string; type: string; size: number; } | null>(null);
    const [previewLoading, setPreviewLoading] = useState<number | null>(null);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions, refreshTrigger]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    };

    const handlePreview = async (submissionId: number, fileName: string, fileSize: number, mimeType?: string) => {
        try {
            setPreviewLoading(submissionId);

            // เรียก API ขอ URL ใหม่
            const res = await submissionService.getFileUrl(submissionId);

            // เปิด Modal ด้วย URL ใหม่
            setPreviewFile({
                url: res.url,
                downloadUrl: res.downloadUrl,
                name: fileName,
                type: mimeType || getFileType(fileName),
                size: fileSize,
            });
        } catch (error) {
            console.error("Failed to refresh file url", error);
            alert("ไม่สามารถเปิดไฟล์ได้ กรุณาลองใหม่ หรือรีเฟรชหน้าจอ");
        } finally {
            setPreviewLoading(null);
        }
    };

    // Loading State
    if (loading && submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <FiLoader className="w-8 h-8 animate-spin mb-3" />
                <p className="text-sm">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-red-400 dark:text-red-500">
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    // Empty State
    if (submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <FiInbox className="w-12 h-12 mb-3" />
                <p className="text-base font-medium text-gray-500 dark:text-gray-400">ยังไม่มีไฟล์ที่ส่ง</p>
                <p className="text-sm mt-1">ไฟล์ที่ส่งจะแสดงที่นี่</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <AnimatePresence>
                {submissions.map((submission, index) => (
                    <motion.div
                        key={submission.submissionId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
              bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm
              hover:shadow-md transition-shadow duration-200
              ${compact ? 'p-3' : 'p-4'}
            `}
                    >
                        <div className="flex items-start gap-3">
                            {/* File Icon */}
                            <div className={`
                ${compact ? 'w-10 h-10' : 'w-12 h-12'}
                bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700
                rounded-xl flex items-center justify-center
                shadow-lg shadow-red-200 dark:shadow-none flex-shrink-0
              `}>
                                <FiFile className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
                            </div>

                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h4 className={`${compact ? 'text-sm' : 'text-base'} font-semibold text-gray-900 dark:text-white truncate`}>
                                            {submission.fileName}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatFileSize(submission.fileSize)}
                                            </span>
                                            <span className="text-gray-300 dark:text-gray-600">•</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <FiCalendar className="w-3 h-3" />
                                                {formatDate(submission.submittedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <SubmissionStatusBadge
                                        status={submission.status}
                                        size={compact ? 'sm' : 'md'}
                                    />
                                </div>

                                {/* Comment Section */}
                                {submission.comment && (
                                    <div className="mt-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">ความเห็น:</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{submission.comment}</p>
                                    </div>
                                )}

                                {/* Actions Button Group */}
                                <div className="flex items-center gap-2 mt-3">
                                    {/* ปุ่มดูตัวอย่าง (Preview) */}
                                    <button
                                        type="button"
                                        onClick={() => handlePreview(submission.submissionId, submission.fileName, submission.fileSize, submission.mimeType)}
                                        disabled={previewLoading === submission.submissionId}
                                        className={`
                      flex items-center gap-1.5
                      ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'}
                      text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 
                      hover:bg-blue-100 dark:hover:bg-blue-900/40
                      rounded-lg font-medium transition-colors disabled:opacity-50
                    `}
                                    >
                                        {previewLoading === submission.submissionId ? (
                                            <FiLoader className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <FiEye className="w-4 h-4" />
                                        )}
                                        {previewLoading === submission.submissionId ? 'กำลังโหลด...' : 'ดูตัวอย่าง'}
                                    </button>

                                    {/* ปุ่มดาวน์โหลด (Download) */}
                                    <button
                                        type="button"
                                        onClick={() => downloadFile(submission.submissionId)}
                                        className={`
                      flex items-center gap-1.5
                      ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'}
                      text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 
                      hover:bg-gray-200 dark:hover:bg-gray-600
                      rounded-lg font-medium transition-colors
                    `}
                                    >
                                        <FiDownload className="w-4 h-4" />
                                        ดาวน์โหลด
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* --- Preview Modal (Full Screen Style) --- */}
            {previewFile && (
                <div className="fixed inset-0 z-[9999] flex flex-col bg-gray-900/95 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">

                    {/* Header */}
                    <div className="flex items-center justify-between bg-gray-300 dark:bg-gray-800 p-3 sm:p-4 rounded-none sm:rounded-t-xl border-b dark:border-gray-700 shrink-0 shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-red-100 dark:bg-white rounded-lg text-red-500 shrink-0">
                                <FaFilePdf size={24} />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white truncate text-base sm:text-lg max-w-[200px] sm:max-w-md">
                                    {previewFile.name}
                                </p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                    {previewFile.type.split('/')[1] || 'FILE'} • {formatFileSize(previewFile.size)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href={previewFile.downloadUrl} // ใช้ URL ที่ได้จาก backend
                                download={previewFile.name}    // hint ชื่อไฟล์ให้ browser
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
                            >
                                <FiDownload size={18} />
                                <span>Download</span>
                            </a>

                            {/* ปุ่ม Download สำหรับมือถือ (แสดงแค่ icon) */}
                            <a
                                href={previewFile.downloadUrl}
                                download={previewFile.name}
                                className="sm:hidden p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                                <FiDownload size={24} />
                            </a>

                            <button
                                onClick={() => setPreviewFile(null)}
                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 bg-white dark:bg-gray-900 rounded-none sm:rounded-b-xl overflow-hidden shadow-2xl relative">
                        {previewFile.type.includes('pdf') ? (
                            <iframe
                                src={`${previewFile.url}#toolbar=0`}
                                className="w-full h-full border-none"
                                title="File Preview"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-gray-400">
                                <FiFile size={48} className="mb-4 opacity-30" />
                                <p>ไม่สามารถแสดงตัวอย่างไฟล์ประเภทนี้ได้</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionList;