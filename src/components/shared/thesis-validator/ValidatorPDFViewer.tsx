// src/components/shared/thesis-validator/ValidatorPDFViewer.tsx
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Issue } from './ValidatorIssueList';

// Setup worker (ใช้ https เพื่อความชัวร์)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface Props {
  fileUrl: string;
  pageNumber: number;
  setNumPages: (num: number) => void;
  pageDimensions: { width: number; height: number };
  setPageDimensions: (dim: { width: number; height: number }) => void;
  issues: Issue[];
  onToggleIgnore: (id: number) => void;
  isReadOnly?: boolean;
}

export const ValidatorPDFViewer: React.FC<Props> = ({
  fileUrl,
  pageNumber,
  setNumPages,
  pageDimensions,
  setPageDimensions,
  issues,
  onToggleIgnore,
  isReadOnly = false
}) => {
  // 1. เพิ่ม State สำหรับเก็บเปอร์เซ็นต์การโหลด และสถานะการโหลด
  const [loadProgress, setLoadProgress] = useState(0);
  const [isDocumentLoading, setIsDocumentLoading] = useState(true);

  const renderOverlayBoxes = () => {
    if (!pageDimensions.width || !pageDimensions.height || issues.length === 0) {
        return null;
    }
    
    return issues.map((issue) => {
      if (!issue.bbox || !Array.isArray(issue.bbox) || issue.bbox.length !== 4) return null;
      
      const [x0, y0, x1, y1] = issue.bbox;

      let borderColor = issue.severity === 'error' ? '#f43f5e' : '#fbbf24'; 
      let bgColor = issue.severity === 'error' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(251, 191, 36, 0.2)';
      
      if (issue.isIgnored) {
        borderColor = '#3b82f6'; 
        bgColor = 'rgba(59, 130, 246, 0.15)';
      }

      const boxWidth = Math.abs(x1 - x0);
      const boxHeight = Math.abs(y1 - y0);

      return (
        <div
          key={issue.id}
          onClick={(e) => { 
            e.stopPropagation(); 
            if (!isReadOnly) onToggleIgnore(issue.id); 
          }}
          className={`absolute transition-all duration-200 border-2 rounded-sm z-50 mix-blend-multiply ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-80 hover:scale-[1.05]'}`}
          style={{
            left: `${(x0 / pageDimensions.width) * 100}%`,
            top: `${(y0 / pageDimensions.height) * 100}%`,
            width: `${(boxWidth / pageDimensions.width) * 100}%`,
            height: `${(boxHeight / pageDimensions.height) * 100}%`,
            borderColor: borderColor,
            backgroundColor: bgColor,
          }}
          title={issue.message}
        />
      );
    });
  };

  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-auto flex justify-center p-8 relative scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      
      {/* 2. Chrome-like Top Loading Bar */}
      {isDocumentLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-100/50 dark:bg-gray-800 z-50 overflow-hidden">
          <div 
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
      )}

      <div className="relative shadow-xl h-fit border border-gray-200 dark:border-gray-700 bg-white">
        <Document
          file={fileUrl}
          // 3. จับ Event ตอนที่กำลังดาวน์โหลด PDF เพื่ออัปเดต %
          onLoadProgress={({ loaded, total }) => {
            if (total) {
              setLoadProgress(Math.round((loaded / total) * 100));
            }
          }}
          // 4. เมื่อโหลดสำเร็จ ให้ซ่อน Loading Bar
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setIsDocumentLoading(false);
          }}
          // ปรับ UI ตรงกลางให้มี Spinner และโชว์เปอร์เซ็นต์ด้วย
          loading={
            <div className="flex flex-col items-center justify-center h-[800px] w-[600px] text-gray-500 gap-4">
              <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm font-medium animate-pulse">กำลังโหลด PDF... {loadProgress}%</span>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-[800px] w-[600px] text-red-500 gap-2">
              <span className="text-4xl">⚠️</span>
              <span className="font-medium">ไม่สามารถโหลดไฟล์ PDF ได้</span>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            width={750} 
            className="bg-white"
            renderTextLayer={false}       
            renderAnnotationLayer={false} 
            // เพิ่ม Placeholder ตอนเปลี่ยนหน้า
            loading={
              <div className="flex items-center justify-center h-[1000px] w-[750px] bg-gray-50 animate-pulse text-gray-400 text-sm">
                กำลังเรนเดอร์หน้า {pageNumber}...
              </div>
            }
            onLoadSuccess={(page) => {
              setPageDimensions({
                width: page.originalWidth,
                height: page.originalHeight
              });
            }}
          >
            {renderOverlayBoxes()}
          </Page>
        </Document>
      </div>
    </div>
  );
};