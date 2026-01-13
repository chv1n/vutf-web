// src/components/features/admin/thesis-topic/ThesisDetailView.tsx
import React from 'react';
import {
  FiUser, FiBook, FiTarget, FiArrowLeft,
  FiClock, FiPhone, FiHash, FiCheck, FiX, FiRefreshCcw
} from 'react-icons/fi';
import { AdminThesisGroup, ThesisGroupStatus } from '../../../../types/admin-thesis';

// Helper Functions
const formatDate = (dateString?: string | null) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCourseType = (type?: string) => {
  if (type === 'PRE_PROJECT') return 'เตรียมโครงงาน (Pre-Project)';
  if (type === 'PROJECT') return 'โครงงาน (Project)';
  return type || '-';
};

interface Props {
  group: AdminThesisGroup;
  onBack: () => void;
  onApprove: (group: AdminThesisGroup) => void;
  onReject: (group: AdminThesisGroup) => void;
  onRevertToPending?: (group: AdminThesisGroup) => void;
}

export const ThesisDetailView = ({
  group,
  onBack,
  onApprove,
  onReject,
  onRevertToPending
}: Props) => {

  // รวม Advisor ทั้งหมดและเรียง Main ขึ้นก่อน
  const allAdvisors = [...(group.advisor || [])].sort((a, b) =>
    a.role === 'main' ? -1 : 1
  );

  const isPending = group.status === ThesisGroupStatus.PENDING;
  const isApproved = group.status === ThesisGroupStatus.APPROVED;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* --- Header --- */}
      <div className="border-b border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">

        {/* Left Side: Back Button & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800 bg-white border border-gray-200 shadow-sm"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900">รายละเอียดโครงงาน</h3>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize
    ${group.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                  group.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                    group.status === 'incomplete' ? 'bg-gray-100 text-gray-600 border-gray-200' : 
                      'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
              >
                {group.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiClock size={14} /> สร้างเมื่อ: {formatDate(group.created_at)}
              {group.approved_at && <span className="text-green-600 ml-2">| อนุมัติเมื่อ: {formatDate(group.approved_at)}</span>}
            </p>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Case 1: ถ้าเป็น Pending แสดงปุ่ม อนุมัติ/ปฏิเสธ */}
          {isPending && (
            <>
              <button
                onClick={() => onReject(group)}
                disabled={!group.isReadyForAdminAction}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-700 font-medium bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <FiX size={18} />
                ปฏิเสธคำขอ
              </button>
              <button
                onClick={() => onApprove(group)}
                disabled={!group.isReadyForAdminAction}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-200"
              >
                <FiCheck size={18} />
                อนุมัติคำขอ
              </button>
            </>
          )}

          {/* Case 2: ถ้าเป็น Approved แสดงปุ่มแก้ไขสถานะกลับ (เพื่อให้ นศ. แก้ไขได้) */}
          {isApproved && onRevertToPending && (
            <button
              onClick={() => onRevertToPending(group)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-orange-200 text-orange-700 font-medium bg-white hover:bg-orange-50 transition-all shadow-sm"
            >
              <FiRefreshCcw size={18} />
              เปลี่ยนสถานะให้นักศึกษาแก้ไข
            </button>
          )}

          {/* Case 3: สถานะอื่นๆ ซ่อนปุ่ม */}
        </div>

      </div>

      {/* --- Body Content --- */}
      <div className="p-6 lg:p-8 space-y-8">

        {/* ส่วนแสดงเหตุผลการปฏิเสธ*/}
        {group.status === 'rejected' && group.rejection_reason && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 bg-white rounded-full text-red-500 shadow-sm border border-red-100 shrink-0">
              <FiX size={16} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-800 mb-1">เหตุผลที่ปฏิเสธคำขอ</h4>
              <p className="text-sm text-red-700 leading-relaxed whitespace-pre-line">
                {group.rejection_reason}
              </p>

              {/* หมายเหตุ */}
              <div className="mt-3 pt-2 border-t border-red-200/60 flex items-center gap-2">
                <span className="text-[11px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                  หมายเหตุ
                </span>
                <span className="text-xs text-red-600 font-medium">
                  รอนักศึกษาดำเนินการแก้ไขข้อมูล
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 1. ข้อมูลวิทยานิพนธ์ */}
        <section>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
            <FiBook className="text-blue-600" /> ข้อมูลวิทยานิพนธ์
          </h4>
          <div className="bg-blue-50/30 p-6 rounded-xl border border-blue-100">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {group.thesis?.thesis_code || 'NO CODE'}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">
                    ({formatCourseType(group.thesis?.course_type)})
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                  {group.thesis?.thesis_name_th}
                </h2>
                <h3 className="text-lg text-gray-600 italic mt-1 font-medium">
                  {group.thesis?.thesis_name_en}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">ปีการศึกษาที่เริ่ม</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {group.thesis?.start_academic_year || '-'}/{group.thesis?.start_term || '-'}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">ปีที่คาดว่าจะจบ</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {group.thesis?.graduation_year || '-'}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">สถานะวิทยานิพนธ์</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold
                            ${group.thesis?.status === 'PASSED' ? 'bg-green-100 text-green-700' :
                    group.thesis?.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'}`}
                >
                  {group.thesis?.status}
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">ความคืบหน้ากลุ่ม</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {group.memberProgress} <span className="text-xs font-normal text-gray-500">คน</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 2. สมาชิกในกลุ่ม */}
          <section>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
              <FiUser className="text-indigo-600" /> สมาชิกในกลุ่ม ({group.members.length})
            </h4>
            <div className="space-y-3">
              {group.members.map((member, idx) => (
                <div key={idx} className="relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  {member.role === 'owner' && (
                    <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                      OWNER
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold border border-indigo-100 shrink-0">
                      {member.student.first_name[0]}
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">
                        {member.student.first_name} {member.student.last_name}
                      </p>
                      <div className="flex flex-wrap gap-x-3 text-sm text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1"><FiHash size={12} /> {member.student.student_code}</span>
                        <span className="flex items-center gap-1"><FiPhone size={12} /> {member.student.phone || '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0 flex items-center justify-end">
                    {member.invitation_status === 'approved' ? (
                      <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> ตอบรับแล้ว
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> รอการตอบรับ
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. อาจารย์ที่ปรึกษา */}
          <section>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
              <FiTarget className="text-rose-600" /> อาจารย์ที่ปรึกษา
            </h4>
            <div className="space-y-3">
              {allAdvisors.length > 0 ? allAdvisors.map((adv, idx) => {
                const isMain = adv.role === 'main';
                return (
                  <div
                    key={idx}
                    className={`relative flex justify-between items-center p-4 rounded-xl border transition-shadow hover:shadow-sm
                               ${isMain ? 'bg-indigo-50/40 border-indigo-200' : 'bg-white border-gray-200'}`}
                  >
                    {/* Decorative bar for main advisor */}
                    {isMain && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl"></div>}

                    <div>
                      <p className={`text-base font-bold ${isMain ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {adv.instructor.first_name} {adv.instructor.last_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span className="bg-white/80 px-1.5 rounded border border-gray-200">
                          CODE: {adv.instructor.instructor_code}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                                    ${isMain ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {isMain ? 'ที่ปรึกษาหลัก' : 'ที่ปรึกษาร่วม'}
                      </span>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-8 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm">
                  ยังไม่ระบุอาจารย์ที่ปรึกษา
                </div>
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};