// src/components/shared/thesis-validator/ValidatorDocumentMap.tsx
import React, { useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleXmark,
    faTriangleExclamation,
    faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

import { Issue } from './ValidatorIssueList';

interface Props {
    numPages: number | null;
    pageNumber: number;
    setPageNumber: (page: number) => void;
    getPageColorClass: (page: number) => string;
    issues: Issue[];
}

export const ValidatorDocumentMap: React.FC<Props> = ({
    numPages,
    pageNumber,
    setPageNumber,
    getPageColorClass,
    issues,
}) => {

    // คำนวณจำนวนหน้าที่มีปัญหา (ที่ไม่ใช่ ignored)
    const affectedPagesCount = useMemo(() => {
        const activeIssues = issues.filter(i => !i.isIgnored);
        // ใช้ Set เพื่อหาจำนวนหน้าไม่ซ้ำกัน
        const uniquePages = new Set(activeIssues.map(i => i.page));
        return uniquePages.size;
    }, [issues]);

    return (
        <div className="p-6 border-b border-slate-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold text-slate-400 dark:text-white uppercase tracking-wider">
                        Document Map
                    </h2>
                    {/* Badge แสดงจำนวนหน้าที่มีปัญหา */}
                    {affectedPagesCount > 0 && (
                        <span className="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            {affectedPagesCount} Pages with Issues
                        </span>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-8 p-2 gap-1.5 max-h-[25vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-gray-700">
                {numPages &&
                    Array.from(new Array(numPages), (_, i) => {
                        const p = i + 1;
                        return (
                            <button
                                key={p}
                                onClick={() => setPageNumber(p)}
                                className={`aspect-square rounded-[4px] text-[10px] font-medium transition-all border ${getPageColorClass(
                                    p
                                )} ${pageNumber === p
                                        ? "ring-2 ring-slate-800 dark:ring-gray-200 ring-offset-1 dark:ring-offset-gray-900 z-10"
                                        : "opacity-90 hover:opacity-100"
                                    }`}
                            >
                                {p}
                            </button>
                        );
                    })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 justify-start text-[10px] font-medium text-slate-500 dark:text-gray-400 pt-3">
                <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faCircleXmark} className="text-rose-500 dark:text-rose-400" />{" "}
                    Error
                </span>
                <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="text-amber-400 dark:text-amber-300"
                    />{" "}
                    Warn
                </span>
                <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-blue-500 dark:text-blue-400" />{" "}
                    Resolved
                </span>
            </div>
        </div>
    );
};