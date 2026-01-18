// src/components/features/instructor/submission-detail/SubmissionFileCard.tsx
import React, { useState } from 'react';
import { FiFileText, FiDownload, FiEye, FiX } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa6';
import { formatFileSize } from '@/types/submission';

interface Props {
  fileName: string;
  fileSize: number;
  fileUrl: string;      // สำหรับ Preview (Inline)
  downloadUrl: string;  // สำหรับ Download (Attachment)
  mimeType: string;
}

export const SubmissionFileCard: React.FC<Props> = ({ 
  fileName, 
  fileSize, 
  fileUrl, 
  downloadUrl,
  mimeType 
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FiFileText className="text-blue-500 dark:text-blue-400" /> เอกสารปริญญานิพนธ์
        </h3>
        
        <div className="flex flex-col lg:flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-700/30">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl shadow-sm">
              <FaFilePdf size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate" title={fileName}>
                {fileName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatFileSize(fileSize)} • {mimeType.split('/')[1].toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 lg:mt-0 w-full lg:w-auto">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex-1 lg:flex-none px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all text-sm font-medium flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-800"
            >
              <FiEye size={18} /> ดูตัวอย่าง
            </button>

            <a
              href={downloadUrl}
              download={fileName}
              className="flex-1 lg:flex-none px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
            >
              <FiDownload size={18} /> ดาวน์โหลด
            </a>
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/90 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-gray-300 dark:bg-gray-800 p-4 rounded-t-2xl border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <FaFilePdf className="text-red-500" size={24} />
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(fileSize)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href={downloadUrl}
                download={fileName}
                className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 px-4 text-sm font-medium"
              >
                <FiDownload size={18} /> <span className="hidden sm:inline">Download</span>
              </a>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-gray-900 rounded-b-2xl overflow-hidden shadow-2xl relative">
            {mimeType.includes('pdf') ? (
              <iframe
                src={`${fileUrl}#toolbar=0`}
                className="w-full h-full border-none"
                title="Thesis Preview"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <FiFileText size={48} className="mb-4 opacity-20" />
                <p>ไฟล์นี้ไม่รองรับการแสดงตัวอย่างในเบราว์เซอร์</p>
                <a href={downloadUrl} download={fileName} className="mt-4 text-blue-600 font-medium hover:underline">
                  คลิกที่นี่เพื่อดาวน์โหลดไฟล์
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};