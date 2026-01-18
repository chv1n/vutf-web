// src/components/features/submission/SubmissionReviewCard.tsx
// Card แสดง submission file (Original หรือ Report)

import React from 'react';
import { FiFile, FiDownload, FiCalendar, FiUser, FiMessageSquare } from 'react-icons/fi';
import { formatFileSize } from '@/types/submission';

interface SubmissionReviewCardProps {
    /** ประเภท card */
    type: 'original' | 'report';
    /** ข้อมูลไฟล์ */
    file?: {
        fileName: string;
        fileSize: number;
        submittedAt: string;
        verifiedAt?: string | null;
        comment?: string | null;
    };
    /** ชื่อผู้ตรวจ (สำหรับ Report) */
    reviewerName?: string;
    /** Callback เมื่อกด download */
    onDownload?: () => void;
    /** Loading state */
    loading?: boolean;
}

/**
 * SubmissionReviewCard - Card แสดง submission file
 * * Features:
 * - แสดง file info (name, size, date)
 * - Download button
 * - สำหรับ Report: reviewer name, comment
 */
export const SubmissionReviewCard: React.FC<SubmissionReviewCardProps> = ({
    type,
    file,
    reviewerName,
    onDownload,
    loading = false,
}) => {
    const isOriginal = type === 'original';
    const title = isOriginal ? 'Original' : 'Report';

    /**
     * Format date to Thai
     */
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // No file state
    if (!file) {
        return (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 border-2 border-dashed border-gray-200 dark:border-gray-600 h-full flex flex-col transition-colors">
                <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                    {title}
                </h4>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-400 dark:text-gray-500 text-sm">ยังไม่มีไฟล์</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`
            bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 h-full flex flex-col transition-colors
            ${isOriginal ? 'border-blue-100 dark:border-blue-900/30' : 'border-emerald-100 dark:border-emerald-900/30'}
        `}>
            {/* Header */}
            <h4 className={`
                text-sm font-bold uppercase tracking-wider mb-4
                ${isOriginal ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}
            `}>
                {title}
            </h4>

            {/* File Info */}
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <FiFile className="w-5 h-5 text-red-500 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                        {file.fileName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF • {formatFileSize(file.fileSize)}
                    </p>
                </div>

                {/* Download Button */}
                <button
                    type="button"
                    onClick={onDownload}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300
                        bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiDownload className="w-4 h-4" />
                    Download
                </button>
            </div>

            {/* Date/Time */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-medium text-gray-500 dark:text-gray-400">Date/Time</span>
                <span className="flex items-center gap-1">
                    <FiCalendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    {formatDate(isOriginal ? file.submittedAt : (file.verifiedAt || file.submittedAt))}
                </span>
            </div>

            {/* Report specific fields */}
            {!isOriginal && (
                <>
                    {/* Reviewer */}
                    {reviewerName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <span className="font-medium text-gray-500 dark:text-gray-400">Review by</span>
                            <span className="flex items-center gap-1">
                                <FiUser className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                                {reviewerName}
                            </span>
                        </div>
                    )}

                    {/* Comment */}
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 mt-2">
                        <span className="font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">Comment</span>
                        <span className="flex items-start gap-1">
                            <FiMessageSquare className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-200">
                                {file.comment || '-'}
                            </span>
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default SubmissionReviewCard;