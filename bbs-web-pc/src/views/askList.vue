<!--问答列表-->
<template>
    <!-- 页头 -->
    <Header @floatWindow="receive_floatWindow"/>

    <div class="main">
        <div class="main-container wrap main-fullScreen ">
            <div class="askListModule">
                <div class="left-container" >
                    
  
                    <div class="left-navigation" ref="headerNavigation">
                        <el-scrollbar ref="tagScrollbar" :max-height="state.tagScrollbarMaxHeight" wrap-style="transition: max-height 0.3s ease 0s;">
                            <div class="item">
                                <router-link tag="a" to="/askList" class="title" :class="router.currentRoute.value.query.questionTagId == undefined || router.currentRoute.value.query.questionTagId == '' ? 'active' :''">
                                    <div class="svg-container">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.0833 10.4998L21.2854 11.2211C21.5221 11.3632 21.5989 11.6703 21.4569 11.9071C21.4146 11.9774 21.3557 12.0363 21.2854 12.0786L11.9999 17.6498L2.71451 12.0786C2.47772 11.9365 2.40093 11.6294 2.54301 11.3926C2.58523 11.3222 2.64413 11.2633 2.71451 11.2211L3.9166 10.4998L11.9999 15.3498L20.0833 10.4998ZM20.0833 15.1998L21.2854 15.9211C21.5221 16.0632 21.5989 16.3703 21.4569 16.6071C21.4146 16.6774 21.3557 16.7363 21.2854 16.7786L12.5144 22.0411C12.1977 22.2311 11.8021 22.2311 11.4854 22.0411L2.71451 16.7786C2.47772 16.6365 2.40093 16.3294 2.54301 16.0926C2.58523 16.0222 2.64413 15.9633 2.71451 15.9211L3.9166 15.1998L11.9999 20.0498L20.0833 15.1998ZM12.5144 1.30852L21.2854 6.57108C21.5221 6.71315 21.5989 7.02028 21.4569 7.25707C21.4146 7.32745 21.3557 7.38635 21.2854 7.42857L11.9999 12.9998L2.71451 7.42857C2.47772 7.2865 2.40093 6.97937 2.54301 6.74258C2.58523 6.6722 2.64413 6.6133 2.71451 6.57108L11.4854 1.30852C11.8021 1.11851 12.1977 1.11851 12.5144 1.30852Z"></path></svg>
                                    </div>
                                    <div class="text">全部</div>
                                </router-link>
                        
                                <div class="childTitle"></div>
                            </div>
                            
                            <div class="item" v-for="tag in state.tagList">
                                <el-tooltip effect="tag-customized" :disabled="tagTooltipDisabled" :content="tag.name" placement="right">
                                    <router-link tag="a" v-if="tag.childNodeNumber ==0" @mouseenter="tagTooltip($event,tag.name)" :to="{path: '/askList', query:{ questionTagId : tag.id}}" class="title" :class="router.currentRoute.value.query.questionTagId == tag.id ? 'active' :''">
                                        <div class="svg-container">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"></path></svg>
                                        </div>
                                        <!-- cell 用js来判断text-overflow是否生效 -->
                                        <div class="text cell">{{tag.name}}</div>
                                    </router-link>
                                
                                    <a v-if="tag.childNodeNumber >0" @mouseenter="tagTooltip($event,tag.name)" class="title mouse">
                                        <div class="svg-container">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"></path></svg>
                                        </div>
                                        <div class="text cell">{{tag.name}}</div>
                                    </a>
                                </el-tooltip>
                                <div class="childTitle">
                                    <div v-for="childQuestionTag in tag.childTag" @mouseenter="tagTooltip($event,childQuestionTag.name)" >
                                        <el-tooltip effect="tag-customized" :disabled="tagTooltipDisabled" :content="childQuestionTag.name" placement="right">
                                            <!-- cell 用js来判断text-overflow是否生效 -->
                                            <router-link  :to="{path: '/askList', query: {questionTagId: childQuestionTag.id}}" class="childItem cell" :class="router.currentRoute.value.query.questionTagId == childQuestionTag.id ? 'active' :''" >{{childQuestionTag.name}}</router-link>            
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="middle-container">
                    <ul class="nav clearfix">
                        <li :class="(state.filterCondition == '' || state.filterCondition == '10') ? 'active' : ''">
                            <router-link :to="{path: '/askList'}" >最新</router-link>
                        </li>
                        <li :class="state.filterCondition == '20' ? 'active' : ''">
                            <router-link :to="{path: '/askList', query: {filterCondition: 20}}" >未解决</router-link>
                        </li>
                        <li :class="state.filterCondition == '30' ? 'active' : ''">
                            <router-link :to="{path: '/askList', query: {filterCondition: 30}}" >已解决</router-link>
                        </li>
                        <li :class="state.filterCondition == '40' ? 'active' : ''">
                            <router-link :to="{path: '/askList', query: {filterCondition: 40}}" >积分悬赏</router-link>
                        </li>
                        <li :class="state.filterCondition == '50' ? 'active' : ''">
                            <router-link :to="{path: '/askList', query: {filterCondition: 50}}" >现金悬赏</router-link>
                        </li>
                        <div class="postQuestionButton">
                            <el-button type="primary" @click="router.push({path: '/addQuestion'})" plain style="width: 100%;" ><Icon name="question-answer-line" size="15px" class="icon"/>提问题</el-button>  
                        </div>
                    </ul>
                    <div class="question-box">
                        <div class="questionList">
                            <div class="questionItem" v-for="question in state.pageView.records" >
                                <div class="avatarBox">
                                    <router-link tag="a" v-if="question.userName != null && question.userName != ''" class="avatarLink" :to="{path:'/user/control/home',query: {userName: question.userName}}" target="_blank">
                                        <img v-if="question.avatarName != null" :src="question.avatarPath+'100x100/'+question.avatarName" class="img">
                                        <img v-if="question.avatarName == null" :src="question.avatar" width="60" height="60" class="img"/>
                                        
                                    </router-link>
                                    <a class="avatarLink" v-if="question.userName == null || question.userName == ''">
                                        <img :src="question.avatar" width="60" height="60" class="img"/>
                                        
                                    </a>
                                </div>
                                
                                <div class="content clearfix">
                                    <ul class="info">
                                        <li>
                                            <router-link tag="a" class="userName" :to="{path:'/user/control/home',query: {userName: question.userName}}" target="_blank">
                                                {{question.nickname != null && question.nickname != '' ?question.nickname : question.account}}
                                            </router-link>
                                            <span v-if="question.account == null || question.account == ''" class='cancelNickname'>已注销</span>   
                                            <span class="userRoleName" v-for="roleName in question.userRoleNameList">{{roleName}}</span>
                                            <span class="staff" v-if="question.isStaff">官方人员</span>
                                            
                                            <span class="postTime">提问时间：{{question.postTime}}</span>
                                            <!--
                                            <span class="lastAnswerTime" v-if="question.lastAnswerTime != null">最新回复：{{question.lastAnswerTime}}</span>
                                            -->
                                            <span class="reward" v-if="parseFloat(question.amount) > 0 || Long.fromString(question.point).gt(0)">
                                                <span class="gradientMask"></span>
                                                <span class="rewardInfo" >
                                                    悬赏<template v-if="parseFloat(question.amount) >0">金额<span class="symbol">¥</span><span class="amount">{{question.amount}}</span>元 </template>
                                                    <span class="point" v-if="Long.fromString(question.point).gt(0)">{{question.point}}</span>积分
                                                </span>
                                                
                                            </span>
                                            
                                        </li>
                                    </ul>
                                    <h2 class="title clearfix">
                                        <span class="cancelAccount" v-if="question.account == null || question.account == ''">此用户账号已注销</span>
                                        <router-link tag="a" :to="{path:'/question',query: {questionId: question.id}}" target="_blank">
                                            {{question.title}}
                                        </router-link>
                                        <span class="questionTag" v-for="questionTag in question.questionTagAssociationList">{{questionTag.questionTagName}}</span>		
                                    </h2>
                                    <div class="clearfix"></div>
                                    <h2 class="summary">
                                        {{question.summary}}
                                    </h2>
                                </div>
                                
                                <div class="rank clearfix">
                                    <div :class="Long.fromString(question.adoptionAnswerId).gt(0) ? 'answers solve' : 'answers active'">
                                        <template v-if="Long.fromString(question.answerTotal).gte(1000000)">999K+</template> <!--超过1000000显示999k+  -->
                                        <template v-else-if="Long.fromString(question.answerTotal).gte(1000)">{{Math.floor(parseFloat(question.answerTotal)/1000)}}k</template> <!--向下取整 -->
                                        <template v-else>{{question.answerTotal}}</template>
                                        <small v-if="Long.fromString(question.adoptionAnswerId).gt(0)">回答</small>
                                        <small v-else>解决</small>
                                    </div>
                                    <div class="views">
                                        <template v-if="Long.fromString(question.viewTotal).gte(1000000)">999K+</template>  <!--超过1000000显示999k+  -->
                                        <template v-else-if="Long.fromString(question.viewTotal).gte(1000)">{{Math.floor(parseFloat(question.viewTotal)/1000)}}k</template> <!--向下取整  -->
                                        <template v-else>{{question.viewTotal}}</template>
                                        <small>浏览</small>
                                    </div>
                                </div>
                            </div>
                            <el-skeleton :loading="state.loading" style="padding-top: 25px;"></el-skeleton>
                            <div class="page" v-if="state.isShowPage">
                                <el-pagination background @current-change="handlePage" :current-page="state.currentpage"  :page-size="state.maxresult" :total="state.totalrecord" layout="total, prev, pager, next,jumper" />
                            </div>
                        </div>
                    </div>

                </div>
                <!--
                <div class="right-container">


                </div>-->
            </div>
        </div>
    </div>



    <!-- 回到顶部 -->
    <el-backtop :bottom="100" :visibility-height="100">
        <div>
            <Icon name="back-to-top" size="16px" />
        </div>
    </el-backtop>

    <!-- 页脚 -->
    <Footer/>
