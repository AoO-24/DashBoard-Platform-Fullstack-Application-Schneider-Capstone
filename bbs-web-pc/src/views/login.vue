<!-- 登录页 -->
<template>
    <!-- 页头 -->
    <Header/>

    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="loginModule" >
                <!--引入登录组件-->
                <Com.Login/>
            </div>
        </div>
    </div>


    <!-- 页脚 -->
    <Footer/>
</template>

<script setup lang="ts">
    import * as Com from "@/components";
    import { useMeta} from 'vue-meta';
    import { appStore } from "@/store";
import { computed } from "vue";

    const store = appStore();

    
    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '登录 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '登录 - ' + store.state.title
                },{
                    name: "description",
                    content: '登录 - ' + store.state.title
                }
            ]
        }))
    )

</script>



<style scoped lang="scss">
.loginModule{
    background: #fff;
    padding:40px 40px 40px 40px;
    width:380px;
    margin:0px auto;
}

</style>