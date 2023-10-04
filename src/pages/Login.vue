<template>
	<div id="page-login">
        <h1>Sincronizar acesso.</h1>
        <p>Seja bem vindo ao gerenciador do seu restaurante. Antes de iniciar, vamos sincronizar seu painel:</p>

        <div id="page-login__form">
            <el-form label-position="top" :model="formSync">
                <el-form-item label="Código de sincronização">
                    <el-input placeholder="Insira o código" size="large" v-model="formSync.code" />
                </el-form-item>

                <el-button color="#8435A4" size="large" @click="onSubmit">Sincronizar</el-button>
            </el-form>
        </div>
    </div>
</template>
	  
<script lang="ts" setup>
	import { ElNotification } from 'element-plus';
	import { useAuth } from '../composables/auth';
	import { ref } from 'vue';

	const formSync = ref({
        code: '',
    });

	if (localStorage.getItem('restaurant')) {
        window.location.href = '/#/painel/pedidos';
    }

	const onSubmit = async () => {
        try {
            const {onSyncCode} = useAuth();
            const result = await onSyncCode(formSync.value)

            if (result.status === 200) {
                localStorage.setItem('restaurant', JSON.stringify(result.data.data));
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
</script>

<style lang="scss">
    #page-login {
        &__form {
            margin-top: 40px;
        }
    }
</style>
