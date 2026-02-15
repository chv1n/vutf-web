// src/services/audit-log.service.ts
import { api } from './api';

export const auditLogService = {
    getRecent: async () => {
        const response = await api.get<any>('/audit-logs/recent');
        return response;
    }
};