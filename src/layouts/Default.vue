<template>
<div id="layout-default">
    <div id="layout-default__navigation">
        <div id="layout-default__navigation__logo">
            <img :src="`https://delivery.sejavisto.digital/logos/${restaurant.logo}`">
        </div>

        <ul>
            <li><router-link to="/#/painel/pedidos" :class="($route.name === 'pedidos') ? 'active' : ''">Pedidos</router-link></li>
            <li><router-link to="/#/painel/cardapio" :class="($route.name === 'cardapio') ? 'active' : ''">Cardápio</router-link></li>
            <li><router-link to="/#/painel/categorias" :class="($route.name === 'categorias') ? 'active' : ''">Categorias</router-link></li>
            <li><router-link to="/#/painel/areas-entrega" :class="($route.name === 'areas-entrega') ? 'active' : ''">Áreas de Entrega</router-link></li>
            <li><router-link to="/#/painel/financeiro" :class="($route.name === 'financeiro') ? 'active' : ''">Financeiro</router-link></li>
            <li><router-link to="/#/painel/configuracoes" :class="($route.name === 'configuracoes') ? 'active' : ''">Configurações</router-link></li>
            <!-- <li>{{ state }}</li> -->
        </ul>
    </div>

    <div id="layout-content">
    <div id="layout-content__bar">
        <el-row>
        <el-col :span="12">
            <h1>{{ restaurant.restaurant_name }}</h1>
        </el-col>

        <el-col :span="12">
            <div class="align-right">
            <el-switch
                v-model="restaurantStatus.online"
                class="ml-2"
                :active-value="1"
                :inactive-value="0"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="Restaurante Aberto"
                inactive-text="Restaurante Fechado"
                @click="onUpdate"
            />
            </div>
        </el-col>
        </el-row>
    </div>

    <div id="layout-content__wrap">
        <router-view></router-view>
    </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRestaurant } from '../composables/restaurant'
import { ipcRenderer } from 'electron'
const state = ref("Aguarde...")

const restaurant = JSON.parse(localStorage.getItem('restaurant') as any)
const restaurantStatus = ref({
    online: 0
})

const checkRestaurant = async () => {
    const {checkOnline} = useRestaurant()
    const result = await checkOnline(restaurant.id)
    restaurantStatus.value = result.data.data
}

const onUpdate = async () => {
    try {
    const {updateStatus} = useRestaurant()
    const result = await updateStatus({ restaurant_id: restaurant.id })

    var audio = new Audio('../assets/notification-online.mp3')

    if (result.status === 200) {
        audio.play()

        setTimeout(function () {
        audio.pause()
        }, 2000)
    
        ElNotification({
        title: 'Notificação',
        message: result.data.message,
        type: 'success',
        })
        // checkRestaurant()
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

onMounted(() => {
    checkRestaurant()

    ipcRenderer.on("updater", (event, message) => {
        console.log(message)
        switch (message) {
            case "update_available":
                state.value = "Disponível"
                break;
        
            case "update_not_available":
                state.value = "Não disponível"
                break;
        }
    })
})
</script>

<style lang="scss" scoped>
#layout-default {
    &__navigation {
    background: #FE495C;
    height: 100vh;
    position: fixed;
    width: 200px;
    &__logo {
        text-align: center;
        padding: 30px 0;
        img { width: 80px; }
    }
    ul {
        margin: 0;
        padding: 0;
        li {
        display: block;
        list-style: none;
        a {
            color: #FFFFFF;
            display: block;
            font-size: 16px;
            font-weight: 300;
            text-decoration: none;
            padding: 15px;
            transition: all 0.3s;
            &:hover, &.active {
            background: #FFFFFF;
            color: #FE495C;
            }
        }
        }
    }
    }
}

#layout-content {
    margin-left: 200px;
    &__bar {
    background: #FFFFFF;
    padding: 15px;
    h1 {
        display: block;
        font-size: 20px;
        margin: 0;
    }
    }
    &__wrap {
    padding: 30px;
    }
}

.align-right {
    text-align: right;
}
</style>