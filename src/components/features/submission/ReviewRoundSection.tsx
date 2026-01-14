// src/components/features/submission/ReviewRoundSection.tsx
// Section แสดง submission ของแต่ละ Inspection Round

import React from 'react';
import { FiClock, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { SubmissionReviewCard } from './SubmissionReviewCard';
import { SubmissionStatus, type Submission } from '@/types/submission';

interface ReviewRoundSectionProps {
    /** ลำดับรอบ */
    roundNumber: number;
    /** ชื่อรอบ */
    roundTitle?: string;
    /** Submission ของรอบนี้ */
    submission: Submission;
    /** Callback download original */
    onDownloadOriginal?: () => void;
    /** Callback download report */
    onDownloadReport?: () => void;
}

/**
 * ReviewRoundSection - แสดง submission ของแต่ละ round
 * 
 * Features:
 * - Header: "รอบที่ X" + Status Badge
 * - 2 columns: Original | Report
 */
export const ReviewRoundSection: React.FC<ReviewRoundSectionProps> = ({
    roundNumber,
    roundTitle,
    submission,
    onDownloadOriginal,
    onDownloadReport,
}) => {
    /**
     * Get status config
     */
    const getStatusConfig = (status: SubmissionStatus) => {
        switch (status) {
            case SubmissionStatus.PENDING:
                return {
                    label: 'รอดำเนินการ',
                    icon: FiClock,
                    bgColor: 'bg-amber-100',
                    textColor: 'text-amber-700',
                    iconColor: 'text-amber-600',
                };
            case SubmissionStatus.IN_PROGRESS:
                return {
                    label: 'กำลังตรวจ',
                    icon: FiLoader,
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700',
                    iconColor: 'text-blue-600',
                };
            case SubmissionStatus.COMPLETED:
                return {
                    label: 'ตรวจเสร็จ',
                    icon: FiCheckCircle,
                    bgColor: 'bg-emerald-100',
                    textColor: 'text-emerald-700',
                    iconColor: 'text-emerald-600',
                };
            default:
                return {
                    label: status,
                    icon: FiClock,
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-700',
                    iconColor: 'text-gray-600',
                };
        }
    };

    const statusConfig = getStatusConfig(submission.status);
    const StatusIcon = statusConfig.icon;

    // Check if report exists (mocked: completed = has report)
    const hasReport = submission.status === SubmissionStatus.COMPLETED;

    return (
        <div className="mb-8 last:mb-0">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                    {roundTitle || `รอบที่ ${roundNumber}`}
                </h3>
                <span className={`
                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
                    ${statusConfig.bgColor} ${statusConfig.textColor}
                `}>
                    <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor} ${submission.status === SubmissionStatus.IN_PROGRESS ? 'animate-spin' : ''}`} />
                    {statusConfig.label}
                </span>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <SubmissionReviewCard
                    type="original"
                    file={{
                        fileName: submission.fileName,
                        fileSize: submission.fileSize,
                        submittedAt: submission.submittedAt,
                    }}
                    onDownload={onDownloadOriginal}
                />

                {/* Report (mocked) */}
                <SubmissionReviewCard
                    type="report"
                    file={hasReport ? {
                        fileName: `${submission.fileName.replace('.pdf', '')}_report.pdf`,
                        fileSize: submission.fileSize,
                        submittedAt: submission.submittedAt,
                        verifiedAt: submission.verifiedAt,
                        comment: submission.comment,
                    } : undefined}
                    reviewerName={hasReport ? 'อ.ผู้ตรวจ' : undefined}
                    onDownload={onDownloadReport}
                />
            </div>
        </div>
    );
};

export default ReviewRoundSection;
