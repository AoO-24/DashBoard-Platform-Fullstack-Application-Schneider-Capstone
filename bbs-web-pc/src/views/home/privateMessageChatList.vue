<!-- 私信对话 -->
<template>
    <!-- 页头 -->
    <Header/>
    <!-- 服务导航 -->
    <ServiceNav/>

    <div class="main-container wrap backgroundModule privateMessageChatTop">
        <router-link tag="a" :to="{path:'/user/control/privateMessageList'}" class="back-to-list">
            <Icon name="arrow-left-s-line" size="16px" class="icon"/>返回私信列表
        </router-link>
        <div class="chatInfo">
            <b>与 
                <span class="cancelAccount" v-if="state.chatUser == null">此用户账号已注销</span>
                <router-link tag="a" v-if="state.chatUser != null" :to="{path:'/user/control/home',query:{userName:state.chatUser.userName}}" target="_blank" >
                    {{state.chatUser.account}}<span v-if="state.chatUser.nickname != null && state.chatUser.nickname != ''"> ({{state.chatUser.nickname}})</span>
                </router-link> 的对话</b>
        </div>
    </div>
    <div class="main">
        <div class="main-container wrap">
            <div class="recentlyChatUserModule">
                <div class="title"><h3>最近对话用户</h3></div>
                <ol class="recentlyChatUserList">
                    <div class="recentlyChatUser" v-for="recentlyChatUser in state.recentlyChatUserList">
                        <div class="author">
                            <router-link tag="a" :to="{path:'/user/control/privateMessageChatList',query:{friendUserName:recentlyChatUser.friendUserName}}" >
                                <img v-if="recentlyChatUser.friendAvatarName == null || recentlyChatUser.friendAvatarName == ''" :src="recentlyChatUser.friendAvatar" width="48" height="48" />
                            
                                <img v-if="recentlyChatUser.friendAvatarName != null && recentlyChatUser.friendAvatarName != ''" :src="recentlyChatUser.friendAvatarPath+'100x100/'+recentlyChatUser.friendAvatarName" width="48" height="48" class="avatar">
                                            
                            </router-link>
                        </div>
                        <div class="info">
                            <router-link tag="a" v-if="recentlyChatUser.friendNickname != null && recentlyChatUser.friendNickname != ''" :to="{path:'/user/control/privateMessageChatList',query:{friendUserName:recentlyChatUser.friendUserName}}" class="userName" :title="recentlyChatUser.friendNickname" >
                                {{recentlyChatUser.friendNickname}}
                            </router-link>
                            <router-link tag="a" v-if="(recentlyChatUser.friendNickname == null || recentlyChatUser.friendNickname == '') && (recentlyChatUser.friendAccount != null && recentlyChatUser.friendAccount != '')" :to="{path:'/user/control/privateMessageChatList',query:{friendUserName:recentlyChatUser.friendUserName}}" class="userName" :title="recentlyChatUser.friendAccount">
                                {{recentlyChatUser.friendAccount}}
                            </router-link>
                            <router-link tag="a" v-if="(recentlyChatUser.friendNickname == null || recentlyChatUser.friendNickname == '') && (recentlyChatUser.friendAccount == null || recentlyChatUser.friendAccount == '')" :to="{path:'/user/control/privateMessageChatList',query:{friendUserName:recentlyChatUser.friendUserName}}" class="userName">
                                <span class='cancelAccount'>此用户账号已注销</span>
                            </router-link>
                            
                        </div> 
                    </div>
                    <el-skeleton :loading="state.recentlyChatUser_loading" class="recentlyChatUser" style="width: 268px;" ></el-skeleton>
                </ol>
            </div>

            <div class="privateMessageChatRight">
                <div class="privateMessageChatModule">
                    <div class="clearfix"></div>
                    <div v-for="privateMessage in state.pageView.records">

                        <!--如果私信对方用户Id和发送者用户Id相同，则说明消息由对方所发 -->
                        <div class="friend" v-if="privateMessage.friendUserId == privateMessage.senderUserId">
                            <router-link tag="a" :to="{path:'/user/control/home',query:{userName:privateMessage.senderUserName}}" >
                                <img v-if="privateMessage.senderAvatarName != null && privateMessage.senderAvatarName != ''" :src="privateMessage.senderAvatarPath+'100x100/'+privateMessage.senderAvatarName" width="48" height="48">
                                <img v-if="privateMessage.senderAvatarName == null || privateMessage.senderAvatarName == ''" :src="privateMessage.senderAvatar" width="48" height="48">   
                            </router-link>
                            <div>
                                <span>
                                    <div class="time">{{privateMessage.sendTime}}</div>
                                    <i></i>
                                    <em v-html="privateMessage.messageContent"></em>
                                    <!-- 
                                    <a class="msg-del"></a> -->
                                </span>
                            </div>
                        </div>
                        <!--自己发的消息 -->
                        <div class="self" v-if="privateMessage.friendUserId != privateMessage.senderUserId">
                            <router-link tag="a" :to="{path:'/user/control/home',query:{userName:privateMessage.senderUserName}}" >
                                <img v-if="privateMessage.senderAvatarName != null && privateMessage.senderAvatarName != ''" :src="privateMessage.senderAvatarPath+'100x100/'+privateMessage.senderAvatarName" width="48" height="48">
                                <img v-if="privateMessage.senderAvatarName == null || privateMessage.senderAvatarName == ''" :src="privateMessage.senderAvatar" width="48" height="48">   
                            </router-link>

                            <div>
                                <span>
                                    <div class="time">{{privateMessage.sendTime}}</div>
                                    <i></i>
                                    <em v-html="privateMessage.messageContent"></em>
                                    <!-- 
                                    <a class="msg-del"></a> -->
                                </span>
                            </div>


                    
                        </div>
                    </div>
                    <el-skeleton :loading="state.loading" style="margin-top: 20px;"></el-skeleton>
                    <div class="page" v-if="state.isShowPage">
                        <el-pagination background @current-change="handlePage" :current-page="state.currentpage"  :page-size="state.maxresult" :total="state.totalrecord" layout="total, prev, pager, next,jumper" hide-on-single-page/>
                    </div>
                </div>
                
                <div class="privateMessageChatForm" v-if="form.allowSendPrivateMessage">

                    <el-form :model="form" ref="formRef" :rules="rules" class="form-container" size="large">
                        <el-form-item :error="error.messageContent" prop="messageContent">
                            <el-input v-model="form.messageContent" placeholder="我想说的话..." show-word-limit type="textarea" :autosize="{ minRows: 6 }"/>
                        </el-form-item>
                        <el-form-item :error="error.captchaValue" prop="captchaValue" v-if="form.showCaptcha" class="captcha-item">
                            <el-row>
                                <el-col :span="10" >
                                    <el-input v-model="form.captchaValue" class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                        <template #prefix>
                                            <Icon name="shield-check-line" size="16px"/>
                                        </template>
                                    </el-input>
                                </el-col>
                                <el-col :span="8" :offset="1">
                                    <el-image :src="form.imgUrl" @click="replaceCaptcha"/>
                                </el-col>
                                <el-col :span="4" :offset="1">
                                    <el-link type="primary" @click="replaceCaptcha" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @mousedown.native="onSubmit" :disabled="form.allowSubmit" style="width:130px">提交</el-button>
                        </el-form-item>
                    </el-form>


                </div>

            </div>

        </div>   
    </div>
    <!-- 页脚 -->
    <Footer/>
