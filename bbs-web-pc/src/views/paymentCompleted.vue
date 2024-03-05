<!-- 支付完成 -->
<template>
    <!-- 页头 -->
    <Header/>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="paymentCompletedModule" >
                <el-result icon="success" title="支付完成" sub-title="明细信息请到用户中心的余额模块查看">
                    <template #extra>
                       
                    </template>
                </el-result>
            </div>
        </div>
    </div>
    <!-- 页脚 -->
    <Footer/>
</template>


<script lang="ts" setup>
    import { getCurrentInstance, ComponentInternalInstance, computed} from 'vue'
    import { useMeta} from 'vue-meta'
    import { appStore } from "@/store";
    import { useRouter } from 'vue-router'
    import Header from '@/components/Header.vue'
    import { AxiosResponse } from 'axios'

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '支付完成 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '支付完成 - ' + store.state.title
                },{
                    name: "description",
                    content: '支付完成 - ' + store.state.title
                }
            ]
        }))
    )


    let interfaceProduct = router.currentRoute.value.params.interfaceProduct != undefined ? router.currentRoute.value.params.interfaceProduct : '0';
    let paymentModule = router.currentRoute.value.params.paymentModule != undefined ? router.currentRoute.value.params.paymentModule : '0';
    let parameterId = router.currentRoute.value.params.parameterId != undefined ? router.currentRoute.value.params.parameterId : '0';


    //查询支付完成
    proxy?.$axios({
        url: '/paymentCompleted/'+interfaceProduct+"/"+paymentModule+"/"+parameterId,
        method: 'get',
        params:  router.currentRoute.value.query,
        //showLoading: false,//是否显示加载图标
        loadingMask:false,// 是否显示遮罩层
        timestamp:false//get请求是否增加时间戳
    })
    .then((response: AxiosResponse) => {
       // const result: any = response.data;
        
    })
    .catch((error: any) =>{
        console.log(error);
    });
    

</script>

<style scoped lang="scss">
    .paymentCompletedModule{
        background: #fff;
        padding-right:8px;
        padding-left:8px;
        padding-top:8px;
        padding-bottom: 30px;
    }

</style>
