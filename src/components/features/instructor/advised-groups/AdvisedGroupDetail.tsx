// src/components/features/instructor/advised-groups/AdvisedGroupDetail.tsx
import React from 'react';
import { FiBook, FiUsers, FiHash, FiClock, FiFileText, FiDownload, FiAlertCircle, FiCheckCircle, FiActivity, FiTag } from 'react-icons/fi';
import { AdvisedGroupResponse } from '../../../../types/group.types';

interface AdvisedGroupDetailProps {
  data: AdvisedGroupResponse;
}

export const AdvisedGroupDetail: React.FC<AdvisedGroupDetailProps> = ({ data }) => {

  const { thesisName, thesisCode, thesisStatus, academicYear, term, students, progress, courseType } = data;

  // Helper สำหรับ "สถานะโครงงาน" (แสดงด้านบน)
  const getThesisStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED':
      case 'APPROVED':
        return <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-sm font-bold flex items-center gap-1"><FiCheckCircle /> สอบผ่าน</span>;
      case 'FAILED':
        return <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-sm font-bold flex items-center gap-1"><FiAlertCircle /> ไม่ผ่าน</span>;
      case 'IN_PROGRESS':
      default:
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-sm font-bold flex items-center gap-1"><FiActivity /> กำลังดำเนินการ</span>;
    }
  };

  // Helper สำหรับ "สถานะการส่งงาน" (แสดงในตาราง)
  const getSubmissionStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_SUBMISSION':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">ยังไม่ส่ง</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium">รอตรวจสอบ</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">กำลังตรวจ</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium flex items-center gap-1 w-fit"><FiCheckCircle /> ตรวจแล้ว</span>;
      case 'OVERDUE':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium flex items-center gap-1 w-fit"><FiAlertCircle /> เลยกำหนด</span>;
      case 'MISSING':
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs font-medium">ยังไม่ส่ง</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">

      {/* 1. ส่วนข้อมูลทั่วไป (Card บน) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiBook className="text-blue-600" /> ข้อมูลกลุ่มปริญญานิพนธ์
          </h2>
          {/* แสดงสถานะโครงงานตรงนี้ (Thesis Status) */}
          <div>
            {getThesisStatusBadge(thesisStatus)}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="text-sm text-gray-400 font-medium uppercase tracking-wide">ชื่อโครงงาน</label>
              <p className="text-xl font-bold text-gray-800 mt-1">{thesisName}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <div>
                <label className="flex items-center gap-1 text-sm text-blue-600 mb-1"><FiHash /> รหัสโครงงาน</label>
                <p className="font-semibold text-gray-800">{thesisCode}</p>
              </div>
              <div>
                <label className="flex items-center gap-1 text-sm text-blue-600 mb-1"><FiClock /> ปีการศึกษา</label>
                <p className="font-semibold text-gray-800">
                  {academicYear ? `${academicYear}/${term}` : '-'}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-1 text-sm text-blue-600 mb-1">
                  <FiTag /> ประเภทโครงงาน
                </label>
                <p className={`font-semibold ${courseType === 'PROJECT' ? 'text-gray-700' : 'text-gray-700'
                  }`}>
                  {courseType}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-5 h-full border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4 uppercase tracking-wider">
                <FiUsers /> รายชื่อสมาชิก
              </h3>
              <ul className="space-y-3">
                {students.map((student, idx) => (
                  <li key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <p className="text-sm font-bold text-gray-800">{student.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{student.code}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ส่วนตารางติดตามงาน (Card ล่าง) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiFileText className="text-blue-600" /> ประวัติการส่งงาน (Submission Progress)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium w-16 text-center">#</th>
                <th className="px-6 py-4 font-medium">รอบการตรวจ</th>
                <th className="px-6 py-4 font-medium">ช่วงเวลาที่กำหนด</th>
                <th className="px-6 py-4 font-medium">สถานะ</th>
                <th className="px-6 py-4 font-medium">ไฟล์แนบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {progress.map((item) => (
                <tr key={item.roundId} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-center font-medium text-gray-400">
                    {item.roundNumber}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{item.roundTitle}</p>
                    {item.submittedAt && (
                      <p className="text-xs text-green-600 mt-1">
                        ส่งเมื่อ: {formatDate(item.submittedAt)}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(item.startDate)} - {formatDate(item.endDate)}
                  </td>
                  <td className="px-6 py-4">
                    {/* ใช้ Helper สำหรับสถานะการส่งงาน */}
                    {getSubmissionStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4">
                    {item.fileUrl ? (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors group"
                      >
                        <div className="p-1.5 bg-red-50 rounded text-red-500 group-hover:bg-red-100">
                          <FiFileText />
                        </div>
                        <span className="text-sm max-w-[150px] truncate" title={item.fileName || 'Download'}>
                          {item.fileName || 'ดาวน์โหลดไฟล์'}
                        </span>
                        <FiDownload className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <span className="text-gray-300 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {progress.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              ไม่พบรอบการตรวจที่เกี่ยวข้อง
            </div>
          )}
        </div>
      </div>

    </div>
  );
};