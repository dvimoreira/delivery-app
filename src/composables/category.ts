import axios from 'axios'

export function useCategory () {
    const API_HOST = 'http://127.0.0.1:8000/api/desktop'

    const onListCategories = async (restaurant_id: any) => {
        try {
            const response = await axios.get(`${API_HOST}/categorias/list/${restaurant_id}`)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onEdit = async (id: any) => {
        try {
            const response = await axios.get(`${API_HOST}/categorias/edit/${id}`)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onCreate = async (data: any) => {
        try {
            const response = await axios.post(`${API_HOST}/categorias/create`, data)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onUpdate = async (data: any) => {
        try {
            const response = await axios.post(`${API_HOST}/categorias/update`, data)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onDelete = async (id: any) => {
        try {
            const response = await axios.get(`${API_HOST}/categorias/delete/${id}`)
            return response
        } catch (error) {
            return error.response
        }
    }

    return {
        onListCategories,
        onEdit,
        onCreate,
        onUpdate,
        onDelete
    }
}