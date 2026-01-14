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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FiFileText className="text-blue-500" /> เอกสารปริญญานิพนธ์
      </h3>
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-all group bg-gray-50/50">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl shadow-sm">
            <FaFilePdf size={28} />
          </div>
          <div>
            <p className="font-medium text-gray-900 line-clamp-1 break-all" title={fileName}>
              {fileName}
            </p>
            <p className="text-xs text-gray-500 mt-1">{formatFileSize(fileSize)}</p>
          </div>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 sm:mt-0 w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-blue-600 hover:text-white hover:border-transparent transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
        >
          <FiDownload /> ดาวน์โหลด / เปิดไฟล์
        </a>
      </div>
    </div>
  );
};