// src/hooks/useSubmission.ts
// Custom hook สำหรับจัดการ Submission operations

import { useState, useCallback } from 'react';
import { submissionService } from '@/services/submission.service';
import type { Submission } from '@/types/submission';
import { translateSubmissionError } from '@/types/submission';

/**
 * useSubmission Hook
 * 
 * Single Responsibility: จัดการ state และ operations สำหรับ file upload
 * 
 * Features:
 * - Submit file with loading state
 * - Error handling with Thai messages
 * - Upload progress tracking (future enhancement)
 */
export function useSubmission() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    /**
     * Submit file
     */
    const submitFile = useCallback(async (data: {
        file: File;
        inspectionId: number;
        groupId: string;
    }): Promise<Submission | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await submissionService.createSubmission(data);
            setSuccess(true);
            return result;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'เกิดข้อผิดพลาดในการอัพโหลด';
            setError(translateSubmissionError(errorMessage));
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Reset state
     */
    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setSuccess(false);
    }, []);

    return {
        submitFile,
        loading,
        error,
        success,
        reset,
    };
}

/**
 * useSubmissions Hook
 * 
 * Single Responsibility: Fetch และ manage submissions list
 */
export function useSubmissions(groupId: string | null) {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch submissions by group
     */
    const fetchSubmissions = useCallback(async () => {
        if (!groupId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await submissionService.getByGroup(groupId);
            setSubmissions(data);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
            setError(translateSubmissionError(errorMessage));
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    /**
     * Download file
     */
    const downloadFile = useCallback(async (submissionId: number) => {
        try {
            const { url } = await submissionService.getFileUrl(submissionId);
            // Open in new tab
            window.open(url, '_blank');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'เกิดข้อผิดพลาดในการดาวน์โหลด';
            setError(translateSubmissionError(errorMessage));
        }
    }, []);

    /**
     * Refresh submissions
     */
    const refresh = useCallback(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    return {
        submissions,
        loading,
        error,
        fetchSubmissions,
        downloadFile,
        refresh,
    };
}
