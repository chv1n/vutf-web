// src/components/features/instructor/submission-detail/SubmissionFileCard.tsx
import React from 'react';
import { FiFileText, FiDownload } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa6';
import { formatFileSize } from '@/types/submission';

interface Props {
  fileName: string;
  fileSize: number;
  fileUrl: string;
}

export const SubmissionFileCard: React.FC<Props> = ({ fileName, fileSize, fileUrl }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FiFileText className="text-blue-500 dark:text-blue-400" /> เอกสารปริญญานิพนธ์
      </h3>
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 transition-all group bg-gray-50/50 dark:bg-gray-700/30">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl shadow-sm">
            <FaFilePdf size={28} />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white line-clamp-1 break-all" title={fileName}>
              {fileName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatFileSize(fileSize)}</p>
          </div>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 sm:mt-0 w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 hover:border-transparent dark:hover:border-transparent transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
        >
          <FiDownload /> ดาวน์โหลด / เปิดไฟล์
        </a>
      </div>
    </div>
  );
};