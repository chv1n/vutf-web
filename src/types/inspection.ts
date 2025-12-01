export interface CreateInspectionDto {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface InspectionRound {
  inspectionId: number;
  title: string;
  description?: string;
  status: string;
  startDate: string;
  endDate: string;
}