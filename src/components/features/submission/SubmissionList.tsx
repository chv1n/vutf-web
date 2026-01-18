// src/components/features/submission/SubmissionList.tsx
// แสดงรายการ Submissions ของกลุ่ม

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFile, FiDownload, FiCalendar, FiLoader, FiInbox } from 'react-icons/fi';
import { useSubmissions } from '@/hooks/useSubmission';
import { SubmissionStatusBadge } from './SubmissionStatusBadge';
import { formatFileSize } from '@/types/submission';

interface SubmissionListProps {
    /** ID ของกลุ่ม */
    groupId: string;
    /** เรียก refresh เมื่อต้องการ reload ข้อมูล */
    refreshTrigger?: number;
    /** แสดงในรูปแบบ compact */
    compact?: boolean;
}

/**
 * SubmissionList - แสดงรายการ Submissions
 * * Single Responsibility: แสดงรายการ submissions พร้อม download
 * * Features:
 * - Fetch submissions by group
 * - Display file info (name, size, status, date)
 * - Download button
 * - Loading & empty state
 */
export const SubmissionList: React.FC<SubmissionListProps> = ({
    groupId,
    refreshTrigger,
    compact = false,
}) => {
    const { submissions, loading, error, fetchSubmissions, downloadFile } = useSubmissions(groupId);

    // Fetch on mount and when refreshTrigger changes
    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions, refreshTrigger]);

    /**
     * Format date to Thai locale
     */
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Loading state
    if (loading && submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <FiLoader className="w-8 h-8 animate-spin mb-3" />
                <p className="text-sm">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-red-400 dark:text-red-500">
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    // Empty state
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

                                {/* Comment (if exists and completed) */}
                                {submission.comment && (
                                    <div className="mt-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">ความเห็น:</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{submission.comment}</p>
                                    </div>
                                )}

                                {/* Verified At (if completed) */}
                                {submission.verifiedAt && (
                                    <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                                        ตรวจเสร็จเมื่อ: {formatDate(submission.verifiedAt)}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => downloadFile(submission.submissionId)}
                                        className={`
                      flex items-center gap-1.5
                      ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'}
                      text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40
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
        </div>
    );
};

export default SubmissionList;