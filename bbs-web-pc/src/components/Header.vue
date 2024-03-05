<!-- 页头 -->
<template>
    <el-affix ref="headerAffix" :offset="0" @scroll="onScroll" style="flex-shrink: 0;">
        <el-collapse-transition >
            <div v-show="headerTransition">
                <div class="headerModule">
                    <div class="shadow-container">
                        <div class="box">
                            <router-link tag="a" class="logo" to="/"><img alt="LOGO" src="@/assets/images/logo.gif" ></router-link>

                            <!-- 站点栏目 -->
                            <div class="nav">
                                <ul class="clearfix">

                                    <el-skeleton :loading="state.loading" style="width: 300px; position: relative; top: -3px;" >
                                        <template #template>
                                            <div style=" display: flex; align-items: center; justify-items: space-between;">
                                                <el-skeleton-item variant="text" style="width: 30%; height:30px; margin-right: 16px" />
                                                <el-skeleton-item variant="text" style="width: 30%; height:30px;"/>
                                            </div>
                                        </template>
                                    </el-skeleton>

                                    <li v-for="column in state.columnList">
                                        <a :href="column.url" v-if="column.linkMode == 2" target="_blank">{{column.name}}</a>
                                        <router-link tag="a" :to="'/'+column.url" v-else>{{column.name}}</router-link>
                                    </li>
                                </ul>
                            </div>
                            <div class="head-search">
                                <div class="form">
                                    <input v-model.trim="state.keyword" autocomplete="off" placeholder="搜索"  @keydown.enter="submitSearch">
                                    <i class="icon-container" @click="submitSearch">
                                        <Icon name="search" size="16px" class="icon" />
                                    </i>
                                </div>
                            </div>
                            <div class="menu">
                                <ul class="clearfix">
                                    <!-- 未登录-->
                                    <div v-if="$store.state.systemUser == null || Object.keys($store.state.systemUser).length==0">
                                        <li><router-link tag="a" to="/register" class="a-button">注册</router-link></li>
                                        <li><a  @click="loginLink" class="a-button">登录</a></li>

                                    </div>
                                     
                                    <!-- 已登录 -->
                                    <li v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0">
                                        <el-dropdown>
                                            <div class="message">
                                                <el-badge class="message-el-badge" :max="99" :value="state.unreadMessageCount" :hidden="state.unreadMessageCount ==0">
                                                    <el-icon size="26px" >
                                                        <BellFilled />
                                                    </el-icon>
                                                </el-badge>
                                            </div>
                                        
                                            <template #dropdown>
                                                <el-dropdown-menu>
                                                    <el-dropdown-item @click="router.push({path: '/user/control/privateMessageList'})"><i class="icomoon-icon" ><icon name="email" size="15px"/></i> 私信 <el-badge :max="99" :value="state.unreadMessage.privateMessageCount" :hidden="state.unreadMessage.privateMessageCount ==0" class="custom-el-badge"/></el-dropdown-item>
                                                    <el-dropdown-item @click="router.push({path: '/user/control/remindList'})"><i class="icomoon-icon" ><icon name="bell" size="15px"/></i> 提醒 <el-badge :max="99" :value="state.unreadMessage.remindCount" :hidden="state.unreadMessage.remindCount ==0" class="custom-el-badge"/></el-dropdown-item>
                                                    <el-dropdown-item @click="router.push({path: '/user/control/systemNotifyList'})"><i class="icomoon-icon" ><icon name="announcement" size="15px"/></i> 系统通知 <el-badge :max="99" :value="state.unreadMessage.systemNotifyCount" :hidden="state.unreadMessage.systemNotifyCount ==0" class="custom-el-badge"/></el-dropdown-item>
                                                </el-dropdown-menu>
                                            </template>
                                        </el-dropdown><router-link tag="a" to="/user/control/privateMessageList" class="a-pic"></router-link>
                                    </li>
                                    <li>
                                      
                                    <div class="author" v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0">
                                        <el-dropdown>
                                            <router-link tag="a" to="/user/control/home">
                                                <img v-if="$store.state.systemUser.avatarName != null" :src="$store.state.systemUser.avatarPath+'100x100/'+$store.state.systemUser.avatarName" >
                                                
                                                <span class="avatarImg" v-if="$store.state.systemUser.avatarName == null">
                                                    <span class="circle"><Icon name="user2" size="28px" class="icon"/></span>
                                                </span>
                                                <el-icon size="15px" class="arrow"><CaretBottom /></el-icon>
                                            </router-link>
                                        
                                            <template #dropdown>
                                                <el-dropdown-menu>
                                                    <el-dropdown-item icon="HomeFilled"  @click="toHome()"> 用户中心 </el-dropdown-item>
                                                    <el-dropdown-item icon="Avatar" @click="updateAvatarVisible = true"> 更换头像 </el-dropdown-item>
                                                    <el-dropdown-item icon="SwitchButton" divided  @mousedown.native="onLogout"> 退出 </el-dropdown-item>
                                                </el-dropdown-menu>
                                            </template>
                                        </el-dropdown>
                                    </div>
                                        
                                        
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-collapse-transition>

        <!--登录弹出窗口-->
        <el-dialog v-model="loginVisible" width="450px" draggable :close-on-click-modal="false" modal-class="dialog-overlay" class="login-popup">
            <!-- 登录 -->
            <Login  @closeDialog="receive_closeDialog"  :pop_up_window="true"/>
        </el-dialog>

        <!--更换头像弹出窗口-->
        <el-dialog v-model="updateAvatarVisible" width="612px" draggable :close-on-click-modal="false">
            <UpdateAvatar @updateAvatar="receive_updateAvatar"/>
        </el-dialog>
    </el-affix>

    

    
