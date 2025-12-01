import { z } from 'zod';

export const createInspectionSchema = z.object({
  title: z
    .string()
    .min(1, 'กรุณาระบุหัวข้อ')
    .max(100, 'หัวข้อต้องไม่เกิน 100 ตัวอักษร'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'กรุณาระบุวันเริ่มต้น'),
  endDate: z.string().min(1, 'กรุณาระบุวันสิ้นสุด'),
  status: z.enum(['OPEN', 'CLOSED']).optional(),
}).refine((data) => {
  // Custom Validation: Start Date < End Date
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start < end;
}, {
  message: 'วันที่เริ่มต้นต้องมาก่อนวันที่สิ้นสุด',
  path: ['startDate'], // ชี้เป้าว่า Error ที่ field ไหน
});

export type CreateInspectionSchema = z.infer<typeof createInspectionSchema>;