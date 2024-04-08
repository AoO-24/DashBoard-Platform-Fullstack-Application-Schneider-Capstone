<!-- 第三方重定向登录 -->
<template>
  
</template>

<script lang="ts" setup>
    import { ElLoading, ElMessage } from 'element-plus'
    import { getCurrentInstance, ComponentInternalInstance,reactive, computed} from 'vue'
    import { appStore } from "@/store";
    import { useRouter } from 'vue-router'
    import { useMeta} from 'vue-meta'
    import { AxiosResponse } from 'axios'
    import { processErrorInfo} from '@/utils/tool';
    import { processJumpAttribute} from '@/utils/jumpProcess';
    import { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


   
    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '第三方重定向登录 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '第三方重定向登录 - ' + store.state.title
                },{
                    name: "description",
                    content: '第三方重定向登录 - ' + store.state.title
                }
            ]
        }))
    )

    //登录错误
    const error = reactive({
    })


    let loadingInstance :LoadingInstance = ElLoading.service({
        lock:true,//加载时全屏幕锁定
        text: '正在跳转...',
        fullscreen: true,//全屏遮罩
        background: 'rgba(255, 255, 255, 0.5)',
    });


    //第三方登录重定向后获取信息
    proxy?.$axios({
        url: '/thirdParty/loginRedirect',
        method: 'get',
        params:  {  
            code:(router.currentRoute.value.query.code != undefined ? router.currentRoute.value.query.code :''),
            state:(router.currentRoute.value.query.state != undefined ? router.currentRoute.value.query.state :''),
            jumpUrl:(router.currentRoute.value.query.jumpUrl != undefined ? router.currentRoute.value.query.jumpUrl :'')
        },
        showLoading: false,//是否显示加载图标
        loadingMask:false,// 是否显示遮罩层
    })
    .then((response: AxiosResponse) => {
        if(response){
            const result: any = response.data;
            loadingInstance.close();
            if(JSON.parse(result.success)){//登录成功
                if(result.userAuthorization != null){
                    let jumpUrl = router.currentRoute.value.query.jumpUrl != undefined ? router.currentRoute.value.query.jumpUrl as string :'' ;
                    let accessUser = result.userAuthorization.accessUser;
                    let accessToken = result.userAuthorization.accessToken;
                    let refreshToken = result.userAuthorization.refreshToken;

                    
                    //访问令牌和刷新令牌存储到localStorage
                    window.localStorage.setItem("bbsToken", JSON.stringify({accessToken : accessToken, refreshToken : refreshToken}));

                    store.commit('setSystemUser', accessUser);

                    if (jumpUrl != null && jumpUrl != '') {

                        let decryptObject = processJumpAttribute(jumpUrl);
                        if(decryptObject.path == "/login"){
                            router.push("index");
                        }else{
                            router.push({
                                path : decryptObject.path,
                                query: decryptObject.query
                            });
                        }
                        

                    } else {
                        router.push("index");
                    }
                }else{
                    ElMessage({
                        showClose: true,
                        message: 'userAuthorization属性内容为空',
                        type: 'error',
                    })
                }
            }else{
                //处理错误信息
                processErrorInfo(result.error as Map<string,string> , error,()=>{});
            }

        }
    }).catch((error: any) =>{
        console.log(error);
    });


</script>