</template>

<script lang="ts" setup>
    import { onMounted, ref ,nextTick, getCurrentInstance, ComponentInternalInstance, reactive, computed, } from 'vue'
    import { appStore } from "@/store";
    import { useMeta} from 'vue-meta'
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import { PageView,Question,QuestionTag,} from "@/types/index";
    import { AxiosResponse } from 'axios';
    import { letterAvatar } from '@/utils/letterAvatar';
    import Long from "long";
    import * as extension from "@/utils/extension";
    import { isEllipsis } from '@/utils/tool';

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();

    const extensionFunction = extension;

    //标签导航
    const headerNavigation = ref();

    //标签提示是否禁用
    const tagTooltipDisabled = ref(true)
    //标签滚动条
    const tagScrollbar = ref()

    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '问答 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '问答 - ' + store.state.keywords
                },{
                    name: "description",
                    content: '问答 - ' + store.state.description
                }
            ]
        }))
    )

    const state = reactive({
        tagList:[] as Array<QuestionTag>,//标签 
        pageView: {} as PageView<Question>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数  
        questionTagId :'',//标签Id
		questionTagName :'',//标签名称
		filterCondition:'' as string,//过滤条件
        loading:true,//是否显示骨架屏
        isShowPage:false,//是否显示分页

        tagScrollbarMaxHeight:"calc(100vh - 186px)"
    });




    //接收子组件消息
    const receive_floatWindow = (floatWindow:boolean) => {
        if(floatWindow){//窗口浮动
            headerNavigation.value.setAttribute('style', '');
        //    headerNavigation.value.querySelector('.el-scrollbar__wrap').setAttribute('style', 'transition: max-height 0.3s ease 0s;');
            state.tagScrollbarMaxHeight = "calc(100vh - 186px)";
            tagScrollbar.value.update();
        }else{
          //  headerNavigation.value.setAttribute('style', 'top: 10px;max-height: calc(100% - 110px);');
            headerNavigation.value.setAttribute('style', 'top: 10px');
            state.tagScrollbarMaxHeight = "calc(100vh - 126px)";
         //   headerNavigation.value.querySelector('.el-scrollbar__wrap').setAttribute('style', 'transition: max-height 0.3s ease 0s;');

            tagScrollbar.value.update();
        }
    }
   
    //鼠标经过显示标签提示
    const tagTooltip = (event: MouseEvent,tagName:string) => {

        let flag = isEllipsis(event);
        if(flag){
            tagTooltipDisabled.value = false;
        }else{
            tagTooltipDisabled.value = true;
        }
        
    }


    
    

    //查询所有问题标签
    const queryTagList = () => {
        proxy?.$axios({
            url: '/queryAllQuestionTag',
            method: 'get',
            params:  {},
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: Array<QuestionTag>) => {
           

            if (data != null && data.length > 0) {
                for (let i= 0; i < data.length; i++) {
                    let questionTag = data[i];
                    if(state.questionTagId == questionTag.id){
                        state.questionTagName = questionTag.name;
                        break;
                    }
                    if (questionTag.childTag != null && questionTag.childTag.length > 0) {
                        for (let j = 0; j < questionTag.childTag.length; j++) {
                            let childQuestionTag = questionTag.childTag[j];
                            if(state.questionTagId == childQuestionTag.id){
                                state.questionTagName = childQuestionTag.name;
                                break;
                            }
                        }
                        
                    }
                }
            }

            state.tagList = data;
            
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //查询问题列表
    const queryQuestionList = (questionTagId:string,filterCondition:string,page: number) => {
        let param = {} as any
        if(questionTagId){
			param.questionTagId = questionTagId
		}
        if(filterCondition){
			param.filterCondition = filterCondition
		}
        if(page){
            param.page = page
        }
        
        proxy?.$axios({
            url: '/queryQuestionList',
            method: 'get',
            params:  param,
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: PageView<Question>) => {

            state.loading = false;//关闭骨架屏
            if(data.records != null && data.records.length >0){
                for(let i:number=0; i<data.records.length; i++){
                    let question = data.records[i];
                    if(question.nickname != null && question.nickname !=''){
                        question.avatar = letterAvatar(question.nickname, 60);
                    }else{
                        question.avatar = letterAvatar(question.account, 60);
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
        let questionTagId:string = router.currentRoute.value.query.questionTagId != undefined ?router.currentRoute.value.query.questionTagId as string :'';
        let filterCondition:string | number = router.currentRoute.value.query.filterCondition != undefined ?router.currentRoute.value.query.filterCondition as string :'';
        let param = {} as any
        if(questionTagId){
			param.questionTagId = questionTagId
		}
        if(filterCondition){
			param.filterCondition = filterCondition
		}
        if(page){
            param.page = page
        }

		router.push({
            path: '/askList', 
            query:param
		});

        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}


     //导航守卫
     onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'askList'){
            let page:number = 1;
            let questionTagId:string = '';
            let filterCondition:string = '';
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            if(to.query.questionTagId != undefined){
                questionTagId = to.query.questionTagId as string
            }
            if(to.query.filterCondition != undefined){
                filterCondition = to.query.filterCondition as string
            }
            state.filterCondition = filterCondition;
            queryTagList();
            queryQuestionList(questionTagId,filterCondition,page)
        }
        
        next();
    });

    onMounted(() => {
        let page:number = (router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != '') ? parseInt(router.currentRoute.value.query.page as string) :1;

        let questionTagId:string = router.currentRoute.value.query.questionTagId != undefined ?router.currentRoute.value.query.questionTagId as string :'';
        let filterCondition:string = router.currentRoute.value.query.filterCondition != undefined ?router.currentRoute.value.query.filterCondition as string :'';
        state.filterCondition = filterCondition;
        queryTagList();
        queryQuestionList(questionTagId,filterCondition,page)
    }) 
</script>

<style scoped lang="scss">


.askListModule{
    display: flex;
    .left-container{
        width: 180px;
        margin-right: 10px;
        .left-navigation{
            width: 180px;
            background: #fff;
         //   padding: 8px;
            padding: 8px 0px 8px 0px;
            box-sizing: border-box;
            border-radius: 2px;
         //   max-height: calc(100vh - 200px);
            box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
           // overflow: auto;
            position: fixed;
            top:70px;
            transition: top 0.3s ease 0s;

           // scrollbar-gutter: stable;
           /**
            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
                background: transparent;
                //display: none;
            }

            &::-webkit-scrollbar-thumb {
                background: transparent;
                border-radius: 4px
            }

            &:hover::-webkit-scrollbar-thumb {
                background: hsla(0,0%,60%,.3)
            } */

            
            .item{
                display: block;
                margin-bottom: 2px;
                padding: 0px 8px 0px 8px;
                .title{
                    padding: 0 12px;
                    color: $color-black-80;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    height: 44px;
                    
                    font-size: 16px;
                    transition: color .3s;
                    .text{
                        overflow:hidden;
                        text-overflow:ellipsis; 
                        white-space:nowrap;
                    }
                    
                    .svg-container{
                        position: relative;
                        top: 3px;
                        svg {
                            fill: $color-black-50;
                            margin-right: 10px;
                            transition: fill .3s;
                            width: 18px;
                            height: 18px;
                        }
                    }
                    
                    &:hover {
                        color: #20a0ff;
                        background: #e8f3ff;
                    }

                    &:hover svg {
                        fill: #20a0ff;
                    }
                }
                .mouse{
                    cursor:default;
                    &:hover {
                        color: $color-black-80;
                        background: #fff;
                    }

                    &:hover svg {
                        fill: $color-black-50;
                    }
                }
                .title.active{
                    color: #20a0ff;
                    background: #e8f3ff !important;
                    svg{
                        fill: #20a0ff;
                    }
                }
            }
            .childTitle{
                .childItem {
                    display: block;
                    cursor: pointer;
                    font-size: 14px;
                    line-height: 44px;
                    color: $color-black-60;
                    padding-left: 38px;
                    transition: color .3s;
                    border-radius: 4px;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                   // word-break: break-all;
                    &:hover {
                        color: #20a0ff;
                        background: #e8f3ff;
                    }
                }
                .childItem.active {
                    color: #20a0ff !important;
                    background: #e8f3ff !important
                }
            }
        }
    }
    .middle-container{
        flex: 1;
     //  flex-shrink: 0;

        .nav {
            margin-bottom: 0;
            padding-left: 0;
            list-style: none;
            >li {
                position: relative;
                display: block;
                float: left;
                margin-bottom: -1px;
                >a {
                    position: relative;
                    display: block;
                    padding: 10px 15px;
                    margin-right: 2px;
                    line-height: 1.42857143;
                    border: 1px solid transparent;
                    border-radius: 3px 3px 0 0;
                    font-size: 15px;
                    color: $color-black-60;
                    &:hover {
                        border-color: #EDEEF1 #EDEEF1 #fff;
                        color: #1890ff;
                    }
                    &:focus,&:hover {
                        text-decoration: none;
                        background-color: #EDEEF1;
                    }
                    >img {
                        max-width: none
                    }
                }
            }
            .active{
                a,a:focus,a:hover {
                    color: $color-black-80;
                    background-color: #fff;
                    border: 1px solid #EDEEF1;
                    border-bottom-color: transparent;
                    cursor: default;
                    border-color: #fff;
                    cursor: default; 
                    box-shadow: 4px 0 3px -4px rgba(0,0,0,.06) , /*左边阴影*/
                                /*0 4px 3px -4px #fff, 顶部阴影*/
                                0 -4px 3px -4px rgba(0,0,0,.06) , /*底部阴影*/
                                -4px 0 3px -4px rgba(0,0,0,.06); /*右边阴影*/
                }
            }
            .postQuestionButton{
                float: right;
                width: 100px;
                .icon{
                    position: relative;
                    top: 0px;
                    right: 5px;
                    margin-left: 5px;
                    font-size: 16px;
                }
            }
        }
        .question-box{
            background:#fff;
            padding:0px 15px 15px 15px;
            box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
            .questionList {
                .questionItem {
                    margin: 0;
                    border-bottom: 1px solid $color-black-20;
                    padding: 15px 0 10px 0;
                    position: relative;
                    min-height: 90px;
                    .avatarBox {
                        position: relative;
                        margin-left: 0;
                        margin-right:10px;
                        padding: 0;
                        float: left;
                        .avatarLink {
                            display: block;
                            position: relative;
                            float: left;
                            padding-left: 6px;
                            img {
                                float: none;
                                display: block;
                                width: 60px;
                                height: 60px;
                                float: left;
                                margin-right: 10px;
                                border-radius:60px;
                                position:relative;
                            }
                        }
                    }
                    .content {
                        /**
                        overflow: auto;
                        overflow-x: hidden;**/
                        margin-left:90px;
                        margin-right:160px;
                        .info {
                            margin-bottom: 8px;
                            color: $color-black-40;
                            padding-left: 0;
                            list-style: none;
                            margin-left: -5px;
                            font-size:0;/*父级元素设置font-size:0; 解决 display：inline-block两个元素之间的默认空格 */
                            >li{
                                display: inline-block;
                                padding-left: 5px;
                                padding-right: 5px
                            }
                            .userName{
                                color: $color-black-60;
                                font-size: 14px;
                                display: inline-block;
                                margin-right: 4px;
                            }
                            .cancelNickname{
                                font-weight:normal;
                                margin-right: 3px;
                                color: transparent;
                                text-shadow: 0 0 5px rgba(0,0,0,0.4);
                                font-size: 14px;
                                zoom: 1;
                                user-select:none;
                            }
                            .userRoleName{
                                display: inline-block;
                                white-space:nowrap;
                                vertical-align: middle;
                                padding: 2px 4px;
                                margin-left:5px;
                                font-size: 12px;
                                line-height: 14px;
                                -webkit-border-radius: 2px;
                                -moz-border-radius: 2px;
                                border-radius: 2px;
                                color:#e2b46e;
                                background-color:#f8e7c4;
                                position: relative;
                                top: -5px;
                            }
                            .staff{
                                display: inline-block;
                                white-space:nowrap;
                                vertical-align: middle;
                                padding: 2px 4px;
                                margin-left:5px;
                                font-size: 12px;
                                line-height: 14px;
                                -webkit-border-radius: 2px;
                                -moz-border-radius: 2px;
                                border-radius: 2px;
                                color:#4CD263;
                                background-color:#cafcc7;
                                position: relative;
                                top: -5px;
                            }
                            .postTime{
                                margin-left: 10px;
                                font-size: 14px;
                            }
                            .lastAnswerTime{
                                margin-left: 10px;
                                font-size: 14px;
                            }
                            .reward{
                                display: inline-block;
                                vertical-align: middle;
                                background: #fcf3e6;
                                border-radius:2px;
                                padding: 5px 8px;
                                margin-left: 6px;
                                position: relative;
                                top: -5px;

                                @keyframes maskBackground {
                                    0% {
                                        background-position: 0px 0;
                                    }
                                    100% {
                                        background-position: 100em 0;
                                    }
                                }
                                .gradientMask{
                                    animation-duration: 15s;
                                    animation-fill-mode: forwards;
                                    animation-iteration-count: infinite;
                                    animation-name: maskBackground;
                                    animation-timing-function: linear;
                                    background: linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 80%,rgba(255,255,255,0.3) 100%);
                                    transform: skewX(-30deg);
                                    font-size: 14px;
                                    position: absolute;
                                    left:0;
                                    right:0;
                                    top:0;
                                    bottom:0;
                                }
                                .rewardInfo{
                                    color: #e2b46d;font-size: 14px;line-height: 14px;
                                    .symbol{
                                        font-family:Arial;font-weight:normal; margin-left: 5px;color: #cca558;
                                    }
                                    .amount{
                                        margin-left: 1px;color: #cca558; margin-right: 5px;
                                    }
                                    .point{
                                        color: #cca558; margin-right: 5px;
                                    }
                                }
                            }
                        }
                        .title {
                            font-weight:600;
                            margin: 0 5px 0 0;
                            font-size: 18px;
                            line-height: 28px;
                            font-weight: normal;
                            .cancelAccount{
                                display: inline-block;
                                vertical-align: middle;
                                padding: 4px 6px 4px 6px;
                                font-size: 14px;
                                line-height: 20px;
                                -webkit-border-radius: 2px;
                                -moz-border-radius: 2px;
                                border-radius: 2px;
                                color: $color-black-50;
                                background-color: $color-black-10;
                                font-weight:100;
                                position:relative;/** 这两行让标签上移 **/
                                top:-1px;
                            }
                            a{
                                color: $color-black-90;
                                margin-right: 5px;
                                &:hover {
                                    text-decoration: none;
                                    color: #1890ff;
                                }
                            }
                            .questionTag{
                                display: inline-block;
                                font-size: 14px;
                                line-height: 18px;
                                padding: 3px 6px 3px 6px;
                                margin-right: 5px;
                                border-radius: 3px;
                                color: #20a0ff;
                                background-color: #E8F3FF;
                                position:relative;
                                font-weight:100;
                                position:relative;/** 这两行让标签上移 **/
                                top:-1px;
                                &:hover {
                                    background-color: #d8edff;
                                    color: #1890ff;
                                    text-decoration: none;
                                }
                            }
                        }
                        .summary{
                            margin: 3px 5px 0 0;
                            font-size: 15px;
                            line-height: 28px;
                            font-weight:normal;
                            text-decoration:none;
                            color: $color-black-60;
                        }
                    }
                    .rank {
                        position:absolute;
                        top:30px;
                        right:0px;
                        font-size: 16px;
                        text-align: center;
                        line-height: 16px;
                        small {
                            display: block;
                            font-size: 12px;
                            margin-top: 1px;
                            font-weight: normal;
                        }
                        .answers,.views{
                            display: inline-block;
                            padding-top: 12px;
                            margin-left:12px;
                            width: 60px;
                            height: 42px;
                            -moz-border-radius: 1px;
                            -webkit-border-radius: 1px;
                            border-radius: 3px;
                        }
                        .answers {
                            color: #20a0ff;
                            background: #E8F3FF;
                            border: none
                        }
                        .views {
                            background-color: $color-black-20;
                            border-color: $color-black-20;
                            color: $color-black-60;
                        }
                        .solve {
                            background: #20a0ff;
                            border: none;
                            color: #fff;
                        }
                    }

                }
            }
        }
        .page{
            padding-top: 50px;
            margin-bottom: 30px;
            display: flex;
            justify-content: flex-end;
            background: #fff;
        }

    }
    .right-container{
        width: 260px;
        background: #e2b46d
    }
}
</style>