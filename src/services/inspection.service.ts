// src/services/inspection.service.ts

import { api } from './api';
import { CreateInspectionDto, InspectionRound } from '../types/inspection';
// import { UpdateInspectionRoundDto } from '../modules/inspection_round/dto/update-inspection_round.dto';

export const inspectionService = {
    getAll: async () => {
        return await api.get<InspectionRound[]>('/inspections');
    },

    create: async (data: CreateInspectionDto) => {
        return await api.post('/inspections', data);
    },

    update: async (id: number, data: Partial<CreateInspectionDto>) => {
        return await api.patch(`/inspections/${id}`, data);
    },

    remove: async (id: number) => {
        return await api.delete(`/inspections/${id}`);
    },

    toggleStatus: async (id: number) => {
        return await api.patch(`/inspections/${id}/status`, {});
    }
};