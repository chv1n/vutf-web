// src/components/features/instructor/advised-groups/AdvisedGroupDetail.tsx
import React, { useState } from 'react';
import {
  FiBook,
  FiUsers,
  FiHash,
  FiClock,
  FiFileText,
  FiDownload,
  FiAlertCircle,
  FiCheckCircle,
  FiActivity,
  FiTag,
  FiEye,
  FiX
} from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa6';
import { AdvisedGroupResponse } from '../../../../types/group.types';

interface AdvisedGroupDetailProps {
  data: AdvisedGroupResponse;
}

// Helper สำหรับตรวจสอบประเภทไฟล์
const getFileType = (fileName: string): string => {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  if (extension === 'pdf') return 'application/pdf';
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'image/' + extension;
  return 'application/octet-stream';
};

export const AdvisedGroupDetail: React.FC<AdvisedGroupDetailProps> = ({ data }) => {
  const { thesisName, thesisCode, thesisStatus, academicYear, term, students, progress, courseType } = data;

  // State สำหรับ Modal Preview
  const [selectedFile, setSelectedFile] = useState<{ url: string; downloadUrl: string; name: string; type: string } | null>(null);

  // Helper สำหรับ "สถานะโครงงาน"
  const getThesisStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED':
      case 'APPROVED':
        return <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full text-sm font-bold flex items-center gap-1"><FiCheckCircle /> สอบผ่าน</span>;
      case 'FAILED':
        return <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-full text-sm font-bold flex items-center gap-1"><FiAlertCircle /> ไม่ผ่าน</span>;
      case 'IN_PROGRESS':
      default:
        return <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-bold flex items-center gap-1"><FiActivity /> กำลังดำเนินการ</span>;
    }
  };

  // Helper สำหรับ "สถานะการส่งงาน"
  const getSubmissionStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_SUBMISSION':
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">ยังไม่ส่ง</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-md text-xs font-medium">รอตรวจสอบ</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-xs font-medium">กำลังตรวจ</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-medium flex items-center gap-1 w-fit"><FiCheckCircle /> ตรวจแล้ว</span>;
      case 'OVERDUE':
        return <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-xs font-medium flex items-center gap-1 w-fit"><FiAlertCircle /> เลยกำหนด</span>;
      case 'MISSING':
      default:
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md text-xs font-medium">ยังไม่ส่ง</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">

      {/* ส่วนข้อมูลทั่วไป (Card บน) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FiBook className="text-blue-600 dark:text-blue-400" /> ข้อมูลกลุ่มปริญญานิพนธ์
          </h2>
          <div>
            {getThesisStatusBadge(thesisStatus)}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="text-sm text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">ชื่อโครงงาน</label>
              <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{thesisName}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 transition-colors">
              <div>
                <label className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 mb-1"><FiHash /> รหัสโครงงาน</label>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{thesisCode}</p>
              </div>
              <div>
                <label className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 mb-1"><FiClock /> ปีการศึกษา</label>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {academicYear ? `${academicYear}/${term}` : '-'}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 mb-1">
                  <FiTag /> ประเภทโครงงาน
                </label>
                <p className={`font-semibold ${courseType === 'PROJECT' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {courseType}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 h-full border border-gray-100 dark:border-gray-700 transition-colors">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4 uppercase tracking-wider">
                <FiUsers /> รายชื่อสมาชิก
              </h3>
              <ul className="space-y-3">
                {students.map((student, idx) => (
                  <li key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 transition-colors">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{student.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{student.code}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ส่วนตารางติดตามงาน (Card ล่าง) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FiFileText className="text-blue-600 dark:text-blue-400" /> ประวัติการส่งงาน (Submission Progress)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 font-medium w-16 text-center">#</th>
                <th className="px-6 py-4 font-medium">รอบการตรวจ</th>
                <th className="px-6 py-4 font-medium">ช่วงเวลาที่กำหนด</th>
                <th className="px-6 py-4 font-medium">สถานะ</th>
                <th className="px-6 py-4 font-medium text-center">ไฟล์แนบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {progress.map((item) => (
                <tr key={item.roundId} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="px-6 py-4 text-center font-medium text-gray-400 dark:text-gray-500">
                    {item.roundNumber}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800 dark:text-white">{item.roundTitle}</p>
                    {item.submittedAt && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        ส่งเมื่อ: {formatDate(item.submittedAt)}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.startDate)} - {formatDate(item.endDate)}
                  </td>
                  <td className="px-6 py-4">
                    {getSubmissionStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.fileUrl ? (
                      <div className="flex items-center justify-center gap-2">
                        {/* ปุ่ม Preview */}
                        <button
                          onClick={() => setSelectedFile({
                            url: item.fileUrl!,
                            downloadUrl: item.downloadUrl || item.fileUrl!,
                            name: item.fileName || 'document.pdf',
                            type: getFileType(item.fileName || 'document.pdf')
                          })}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="ดูตัวอย่าง"
                        >
                          <FiEye size={18} />
                        </button>

                        {/* ปุ่ม Download */}
                        <a
                          href={item.downloadUrl || item.fileUrl}
                          download={item.fileName}
                          className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="ดาวน์โหลด"
                        >
                          <FiDownload size={18} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-300 dark:text-gray-600 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {progress.length === 0 && (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500">
              ไม่พบรอบการตรวจที่เกี่ยวข้อง
            </div>
          )}
        </div>
      </div>

      {/* In-App Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/90 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-gray-300 dark:bg-gray-800 p-4 rounded-t-2xl border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <FaFilePdf className="text-red-500" size={24} />
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 uppercase">{selectedFile.type.split('/')[1] || 'FILE'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={selectedFile.downloadUrl}
                download={selectedFile.name}
                className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 px-4 text-sm font-medium"
              >
                <FiDownload size={18} /> <span className="hidden sm:inline">Download</span>
              </a>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-b-2xl overflow-hidden shadow-2xl relative">
            {selectedFile.type.includes('pdf') ? (
              <iframe
                src={`${selectedFile.url}#toolbar=0`}
                className="w-full h-full border-none"
                title="File Preview"
              />
            ) : selectedFile.type.startsWith('image/') ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <img src={selectedFile.url} alt="Preview" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <FiFileText size={48} className="mb-4 opacity-20" />
                <p>ไฟล์นี้ไม่รองรับการแสดงตัวอย่างในเบราว์เซอร์</p>
                <a href={selectedFile.downloadUrl} download={selectedFile.name} className="mt-4 text-blue-600 font-medium hover:underline">
                  คลิกที่นี่เพื่อดาวน์โหลดไฟล์
                </a>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};