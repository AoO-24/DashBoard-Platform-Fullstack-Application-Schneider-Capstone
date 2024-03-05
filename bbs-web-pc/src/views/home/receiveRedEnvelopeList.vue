<!-- 收红包列表 -->
<template>
    <!-- 页头 -->
    <Header/>
    <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="receiveRedEnvelopeListModule" >
                <el-table :data="state.pageView.records" stripe class="dataTable">
                    <el-table-column align="center">
                        <template #header>
                            发红包用户
                        </template>
                        <template #default="scope">
                            <div class="userInfo">
                                <div v-if="scope.row.giveAccount == null || scope.row.giveAccount == ''" class="cancelAccount">此用户账号已注销</div>
                                <div v-if="scope.row.giveAccount != null && scope.row.giveAccount != ''" >
                                    <router-link tag="a" :to="{path:'/user/control/home',query: {userName: scope.row.giveUserName}}" target="_blank">
                                        <span class="avatarImg">
                                            <img v-if="scope.row.giveAvatarPath != null" :src="scope.row.giveAvatarPath+'100x100/'+scope.row.giveAvatarName" class="img">
                                        
                                            <img v-if="scope.row.giveAvatarPath == null" :src="scope.row.giveAvatar" width="40" height="40" class="img"/>
                                        </span>
                                        <span v-if="scope.row.giveNickname == null || scope.row.giveNickname == ''" class="account">{{scope.row.giveAccount}}</span>
                                        <span v-if="scope.row.giveNickname != null && scope.row.giveNickname != ''" class="account">{{scope.row.giveNickname}}</span>
                                    </router-link>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="金额"  width="200" align="center"/>
                    <el-table-column prop="receiveTime" label="收取时间"  width="200" align="center"/>
                    <template #empty>
                        <div v-if="!state.loading">暂无数据</div>
                        <div v-if="state.loading"></div>
                    </template>
                </el-table>

                <el-skeleton :loading="state.loading"></el-skeleton>
                <div class="page" v-if="state.isShowPage">
					<el-pagination background @current-change="handlePage" :current-page="state.currentpage"  :page-size="state.maxresult" :total="state.totalrecord" layout="total, prev, pager, next,jumper" />
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
    import { PageView,ReceiveRedEnvelope } from "@/types/index";
    import { letterAvatar } from '@/utils/letterAvatar';

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    
    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '收红包列表 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '收红包列表 - ' + store.state.title
                },{
                    name: "description",
                    content: '收红包列表 - ' + store.state.title
                }
            ]
        }))
    )


    const state = reactive({
        pageView: {} as PageView<ReceiveRedEnvelope>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数     

        loading:true,//是否显示骨架屏
        isShowPage:false//是否显示分页
    });

    //错误
    const error = reactive({})

    //查询收红包列表
    const queryReceiveRedEnvelopeList = (page: number) => {
        proxy?.$axios({
            url: '/user/control/receiveRedEnvelopeList',
            method: 'get',
            params:  { 
                page: page
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: PageView<ReceiveRedEnvelope>) => {
            if(data.records != null && data.records.length >0){
                for(let i:number=0; i<data.records.length; i++){
                    let receiveRedEnvelope = data.records[i];
                    if(receiveRedEnvelope.giveNickname != null && receiveRedEnvelope.giveNickname !=''){
                        receiveRedEnvelope.giveAvatar = letterAvatar(receiveRedEnvelope.giveNickname, 40);
                    }else{
                        receiveRedEnvelope.giveAvatar = letterAvatar(receiveRedEnvelope.giveAccount, 40);
                    }

                }
            }
            state.pageView = data;

            state.loading = false;//关闭骨架屏

            state.totalrecord = parseInt(state.pageView.totalrecord);//服务器返回的long类型已转为String类型
            state.currentpage = state.pageView.currentpage;
            state.totalpage = parseInt(state.pageView.totalpage);//服务器返回的long类型已转为String类型
            state.maxresult = state.pageView.maxresult;


            state.isShowPage = true;//显示分页栏
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    

    //分页
    const handlePage = (page: number) => {
        
		router.push({
            path: '/user/control/receiveRedEnvelopeList', 
            query:{
                page : page
            }
		});
        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}


    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'receiveRedEnvelopeList'){
            let page:number = 1;
            let giveRedEnvelopeId:string = '';
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            queryReceiveRedEnvelopeList(page);
        }
        
        next();
    });
    onMounted(() => {
        init();

    }) 

    //初始化
    const init = () => {
		let page:number = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :1;
        queryReceiveRedEnvelopeList(page);
	}
    

</script>

<style scoped lang="scss">
    .receiveRedEnvelopeListModule{
        background: #fff;
        padding-right:8px;
        padding-left:8px;
        padding-top:8px;
        padding-bottom: 30px;

        .page{
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
        }
    }

</style>