</template>


<script setup lang="ts">
    import { ref,getCurrentInstance, ComponentInternalInstance,reactive,onMounted,onUnmounted} from 'vue'
    import { ElAffix} from 'element-plus'
    import { Column,UnreadMessage } from "../types/index";
    import { AxiosResponse } from 'axios'
    import { appStore } from "../store";
    import { useRouter } from 'vue-router'
    import { processErrorInfo,generateRandom} from '../utils/tool';

    const store = appStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;

    //登录窗口
    const loginVisible = ref(false)
    //更换头像窗口
    const updateAvatarVisible = ref(false)

    //传递消息给父组件
    const emit = defineEmits(['unreadMessage','updateAvatar','sticky','floatWindow'])
    //页头动画
    const headerTransition = ref(true)


    //接收父组件消息
    const props = defineProps({
        sticky: {//是否使用浮动置顶
            type: Boolean,
            default: true
        }
    })  
   
    const state = reactive({
        columnList: [] as Column[],//栏目集合
        loading:true,//是否显示骨架屏
        unreadMessage:{
            privateMessageCount:0,
            systemNotifyCount:0,
            remindCount:0,
        } as UnreadMessage,
        unreadMessageCount:0,//未读消息总数

        timer:{} as any,//查询消息定时器

        keyword : '', //搜索关键词
    });


    //跳转用户中心
    const toHome = () => {
        router.push({path: '/user/control/home'});
    }


    
  
    //上次滚动位置
    let oldPosition: number = 0;

    const headerAffix = ref<InstanceType<typeof ElAffix>>();

    // 滚动容器的scroll事件的响应函数
    const onScroll = (value: { scrollTop: number, fixed: boolean }):void => {
        const rootElement = headerAffix.value?.$el as HTMLElement;
       
        for (let i: number = 0; i < rootElement.children.length; i++) {
            let node:Element = rootElement.children[i];
            
            if(!props.sticky){
                node.setAttribute("class","");//关闭浮动置顶功能
                return;
            }


            if(node.getAttribute("class")?.indexOf("el-affix--fixed") == 0){
                if(oldPosition < value.scrollTop && value.fixed && value.scrollTop >200){//如果向下滚动并且在浮动状态并且滚动200像素
                //if(oldPosition < value.scrollTop && value.fixed){//如果向下滚动并且在浮动状态
                    node.setAttribute("class","el-affix--fixed custom-el-affix--fixed--no");
                    headerTransition.value = false;//隐藏
                    //传递消息给父组件
                    emit('floatWindow',false);//浮动窗口
  
                }else{//显示
                    node.setAttribute("class","el-affix--fixed");
                    headerTransition.value = true;//显示
                    emit('floatWindow',true);//浮动窗口
                }
                
            }
            if(value.scrollTop == 0){
                headerTransition.value = true;//显示
                emit('floatWindow',true);//浮动窗口
                headerAffix.value?.update();
            }
            
        }
        oldPosition = value.scrollTop; 
    }

 

    //接收子组件消息
    const receive_updateAvatar = (updateAvatar:boolean) => {
        if(updateAvatar){//如果头像上传成功
            updateAvatarVisible.value = false;
            //传递消息给父组件
            emit('updateAvatar',updateAvatar);

            
            //改变‘用户信息版本’,让App.vue监听到变化后执行刷新登录用户信息
            store.commit('setUserInfoVersion', generateRandom());
        }
    }
   

    //查询未读消息
    const queryUnreadMessage = () => {
        if(store.state.systemUser != null && Object.keys(store.state.systemUser).length>0){//如果在登录状态
            proxy?.$axios({
                url: '/user/control/unreadMessageCount',
                method: 'get',
                params:  {},
                showLoading: false,//是否显示加载图标
                loadingMask:false,// 是否显示遮罩层
            })
            .then((response: AxiosResponse) => {
                if(response){
                    const result: any = response.data;
                    let resultValue = JSON.parse(result);
                    
                    state.unreadMessageCount = parseInt(resultValue.privateMessageCount) + parseInt(resultValue.remindCount) + parseInt(resultValue.systemNotifyCount);
                    state.unreadMessage.privateMessageCount = parseInt(resultValue.privateMessageCount);
                    state.unreadMessage.remindCount = parseInt(resultValue.remindCount);
                    state.unreadMessage.systemNotifyCount = parseInt(resultValue.systemNotifyCount);

                    //传递消息给父组件
                    emit('unreadMessage',state.unreadMessage);
                }
            })
            .catch((error: any) =>{
                console.log(error);
            });

        }
    }





    //查询栏目
    proxy?.$axios({
        url: '/columnList',
        method: 'get',
        params:  {
        },
        showLoading: false,//是否显示加载图标
        loadingMask:false,// 是否显示遮罩层
    })
    .then((response: AxiosResponse) => {
        return response?.data
    })
    .then((data: Column[]) => {
        state.loading = false;//关闭骨架屏
        state.columnList = data;
    })
    .catch((error: any) =>{
        console.log(error);
    });
    
   
    
    //会员退出登录
    const onLogout = () => {
        let formData = new FormData();
        proxy?.$axios({
            url: '/logout',
            method: 'post',
            data: formData
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
            
                if(JSON.parse(result.success)){//成功
                    let jumpUrl = result.jumpUrl;

                    //清理登录信息
                    window.localStorage.clear();//清空sessionStorage中所有信息

                    store.commit('setSystemUser', {});

                    if (jumpUrl != null) {
                        router.push(jumpUrl);
                    } else {
                        router.push("index");
                    }
                }else{
                    //处理错误信息
                    processErrorInfo(result.error as Map<string,string> , {},()=>{});

                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
            
    }

    //提交搜索
    const submitSearch = () =>  {
        if (state.keyword != null && state.keyword != "") {
            router.push({
                path : '/search',
                query : {
                    keyword : encodeURIComponent(state.keyword)
                }
            });
        }

    }

   
    //登录链接
    const loginLink = () =>  {
        let uri = router.currentRoute.value.path;
        if(uri == "/login"){//如果是登录页
            router.push("/login");
        }else{
            loginVisible.value = true;//弹出登录框
        }
    }

    //接收关闭登录弹窗子组件消息
    const receive_closeDialog = (isClose:boolean) => {
        loginVisible.value = isClose;
    }
   
     //定时查询消息
    const timerUnreadMessage = () =>  {
        queryUnreadMessage();
       
        state.timer = setTimeout(() =>{
            timerUnreadMessage();
        }, 15000);//15秒
    }

    onMounted(() => {
        timerUnreadMessage();

        let keyword:string = router.currentRoute.value.query.keyword != undefined ?router.currentRoute.value.query.keyword as string :'';
        if(router.currentRoute.value.path == "/search" && keyword != ''){
            state.keyword = decodeURIComponent(keyword)
        } 

    }) 

    //卸载组件实例后调用
    onUnmounted (()=>{
        clearTimeout(state.timer); //销毁
        state.timer = null
    })

</script>

<style scoped lang="scss">
    :deep(.custom-el-affix--fixed--no){
      //  position: static !important;
        pointer-events: none;
    }

    //遮罩层样式
    :deep(.dialog-overlay){
        background-color: rgba(0, 0, 0, 0.3);
    }

    //登录弹出框
    :deep(.login-popup){
        .el-dialog__header {
            padding: 25px 34px 0px;
        }
        .el-dialog__body {
            padding: 0px 34px 34px;
        }
        .el-dialog__headerbtn {
            top: 5px;
            right: 0px;
            font-size: 18px;
        }
    }
    
    
    
    .custom-el-badge{
        -webkit-transform:scale(0.9);
        transform:scale(0.9);
        position: relative;
        top: -3px;
        
        :deep(.el-badge__content){
            height: 16px !important;
           
        }
    }

    .icomoon-icon{
        margin-right: 4px;
        position: relative;
        top: 2px;
    }


    .headerModule {
        height: 70px;
        
        .shadow-container{
            height: 60px;
            background-color: #fff;
            box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
            .box {
                zoom: 1;
                height: 60px;
                width: 1210px;
                margin: 0 auto;
                
            
                :before, :after {
                    clear: both;
                    display: table;
                    content: "";
                    line-height: 0
                }

                .logo {
                    float: left;
                    position:relative;
                    top: 10px;
                }
                .nav {
                    float: left;
                    margin-left: 8px;
                    position: relative;
                    top: 18px;
                    ul li {
                        float: left
                    }

                    ul li a {
                        display: block;
                        margin-left: 25px;
                        color: $color-black-90;
                        font-size: 16px
                    }

                    ul li a:hover {
                        color:$color-blue-60;
                    }
                }
                .menu {
                    float: right;
                    margin-right: 8px;
                    ul li {
                        float: left;
                        font-size: 0;
                        a {
                            display: block;
                            margin-left: 18px;
                            color: $color-black-90;
                            font-size: 14px;
                            &:hover {
                                color:$color-blue-60;
                            }
                        }
                        
                        .a-button {
                            color:#3491FA;
                            outline: none;
                            display: inline-block;
                            padding: 1px 16px;
                            font-size: 14px;
                            line-height: 32px;
                            text-align: center;
                            cursor: pointer;
                            background: #E8F3FF;
                            border-radius: 3px;
                            margin: 0;
                            margin-left: 15px;
                            margin-top: 13px;
                            &:hover {
                                color:#57A9FB;
                            }
                        }
                        .message{
                            position:relative;
                            top: 17px;
                            margin-right: 13px;
                            color: $color-black-50;
                            cursor: pointer;

                            .el-icon{
                                :hover{
                                    color: $color-black-60;
                                }
                            }
                            .message-el-badge{
                                :deep(.el-badge__content){
                                    height: 16px !important;
                                
                                }
                            }
                        }
                        .author{
                            
                            margin-right: 14px;
                            color:$color-black-90;
                            display: inline-block;
                            img{
                                position:relative;
                                top: 12px;
                                width:36px;
                                height:36px;
                                -webkit-border-radius:50%;
                                -moz-border-radius:50%;
                                border-radius:50%;
                                display:block;
                            }
                            .avatarImg{
                                font-size: 0; 
                                position:relative;
                                top: 12px;
                                .circle{
                                    border-radius:100%;display: inline-block;
                                    width:36px;
                                    height:36px;
                                    position:relative;
                                    background: $color-black-20;
                                    .icon{
                                        margin-top: 3px; margin-left: 4px;color: $color-black-40;
                                    }
                                    &:hover{
                                        color: $color-black-40;
                                    }
                                }
                            }
                            .arrow{
                                position:relative;
                                top: -18px;
                                right: -38px;
                                color: $color-black-50;
                                cursor: pointer;

                                &:hover{
                                    color: $color-black-60;
                                }
                            }
                            
                        }
                        
                    }
                }
                .head-search {
                    float: left;
                    margin-left: 20px;
                    position: relative;
                    line-height: 49px;
                    .form{
                        width: 220px;
                        height: 32px;
                        background: $color-black-20;
                        border-radius: 3px;
                        margin-top: 14px;
                        position: relative;
                        input {
                            width: 176px;
                            height: 24px;
                            line-height: 22px;
                            background: none;
                            border: none;
                            color: $color-black-80;
                            padding-left: 12px;
                            font-size: 14px;
                            position: relative;
                            top: -7px;
                            &::-webkit-input-placeholder {
                                color: $color-black-60;
                            }
                            &:-moz-placeholder {
                                color: $color-black-60;
                            }
                            &:-ms-input-placeholder {
                            color: $color-black-60;
                            }
                        }
                        .icon-container {
                            width: 30px;
                            height: 30px;
                            position: absolute;
                            top: 0px;
                            right: 0px;
                            cursor:pointer;
                            .icon{
                                position: relative;
                                top: -4px;
                                left: 6px;
                                line-height: 30px;
                                color: $color-black-60;
                                
                                pointer-events:none;
                            }
                        }
                    }
                }

                /**
                .head-search {
                    float: left;
                    margin-left: 20px;
                    position: relative;
                    line-height: 49px
                }
                .head-search form {
                    width: 220px;
                    height: 32px;
                    background: $color-black-20;
                    border-radius: 3px;
                    float: left;
                    margin-top: 14px;
                    position: relative;
                    input {
                        width: 176px;
                        height: 24px;
                        line-height: 22px;
                        background: none;
                        border: none;
                        color: $color-black-80;
                        padding-left: 12px;
                        font-size: 14px;
                        position: relative;
                        top: -7px;
                        &::-webkit-input-placeholder {
                            color: $color-black-60;
                        }
                        &:-moz-placeholder {
                            color: $color-black-60;
                        }
                        &:-ms-input-placeholder {
                        color: $color-black-60;
                        }
                    }
                }
                .head-search form .sub-button {
                    width: 32px;
                    height: 32px;
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    text-indent: -999px;
                    cursor: pointer;
                    margin: 0px;
                }
                .head-search form .icon {
                    position: absolute;
                    top: -5px;
                    right: 7px;
                    color: $color-black-60;
                    pointer-events:none;
                } */
            }
        }
    }

</style>
