<template>
    <el-button type="success" size="large" @click="modal = true; action = 'add'; formCategory.title = ''">Adicionar novo</el-button>

    <el-table :data="data" style="width: 100%; margin-top: 30px;">
        <el-table-column label="Bairro" prop="bairro" />

        <el-table-column label="Preço" prop="valor" />
    
        <el-table-column label="Data de Cadastro" align="center">
            <template #default="scope">
                {{ new Date(scope.row.created_at).toLocaleDateString() }}
            </template>
        </el-table-column>

        <el-table-column label="Ação" align="center">
            <template #default="scope">
                <el-button size="small" @click="onEdit(scope.row.id)">Editar</el-button>
                <el-button size="small" @click="onDelete(scope.row.id)" type="danger">Deletar</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- MODAL -->
    <el-dialog v-model="modal" :title="(action === 'add') ? 'Adicionar Bairro' : 'Editar Bairro'" destroy-on-close>
        <el-form label-position="top" :model="formCategory">
            <el-form-item label="Bairro">
                <el-input placeholder="Informe o bairro" size="large" v-model="formCategory.bairro" />
            </el-form-item>

            <el-form-item label="Preço">
                <el-input placeholder="Informe o preço" size="large" v-model="formCategory.valor" />
            </el-form-item>

            <el-button type="danger" @click="modal = false; action = 'add'">Cancelar</el-button>
            <el-button type="success" @click="onSubmit">Salvar</el-button>
        </el-form>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { ElLoading, ElMessageBox, ElNotification } from 'element-plus'
    import { onMounted, ref } from 'vue'
import { useDeliveryTax } from '../composables/deliveryTax'

    const restaurant = JSON.parse(localStorage.getItem('restaurant') as any)
    const data = ref()
    const modal = ref(false)
    const action = ref('add')

    const formCategory = ref({
        restaurant_id: restaurant.id,
        id: null,
        title: '',
        bairro: '',
        valor: ''
    })

    const onList = async () => {
        try {
            const {onListDeliveryTax} = useDeliveryTax()
            const result = await onListDeliveryTax(restaurant.id)

            if (result.status === 200) {
                data.value = result.data.data
                return
            } else if (result.status === 422) {
                for (const key in result.data.errors) {
                    if (result.data.errors[key]) {
                        throw Error(result.data.errors[key])
                    }
                }
                return
            }

            throw Error(result.data.message)
        } catch (e) {
            ElNotification({
                title: 'Notificação',
                message: e.message,
                type: 'error',
            })
        }

    }

    const onSubmit = async () => {
        const loading = ElLoading.service({
            lock: true,
            text: 'Processando...',
            background: 'rgba(0, 0, 0, 0.7)',
        })

        try {
            const {onCreate, onUpdate} = useDeliveryTax()
            let result = null

            if (action.value === 'add') {
                result = await onCreate(formCategory.value)
            } else {
                result = await onUpdate(formCategory.value)
            }

            if (result.status === 200) {
                ElNotification({
                    title: 'Notificação',
                    message: result.data.message,
                    type: 'success',
                })

                loading.close()
                onList()

                action.value = 'add'
                modal.value = false
                return
            } else if (result.status === 422) {
                for (const key in result.data.errors) {
                    if (result.data.errors[key]) {
                        throw Error(result.data.errors[key])
                    }
                }
                loading.close()
                
                return
            }

            throw Error(result.data.message)
        } catch (e) {
            ElNotification({
                title: 'Notificação',
                message: e.message,
                type: 'error',
            })
        } finally {
            loading.close()
        }
    }

    const onEdit = async (id: any) => {
        const loading = ElLoading.service({
            lock: true,
            text: 'Processando...',
            background: 'rgba(0, 0, 0, 0.7)',
        })
    
        try {
            const {onEdit} = useDeliveryTax()
            const result = await onEdit(id)

            if (result.status === 200) {
                action.value = 'edit'
                modal.value = true
                formCategory.value = result.data.data
                loading.close()

                return
            } else if (result.status === 422) {
                for (const key in result.data.errors) {
                    if (result.data.errors[key]) {
                        throw Error(result.data.errors[key])
                    }
                }
                loading.close()

                return
            }

            throw Error(result.data.message)
        } catch (e) {
            ElNotification({
                title: 'Notificação',
                message: e.message,
                type: 'error',
            })
        } finally {
            loading.close()
        }
    }

    const onDelete = (id: any) => {
        try {
            ElMessageBox.confirm(
                'Tem certeza que deseja deletar este bairro?',
                'Alerta',
                {
                    confirmButtonText: 'Confirmar',
                    cancelButtonText: 'Cancelar',
                    type: 'warning',
                }
            ).then(async () => {
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Processando...',
                    background: 'rgba(0, 0, 0, 0.7)',
                })

                const {onDelete} = useDeliveryTax()
                const result = await onDelete(id)

                if (result.status === 200) {
                    ElNotification({
                        title: 'Notificação',
                        message: result.data.message,
                        type: 'success',
                    })

                    loading.close()
                    onList()

                    return
                } else if (result.status === 422) {
                    for (const key in result.data.errors) {
                        if (result.data.errors[key]) {
                            throw Error(result.data.errors[key])
                        }
                    }
                    loading.close()
                    
                    return
                }

                throw Error(result.data.message)
            }).catch(() => {})
        } catch (e) {
            ElNotification({
                title: 'Notificação',
                message: e.message,
                type: 'error',
            })
        }
    }
    
    onMounted(() => {
        onList()
    })
</script>

<style lang="scss">

</style>