// src/services/api.ts
import { ApiResponse } from '@/types'

const BASE_URL = '/api/v1'

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
        throw new Error(errorMessage);
    }
    return response.json();
}

// ชันกลางสำหรับยิง fetch พร้อมระบบ Auto Refresh
const customFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const url = `${BASE_URL}${endpoint}`;
    
    // ตั้งค่า Default Options
    const fetchOptions: RequestInit = {
        ...options,
        credentials: 'include', // แนบ Cookie เสมอ
        headers: {
            ...options.headers,
        }
    };

    // 1. ยิง Request ครั้งแรก
    let response = await fetch(url, fetchOptions);

    // 2. ถ้าเจอ 401 และไม่ใช่การ Login หรือ Refresh (เพื่อป้องกัน Loop)
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
        try {
            // 3. แอบยิงไปขอ Token ใหม่
            const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include' // แนบ Refresh Token ใน Cookie ไปด้วย
            });

            // 4. ถ้า Refresh สำเร็จ
            if (refreshResponse.ok) {
                // 5. ยิง Request เดิมซ้ำอีกรอบ (Retry)
                response = await fetch(url, fetchOptions);
            }
        } catch (error) {
            // ถ้า Refresh ไม่ผ่าน ก็ปล่อยให้ Error 401 ตัวเดิมทำงานต่อไป (เดี๋ยว handleResponse จะ throw error เอง)
            console.error('Auto refresh failed:', error);
        }
    }

    return response;
};

export const api = {
    get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
        const response = await customFetch(endpoint, {
            method: 'GET',
        });
        return handleResponse(response);
    },

    post: async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
        const response = await customFetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    patch: async <T>(endpoint: string, data: any): Promise<T> => {
        const response = await customFetch(endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    delete: async <T>(endpoint: string): Promise<T> => {
        const response = await customFetch(endpoint, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },
}