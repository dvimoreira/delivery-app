<template>
    <el-button type="success" size="large" @click="openMenu()">Adicionar novo</el-button>

    <el-table :data="data" style="width: 100%; margin-top: 30px;">
        <el-table-column label="Título" prop="title" />

        <el-table-column label="Preço" align="center">
            <template #default="scope">
                <div v-if="scope.row.price">R$ {{ scope.row.price }}</div>
                <div v-else>-</div>
            </template>
        </el-table-column>
    
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
    <el-dialog v-model="modal" :title="(action === 'add') ? 'Adicionar Produto' : 'Editar Produto'" destroy-on-close>
        <el-form label-position="top" :model="formMenu" enctype="multipart/form-data">
            <el-form-item label="Título">
                <el-input placeholder="Informe o título" size="large" v-model="formMenu.title" />
            </el-form-item>

            <el-form-item label="Descrição">
                <el-input placeholder="Informe a descrição" size="large" v-model="formMenu.description" />
            </el-form-item>

            <el-form-item label="Produto com mais de uma escolha?">
                <el-switch
                    v-model="formMenu.variable_price"
                    class="ml-2"
                    :active-value="'1'"
                    :inactive-value="'0'"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    active-text="Sim"
                    inactive-text="Não"
                />
            </el-form-item>

            <el-form-item label="Preço" v-if="formMenu.variable_price === '0'">
                <el-input placeholder="Informe o preço" size="large" v-model="formMenu.price" />
            </el-form-item>

            <el-switch
                v-model="formMenu.isActive"
                class="ml-2"
                :active-value="'1'"
                :inactive-value="'2'"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="Ativo"
                inactive-text="Inativo"
            />

            <el-form-item label="Categoria">
                <!-- <el-select v-model="formMenu.category_id" placeholder="Selecione a categoria" size="large" style="width: 100%;">
                    <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    />
                </el-select> -->

                <el-select v-model="formMenu.category_id" placeholder="Selecione a categoria" size="large" multiple collapse-tags style="width: 100%;">
                    <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="Imagem">
                <input type="file" ref="file" v-on:change="handleFileUpload()">
            </el-form-item>

            <br><br>

            <el-button type="danger" @click="modal = false; action = 'add'">Cancelar</el-button>
            <el-button type="success" @click="onSubmit">Salvar</el-button>
        </el-form>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { ElLoading, ElMessageBox, ElNotification, UploadProps, UploadUserFile } from 'element-plus'
    import { onMounted, ref } from 'vue'
import { useCategory } from '../composables/category'
import { useMenu } from '../composables/menu'

    const restaurant = JSON.parse(localStorage.getItem('restaurant') as any)
    const data = ref()
    const modal = ref(false)
    const action = ref('add')
    const categories = ref([])
    const file = ref()

    const formMenu = ref({
        restaurant_id: restaurant.id,
        id: '',
        title: '',
        description: '',
        price: '',
        category_id: '',
        isActive: '1',
        image_url: null,
        variable_price: '0'
    })

    const handleFileUpload = () => {
        formMenu.value.image_url = file.value.files[0]
    }

    const openMenu = () => {
        modal.value = true; 
        action.value = 'add'
        formMenu.value.restaurant_id = ''
        formMenu.value.id = ''
        formMenu.value.title = ''
        formMenu.value.description = ''
        formMenu.value.price = ''
        formMenu.value.category_id = ''
        formMenu.value.isActive = ''
        formMenu.value.variable_price = '0'
    }

    const onListCategories = async () => {
        try {
            const {onListCategories} = useCategory()
            const result = await onListCategories(restaurant.id)

            if (result.status === 200) {
                categories.value = result.data.data
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

    const onList = async () => {
        try {
            const {onListMenu} = useMenu()
            const result = await onListMenu(restaurant.id)

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
            const {onCreate, onUpdate} = useMenu()
            let result = null

            const formData = new FormData();
            formData.append('restaurant_id', (restaurant.id) ? restaurant.id : '')
            formData.append('title', (formMenu.value.title) ? formMenu.value.title : '')
            formData.append('description', (formMenu.value.description) ? formMenu.value.description : '')
            formData.append('price', (formMenu.value.price) ? formMenu.value.price : '')
            formData.append('category_id', (formMenu.value.category_id) ? formMenu.value.category_id : '')
            formData.append('image_url', (formMenu.value.image_url) ? formMenu.value.image_url : '')
            formData.append('isActive', (formMenu.value.isActive) ? formMenu.value.isActive : '')
            formData.append('variable_price', (formMenu.value.variable_price) ? formMenu.value.variable_price : '')

            if (action.value === 'add') {
                result = await onCreate(formData)
            } else {
                formData.append('id', formMenu.value.id)
                result = await onUpdate(formData)
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
            const {onEdit} = useMenu()
            const result = await onEdit(id)

            if (result.status === 200) {
                action.value = 'edit'
                modal.value = true
                formMenu.value.restaurant_id = result.data.data.id
                formMenu.value.id = result.data.data.id
                formMenu.value.title = result.data.data.title
                formMenu.value.description = result.data.data.description
                formMenu.value.price = result.data.data.price
                formMenu.value.category_id = result.data.data.category_id
                formMenu.value.isActive = result.data.data.isActive
                formMenu.value.variable_price = result.data.data.variable_price

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
                'Tem certeza que deseja deletar esta produto?',
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

                const {onDelete} = useMenu()
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
        onListCategories()
    })
</script>

<style lang="scss">

</style>