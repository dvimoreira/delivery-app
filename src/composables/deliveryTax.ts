import axios from 'axios'

export function useDeliveryTax () {
    const API_HOST = 'http://127.0.0.1:8000/api/desktop'

    const onListDeliveryTax = async (restaurant_id: any) => {
        try {
            const response = await axios.get(`${API_HOST}/area-entrega/list/${restaurant_id}`)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onEdit = async (id: any) => {
        try {
            const response = await axios.get(`${API_HOST}/area-entrega/edit/${id}`)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onCreate = async (data: any) => {
        try {
            const response = await axios.post(`${API_HOST}/area-entrega/create`, data)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onUpdate = async (data: any) => {
        try {
            const response = await axios.post(`${API_HOST}/area-entrega/update`, data)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onDelete = async (id: any) => {
        try {
            const response = await axios.get(`${API_HOST}/area-entrega/delete/${id}`)
            return response
        } catch (error) {
            return error.response
        }
    }

    return {
        onListDeliveryTax,
        onEdit,
        onCreate,
        onUpdate,
        onDelete
    }
}