<!-- 用户登录日志列表 -->
<template>
    <!-- 页头 -->
    <Header/>
     <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="userLoginLogListModule" >
                <el-table :data="state.pageView.records" stripe class="dataTable">
                    <el-table-column prop="ip" label="登录IP"  width="300" align="center"/>
                    <el-table-column prop="ipAddress" label="IP归属地" align="center"/>
                    <el-table-column align="center" width="120">
                        <template #header>
                            类型
                        </template>
                        <template #default="scope">
                            <span v-if="scope.row.typeNumber == 10">登录</span>
                            <span v-if="scope.row.typeNumber == 20">续期</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="logonTime" label="登录时间"  width="200" align="center"/>

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
    import { PageView,UserLoginLog } from "@/types/index";

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    
    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '登录日志列表 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '登录日志列表 - ' + store.state.title
                },{
                    name: "description",
                    content: '登录日志列表 - ' + store.state.title
                }
            ]
        }))
    )


    const state = reactive({
        pageView: {} as PageView<UserLoginLog>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数     

        loading:true,//是否显示骨架屏
        isShowPage:false//是否显示分页
    });

    //查询用户登录日志列表
    const queryUserLoginLogList = (page: number) => {
        proxy?.$axios({
            url: '/user/control/userLoginLogList',
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
        .then((data: PageView<UserLoginLog>) => {
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
            path: '/user/control/userLoginLogList', 
            query:{page : page}
		});
        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}



    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'userLoginLogList'){
            let page:number = 1;
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            queryUserLoginLogList(page);
        }
        
        next();
    });
    
    onMounted(() => {
        let page:number = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :1;
        queryUserLoginLogList(page);

    }) 
    

</script>

<style scoped lang="scss">
    .userLoginLogListModule{
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
