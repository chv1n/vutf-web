import { ApiResponse } from '@/types'

const BASE_URL = '/api'

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';

        throw new Error(errorMessage);
    }
    return response.json();
}

export const api = {
    get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            // 👇 เพิ่มบรรทัดนี้ เพื่อให้ Browser แนบ Cookie ไปกับ Request
            credentials: 'include',
        });
        return handleResponse(response);
    },

    post: async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 👇 เพิ่มบรรทัดนี้เช่นกัน
            credentials: 'include',
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
}
