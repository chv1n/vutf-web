export interface CreateInspectionDto {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export enum InspectionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
export interface InspectionRound {
  inspectionId: number;
  title: string;
  description?: string;
  status: InspectionStatus;
  startDate: string;
  endDate: string;
}