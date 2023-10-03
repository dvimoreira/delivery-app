import axios from 'axios'

export function useMenu () {
    const API_HOST = 'https://delivery.sejavisto.digital/api/desktop'

    const onListMenu = async (restaurant_id: any) => {
        try {
            const response = await axios.get(`${API_HOST}/cardapio/list/${restaurant_id}`)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onEdit = async (id: any) => {
        try {
            const response = await axios.get(`${API_HOST}/cardapio/edit/${id}`)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onCreate = async (data: any) => {
        try {
            const response = await axios.post(`${API_HOST}/cardapio/create`, data)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onUpdate = async (data: any) => {
        try {
            const response = await axios.post(`${API_HOST}/cardapio/update`, data)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onDelete = async (id: any) => {
        try {
            const response = await axios.get(`${API_HOST}/cardapio/delete/${id}`)
            return response
        } catch (error) {
            return error.response
        }
    }

    return {
        onListMenu,
        onEdit,
        onCreate,
        onUpdate,
        onDelete
    }
}