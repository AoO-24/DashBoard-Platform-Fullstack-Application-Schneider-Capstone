<!-- 收藏夹 -->
<template>
    <!-- 页头 -->
    <Header/>
    <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main">
       
        <div class="main-container wrap backgroundModule main-fullScreen">
            

            <div class="favoriteListModule" >
                <el-table :data="state.pageView.records" stripe class="dataTable">
                    <el-table-column align="center">
                        <template #header>
                            标题
                        </template>
                        <template #default="scope">
                            <router-link tag="div" v-if="scope.row.module == 10" class="link" :to="{path: '/thread', query:{ topicId : scope.row.topicId}}">
                                {{scope.row.topicTitle}}
                            </router-link>
                             <router-link tag="div" v-if="scope.row.module == 20" class="link" :to="{path: '/question', query:{ questionId : scope.row.questionId}}">
                                {{scope.row.questionTitle}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column align="center"  width="200" >
                        <template #header>
                            模块
                        </template>
                        <template #default="scope">
                            <span v-if="scope.row.module == 10">话题</span>
                            <span v-if="scope.row.module == 20">问题</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="addtime" label="收藏时间"  width="200" align="center"/>
                    <el-table-column width="120" align="center">
                        <template #header>
                            操作
                        </template>
                        <template #default="scope">
                            <el-button-group>
                                <el-button type="primary" @click="handleDeleteFavorite(scope.$index, scope.row)" >删除</el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>

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
    import { PageView,Favorites } from "@/types/index";
    import { processErrorInfo} from '@/utils/tool';
    import { ElMessage } from 'element-plus';

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '收藏夹 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '收藏夹 - ' + store.state.title
                },{
                    name: "description",
                    content: '收藏夹 - ' + store.state.title
                }
            ]
        }))
    )


    const state = reactive({
        pageView: {} as PageView<Favorites>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数     

        loading:true,//是否显示骨架屏
        isShowPage:false//是否显示分页
    });

    //错误
    const error = reactive({})

    //查询收藏夹列表
    const queryFavoriteList = (page: number) => {
        proxy?.$axios({
            url: '/user/control/favoriteList',
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
        .then((data: PageView<Favorites>) => {
            state.loading = false;//关闭骨架屏
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
		router.push({
            path: '/user/control/favoriteList', 
            query:{page : page}
		});
        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}

    //处理删除
    const handleDeleteFavorite = (index: number, row: Favorites) => {
        proxy?.$axios({
            url: '/user/control/deleteFavorite',
            method: 'post',
            params:  { 
                favoriteId: row.id
            },
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                    
                if(JSON.parse(result.success)){//成功
                    ElMessage({
                        showClose: true,
                        message: '删除成功',
                        type: 'success',
                    })

                    init();

                }else{
                    //处理错误信息
                    processErrorInfo(result.error as Map<string,string> , error,()=>{});
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    

    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'favoriteList'){
            let page:number = 1;
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            queryFavoriteList(page);
        }
        
        next();
    });
    onMounted(() => {
        init();

    }) 

    //初始化
    const init = () => {
		let page:number = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :1;
        queryFavoriteList(page);
	}
    

</script>

<style scoped lang="scss">
    .favoriteListModule{
        background: #fff;
        padding-right:8px;
        padding-left:8px;
        padding-top:8px;
        padding-bottom: 30px;
        .link{
            color: $color-blue-60;
        }
        .page{
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
        }
    }

</style>
