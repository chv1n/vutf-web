// src/types/report.ts

export type VerificationStatus = 'PASS' | 'FAIL' | 'ERROR'; 
export type ReviewStatus = 'PENDING' | 'PASSED' | 'NOT_PASSED' | 'NEEDS_REVISION';


export interface ReportData {
  id: number;
  createdAt: string;     
  verificationStatus: VerificationStatus;
  reviewStatus: ReviewStatus;
  comment: string | null;

  // File Info (เป็น Object ซ้อน)
  file: {
    name: string;
    url: string;
    downloadUrl: string;
    type: string;
    size: number;
  };

  csv?: {
    url: string;
    downloadUrl: string;
  } | null;

  // Reviewer Info
  reviewer: {
    name: string;
    id: string | null;
  };
  
  commenter: {
    name: string;
    id: string | null;
  };

  // Project Info
  project: {
    nameTh: string;
    nameEn: string;
    code: string;
  };

  // Student Info
  groupMembers: {
    studentId: string;
    studentCode: string;
    firstName: string;
    lastName: string;
    role: string;
    avatarUrl?: string | null;
  }[];

  // Inspection Round
  inspectionRound: {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    courseType: string;
  } | null;

  context: {
    submissionId: number;
    round: string;
  };
}

export interface ReportFilterParams {
  page: number;
  limit: number;
  search?: string;
  academicYear?: string;
  term?: string;
  round?: number;
  courseType?: string;
  verificationStatus?: VerificationStatus;
  reviewStatus?: ReviewStatus;
}