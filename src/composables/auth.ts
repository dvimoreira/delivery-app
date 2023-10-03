import axios from 'axios'

export function useAuth () {
    const API_HOST = 'https://delivery.sejavisto.digital/api/desktop'

    const onSyncCode = async (data: any) => {
        try {
            const response = await axios.post(`${API_HOST}/auth/login`, data)
            return response
        } catch (error) {
            return error.response
        }
    }

    return {onSyncCode}
}