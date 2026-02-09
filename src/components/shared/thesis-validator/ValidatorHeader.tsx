// src/components/shared/thesis-validator/ValidatorHeader.tsx
import React from 'react';
import { FiChevronLeft, FiChevronRight, FiDownload, FiX, FiSkipForward } from 'react-icons/fi';
import { FaKeyboard, FaFilePdf } from 'react-icons/fa6'; 

interface Props {
  fileName: string;
  pageNumber: number;
  numPages: number | null;
  setPageNumber: (page: number) => void;
  onClose: () => void;
  onNextIssue: () => void;
  onDownloadReport?: () => void;
}

export const ValidatorHeader: React.FC<Props> = ({
  fileName,
  pageNumber,
  numPages,
  setPageNumber,
  onClose,
  onNextIssue,
  onDownloadReport
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm transition-colors duration-200">
      
      {/* Left: Title & Hint */}
      <div className="flex items-center gap-4">
        {/* PDF */}
        <div className="w-10 h-10 bg-slate-900 dark:bg-slate-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 dark:shadow-none">
           <FaFilePdf size={20} />
        </div>
        
        <div>
           <h1 className="text-base font-bold text-slate-800 dark:text-white leading-tight">{fileName}</h1>
           <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-gray-400 font-medium tracking-wide">
              <span>AUTOMATED CHECK SYSTEM</span>
              <span className="text-slate-300 dark:text-gray-600">|</span>
              <span className="flex items-center gap-1 text-slate-500 dark:text-gray-300 bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                 <FaKeyboard /> Press <b className="text-slate-800 dark:text-white">Enter</b> to Approve & Next
              </span>
           </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        
        <button
          onClick={onNextIssue}
          className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800 transition-all flex items-center gap-2"
          title="Skip to next error/warning page"
        >
          <span>Next Issue</span>
          <FiSkipForward />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-gray-700"></div>

        <div className="flex items-center bg-slate-100 dark:bg-gray-700 rounded-lg p-1 border border-slate-200 dark:border-gray-600">
          <button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-md transition-all text-slate-500 dark:text-gray-400 disabled:opacity-30"
          >
            <FiChevronLeft size={16} />
          </button>
          <span className="text-xs font-mono px-4 w-24 text-center select-none text-slate-600 dark:text-gray-300">
             Page <span className="font-bold text-slate-800 dark:text-white">{pageNumber}</span> <span className="text-slate-400 dark:text-gray-500">/ {numPages || "-"}</span>
          </span>
          <button
            onClick={() => setPageNumber(Math.min(numPages || 1, pageNumber + 1))}
            disabled={!numPages || pageNumber >= numPages}
            className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-md transition-all text-slate-500 dark:text-gray-400 disabled:opacity-30"
          >
            <FiChevronRight size={16} />
          </button>
        </div>

        {/* ปุ่ม Download */}
        {onDownloadReport && (
          <button
            onClick={onDownloadReport}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Export Report"
          >
            <FiDownload size={20} />
          </button>
        )}

        <button
          onClick={onClose}
          className="ml-2 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
          title="Close Validator"
        >
          <FiX size={22} />
        </button>
      </div>
    </div>
  );
};