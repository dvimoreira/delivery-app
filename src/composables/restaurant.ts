import axios from 'axios'

export function useRestaurant () {
    const API_HOST = 'https://delivery.sejavisto.digital/api/desktop'

    const checkOnline = async (id: any) => {
        try {
            const response = await axios.get(`${API_HOST}/restaurant/checkOnline/${id}`)
            return response
        } catch (error) {
            return error.response
        }
    }

    const updateStatus = async (data: any) => {
        try {
            const response = await axios.post(`${API_HOST}/restaurant/updateOnline`, data)
            return response
        } catch (error) {
            return error.response
        }
    }

    return {checkOnline, updateStatus}
}