// src/components/features/admin/track/ReportTabList.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { reportService } from '@/services/report.service';
import { ReportData, ReportFilterParams, VerificationStatus } from '@/types/report';
import { TrackThesisFilterParams } from '@/types/track-thesis';
import { FiFileText, FiEye, FiDownload, FiX, FiClock, FiActivity, FiLayers } from 'react-icons/fi';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa6';
import { ThesisValidator } from '@/components/shared/thesis-validator/ThesisValidator';
import { PdfPreviewModal } from '@/components/shared/pdf-preview/PdfPreviewModal';

interface Props {
    filters: TrackThesisFilterParams;
    activeTab: string;
    selectedReportMap: Record<number, number>;
    setSelectedReportMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

type PreviewMode = 'PDF' | 'VALIDATOR';

export const ReportTabList: React.FC<Props> = ({ filters, activeTab, selectedReportMap, setSelectedReportMap }) => {
    const [reports, setReports] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(false);

    const [previewFile, setPreviewFile] = useState<ReportData | null>(null);
    const [previewMode, setPreviewMode] = useState<PreviewMode>('PDF');

    // 1. จัดกลุ่ม Reports ตาม Submission ID
    const groupedReports = useMemo(() => {
        const groups: Record<number, ReportData[]> = {};
        reports.forEach(report => {
            const subId = report.context.submissionId;
            if (!groups[subId]) groups[subId] = [];
            groups[subId].push(report);
        });

        // เรียงลำดับแต่ละกลุ่มตามวันที่ (เก่าไปใหม่) เพื่อทำ Timeline
        Object.values(groups).forEach(list => {
            list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        });

        return groups;
    }, [reports]);

    useEffect(() => {
        const fetchReports = async () => {
            if (activeTab !== 'reports') return;
            try {
                setLoading(true);
                const params: ReportFilterParams = {
                    page: 1,
                    limit: 100,
                    inspectionId: filters.inspectionId,
                    search: filters.search,
                    academicYear: filters.academicYear,
                    term: filters.term,
                    round: filters.roundNumber,
                    courseType: filters.courseType === 'ALL' ? undefined : filters.courseType,
                    verificationStatus: filters.verificationStatus as VerificationStatus,
                };

                const res = await reportService.getAll(params);
                setReports(res.data || []);
            } catch (err) {
                console.error("Failed to load reports:", err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchReports, 500);
        return () => clearTimeout(timer);
    }, [filters, activeTab]);

    const formatSize = (bytes: number) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const displayRoundInfo = useMemo(() => {
        // กรณีใช้ Custom Filter
        if (filters.academicYear && filters.term) {
            return `ประจำรอบ: ปี ${filters.academicYear}/${filters.term} รอบที่ ${filters.roundNumber || '-'}`;
        }
        // กรณีใช้ Active Round หรือดึงจากข้อมูลที่มีอยู่
        if (reports.length > 0 && reports[0].inspectionRound) {
            const r = reports[0].inspectionRound;
            return `ประจำรอบ: ปี ${r.year}/${r.term} รอบที่ ${r.roundNumber}`;
        }
        return '';
    }, [filters, reports]);

    if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">กำลังโหลดข้อมูล...</div>;

    const submissionIds = Object.keys(groupedReports).map(Number);

    return (
        <div className="space-y-6">
            {submissionIds.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-3 mb-4 px-1 transition-colors duration-200">
                    <div className="w-full sm:w-auto">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            ระบบตรวจแล้วจำนวน
                            <span className="text-blue-600 dark:text-blue-600 text-2xl mx-1">
                                {submissionIds.length}
                            </span>
                            กลุ่ม
                        </h3>
                    </div>

                    {displayRoundInfo && (
                        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
                            {displayRoundInfo}
                        </div>
                    )}
                </div>
            )}
            {submissionIds.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <FiFileText className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                    <p className="text-slate-500 font-medium">ไม่พบรายการผลการตรวจ</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {submissionIds.map((subId) => {
                        const attempts = groupedReports[subId];
                        // เลือก Report ตัวที่จะแสดง: ตามที่คลิกเลือกไว้ หรือถ้าไม่มีให้เอาตัวล่าสุด (ตัวสุดท้ายของ Array)
                        const activeReportId = selectedReportMap[subId] || attempts[attempts.length - 1].id;
                        const activeReport = attempts.find(r => r.id === activeReportId) || attempts[attempts.length - 1];

                        return (
                            <div key={subId} className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all">
                                {/* Side Indicator */}
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${activeReport.verificationStatus === 'PASS' ? 'bg-green-500' : 'bg-red-500'}`} />

                                <div className="p-5 pl-7">
                                    {/* Header: Project Info */}
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">
                                                    {activeReport.project.code}
                                                </span>
                                                <span className="text-[10px] px-2 py-1 rounded-full font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                                    {activeReport.project.courseType}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1">
                                                {activeReport.project.nameTh}
                                            </h4>
                                            <p className="text-sm text-slate-500 italic line-clamp-1">{activeReport.project.nameEn}</p>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex flex-col items-end gap-2">
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${activeReport.verificationStatus === 'PASS'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                VERIFICATION: {activeReport.verificationStatus}
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${activeReport.reviewStatus === 'PASSED'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                REVIEW: {activeReport.reviewStatus}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline / Attempt Selector */}
                                    <div className="flex items-center gap-3 py-3 border-y border-slate-50 dark:border-slate-700/50 mb-6 overflow-x-auto">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1 min-w-fit">
                                            <FiLayers /> Attempts:
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {attempts.map((attempt, idx) => (
                                                <button
                                                    key={attempt.id}
                                                    onClick={() => setSelectedReportMap(prev => ({ ...prev, [subId]: attempt.id }))}
                                                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center border-2 ${activeReportId === attempt.id
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-110'
                                                        : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500'
                                                        }`}
                                                >
                                                    {attempt.attemptNumber}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Active Report Details */}
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 w-full">
                                            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                                    <FiClock className="text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Report Date</p>
                                                    <p className="font-semibold">{new Date(activeReport.createdAt).toLocaleString('th-TH')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                                    <FiActivity className="text-purple-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Reviewer</p>
                                                    <p className="font-semibold">{activeReport.reviewer?.name || 'Waiting for review'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                            <button
                                                onClick={() => { setPreviewMode('PDF'); setPreviewFile(activeReport); }}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-indigo-600 border border-indigo-200 dark:border-indigo-900 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors"
                                            >
                                                <FiEye /> View PDF
                                            </button>

                                            {activeReport.csv && (
                                                <button
                                                    onClick={() => { setPreviewMode('VALIDATOR'); setPreviewFile(activeReport); }}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-emerald-600 border border-emerald-200 dark:border-emerald-900 rounded-lg text-sm font-bold hover:bg-emerald-50 transition-colors"
                                                >
                                                    <FaFileCsv size={16} />
                                                    <span>Results</span>
                                                </button>
                                            )}

                                            <a
                                                href={activeReport.file.downloadUrl}
                                                className="p-2.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors
               dark:bg-slate-700 dark:text-slate-300 
               dark:hover:bg-slate-100 dark:hover:text-black"
                                                title="Download Report"
                                            >
                                                <FiDownload size={18} />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Comments (Optional - show if exists) */}
                                    {activeReport.comment && (
                                        <div className="mt-4 p-3 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg">
                                            <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase mb-1">Instructor Comment:</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{activeReport.comment}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Previews */}
            {previewFile && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-slate-900/95 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
                    {previewMode === 'PDF' ? (
                        <PdfPreviewModal
                            url={previewFile.file.url}
                            downloadUrl={previewFile.file.downloadUrl || previewFile.file.url}
                            fileName={previewFile.file.name}
                            fileSize={previewFile.file.size}
                            onClose={() => setPreviewFile(null)}
                        />
                    ) : (
                        <div className="w-full h-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                            <ThesisValidator
                                reportFileId={previewFile.id}
                                pdfUrl={previewFile.originalFile?.url || previewFile.file.url}
                                csvUrl={previewFile.csv?.url || ''}
                                fileName={previewFile.originalFile?.name || previewFile.file.name}
                                onClose={() => setPreviewFile(null)}
                                isReadOnly={true}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};