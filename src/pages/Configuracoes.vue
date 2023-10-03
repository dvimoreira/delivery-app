<template>
    <div id="page-configuracoes">
        <el-tabs v-model="activeName">
            <el-tab-pane label="Impressora" name="first">
                <el-form label-position="top" :model="formSync">
                    <el-form-item label="Selecione uma impressora">
                        <el-select v-model="formSync.printSelected" placeholder="Selecione" size="large">
                            <el-option
                                v-for="(item, key) in printersList"
                                :key="key"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>

                    <el-button color="#8435A4" size="large" @click="onSubmit">Salvar</el-button>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="Recebimentos" name="second">Recebimentos</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts" setup>
    import { ipcRenderer } from 'electron'
    import { ElNotification } from 'element-plus'
    import { ref, onMounted  } from 'vue'
    import { useAuth } from '../composables/auth';

    let printersList = ref({})
    const formSync = ref({
        printSelected: '',
    });
    const activeName = ref('first')

    const getPrinters = async () => {
        try {
            let result = await ipcRenderer.invoke('get-printers-list')
            printersList.value = JSON.parse(result)
        } catch (e) {
            ElNotification({
                title: 'Notificação',
                message: e.message,
                type: 'error',
            })
        }
    }

    onMounted(() => {
        getPrinters()
    })

    const onSubmit = async () => {
        try {
            let data = formSync.value.printSelected.replace(/^\s+/g, '');
            localStorage.setItem('impressora_selecionada', data)

            ElNotification({
                title: 'Notificação',
                message: 'Impressora salva com sucesso!', 
                type: 'success',
            })
        } catch (e) {
            ElNotification({
                title: 'Notificação',
                message: e.message, 
                type: 'error',
            })
        }

    }
</script>

<style lang="scss" scoped>

</style>
