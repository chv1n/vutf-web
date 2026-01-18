// src/types/group.types.ts

// Interface สำหรับข้อมูลความคืบหน้า (Progress)
export interface GroupProgress {
  roundId: number;
  roundTitle: string;
  roundNumber: number;
  startDate: string; // รับมาจาก Backend เป็น ISO String
  endDate: string;
  status: string;
  submittedAt: string | null;
  submissionId: number | null;
  fileUrl: string | null;
  downloadUrl?: string | null;
  fileName: string | null;
}

// Interface สำหรับข้อมูลสมาชิกในกลุ่ม (ย่อ)
export interface StudentMember {
  name: string;
  code: string;
  role: string;
}

// Interface หลักสำหรับ Response (โครงสร้างแบบแบนราบ - Flattened)
export interface AdvisedGroupResponse {
  groupId: string;
  thesisCode: string;
  thesisName: string;
  thesisStatus: string;
  advisorRole: string; // 'main' หรือ 'co'
  courseType: string;
  academicYear: number;
  term: number;
  students: StudentMember[];
  progress: GroupProgress[];
}