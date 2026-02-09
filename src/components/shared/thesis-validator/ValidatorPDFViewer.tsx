// src/components/shared/thesis-validator/ValidatorPDFViewer.tsx
import React from 'react';
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
}

export const ValidatorPDFViewer: React.FC<Props> = ({
  fileUrl,
  pageNumber,
  setNumPages,
  pageDimensions,
  setPageDimensions,
  issues,
  onToggleIgnore
}) => {

  const renderOverlayBoxes = () => {
    // ถ้ายังไม่มีขนาดหน้า หรือไม่มี Issue ให้ข้ามไป
    if (!pageDimensions.width || !pageDimensions.height || issues.length === 0) {
        return null;
    }
    
    return issues.map((issue) => {
      // ตรวจสอบว่ามี bbox และต้องเป็น Array ที่มี 4 ค่า
      if (!issue.bbox || !Array.isArray(issue.bbox) || issue.bbox.length !== 4) return null;
      
      const [x0, y0, x1, y1] = issue.bbox;

      // ปรับสีให้ชัดขึ้น และตรงกับ Sidebar (Error=Rose, Warning=Amber)
      let borderColor = issue.severity === 'error' ? '#f43f5e' : '#fbbf24'; // Tailwind rose-500 / amber-400
      let bgColor = issue.severity === 'error' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(251, 191, 36, 0.2)';
      
      // ถ้า Ignored ให้เป็นสีฟ้า
      if (issue.isIgnored) {
        borderColor = '#3b82f6'; // Blue-500
        bgColor = 'rgba(59, 130, 246, 0.15)';
      }

      // คำนวณความกว้าง/สูง
      // หมายเหตุ: สูตรนี้สำหรับ bbox แบบ [x_min, y_min, x_max, y_max]
      // ถ้า bbox ใน CSV ของคุณเป็น [x, y, width, height] ให้แก้ width เป็น (x1 / ...) และ height เป็น (y1 / ...)
      const boxWidth = Math.abs(x1 - x0);
      const boxHeight = Math.abs(y1 - y0);

      return (
        <div
          key={issue.id}
          onClick={(e) => { e.stopPropagation(); onToggleIgnore(issue.id); }}
          className="absolute cursor-pointer transition-all duration-200 hover:opacity-80 hover:scale-[1.05] border-2 rounded-sm z-50 mix-blend-multiply"
          style={{
            // ใช้ % เพื่อให้ Responsive ตามขนาดหน้าจอ
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
       <div className="relative shadow-xl h-fit border border-gray-200 dark:border-gray-700 bg-white">
         <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
                <div className="flex items-center justify-center h-[800px] w-[600px] text-gray-400">
                    Loading PDF...
                </div>
            }
            error={
                <div className="flex items-center justify-center h-[800px] w-[600px] text-red-500">
                    Failed to load PDF
                </div>
            }
         >
            <Page
              pageNumber={pageNumber}
              width={750} 
              className="bg-white"
              renderTextLayer={false}       
              renderAnnotationLayer={false} 
              onLoadSuccess={(page) => {
                 // อัปเดตขนาดหน้าเมื่อโหลดเสร็จ เพื่อให้คำนวณตำแหน่ง Box ได้ถูกต้อง
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