<!--话题收藏用户-->
<template>
    <!-- 页头 -->
    <Header/>
     <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main-container wrap backgroundModule topicFavoriteListHeadModule">
        <div class="container">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/user/control/topicList',query:{page:router.currentRoute.value.query.topicPage != undefined ? router.currentRoute.value.query.topicPage :'1'} }">话题收藏用户</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/thread',query:{topicId:state.topic?.id} }">{{state.topic.title}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/' }"></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </div>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="topicFavoriteListModule" >
                <el-table :data="state.pageView.records" stripe class="dataTable">
                    <el-table-column align="center">
                        <template #header>
                            用户
                        </template>
                        <template #default="scope">
                            <div class="userInfo">
                                <div v-if="scope.row.account == null || scope.row.account == ''" class="cancelAccount">此用户账号已注销</div>
                                <div v-if="scope.row.account != null && scope.row.account != ''" >
                                    <router-link tag="a" :to="{path:'/user/control/home',query: {userName: scope.row.userName}}" target="_blank">
                                        <span class="avatarImg">
                                            <img v-if="scope.row.avatarName != null" :src="scope.row.avatarPath+'100x100/'+scope.row.avatarName" class="img">
                                        
                                            <img v-if="scope.row.avatarName == null" :src="scope.row.avatar" width="40" height="40" class="img"/>
                                        </span>
                                        <span v-if="scope.row.nickname == null || scope.row.nickname == ''" class="account">{{scope.row.account}}</span>
                                        <span v-if="scope.row.nickname != null && scope.row.nickname != ''" class="account">{{scope.row.nickname}}</span>
                                    </router-link>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="addtime" label="收藏时间" width="400" align="center"/>

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
    import { PageView,Favorites, Topic } from "@/types/index";
    import {letterAvatar} from '@/utils/letterAvatar'

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


   
    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '话题收藏用户 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '话题收藏用户 - ' + store.state.title
                },{
                    name: "description",
                    content: '话题收藏用户 - ' + store.state.title
                }
            ]
        }))
    )


    const state = reactive({
        topic: {} as Topic,
        pageView: {} as PageView<Favorites>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数     

        loading:true,//是否显示骨架屏
        isShowPage:false//是否显示分页
    });

    //查询话题收藏列表
    const queryTopicFavoritesList = (topicId:string,page: number) => {
        proxy?.$axios({
            url: '/user/control/topicFavoriteList',
            method: 'get',
            params:  { 
                topicId: topicId,
                page: page
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: PageView<Favorites>) => {
            state.loading = false;//关闭骨架屏

            if(data.records != null && data.records.length >0){
                for(let i:number=0; i<data.records.length; i++){
                    let topicFavorites = data.records[i];
                    if(topicFavorites.nickname != null && topicFavorites.nickname !=''){
                        topicFavorites.avatar = letterAvatar(topicFavorites.nickname, 40);
                    }else{
                        topicFavorites.avatar = letterAvatar(topicFavorites.account, 40);
                    }

                }
            }


            state.pageView = data;
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
		let topicId:string = router.currentRoute.value.query.topicId != undefined ? router.currentRoute.value.query.topicId as string :'';
        
        router.push({
            path: '/user/control/topicFavoriteList', 
            query:{
                topicId: topicId,
                page : page
            }
		});
        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}

    //查询话题
    const queryTopic = (topicId: string) => {
		 proxy?.$axios({
            url: '/thread',
            method: 'get',
            params:  { 
                topicId: topicId,
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: Topic) => {
            state.topic = data;
        })
        .catch((error: any) =>{
            console.log(error);
        });
        

	}

    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'topicFavoriteList'){
            let page:number = 1;
            let topicId:string = '';
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            if(to.query.topicId != undefined){
                topicId = to.query.topicId as string;
            }
            
            queryTopicFavoritesList(topicId,page);
            queryTopic(topicId);
        }
        
        next();
    });
    
    onMounted(() => {
        let topicId:string = router.currentRoute.value.query.topicId != undefined ? router.currentRoute.value.query.topicId as string :'';
        let page:number = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :1;
        queryTopicFavoritesList(topicId,page);
        queryTopic(topicId);
    }) 
    

</script>

<style scoped lang="scss">
    .topicFavoriteListHeadModule{
        padding: 30px 0 30px 0px;
        margin-bottom: 10px;
        .container{
            margin-left: 10px;
            margin-right: 10px;
        }
        :deep(.el-breadcrumb__inner.is-link, .el-breadcrumb__inner a) {
            font-weight: normal;
        }
    }
    .topicFavoriteListModule{
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
