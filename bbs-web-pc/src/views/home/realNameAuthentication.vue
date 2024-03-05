<!-- 实名认证 -->
<template>
    <!-- 页头 -->
    <Header/>
    <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="realNameAuthenticationModule" >
                <div class="container">
                    <span v-if="state.user.mobile != null && state.user.mobile != ''" class="mobile">
                        您绑定的手机号：{{state.user.mobile}}
                    </span>
                    <span v-if="state.user.mobile == null || state.user.mobile == ''" class="mobile">
                        您还没绑定手机
                    </span>
                    <span class="operating" v-if="state.user.mobile != null && state.user.mobile != ''">
                        <el-button type="primary" plain @click="router.push({path: '/user/control/updatePhoneBinding/step1'})">修改</el-button>
                    </span>
                    <span class="operating" v-if="state.user.mobile == null || state.user.mobile == ''">
                        <el-button type="primary" plain @click="router.push({path: '/user/control/phoneBinding'})">立即绑定</el-button>
                    </span>
                    
                </div>
                
            </div>
        </div>
    </div>
    <!-- 页脚 -->
    <Footer/>
</template>


<script lang="ts" setup>
    import { getCurrentInstance, ComponentInternalInstance, reactive, onMounted, computed} from 'vue'
    import { useMeta} from 'vue-meta'
    import { appStore } from "@/store";
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import Header from '@/components/Header.vue'
    import { AxiosResponse } from 'axios'
    import { User } from "@/types/index";

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '实名认证 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '实名认证 - ' + store.state.title
                },{
                    name: "description",
                    content: '实名认证 - ' + store.state.title
                }
            ]
        }))
    )


    const state = reactive({
        user: {} as User,
    });

   

    //查询实名认证
    const queryRealNameAuthentication = () => {
        proxy?.$axios({
            url: '/user/control/realNameAuthentication',
            method: 'get',
            params:  { 
               
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                state.user = result.user;
            }
            

        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    

    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'realNameAuthentication'){
            queryRealNameAuthentication();
        }
        
        next();
    });
    onMounted(() => {
        init();

    }) 

    //初始化
    const init = () => {
		queryRealNameAuthentication();
	}
    

</script>

<style scoped lang="scss">
    .realNameAuthenticationModule{
        background: #fff;
        padding-right:8px;
        padding-left:8px;
        padding-top:8px;
        padding-bottom: 30px;
        
         .container {
            width: 500px;
            padding-top: 30px;
            overflow: hidden;
            margin: 0 auto;

            .mobile{
                font-size: 18px;
            }
            .operating{
                margin-left: 30px;
                position: relative;
                top: -2px;
            }
         }
    }

</style>
