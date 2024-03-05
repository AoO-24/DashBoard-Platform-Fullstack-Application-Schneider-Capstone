<!-- 私信列表 -->
<template>
    <!-- 页头 -->
    <Header/>
    <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            

            <div class="privateMessageListModule" >
                <div class="privateMessageTitle"><h2>全部私信</h2></div>
		
		
                <div class="privateMessageInfo" v-if="state.pageView.records != null && state.pageView.records.length >0">
                    <ol class="privateMessageList">
                        <div class="privateMessage" v-for="privateMessage in state.pageView.records">
                            
                            <div class="author">
                                <router-link tag="a" :to="{path:'/user/control/home',query:{userName:privateMessage.friendUserName}}">
                                    <img v-if="privateMessage.friendAvatarName != null" :src="privateMessage.friendAvatarPath+'100x100/'+privateMessage.friendAvatarName" width="64" height="64" class="img">
                                        
                                    <img v-if="privateMessage.friendAvatarName == null" :src="privateMessage.friendAvatar" width="64" height="64" class="img"/>
                                </router-link>
                                <cite>
                                    <span v-if="privateMessage.friendAccount == null || privateMessage.friendAccount == ''" class="cancelAccount">此用户账号已注销</span>
                                    <router-link tag="a" :to="{path:'/user/control/home',query:{userName:privateMessage.friendUserName}}">
                                        <span>{{(privateMessage.friendNickname != null && privateMessage.friendNickname != '') ? privateMessage.friendNickname : privateMessage.friendAccount}}</span>
                                    </router-link>
                                </cite> 
                                <div class="tipBottom">
                                    <span class="a-toolbar">
                                        <span v-if="privateMessage.status == 10" class="status">未读</span>
                                        <span v-if="privateMessage.status == 20" class="status alreadyRead">已读</span>
                                        
                                        <router-link tag="a" :to="{path:'/user/control/privateMessageChatList',query:{friendUserName:privateMessage.friendUserName}}">
                                            <Icon name="chat-line" size="16px" class="icon"/>对话
                                        </router-link>
                                        <a @click="deletePrivateMessage(privateMessage.friendUserName)"><Icon name="trash" size="16px" class="icon"/>删除</a>
                                    </span>
                                </div>
                            </div>
                            
                            <div class="time">{{privateMessage.sendTime}}</div>
                            <p class="content" @click="router.push({path: '/user/control/privateMessageChatList', query:{ friendUserName : privateMessage.friendUserName}})">{{privateMessage.messageContent}}</p>
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
    import { PageView,PrivateMessage} from "@/types/index";
    import { letterAvatar } from '@/utils/letterAvatar';
    import { ElMessage } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '私信列表 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '私信列表 - ' + store.state.title
                },{
                    name: "description",
                    content: '私信列表 - ' + store.state.title
                }
            ]
        }))
    )

    const state = reactive({
        pageView: {} as PageView<PrivateMessage>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数     

        loading:true,//是否显示骨架屏
        isShowPage:false//是否显示分页
    });

    //错误
    const error = reactive({})


    //查询私信列表
    const queryPrivateMessageList = (page: number) => {
        proxy?.$axios({
            url: '/user/control/privateMessageList',
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
        .then((data: PageView<PrivateMessage>) => {
            state.loading = false;//关闭骨架屏


            if(data.records != null && data.records.length >0){
                for(let i:number=0; i<data.records.length; i++){
                    let privateMessage = data.records[i];
                    if(privateMessage.friendNickname != null && privateMessage.friendNickname !=''){
                        privateMessage.friendAvatar = letterAvatar(privateMessage.friendNickname, 64);
                    }else{
                        privateMessage.friendAvatar = letterAvatar(privateMessage.friendAccount, 64);
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
		router.push({
            path: '/user/control/privateMessageList', 
            query:{page : page}
		});
        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}


    //删除私信
    const deletePrivateMessage = (friendUserName: string) => {
        proxy?.$axios({
            url: '/user/control/deletePrivateMessage',
            method: 'post',
            params:  { 
                friendUserName: friendUserName
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
        if(to.name == 'privateMessageList'){
            let page:number = 1;
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            queryPrivateMessageList(page);
        }
        
        next();
    });
    
    onMounted(() => {
        init();
    }) 

     //初始化
    const init = () => {
		let page:number = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :1;
        queryPrivateMessageList(page);
	}
    

</script>

<style scoped lang="scss">
.privateMessageListModule{
    background: #fff;
    padding-right:8px;
    padding-left:8px;
    padding-top:8px;
    padding-bottom: 30px;
    .privateMessageTitle{
        margin-left:2px;
	    margin-right:2px;
        padding-bottom: 4px;
        border-bottom:1px dotted $color-black-30;
    }
    .privateMessageTitle h2{
        line-height:36px;
        font-size: 15px;
        font-weight: 700;
        margin-left: 10px;
        color: $color-black-70;
    }  
    .privateMessageInfo{
        padding: 0px 2px 10px 2px;
        position: relative;
        padding-bottom:80px;
        .privateMessageList{
            list-style:none;
            .cancelAccount{
                display: inline-block;
                vertical-align: middle;
                padding: 8px 6px 6px 6px;
                font-size: 14px;
                line-height: 14px;
                -webkit-border-radius: 2px;
                -moz-border-radius: 2px;
                border-radius: 2px;
                color: $color-black-50;
                background-color: $color-black-10;
            }
            .privateMessage{
                padding:12px 10px 7px 86px;
                border-bottom:1px solid $color-black-20;
                .content{
                    padding:0px;
                    word-wrap:break-word;
                    color:$color-black-70;
                    line-height: 30px;
                    font-size: 15px;
                    margin-right: 120px;
                    cursor: pointer; 
                }
                .content:hover{
                    color: $color-blue-60;
                       
                }
            }
            .author{
                position:relative;
                img{
                    position:absolute;
                    left:-76px;
                    -webkit-border-radius:50%;
                    -moz-border-radius:50%;
                    border-radius:50%;
                    display:block;
                }
            }
            cite{
                font-style:normal;
                font-size: 15px;
                a{
                    color:$color-black-60;
                }
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