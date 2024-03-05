<!--积分列表-->
<template>
    <!-- 页头 -->
    <Header/>
    <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main-container wrap backgroundModule rewardPointInfoModule">
        <div class="container">
            <span class="text">
                <span class="name">发表话题奖励积分：</span>{{state.rewardPointInfo.topic_rewardPoint}}
            </span>
            <span class="text">
                <span class="name">发表评论奖励积分：</span>{{state.rewardPointInfo.comment_rewardPoint}}
            </span>
            <span class="text">
                <span class="name">发表回复奖励积分：</span>{{state.rewardPointInfo.reply_rewardPoint}}
            </span>
            <span class="text">
                <span class="name">提交问题奖励积分：</span>{{state.rewardPointInfo.question_rewardPoint}}
            </span>
            <span class="text">
                <span class="name">提交答案奖励积分：</span>{{state.rewardPointInfo.answer_rewardPoint}}
            </span>
            <span class="text">
                <span class="name">提交答案回复奖励积分：</span>{{state.rewardPointInfo.answerReply_rewardPoint}}
            </span>
        </div>
    </div>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="pointModule" >
                <el-table :data="state.pageView.records" stripe class="dataTable">  
                    <el-table-column align="center" width="300">
                        <template #header>
                            模块
                        </template>
                        <template #default="scope">
                            <span v-if="scope.row.module == 100">发表话题</span>
                            <span v-if="scope.row.module == 200">发表评论</span>
                            <span v-if="scope.row.module == 300">发表回复</span>
                            <span v-if="scope.row.module == 400">积分解锁话题隐藏内容</span>
                            <span v-if="scope.row.module == 500">会员卡订单支付</span>
                            <span v-if="scope.row.module == 600">充值</span>
                            <span v-if="scope.row.module == 700">问题</span>
                            <span v-if="scope.row.module == 800">答案</span>
                            <span v-if="scope.row.module == 900">答案回复</span>
                            <span v-if="scope.row.module == 1000">悬赏积分</span>
                            <span v-if="scope.row.module == 1100">采纳答案</span>
                            <span v-if="scope.row.module == 1200">调整赏金</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="200">
                        <template #header>
                            收入/支出
                        </template>
                        <template #default="scope">
                            <span v-if="scope.row.pointState == 1">+</span>
                            <span v-if="scope.row.pointState == 2">-</span>
                            {{scope.row.point}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="times" label="时间"  width="200" align="center"/>
                    <el-table-column prop="remark" label="备注" align="center"/>

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
    import { PageView,PointLog,RewardPointInfo,User } from "@/types/index";

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '积分列表 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '积分列表 - ' + store.state.title
                },{
                    name: "description",
                    content: '积分列表 - ' + store.state.title
                }
            ]
        }))
    )


    const state = reactive({
        rewardPointInfo:{} as RewardPointInfo,//奖励积分信息
        user:{} as User,
        pageView: {} as PageView<PointLog>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数     

        loading:true,//是否显示骨架屏
        isShowPage:false//是否显示分页
    });

    //查询积分
    const queryPoint = (page: number) => {
        proxy?.$axios({
            url: '/user/control/point',
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
                state.rewardPointInfo = result.rewardPointInfo;
                state.user = result.user;
                state.pageView =  result.pageView;

                state.loading = false;//关闭骨架屏

                state.totalrecord = parseInt(state.pageView.totalrecord);//服务器返回的long类型已转为String类型
                state.currentpage = state.pageView.currentpage;
                state.totalpage = parseInt(state.pageView.totalpage);//服务器返回的long类型已转为String类型
                state.maxresult = state.pageView.maxresult;


                state.isShowPage = true;//显示分页栏
            }
            
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    

    //分页
    const handlePage = (page: number) => {
		router.push({
            path: '/user/control/point', 
            query:{page : page}
		});
        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}

   

    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'point'){
            let page:number = 1;
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            queryPoint(page);
        }
        
        next();
    });
    
    onMounted(() => {
        let page:number = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :1;
        queryPoint(page);

    }) 
    

</script>

<style scoped lang="scss">
    .rewardPointInfoModule{
        padding: 30px 0 30px 0px;
        background: #fff;
        line-height:46px;
        .container{
            margin-left: 30px;
            margin-right: 30px;
            .text{
                font-size: 15px; 
                margin-right: 40px;
                .name{
                    color: #99a9bf;
                }
            }
        }
        
    }
    .pointModule{
        background: #fff;
        padding-right:8px;
        padding-left:8px;
        padding-top:8px;
        padding-bottom: 30px;
        margin-top: 10px;
        .page{
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
        }
    }

</style>
