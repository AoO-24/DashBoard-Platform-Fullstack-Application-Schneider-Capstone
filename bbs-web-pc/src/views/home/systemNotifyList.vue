<!-- 系统通知 -->
<template>
    <!-- 页头 -->
    <Header/>
    <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            

            <div class="systemNotifyListModule" >
                <div class="systemNotifyTitle"><h2>全部系统通知</h2></div>
		
		
                <div class="systemNotifyInfo" v-if="state.pageView.records != null && state.pageView.records.length >0">
                    <ol class="systemNotifyList">
                        <div class="systemNotify" v-for="subscriptionSystemNotify in state.pageView.records">
                            
                            <div class="author">
                                <div class="tipBottom">
                                    <span class="a-toolbar">
                                        <span v-if="subscriptionSystemNotify.status == 10" class="status">未读</span>
                                        <span v-if="subscriptionSystemNotify.status == 20" class="status alreadyRead">已读</span>
                                        
                                        <a @click="deleteSystemNotify(subscriptionSystemNotify.id)"><Icon name="trash" size="16px" class="icon"/>删除</a>
                                    </span>
                                </div>
                            </div>
                            
                            <div class="time">{{subscriptionSystemNotify.sendTime}}</div>
                            <div class="content" v-html="subscriptionSystemNotify.content"></div>
                            <div class="clearfix"></div>
                        </div>
                    </ol>
                </div>


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
    import { PageView,SubscriptionSystemNotify} from "@/types/index";
    import { ElMessage } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '系统通知列表 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '系统通知列表 - ' + store.state.title
                },{
                    name: "description",
                    content: '系统通知列表 - ' + store.state.title
                }
            ]
        }))
    )


    const state = reactive({
        pageView: {} as PageView<SubscriptionSystemNotify>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数     

        loading:true,//是否显示骨架屏
        isShowPage:false//是否显示分页
    });

    //错误
    const error = reactive({})


    //查询系统通知列表
    const querySystemNotifyList = (page: number) => {
        proxy?.$axios({
            url: '/user/control/systemNotifyList',
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
        .then((data: PageView<SubscriptionSystemNotify>) => {
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
            path: '/user/control/systemNotifyList', 
            query:{page : page}
		});
        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}


    //删除系统通知
    const deleteSystemNotify = (subscriptionSystemNotifyId: string) => {
        proxy?.$axios({
            url: '/user/control/deleteSystemNotify',
            method: 'post',
            params:  { 
                subscriptionSystemNotifyId: subscriptionSystemNotifyId
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
        if(to.name == 'systemNotifyList'){
            let page:number = 1;
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            querySystemNotifyList(page);
        }
        
        next();
    });
    
    onMounted(() => {
        init();
    }) 

     //初始化
    const init = () => {
		let page:number = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :1;
        querySystemNotifyList(page);
	}
    

</script>

<style scoped lang="scss">
.systemNotifyListModule{
    background: #fff;
    padding-right:8px;
    padding-left:8px;
    padding-top:8px;
    padding-bottom: 30px;
    .systemNotifyTitle{
        margin-left:2px;
	    margin-right:2px;
        padding-bottom: 4px;
        border-bottom:1px dotted $color-black-30;
    }
    .systemNotifyTitle h2{
        line-height:36px;
        font-size: 15px;
        font-weight: 700;
        margin-left: 10px;
        color: $color-black-70;
    }  
    .systemNotifyInfo{
        padding: 0px 2px 10px 2px;
        position: relative;
        padding-bottom:80px;
        .systemNotifyList{
            list-style:none;
            .systemNotify{
                padding:10px 10px 8px 10px;
                border-bottom:1px solid $color-black-20;
                .content{
                    padding:0px;
                    word-wrap:break-word;
                    color:$color-black-70;
                    line-height: 28px;
                    font-size: 15px;
                    margin-right: 120px;
                }
            }
            .author{
                position:relative;
            }
           .time{
                margin-bottom:5px;
                color:$color-black-40;
                line-height: 20px;
            }
            .tipBottom {
                font-size: 14px;
                margin-top: 5px;
                float:right;
                .status{
                    margin-right: 14px;
                }
                .alreadyRead{
                    color: #009A29;
                }
                a{
                    margin-right: 10px;
                    :hover {
                        color: $color-blue-60
                    }
                }
                .a-toolbar {
                    display: block;
                    width: 100%;
                    .icon {
                        font-size: 15px;
                        margin-right: 2px;
                        position: relative;
                        top: 2px;
                    }
                }
            }
        }
   }
    .page{
        margin-top: 30px;
        display: flex;
        justify-content: flex-end;
    }
}

   
</style>
