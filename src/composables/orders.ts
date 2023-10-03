import axios from 'axios'

export function useOrder () {
    const API_HOST = 'http://127.0.0.1:8000/api/desktop'

    const onList = async (restaurant_id: any) => {
        try {
            const response = await axios.get(`${API_HOST}/pedidos/listPedidos/${restaurant_id}`)
            return response
        } catch (error) {
            return error.response
        }
    }

    const onUpdate = async (data: any) => {
        try {
            const response = await axios.post(`${API_HOST}/pedidos/listPedidosUpdate`, data)
            return response
        } catch (error) {
            return error.response
        }
    }

    return {
        onList,
        onUpdate
    }
}