</template>


<script lang="ts" setup>
    import { getCurrentInstance, ComponentInternalInstance, reactive, onMounted, ref, computed} from 'vue'
    import { useMeta} from 'vue-meta'
    import { appStore } from "@/store";
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import Header from '@/components/Header.vue'
    import { AxiosResponse } from 'axios'
    import { PageView,PrivateMessage,User} from "@/types/index";
    import { letterAvatar } from '@/utils/letterAvatar';
    import { ElMessage, FormInstance } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '私信对话 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '私信对话 - ' + store.state.title
                },{
                    name: "description",
                    content: '私信对话 - ' + store.state.title
                }
            ]
        }))
    )

    const state = reactive({
        chatUser :{} as User,
        recentlyChatUserList: [] as Array<PrivateMessage>,//最近对话用户
        pageView: {} as PageView<PrivateMessage>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数     

        loading:true,//是否显示骨架屏
        recentlyChatUser_loading:true,//最近对话用户是否显示骨架屏
        isShowPage:false,//是否显示分页

    });

    const form = reactive({
        allowSendPrivateMessage:false,//是否允许发私信
        messageContent: '',//私信内容
        showCaptcha:false,//是否显示验证码
        captchaKey: '',//验证码key
        captchaValue: '',//验证码值
        imgUrl: '',//验证码图片
        allowSubmit:false,//提交按钮disabled状态

    });

    

    //错误
    const error = reactive({
        messageContent: '',//私信内容
        captchaValue: '',//验证码
    })

    //查询最近对话用户
    const queryRecentlyChatUser = () => {
        proxy?.$axios({
            url: '/user/control/privateMessageList',
            method: 'get',
            params:  {
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            const result: any = response.data;
          
            if(result.records != null && result.records.length >0){
                for(let i:number=0; i<result.records.length; i++){
                    let privateMessage = result.records[i];
                    if(privateMessage.friendNickname != null && privateMessage.friendNickname !=''){
                        privateMessage.friendAvatar = letterAvatar(privateMessage.friendNickname, 48);
                    }else{
                        privateMessage.friendAvatar = letterAvatar(privateMessage.friendAccount, 48);
                    }

                }
                 state.recentlyChatUserList = result.records;
            }

            state.recentlyChatUser_loading = false;//关闭骨架屏
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }


    //查询私信对话列表
    const queryPrivateMessageChatList = (friendUserName:string, page: number|null) => {
        proxy?.$axios({
            url: '/user/control/privateMessageChatList',
            method: 'get',
            params:  { 
                friendUserName:friendUserName,
                page: page,
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                state.chatUser = result.chatUser;
                state.pageView =  result.pageView;

                if(state.pageView.records != null && state.pageView.records.length >0){
                    for(let i:number=0; i<state.pageView.records.length; i++){
                        let privateMessage = state.pageView.records[i];
                        if(privateMessage.senderNickname != null && privateMessage.senderNickname !=''){
                            privateMessage.senderAvatar = letterAvatar(privateMessage.senderNickname, 48);
                        }else{
                            privateMessage.senderAvatar = letterAvatar(privateMessage.senderAccount, 48);
                        }

                    }
                }

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
    const handlePage = (page: number|null) => {
        let friendUserName:string = router.currentRoute.value.query.friendUserName != undefined ? router.currentRoute.value.query.friendUserName as string :'';
        
		router.push({
            path: '/user/control/privateMessageChatList', 
            query:{
                friendUserName : friendUserName,
                page : page
            }
		});
        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}


    //添加私信页
    const addPrivateMessageUI = (friendUserName:string) => {
        proxy?.$axios({
            url: '/user/control/addPrivateMessage',
            method: 'get',
            params:  {
                friendUserName:friendUserName
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
          
                let formCaptcha = result.formCaptcha;//验证码
                form.allowSendPrivateMessage = result.allowSendPrivateMessage;//是否允许发私信

                if (formCaptcha && formCaptcha.showCaptcha == true) {
                    form.showCaptcha = true;
                    form.captchaKey = formCaptcha.captchaKey;
                    replaceCaptcha();//刷新验证码
                }
            }
            
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //刷新验证码
    const replaceCaptcha = () => {
        form.imgUrl = store.state.apiUrl+"captcha/" + form.captchaKey + ".jpg?" + Math.random();

    }

    //校验验证码
    const checkCaptchaValue = (rule: any, value: any, callback: any) => {
        if(form.captchaKey != null && form.captchaKey != ''){
            if (value === '') {
                return callback(new Error('验证码不能为空'));
            }else{
                if (value.trim().length < 4) {
                    callback(new Error('验证码长度为4个字符'))
                } else {   
                    proxy?.$axios({
                        url: '/userVerification',
                        method: 'get',
                        params:  {
                            captchaKey:form.captchaKey,
                            captchaValue:form.captchaValue
                        }
                    })
                    .then((response: AxiosResponse) => {
                        if(response){
                            const result: any = response.data;
                            if(!JSON.parse(result)){
                                callback(new Error('验证码错误'))
                            }else{
                                callback();
                            }
                        }
                    }).catch((error: any) =>{
                        console.log(error);
                    });
                }

            }
        }
    }

    //校验规则
    const rules = reactive({
        messageContent: [{ required: true, message: '私信内容不能为空', trigger: 'blur'}],
        captchaValue: [{ validator: checkCaptchaValue, trigger: 'blur' }],

    })

    const formRef = ref<FormInstance>();

    //提交数据
    const onSubmit = () => {
        form.allowSubmit = true;//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            formRef.value?.validate((valid: boolean) => {
                if (valid) {
                    resolve();
                }else{
                    form.allowSubmit = false;//提交按钮disabled状态
                }
            })
            
        });

       
        Promise.all([p1])
            .then(() => {
                //清空error的属性值
                Object.keys(error).map(key => {
                    Object.assign(error, {[key] : ''});
                })
            

                let formData = new FormData();
                if(form.messageContent != null && form.messageContent.trim() != ''){
                    formData.append('messageContent', form.messageContent);
                }
                
                
                let friendUserName:string = router.currentRoute.value.query.friendUserName != undefined ? router.currentRoute.value.query.friendUserName as string :'';
                formData.append('friendUserName', friendUserName);

                //验证码Key
                formData.append('captchaKey', form.captchaKey);
                //验证码值
                if(form.captchaValue != ''){
                    formData.append('captchaValue', form.captchaValue.trim());
                }

                proxy?.$axios({
                    url: '/user/control/addPrivateMessage',
                    method: 'post',
                    data: formData,
                    //showLoading: false,//是否显示加载图标
                    loadingMask:false,// 是否显示遮罩层
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                    
                        if(JSON.parse(result.success)){
                            
                             ElMessage({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                            })

                            //清空表单
                            formRef.value?.resetFields();

                            //清空分页，会默认查询最后一页
                            handlePage(null);
                            init();
                        }else{
                            //处理错误信息
                            processErrorInfo(result.error as Map<string,string> , error,()=>{});
                            
                            if(result.captchaKey != null){
                                form.showCaptcha = true;
                                form.captchaKey = result.captchaKey;
                                replaceCaptcha();
                            }else{
                                form.showCaptcha = false;
                            }


                        }
                        form.allowSubmit = false;//提交按钮disabled状态
                    }
                })
                .catch((error: any) =>{
                    console.log(error);
                    form.allowSubmit = false;//提交按钮disabled状态
                });
            }).catch(() => {
                console.log("提交数据错误");
            });

    }

    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'privateMessageChatList'){
            let page:number|null = null;
            let friendUserName:string = '';
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            if(to.query.friendUserName != undefined){
                friendUserName = to.query.friendUserName as string;
            }
            queryPrivateMessageChatList(friendUserName,page);
            queryRecentlyChatUser();
            addPrivateMessageUI(friendUserName);
        }
        
        next();
    });
    
    onMounted(() => {
        init();
    }) 

     //初始化
    const init = () => {
		let friendUserName:string = router.currentRoute.value.query.friendUserName != undefined ? router.currentRoute.value.query.friendUserName as string :'';
        let page:number|null = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :null;
        
        queryPrivateMessageChatList(friendUserName,page);
        queryRecentlyChatUser();
        addPrivateMessageUI(friendUserName);
	}
    

</script>

<style scoped lang="scss">
.privateMessageChatTop{
    padding: 10px 0 10px 0px;
	line-height:46px;
	text-align: center;
	background: #fff;
    .back-to-list{
        position: absolute;
        font-size: 15px;
        color: $color-black-50;
        left: 50%;
        margin-left: -592px;
        
        .icon{
            position: relative;
            top: 3px;
            margin-right: 2px;
        }
        &:hover{
            color: $color-blue-60;
        }
    }
    .chatInfo{
        margin-left: 240px;
    }
    .cancelAccount{
        display: inline-block;
        vertical-align: middle;
        padding: 6px 6px;
        font-size: 14px;
        line-height: 14px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        color: $color-black-50;
        background-color: $color-black-10;
        font-weight:normal;
        position: relative;
        top: -1px;
    }
    b{
        display: inline-block;
        font-size: 15px;
        font-weight:normal;
        color: $color-black-60;
        a{
            font-weight:bold;
            color: $color-black-70;
            &:hover{
                color: $color-blue-60;
            }
        }
    }
}

.recentlyChatUserModule {
	display: inline; 
    float: left; 
    margin:10px 0px 0px 0px;
    border-radius: 1px; 
    width:280px; 
    background: #fff;
    box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
    .title {
        padding-top: 3px;
        border-bottom:1px solid $color-black-20;height: 46px;line-height: 46px;
         h3{
            margin-left: 15px;font-size: 15px;font-weight:700;color:$color-black-70;
            :before{
                display:inline-block;
                margin-right:8px;
                content:'';
                width:4px;
                height:22px;
                vertical-align:-6px;
                background-color:$color-blue-60;
            }
        }
    }
    .recentlyChatUserList{
        list-style:none;
        .recentlyChatUser{
            padding:8px 0 6px 6px;
            min-height: 54px;
        }
        .author{
            position:relative;
            color:#999;
            img{
                position:absolute;
                left:10px;
                -webkit-border-radius:50%;
                -moz-border-radius:50%;
                border-radius:50%;
                display:block;
            }
        }
        .info {
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            margin-right: 13px;
            .userName{
                font-style:normal;
                font-size: 15px;
                margin-left: 70px;
                line-height: 50px;
                color: $color-black-90;

               
            }
            .userName:hover{
                color: $color-blue-60;
            }
            .cancelAccount{
                font-style:normal; 
                display: inline-block;
                vertical-align: middle;
                padding: 6px 6px;
                font-size: 14px;
                line-height: 14px;
                -webkit-border-radius: 2px;
                -moz-border-radius: 2px;
                border-radius: 2px;
                color: $color-black-50;
                background-color: $color-black-10;
                font-weight:normal;
                position: relative;
                top: 0px;
            }
        }
        
    }
}
   
.privateMessageChatRight{
	display: inline; 
    float: right; 
    margin-top: 10px;
    width: 920px;

    .privateMessageChatModule {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        padding: 0px 10px 30px 10px;
        background: #fff;
        box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
        .friend{
            margin: 26px 52px 0 10px;
            position: relative;
            img{
                position: absolute;
                width: 64px;
                height: 64px;
                left: 0;
                top: 0;
                background: #fff;
                -webkit-border-radius:50%;
                -moz-border-radius:50%;
                border-radius:50%;
            }
             div{
                position: relative;
                margin-left: 64px;
                margin-right: 50px;
                text-align: initial;
                i{
                    position: absolute;
                    width: 24px;
                    height: 24px;
                    left: -24px;
                    top: 10px;
                    &:after{
                        content: "";
                        position: absolute;
                        border-style: solid;
                        border-color:  transparent #fafafa transparent transparent;
                        border-width: 10px;
                        left:5px;
                    }
                }
                span{
                    float: left;
                    min-height: 40px;
                    min-width: 96px;
                    margin-left: 24px;
                    margin-top:22px;
                    font-size: 15px;
                    border: 1px #fff solid;
                    background: #fafafa;
                    border-radius: 10px;
                    position: relative;
                    max-width: 94%;
                    em{
                       font-style: normal;
                        padding: 10px;
                        display: block;
                        white-space:normal; word-break:break-all; 
                    }
                }
            }
            .time{
                position:absolute;
                width:150px;
                line-height: 40px;
                display: inline-block;
                color: $color-black-50;
                font-size: 13px;
                top: -32px;
                left: -60px;
            }
            .msg-del{
                background: #ececec;
                color: #919191;
                border-radius: 12px;
                line-height: 20px;
                text-align: center;
                height: 20px;
                width: 20px;
                font-size: 15px;
                padding: 1px;
                top: -10px;
                right: -10px;
                position: absolute;
                &::before {
                    content: "\2716";
                }
                
            }
            .msg-del:hover {
                color: $color-blue-60;
            }
            &:after{
                content: "";
                display: block;
                height: 0;
                clear: both;
                visibility: hidden;
            }
        }
        .self{
            margin: 26px 10px 0 46px;
            position: relative;
            img{
                position: absolute;
                width: 64px;
                height: 64px;
                left: 0;
                top: 0;
                background: #fff;
                left: auto;
                right: 0;
                -webkit-border-radius:50%;
                -moz-border-radius:50%;
                border-radius:50%;
            }
            div{
                position: relative;
                text-align: initial;
                margin-left: 50px;
                margin-right: 82px;
                i{
                    position: absolute;
                    width: 24px;
                    height: 24px;
                    top: 10px;
                    left: auto;
                    right: -20px;
                    &:after{
                        content: "";
                        position: absolute;
                        border-style: solid;
                        border-color:  transparent transparent transparent #e5f3ff;
                        border-width: 10px;
                        left:5px;
                    }
                }
                
                span{
                    min-height: 40px;
                    min-width: 96px;
                    font-size: 15px;
                    border: 1px #fff solid;
                    border-radius: 10px;
                    position: relative;
                    max-width: 94%;
                    background: #e5f3ff;
                    border-color: #e5f3ff;
                    color: $color-blue-60;
                    float: right;
                    margin-top:22px;
                    margin-left: 0;
                    margin-right: 10px;
                    em{
                       font-style: normal;
                        padding: 10px;
                        display: block;
                        white-space:normal; word-break:break-all; 
                    }
                }
            }
            .time{
                position:absolute;
                width:150px;
                line-height: 40px;
                display: inline-block;
                color: $color-black-50;
                font-size: 13px;
                top: -32px;
                right: -100px;
            }
            .msg-del{
                background: #ececec;
                color: #919191;
                border-radius: 12px;
                line-height: 20px;
                text-align: center;
                height: 20px;
                width: 20px;
                font-size: 15px;
                padding: 1px;
                top: -10px;
                left: -10px;
                position: absolute;
                &::before {
                    content: "\2716";
                }
                
            }
            .msg-del:hover {
                color: $color-blue-60;
            }
            &:after{
                content: "";
                display: block;
                height: 0;
                clear: both;
                visibility: hidden;

            }

        }
        .page{
            margin-top: 50px;
            display: flex;
            justify-content: flex-end;
        }
    }
}


.privateMessageChatForm{
	margin-top: 10px;
	background: #fff;
	padding:15px 15px 1px 15px;
	box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);

    .form-container{
        //验证码错误提示单独一行
        :deep(.el-form-item__content) {
            line-height: normal;
        } 
        
        .captcha-item{
            .captchaInput{
                width: 130px;
            }
            :deep(.el-form-item__error){
                width: 100%;
            }
            .replaceCaptchaText{
                position: relative;
                top: 10px;
                user-select:none;
            }
        }
        
    }
}

  

    
    


</style>