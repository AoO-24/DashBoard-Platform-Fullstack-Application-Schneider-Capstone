<!-- 会员卡订单 -->
<template>
    <!-- 页头 -->
    <Header/>
    <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="membershipCardOrderListModule" >
                <el-table :data="state.pageView.records" stripe class="dataTable">
                    <el-table-column prop="orderId" label="订单号" align="center"/>
                    <el-table-column prop="createDate" label="创建时间"  width="170" align="center"/>
                    <el-table-column prop="paymentAmount" label="已支付金额"  width="130" align="center"/>
                    <el-table-column prop="paymentPoint" label="已支付积分"  width="130" align="center"/>
                    <el-table-column prop="roleName" label="角色名称"  width="180" align="center"/>
                    <el-table-column prop="specificationName" label="规格名称"  width="180" align="center"/>
                    <el-table-column prop="quantity" label="数量"  width="80" align="center"/>
                    <el-table-column align="center" width="100">
                        <template #header>
                            时长
                        </template>
                        <template #default="scope">
                            {{scope.row.duration}}
                            <span v-if="scope.row.unit == 10">小时</span>
                            <span v-if="scope.row.unit == 20">日</span>
                            <span v-if="scope.row.unit == 30">月</span>
                            <span v-if="scope.row.unit == 40">年</span>
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
    import { PageView,MembershipCardOrder } from "@/types/index";

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '会员卡订单 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '会员卡订单 - ' + store.state.title
                },{
                    name: "description",
                    content: '会员卡订单 - ' + store.state.title
                }
            ]
        }))
    )


    const state = reactive({
        pageView: {} as PageView<MembershipCardOrder>,//分页
        totalrecord : 0, //总记录数
		    currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数     

        loading:true,//是否显示骨架屏
        isShowPage:false//是否显示分页
    });

    //错误
    const error = reactive({})

    //查询会员卡订单列表
    const queryMembershipCardOrderList = (page: number) => {
        proxy?.$axios({
            url: '/user/control/membershipCardOrderList',
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
        .then((data: PageView<MembershipCardOrder>) => {
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
            path: '/user/control/membershipCardOrderList', 
            query:{page : page}
		});
        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}


    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'membershipCardOrderList'){
            let page:number = 1;
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            queryMembershipCardOrderList(page);
        }
        
        next();
    });
    onMounted(() => {
        init();

    }) 

    //初始化
    const init = () => {
		let page:number = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :1;
        queryMembershipCardOrderList(page);
	}
    

</script>

<style scoped lang="scss">
    .membershipCardOrderListModule{
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
