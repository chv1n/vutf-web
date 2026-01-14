// src/types/submission.ts
// Types และ Interfaces สำหรับ Submission Domain

// ============================================
// ENUMS
// ============================================

/**
 * สถานะของ Submission
 */
export enum SubmissionStatus {
    PENDING = 'PENDING',         // รอดำเนินการ (นศ submit ไฟล์เข้ามา)
    IN_PROGRESS = 'IN_PROGRESS', // กำลังดำเนินการ (อาจารย์กดตรวจ)
    COMPLETED = 'COMPLETED',     // ตรวจเสร็จ
}

// ============================================
// ENTITIES
// ============================================

/**
 * ข้อมูล Submission
 */
export interface Submission {
    submissionId: number;
    fileName: string;
    fileUrl: string;
    fileSize: number;        // bytes
    mimeType: string;
    status: SubmissionStatus;
    submittedAt: string;     // ISO date
    verifiedAt: string | null;
    comment: string | null;
    groupId: string;
    inspectionId: number;
}

/**
 * Response สำหรับ Download URL
 */
export interface SubmissionFileUrl {
    url: string;
}

// ============================================
// DTOs
// ============================================

/**
 * Request สำหรับสร้าง Submission
 */
export interface CreateSubmissionRequest {
    file: File;
    inspectionId: number;
    groupId: string;
}

// ============================================
// ERROR MESSAGES (Thai)
// ============================================

export const SUBMISSION_ERROR_MESSAGES: Record<string, string> = {
    'File is required': 'กรุณาเลือกไฟล์',
    'Invalid file type': 'ไฟล์ต้องเป็น PDF เท่านั้น',
    'File too large': 'ไฟล์ต้องมีขนาดไม่เกิน 50MB',
    'Inspection round is not open': 'รอบตรวจนี้ปิดแล้ว',
    'Inspection round has not started yet': 'ยังไม่ถึงเวลาส่ง',
    'Inspection round has ended': 'หมดเวลาส่งแล้ว',
    'Only the group owner can submit files': 'เฉพาะหัวหน้ากลุ่มเท่านั้นที่สามารถส่งไฟล์ได้',
    'Cannot update submission. Status is not PENDING.': 'ไม่สามารถแก้ไขได้ เนื่องจากไฟล์อยู่ระหว่างการตรวจ',
    'Group not found': 'ไม่พบกลุ่ม',
    'Inspection round not found': 'ไม่พบรอบตรวจ',
    'Submission not found': 'ไม่พบ Submission',
};

// ============================================
// CONSTANTS
// ============================================

export const SUBMISSION_FILE_CONSTRAINTS = {
    MAX_SIZE_BYTES: 52428800, // 50MB
    MAX_SIZE_MB: 50,
    ALLOWED_TYPES: ['application/pdf'],
    ALLOWED_EXTENSIONS: ['.pdf'],
};

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Props สำหรับ Status Badge
 */
export interface SubmissionStatusBadgeProps {
    status: SubmissionStatus;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

/**
 * Helper function สำหรับแปลงขนาดไฟล์
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Helper function สำหรับแปลงข้อความ error
 */
export const translateSubmissionError = (message: string): string => {
    return SUBMISSION_ERROR_MESSAGES[message] || message;
};
