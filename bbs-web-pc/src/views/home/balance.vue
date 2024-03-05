<!-- 余额 -->
<template>
    <!-- 页头 -->
    <Header/>
    <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main-container wrap backgroundModule balanceModule">
        <span class="deposit"><span class="name">余额：</span>￥{{state.deposit}}</span>

        <span class="buttonBox">
            <el-button type="primary" plain @click="router.push({path: '/user/control/payment', query:{ paymentModule : 5}})">充值</el-button>
        </span>
    </div>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="paymentLogListModule" >
                <el-table :data="state.pageView.records" stripe class="dataTable">
                    <el-table-column prop="paymentRunningNumber" label="支付流水号" align="center" width="300"/>
                    <el-table-column align="center" width="150">
                        <template #header>
                            金额
                        </template>
                        <template #default="scope">
                            <span v-if="scope.row.amountState == 1">+</span>
                            <span v-if="scope.row.amountState == 2">-</span>
                            {{scope.row.amount}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="250">
                        <template #header>
                            模块
                        </template>
                        <template #default="scope">
                            <span v-if="scope.row.paymentModule == 1">会员卡订单支付</span>
                            <span v-if="scope.row.paymentModule == 5">充值</span>
                            <span v-if="scope.row.paymentModule == 70">余额购买话题隐藏内容</span>
                            <span v-if="scope.row.paymentModule == 80">解锁话题隐藏内容分成</span>
                            <span v-if="scope.row.paymentModule == 90">悬赏金额</span>
                            <span v-if="scope.row.paymentModule == 100">采纳答案</span>
                            <span v-if="scope.row.paymentModule == 110">调整赏金</span>
                            <span v-if="scope.row.paymentModule == 120">话题发红包</span>
                            <span v-if="scope.row.paymentModule == 130">话题收红包</span>
                            <span v-if="scope.row.paymentModule == 140">话题返还红包</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="times" label="时间"  width="200" align="center"/>
                    <el-table-column prop="remark" label="备注"  align="center"/>
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
    import { PageView,PaymentLog } from "@/types/index";

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '余额 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '余额 - ' + store.state.title
                },{
                    name: "description",
                    content: '余额 - ' + store.state.title
                }
            ]
        }))
    )


    const state = reactive({
        deposit :'',//预存款
        pageView: {} as PageView<PaymentLog>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数     

        loading:true,//是否显示骨架屏
        isShowPage:false//是否显示分页
    });

    //错误
    const error = reactive({})

    //查询余额
    const queryBalance = (page: number) => {
        proxy?.$axios({
            url: '/user/control/balance',
            method: 'get',
            params:  { 
                page: page
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                state.deposit = result.deposit;
                state.pageView =  result.pageView;

                

                state.totalrecord = parseInt(state.pageView.totalrecord);//服务器返回的long类型已转为String类型
                state.currentpage = state.pageView.currentpage;
                state.totalpage = parseInt(state.pageView.totalpage);//服务器返回的long类型已转为String类型
                state.maxresult = state.pageView.maxresult;


                state.isShowPage = true;//显示分页栏
            }
            
            state.loading = false;//关闭骨架屏
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    

    //分页
    const handlePage = (page: number) => {
		router.push({
            path: '/user/control/balance', 
            query:{page : page}
		});
        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}


    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'balance'){
            let page:number = 1;
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            queryBalance(page);
        }
        
        next();
    });
    onMounted(() => {
        init();

    }) 

    //初始化
    const init = () => {
		let page:number = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :1;
        queryBalance(page);
	}
    

</script>

<style scoped lang="scss">
    .balanceModule{
        padding: 30px 0 30px 0px;
        background: #fff;
        line-height:46px;
        margin-bottom: 10px;
        .deposit{
            margin-left: 30px;
            font-size: 16px; 
            .name{
                color: #99a9bf;
            }
        }
        .buttonBox{
            margin-left: 100px;
            margin-top: -26px;
            :deep(.el-button--primary){
                padding: 16px 15px 16px 15px;
            }
        }
    }

    .paymentLogListModule{
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
