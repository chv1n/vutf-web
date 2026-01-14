// src/components/features/submission/SubmissionUploadForm.tsx
// Form สำหรับอัพโหลดไฟล์ Submission

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useSubmission } from '@/hooks/useSubmission';
import {
    SUBMISSION_FILE_CONSTRAINTS,
    formatFileSize,
    type Submission
} from '@/types/submission';

interface SubmissionUploadFormProps {
    /** ID ของกลุ่ม */
    groupId: string;
    /** ID ของรอบตรวจ */
    inspectionId: number;
    /** Callback เมื่อ upload สำเร็จ */
    onSuccess?: (submission: Submission) => void;
    /** แสดงในรูปแบบ compact */
    compact?: boolean;
}

/**
 * SubmissionUploadForm - Form สำหรับอัพโหลดไฟล์
 * 
 * Single Responsibility: จัดการ UI และ logic สำหรับ file upload
 * 
 * Features:
 * - Drag & Drop support
 * - PDF only validation
 * - 50MB max size validation
 * - Upload progress indicator
 * - Error handling with Thai messages
 */
export const SubmissionUploadForm: React.FC<SubmissionUploadFormProps> = ({
    groupId,
    inspectionId,
    onSuccess,
    compact = false,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { submitFile, loading, error, success, reset } = useSubmission();

    /**
     * Validate file
     */
    const validateFile = useCallback((file: File): string | null => {
        // Check file type
        if (!SUBMISSION_FILE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
            return 'ไฟล์ต้องเป็น PDF เท่านั้น';
        }
        // Check file size
        if (file.size > SUBMISSION_FILE_CONSTRAINTS.MAX_SIZE_BYTES) {
            return `ไฟล์ต้องมีขนาดไม่เกิน ${SUBMISSION_FILE_CONSTRAINTS.MAX_SIZE_MB}MB`;
        }
        return null;
    }, []);

    /**
     * Handle file selection
     */
    const handleFileSelect = useCallback((file: File) => {
        setFileError(null);
        reset();

        const validationError = validateFile(file);
        if (validationError) {
            setFileError(validationError);
            return;
        }

        setSelectedFile(file);
    }, [validateFile, reset]);

    /**
     * Handle file input change
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    /**
     * Handle drag events
     */
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    /**
     * Handle upload submit
     */
    const handleSubmit = async () => {
        if (!selectedFile) return;

        const result = await submitFile({
            file: selectedFile,
            inspectionId,
            groupId,
        });

        if (result) {
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            onSuccess?.(result);
        }
    };

    /**
     * Clear selected file
     */
    const handleClear = () => {
        setSelectedFile(null);
        setFileError(null);
        reset();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    /**
     * Open file picker
     */
    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const displayError = fileError || error;

    return (
        <div className={`${compact ? 'space-y-3' : 'space-y-4'}`}>
            {/* Drop Zone */}
            <div
                onClick={openFilePicker}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-200
          ${compact ? 'p-4' : 'p-6'}
          ${isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : selectedFile
                            ? 'border-emerald-300 bg-emerald-50/50'
                            : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50'
                    }
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleInputChange}
                    className="hidden"
                />

                <AnimatePresence mode="wait">
                    {selectedFile ? (
                        // Selected file display
                        <motion.div
                            key="file"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FiFile className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                    {selectedFile.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClear();
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ) : (
                        // Upload prompt
                        <motion.div
                            key="prompt"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center"
                        >
                            <FiUploadCloud className={`mx-auto ${compact ? 'w-8 h-8' : 'w-12 h-12'} text-gray-400`} />
                            <p className={`${compact ? 'mt-2 text-sm' : 'mt-4 text-base'} font-medium text-gray-700`}>
                                ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือก
                            </p>
                            <p className={`${compact ? 'mt-1 text-xs' : 'mt-2 text-sm'} text-gray-500`}>
                                PDF เท่านั้น (สูงสุด {SUBMISSION_FILE_CONSTRAINTS.MAX_SIZE_MB}MB)
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {displayError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl"
                    >
                        <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-600">{displayError}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl"
                    >
                        <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <p className="text-sm text-emerald-600">อัพโหลดไฟล์สำเร็จ</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submit Button */}
            {selectedFile && !success && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`
            w-full flex items-center justify-center gap-2
            ${compact ? 'py-2.5' : 'py-3'} px-4
            bg-gradient-to-r from-blue-600 to-blue-700
            hover:from-blue-700 hover:to-blue-800
            text-white font-medium rounded-xl
            shadow-lg shadow-blue-200
            transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12" cy="12" r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <span>กำลังอัพโหลด...</span>
                        </>
                    ) : (
                        <>
                            <FiUploadCloud className="w-5 h-5" />
                            <span>ส่งไฟล์</span>
                        </>
                    )}
                </motion.button>
            )}
        </div>
    );
};

export default SubmissionUploadForm;
