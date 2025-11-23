import { ApiResponse } from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = {
    get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
        const response = await fetch(`${BASE_URL}${endpoint}`)
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json()
    },

    post: async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json()
    }
}
