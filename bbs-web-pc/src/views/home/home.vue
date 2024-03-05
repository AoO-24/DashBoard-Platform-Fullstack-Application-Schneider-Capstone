<!-- 用户中心页 -->
<template>
    <!-- 页头 -->
    <Header @unreadMessage="receive_unreadMessage"/>
    <div class="main">
                           
        <div class="main-container wrap">
            <div class="homeModule" >
                <el-empty description="用户信息不存在或已隐藏" v-if="Object.keys(state.user).length == 0"/>
                
                <div v-if="Object.keys(state.user).length > 0" class="user-home-header" >
                    <div class="avatarRing"></div>
                    <div class="inner clearfix">
                        <div class="avatar">
                            <div class="img-box">
                               
                                <img v-if="state.user.avatarName != null" :src="state.user.avatarPath+''+state.user.avatarName">
                               
                                <img v-if="state.user.avatarName == null" :src="state.avatar" width="140" height="140">
				         	
                            </div>
                            <div class="counts clearfix">
                                <div class="point">
                                    <div class="num">
                                        <span v-if="state.user.point != null">
                                            <span v-if="Long.fromString(state.user.point).gt(999999)">{{state.user.point}}+</span>
                                            <span v-if="Long.fromString(state.user.point).lte(999999)">{{state.user.point}}</span>
                                        </span>
                                        <span v-if="state.user.point == null">0</span>
                                    </div>
                                    <div class="sub">积分</div>
                                </div>
                                <div class="follows">
                                    <div id="followerCount" class="num">
                                        <span v-if="Long.fromString(state.followerCount).gt(999999)">{{state.followerCount}}+</span>
                                        <span v-if="Long.fromString(state.followerCount).lte(999999)">{{state.followerCount}}</span>
                                    </div>
                                    <div class="sub" >粉丝</div>
                                </div>
                                
                            </div>
                        </div>
                        <div class="head-line">
                            <div class="name">{{state.user.account}}</div>
                            <div class="grade" v-if="state.user.gradeName != null">{{state.user.gradeName}}</div> 
                        </div>
                        <div class="nickname" v-if="state.user.nickname != null && state.user.nickname != ''">
                            <span class="nicknameLabel">呢称：</span>{{state.user.nickname}}
                        </div> 
                        <div class="role">
                            <i class="userRoleName" v-for="roleName in state.user.userRoleNameList" >{{roleName}}</i>	
                        </div>
                        <div class="ipAddress" v-if="state.user.ipAddress != null && state.user.ipAddress != ''">
                            <span><Icon name="map-pin-line" size="16px" class="icon"/>{{state.user.ipAddress}}</span>
                        </div> 
                        <div class="clearfix"></div>
                        <div class="action-button" v-if="state.user.userName != null && state.user.userName != $store.state.systemUser.userName">
                           
						    <!-- 关注用户 -->
                            <span class="action-followBox" >
                                <el-button type="primary" @click="addFollow(state.user.userName)">{{state.followText}}</el-button>
                            </span>
						
                            <span class="privateMessageBox" >
                                 <el-button type="primary" plain @click="toPrivateMessage(state.user.userName)">发私信</el-button>
                            </span>
					
                        </div>
                    </div>						
                </div>

                          
                <div v-if="Object.keys(state.user).length > 0 && $store.state.systemUser != null && Object.keys($store.state.systemUser).length > 0 && state.user.userName == $store.state.systemUser.userName" class="selfService clearfix">
                    <div class="box">
                        <ul class="ul">
                            <li class="item">
                                <router-link tag="a" to="/user/control/userDynamicList" class="a-pic">
                                    <div class="img"><Icon name="pulse" size="48px"/></div>
                                    <h4 class="title">我的动态</h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/topicList" class="a-pic">
                                    <div class="img" ><Icon name="topic" size="48px"/></div> 	
                                    <h4 class="title">我的话题</h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/commentList" class="a-pic">
                                    <div class="img" ><Icon name="comment" size="48px"/></div> 	
                                    <h4 class="title">我的评论</h4>
                                </router-link>
                            </li>
                            <li class="item" >
                                <router-link tag="a" to="/user/control/replyList" class="a-pic">
                                    <div class="img"><Icon name="reply" size="48px"/></div> 
                                    <h4 class="title">我的回复</h4>	
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/questionList" class="a-pic">
                                    <div class="img" ><Icon name="question-answer-line" size="48px"/></div> 
                                    <h4 class="title">我的问题</h4>	
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/answerList" class="a-pic">
                                    <div class="img" ><Icon name="info-alt" size="48px"/></div> 	
                                    <h4 class="title">我的答案</h4>
                                </router-link>
                            </li>
                            <li class="item" >
                                <router-link tag="a" to="/user/control/answerReplyList" class="a-pic">
                                    <div class="img" ><Icon name="reply" size="48px"/></div> 	
                                    <h4 class="title">我的答案回复</h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/favoriteList" class="a-pic">
                                    <div class="img" ><Icon name="favorites" size="48px"/></div> 	
                                    <h4 class="title">收藏夹</h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/likeList" class="a-pic">
                                    <div class="img" ><Icon name="thumb-up" size="48px"/></div> 	
                                    <h4 class="title">点赞</h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/followList" class="a-pic">
                                    <div class="img" ><Icon name="heart" size="48px"/></div> 	
                                    <h4 class="title">关注</h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/followerList" class="a-pic">
                                    <div class="img" ><Icon name="follower" size="48px"/></div> 	
                                    <h4 class="title">粉丝</h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/privateMessageList" class="a-pic">
                                    <el-badge :value="state.unreadMessage.privateMessageCount" :hidden="state.unreadMessage.privateMessageCount ==0" :max="99" class="badge">
                                        <div class="img" ><Icon name="email" size="48px"/></div> 
                                    </el-badge>
                                    <h4 class="title">私信 </h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/remindList" class="a-pic">
                                    <el-badge :value="state.unreadMessage.remindCount" :hidden="state.unreadMessage.remindCount ==0" :max="99" class="badge">
                                        <div class="img" ><Icon name="bell" size="48px"/></div> 
                                    </el-badge>	
                                    <h4 class="title">提醒</h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/systemNotifyList" class="a-pic">
                                    <el-badge :value="state.unreadMessage.systemNotifyCount" :hidden="state.unreadMessage.systemNotifyCount ==0" :max="99" class="badge">
                                        <div class="img" ><Icon name="announcement" size="48px"/></div> 
                                    </el-badge>	
                                    <h4 class="title">系统通知</h4>	
                                </router-link>
                            </li>
                            <li class="item" onclick="">
                                <router-link tag="a" to="/user/control/membershipCardOrderList" class="a-pic">
                                    <div class="img" ><Icon name="order" size="48px"/></div> 	
                                    <h4 class="title">会员卡订单</h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/balance" class="a-pic">
                                    <div class="img" ><Icon name="deposit" size="48px"/></div> 	
                                    <h4 class="title">余额</h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/giveRedEnvelopeList" class="a-pic">
                                    <div class="img" ><Icon name="redEnvelope-2" size="48px"/></div> 
                                    <h4 class="title">发红包</h4>	
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/receiveRedEnvelopeList" class="a-pic">
                                    <div class="img" ><Icon name="redEnvelope-2" size="48px"/></div> 
                                    <h4 class="title">收红包</h4>	
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/editUser" class="a-pic">
                                    <div class="img" ><Icon name="pencil-alt" size="48px"/></div> 
                                    <h4 class="title">修改个人资料</h4>	
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/realNameAuthentication" class="a-pic">
                                    <div class="img" ><Icon name="realNameAuthentication" size="48px"/></div> 
                                    <h4 class="title">实名认证</h4>	
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/reportList" class="a-pic">
                                    <div class="img" ><Icon name="error-warning-line" size="48px"/></div> 	
                                    <h4 class="title">举报</h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/point" class="a-pic">
                                    <div class="img" ><Icon name="point" size="48px"/></div> 	
                                    <h4 class="title">积分日志</h4>
                                </router-link>
                            </li>
                            <li class="item">
                                <router-link tag="a" to="/user/control/userLoginLogList" class="a-pic">
                                    <div class="img" ><Icon name="log" size="48px"/></div> 	
                                    <h4 class="title">登录日志</h4>
                                </router-link>
                            </li>

                            
                        </ul>
                    </div>

                </div>

            </div>
            <div class="userDynamicModule" v-if="state.pageView.records != undefined && state.pageView.records != null && state.pageView.records.length >0">
                <ol class="userDynamicList">
                    <div class="userDynamic" v-for="(userDynamic,index) in state.pageView.records" :key="userDynamic.id" >
                        <div class="userDynamic-author">
                            <router-link tag="a" class="avatarLink" :to="{path:'/user/control/home',query: {userName: userDynamic.userName}}" target="_blank">
                                    <img v-if="userDynamic.avatarName != null" :src="userDynamic.avatarPath+'100x100/'+userDynamic.avatarName" class="img">
                                    <img v-if="userDynamic.avatarName == null" :src="userDynamic.avatar" width="72" height="72" class="img"/>      
                            </router-link>
							<cite>
                                <router-link tag="a" class="userName" :to="{path:'/user/control/home',query: {userName: userDynamic.userName}}" target="_blank">
                                    {{userDynamic.nickname != null && userDynamic.nickname != '' ?userDynamic.nickname : userDynamic.account}}
                                </router-link>
							</cite> 
						</div>
						<div class="userDynamicTime">{{userDynamic.postTime}}</div>
                        <div class="topicTitle">
                            <template v-if="userDynamic.module == 100">
                                <span class="info">发表了话题</span>
                                <router-link tag="a" :to="{path:'/thread',query: {topicId: userDynamic.topicId}}" >
                                    {{userDynamic.topicTitle}}
                                </router-link>
                            </template>
                            <template v-if="userDynamic.module == 200">
                                <span class="info">评论了话题</span>
                                <router-link tag="a" :to="{path:'/thread',query: {topicId: userDynamic.topicId}}" >
                                    {{userDynamic.topicTitle}}
                                </router-link>
                            </template>
                            <template v-if="userDynamic.module == 300">
                                <span class="info">引用了话题</span>
                                <router-link tag="a" :to="{path:'/thread',query: {topicId: userDynamic.topicId}}" >
                                    {{userDynamic.topicTitle}}
                                </router-link>
                            </template>
                            <template v-if="userDynamic.module == 400">
                                <span class="info">回复了话题</span>
                                <router-link tag="a" :to="{path:'/thread',query: {topicId: userDynamic.topicId}}" >
                                    {{userDynamic.topicTitle}}
                                </router-link>
                            </template>
                            <template v-if="userDynamic.module == 500">
                                <span class="info">提交了问题</span>
                                <router-link tag="a" :to="{path:'/question',query: {questionId: userDynamic.questionId}}" >
                                    {{userDynamic.questionTitle}}
                                </router-link>
                            </template>
                            <template v-if="userDynamic.module == 600">
                                <span class="info">回答了问题</span>
                                <router-link tag="a" :to="{path:'/question',query: {questionId: userDynamic.questionId}}" >
                                    {{userDynamic.questionTitle}}
                                </router-link>
                            </template>
                            <template v-if="userDynamic.module == 700">
                                <span class="info">回复了问题</span>
                                <router-link tag="a" :to="{path:'/question',query: {questionId: userDynamic.questionId}}" >
                                    {{userDynamic.questionTitle}}
                                </router-link>
                            </template>
							<i class="userRoleName" v-for="roleName in userDynamic.allowRoleViewList">{{roleName}}</i>


                            <span v-for="(value,key) in userDynamic.hideTagTypeMap" :class="'hideTagType hide_'+key">

                                <span class="circle point" v-if="value">
                                    <Icon name="unlock-solid" size="14px" class="icon"/>
                                </span>

                                <span class="circle" v-if="!value">
                                    <Icon name="lock-solid" size="14px" class="icon"/>
                                </span>
                            </span>
						</div>
                        <div :ref="'readMore_'+userDynamic.id">
                            <template v-if="userDynamic.module == 100">
                                <div class="topicContent collapsedContainer" :ref="'userDynamicContent_'+userDynamic.id" >
                                    <RenderTemplate @click-onTopicUnhide="onTopicUnhide" @load-onImageLoad="onImageLoad" :html="userDynamic.topicContent"></RenderTemplate>
                                    
                                </div>
                            </template>
                            <template v-if="userDynamic.module == 200">
                                <div class="topicContent collapsedContainer" :ref="'userDynamicContent_'+userDynamic.id" >
                                    <RenderTemplate @load-onImageLoad="onImageLoad" :html="userDynamic.commentContent"></RenderTemplate>
                                    
                                </div>
                            </template>
                            <template v-if="userDynamic.module == 300">
                                <div class="collapsedContainer" >
                                <div class="commentContent" :ref="'userDynamicContent_'+userDynamic.id" >
                                    <RenderTemplate @load-onImageLoad="onImageLoad" :html="userDynamic.commentContent"></RenderTemplate>
                                    
                                </div>
                                <div class="quoteContent">
	                                <div class="text" >
	                                    {{userDynamic.quoteCommentContent}}
	                                </div>
	                            </div>
                            </div>
                            </template>
                            <template v-if="userDynamic.module == 400">
                                <div class="replyContent collapsedContainer" >
                                    {{userDynamic.replyContent}}
                                </div>
                            </template>
                            <template v-if="userDynamic.module == 500">
                                <div class="topicContent collapsedContainer" :ref="'userDynamicContent_'+userDynamic.id" >
                                    <RenderTemplate @load-onImageLoad="onImageLoad" :html="userDynamic.questionContent"></RenderTemplate>
                                    
                                </div>
                            </template>
                            <template v-if="userDynamic.module == 600">
                                <div class="topicContent collapsedContainer" :ref="'userDynamicContent_'+userDynamic.id" >
                                    <RenderTemplate @load-onImageLoad="onImageLoad" :html="userDynamic.answerContent"></RenderTemplate>
                                    
                                </div>
                            </template>
                            <template v-if="userDynamic.module == 700">
                                <div class="replyContent collapsedContainer" >
                                    {{userDynamic.answerReplyContent}}
                                </div>
                            </template>

                            <template v-if="state.isReadMoreText.get(userDynamic.id) != undefined">
                                <span v-if="state.isReadMoreText.get(userDynamic.id) == true" class="readMore" @click="readMoreClick(userDynamic.id)">展开阅读</span>
                                <span v-if="state.isReadMoreText.get(userDynamic.id) == false" class="shrinkMore" @click="readMoreClick(userDynamic.id)">收起</span>
                            </template>
                        </div>
                        <div class="clearfix"></div>
                        <div class="tipBottom">
							<span class="a-toolbar">
                                <template v-if="userDynamic.module == 100">
                                    <router-link tag="a" :to="{path:'/thread',query: {topicId: userDynamic.topicId}}" target="_blank">
                                        查看原文
                                    </router-link>
									<span>{{userDynamic.topicViewTotal}}次阅读</span>
									<span>{{userDynamic.topicCommentTotal}}个评论</span>
									<span>{{state.favoriteCount.get('topic_'+userDynamic.topicId)}}人收藏</span>
									<span>{{state.likeCount.get('topic_'+userDynamic.topicId)}}人赞</span>
                                </template>
                                <template v-if="userDynamic.module == 200">
                                    <router-link tag="a" :to="{path:'/thread',query: {topicId: userDynamic.topicId,commentId:userDynamic.commentId}}" target="_blank">
                                        查看原文
                                    </router-link>
                                </template>
                                <template v-if="userDynamic.module == 300">
                                    <router-link tag="a" :to="{path:'/thread',query: {topicId: userDynamic.topicId,commentId:userDynamic.commentId}}" target="_blank">
                                        查看原文
                                    </router-link>
                                </template>
                                <template v-if="userDynamic.module == 400">
                                    <router-link tag="a" :to="{path:'/thread',query: {topicId: userDynamic.topicId,commentId:userDynamic.commentId,replyId:userDynamic.replyId}}" target="_blank">
                                        查看原文
                                    </router-link>
                                </template>
                                <template v-if="userDynamic.module == 500">
                                    <router-link tag="a" :to="{path:'/question',query: {questionId: userDynamic.questionId}}" target="_blank">
                                        查看原文
                                    </router-link>
									<span>{{userDynamic.questionViewTotal}}次阅读</span>
									<span>{{userDynamic.questionAnswerTotal}}个答案</span>
									<span>{{state.favoriteCount.get('question_'+userDynamic.questionId)}}人收藏</span>
                                </template>
                                <template v-if="userDynamic.module == 600">
                                    <router-link tag="a" :to="{path:'/question',query: {questionId: userDynamic.questionId,answerId:userDynamic.answerId}}" target="_blank">
                                        查看原文
                                    </router-link>
                                </template>
                                <template v-if="userDynamic.module == 700">
                                    <router-link tag="a" :to="{path:'/question',query: {questionId: userDynamic.questionId,answerId:userDynamic.answerId,replyId:userDynamic.answerReplyId}}" target="_blank">
                                        查看原文
                                    </router-link>
                                </template>
                            </span>
                        </div>
                    </div>
                </ol>
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
    import { getCurrentInstance, ComponentInternalInstance, reactive, onMounted, computed, nextTick, onUnmounted, onUpdated, watch} from 'vue'
    import { PageView, UnreadMessage, User, UserDynamic } from "@/types/index";
    import { AxiosResponse } from 'axios'
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import {letterAvatar} from '@/utils/letterAvatar'
    import { appStore } from "@/store";
    import Long from "long";
    import { getLanguageClassName, processErrorInfo} from '@/utils/tool';
    import { useMeta} from 'vue-meta';
    import Hls from 'hls.js';
    import DPlayer from 'dplayer';
    import { escapeHtml, escapeVueHtml } from '@/utils/escape';
    import Prism from "prismjs";
    import { ElImage, ElMessage, ElMessageBox } from 'element-plus';
    import Icon from "@/components/icon/Icon.vue";
    import { nativeQueryVideoRedirect, nativeRefreshToken } from '@/utils/http';

    const store = appStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;


   
    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '用户中心 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '用户中心 - ' + store.state.title
                },{
                    name: "description",
                    content: '用户中心 - ' + store.state.title
                }
            ]
        }))
    )


    const state = reactive({
        user: {} as User,//用户
        avatar:'',//字符头像
        followerCount:'0',//粉丝总数
        followText:'关注',//关注文本


        unreadMessage:{//未读消息
            privateMessageCount:0,
            systemNotifyCount:0,
            remindCount:0,
        } as UnreadMessage,
        

        pageView: {} as PageView<UserDynamic>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数     

        loading:true,//是否显示骨架屏
        isShowPage:false,//是否显示分页
        playerIdList: [] as Array<string>,//视频播放Id列表
		playerObjectList: [] as Array<any>,//视频播放对象集合
        playerHlsList: [] as Array<any>,//视频播放流对象集合
		playerNodeList: [] as Array<any>,//视频节点对象集合

        hidePasswordIndex:0,//隐藏标签密码框索引

        //“阅读更多”功能
        collapsedHeight:200, //默认高度
        isReadMoreText: new Map<string,boolean>,//是否显示展开文本 key:用户动态Id value:true(展开文本) false(收缩文本) key不存在时不显示任何文本
    
        favoriteCount: new Map<string,string>,//收藏数量 key:模块+id  例如话题收藏topic_topicId   问题收藏question_questionId
        likeCount: new Map<string,string>,//点赞数量 key:模块+id  例如话题点赞topic_topicId  
    
    });

    //错误
    const error = reactive({
    })


    //查询是否已经关注该用户
    const queryFollowing = (userName:string) => {
        //清空信息
        state.followText = '关注';

        proxy?.$axios({
            url: '/queryFollowing',
            method: 'get',
            params:  {
                userName:userName
            },
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(JSON.parse(result)){
                    state.followText = '已关注';
                }
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }
    //添加关注
    const addFollow = (userName:string) => {
        if(state.followText =='关注'){
            let formData = new FormData();
            formData.append('userName', userName);
            
            proxy?.$axios({
                url: '/user/control/follow/add',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(JSON.parse(result.success)){
                        state.followText ='已关注'
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
        
    }

    //跳转私信
    const toPrivateMessage = (userName:string) => {
        router.push({path: '/user/control/privateMessageChatList',query:{friendUserName:userName}});
    }

    //查询用户动态
    const queryUserDynamicList = (userName:string,page: number) => {
        //清空播放器
        clearVideoPlayer();
        //清空是否显示展开文本
        state.isReadMoreText.clear();

        state.pageView = {} as PageView<UserDynamic>;
        state.totalrecord = 0;
        state.currentpage = 1;
        state.totalpage = 1;
        state.maxresult = 12;

        proxy?.$axios({
            url: '/user/control/userDynamicList',
            method: 'get',
            params:  {
                userName:userName,
                page: page
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: PageView<UserDynamic>) => {
            state.loading = false;//关闭骨架屏

            

            if(data.records != null && data.records.length >0){
                for(let i:number=0; i<data.records.length; i++){
                    let userDynamic = data.records[i];

                    if(userDynamic.module == 100){
                        //处理隐藏标签富文本
                        let contentNode = document.createElement("div");
                        contentNode.innerHTML = userDynamic.topicContent;
                        state.hidePasswordIndex = 0;
                        bindNode(contentNode,userDynamic.topicId);
                        userDynamic.topicContent = escapeVueHtml(contentNode.innerHTML);


                        state.favoriteCount.set("topic_"+userDynamic.topicId,"0");//初始值
                        state.likeCount.set("topic_"+userDynamic.topicId,"0");//初始值
                        //查询话题用户收藏总数
                        queryTopicFavoriteCount("topic_"+userDynamic.topicId,userDynamic.topicId); 
                         //查询话题用户点赞总数
                        queryTopicLikeCount("topic_"+userDynamic.topicId,userDynamic.topicId); 
                       
                    }else if(userDynamic.module == 200){
                        //处理富文本
                        let contentNode = document.createElement("div");
                        contentNode.innerHTML = userDynamic.commentContent;
                        bindNode(contentNode,"-1");
                        userDynamic.commentContent = escapeVueHtml(contentNode.innerHTML);
                    }else if(userDynamic.module == 300){
                        //处理富文本
                        let contentNode = document.createElement("div");
                        contentNode.innerHTML = userDynamic.commentContent;
                        bindNode(contentNode,"-1");
                        userDynamic.commentContent = escapeVueHtml(contentNode.innerHTML);
                    }else if(userDynamic.module == 500){
                        //处理富文本
                        let contentNode = document.createElement("div");
                        contentNode.innerHTML = userDynamic.questionContent;
                        bindNode(contentNode,"-1");
                        userDynamic.questionContent = escapeVueHtml(contentNode.innerHTML);

                        state.favoriteCount.set("question_"+userDynamic.questionId,"0");//初始值
                        //查询问题用户收藏总数
                        queryQuestionFavoriteCount("question_"+userDynamic.questionId,userDynamic.questionId); 
                    }else if(userDynamic.module == 600){
                        //处理富文本
                        let contentNode = document.createElement("div");
                        contentNode.innerHTML = userDynamic.answerContent;
                        bindNode(contentNode,"-1");
                        userDynamic.answerContent = escapeVueHtml(contentNode.innerHTML);
                    }



                    if(userDynamic.nickname != null && userDynamic.nickname !=''){
                        userDynamic.avatar = letterAvatar(userDynamic.nickname, 72);
                    }else{
                        userDynamic.avatar = letterAvatar(userDynamic.account, 72);
                    }

                }

            }


            state.pageView = data;

            state.totalrecord = parseInt(state.pageView.totalrecord);//服务器返回的long类型已转为String类型
            state.currentpage = state.pageView.currentpage;
            state.totalpage = parseInt(state.pageView.totalpage);//服务器返回的long类型已转为String类型
            state.maxresult = state.pageView.maxresult;


            state.isShowPage = true;//显示分页栏

            nextTick(()=>{
                setTimeout(function() {
                    renderVideoPlayer();//渲染视频播放器
                }, 30);

                if(data.records != null && data.records.length >0){
                    for(let i:number=0; i<data.records.length; i++){
                        let userDynamic = data.records[i];
                        //渲染代码
                        let userDynamicRefValue = proxy?.$refs['userDynamicContent_'+userDynamic.id];
                        if(userDynamicRefValue != undefined){
                            renderBindNode((userDynamicRefValue as any)[0]); 
                        }
                    }

                }
                
                //"阅读更多"功能处理
                readMoreProcess();
            });
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    

    //分页
    const handlePage = (page: number) => {
        let userName:string = router.currentRoute.value.query.userName != undefined ?router.currentRoute.value.query.userName as string :'';
        
		router.push({
            path: '/user/control/home', 
            query:{
                userName:userName,
                page : page
            }
		});
        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}

    //话题解锁
    const onTopicUnhide = (hideType: number,hidePassword: string,topicId:string) => {
        let formData = new FormData();
        formData.append('topicId', topicId);
        formData.append('hideType',  String(hideType));
        if(hideType == 10){
            if(hidePassword != undefined && hidePassword != ""){
                formData.append('password',  hidePassword);
            }else{
                ElMessage({
                    showClose: true,
                    message: '密码不能为空',
                    type: 'error',
                })

                return;
            }
        }
        ElMessageBox.confirm('确定解锁?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {
            proxy?.$axios({
                url: '/user/control/topic/unhide',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(JSON.parse(result.success)){
                        ElMessage({
                            showClose: true,
                            message: '话题解锁成功',
                            type: 'success',
                            onClose:()=>{
                                
                            }
                        })
                        let page:number = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :1;
                        
                        if(state.user.userName != store.state.systemUser.userName){//如果查询用户自已的动态，则不显示
                            queryUserDynamicList(state.user.userName,page);
                        }
                    }else{
                        //处理错误信息
                        processErrorInfo(result.error as Map<string,string> ,  error,()=>{});
                        
                    }
                }
            })
            .catch((error: any) =>{
                console.log(error);
            });
            
        })
        .catch(() => {
            //取消
        })
    }

    //图片加载成功触发事件
    const onImageLoad = (e:Event) => {
        readMoreProcess();
    }

    //递归绑定节点参数
    const bindNode = (node:any,topicId:string) => {
        
        
        //先找到子节点
        let nodeList = node.childNodes;
        for(let i = 0;i < nodeList.length;i++){
            //childNode获取到到的节点包含了各种类型的节点
            //但是我们只需要元素节点  通过nodeType去判断当前的这个节点是不是元素节点
            let childNode = nodeList[i];
            let random = Math.random().toString().slice(2);
            //判断是否是元素节点。如果节点是元素(Element)节点，则 nodeType 属性将返回 1。如果节点是属性(Attr)节点，则 nodeType 属性将返回 2。
            if(childNode.nodeType == 1){
                 //处理隐藏内容
                 if(childNode.nodeName.toLowerCase() == "hide" ){
                    if(childNode.getAttribute("hide-type") == "10"){//输入密码可见
                        var nodeHtml = "";
                        nodeHtml += '<div class="hide-box">';
                        nodeHtml += 	'<Icon name="lock-solid-2" size="52px" class="background-image"></Icon>';
                        nodeHtml += 	'<div class="background-prompt">此处内容已被隐藏，输入密码可见</div>';
                        nodeHtml += 	'<div class="input-box">';
                        nodeHtml += 		'<input type="password" v-model.trim="hide_passwordList['+state.hidePasswordIndex+']" class="text" maxlength="30"  placeholder="密码">';
                      //  nodeHtml += 		'<input type="button" value="提交" class="button" @click="topicUnhide(10,'+state.hidePasswordIndex+');">';
                        nodeHtml += 		'<div class="button" @click="onTopicUnhide_renderTemplate(10,'+state.hidePasswordIndex+','+topicId+');">提交</div>';
                      
                        nodeHtml += 	'</div>';
                        nodeHtml += '</div>';
                        childNode.innerHTML = nodeHtml;
                        
                        state.hidePasswordIndex++;
                    }
                    else if(childNode.getAttribute("hide-type") == "20"){
                        var nodeHtml = "";
                        nodeHtml += '<div class="hide-box">';
                        nodeHtml += 	'<Icon name="lock-solid-2" size="52px" class="background-image"></Icon>';
                        nodeHtml += 	'<div class="background-prompt">此处内容已被隐藏，评论话题可见</div>';
                        nodeHtml += '</div>';
                        childNode.innerHTML = nodeHtml;
                    }else if(childNode.getAttribute("hide-type") == "30"){
                        var nodeHtml = "";
                        nodeHtml += '<div class="hide-box">';
                        nodeHtml += 	'<Icon name="lock-solid-2" size="52px" class="background-image"></Icon>';
                        nodeHtml += 	'<div class="background-prompt">此处内容已被隐藏，等级达到‘'+escapeHtml(childNode.getAttribute("description"))+'’可见</div>';
                        nodeHtml += '</div>';
                        childNode.innerHTML = nodeHtml;
                    }else if(childNode.getAttribute("hide-type") == "40"){
                        var nodeHtml = "";
                        nodeHtml += '<div class="hide-box">';
                        nodeHtml += 	'<Icon name="lock-solid-2" size="52px" class="background-image"></Icon>';
                        nodeHtml += 	'<div class="background-prompt">此处内容已被隐藏，支付‘'+childNode.getAttribute("input-value")+'’积分可见</div>';
                        nodeHtml += 	'<div class="submit-box" @click="onTopicUnhide_renderTemplate(40,'+null+','+topicId+');">立即购买</div>';
                        nodeHtml += '</div>';
                        childNode.innerHTML = nodeHtml;
                    }else if(childNode.getAttribute("hide-type") == "50"){
                        var nodeHtml = "";
                        nodeHtml += '<div class="hide-box">';
                        nodeHtml += 	'<Icon name="lock-solid-2" size="52px" class="background-image"></Icon>';
                        nodeHtml += 	'<div class="background-prompt">此处内容已被隐藏，支付 ￥<span class="highlight">'+childNode.getAttribute("input-value")+'</span> 元可见</div>';
                        nodeHtml += 	'<div class="submit-box" @click="onTopicUnhide_renderTemplate(50,'+null+','+topicId+');">立即购买</div>';
                        nodeHtml += '</div>';
                        childNode.innerHTML = nodeHtml;
                    }
                }
                //处理图片
                if(childNode.nodeName.toLowerCase() == "img" ){
                    let src = childNode.getAttribute("src");
                    
                    childNode.removeAttribute("src");//将原节点src属性删除，防止多请求一次
                
                    let html = '';
                    let style = '';
                    if(childNode.getAttribute("width") != null){//如果是表情，表情图不放大
                        style = 'style="width: '+childNode.getAttribute("width")+'; height: '+childNode.getAttribute("height")+'"';
                        html = '<el-image src="'+store.state.apiUrl+src+'" '+style+' loading="lazy" ></el-image>';
                    }else{
                    
                        html = '<el-image src="'+src+'" '+style+' :preview-src-list=["'+src+'"] lazy hide-on-click-modal @load="imageLoad_renderTemplate"></el-image>';
                    }
                    //创建要替换的元素
                //	let html = '<el-image src="'+src+'" '+style+' lazy></el-image>';
                //	let html = '<el-image src="'+src+'" '+style+' :preview-src-list=["http://127.0.0.1:8080/cms/common/tttttt/templates.jpg"] lazy hide-on-click-modal ></el-image>';
                    
                
                
                //	let html = '<el-image src="backstage/images/null.gif" lazy></el-image>';
                    let placeholder = document.createElement('div');
                    placeholder.innerHTML = html;
                    let node = placeholder.childNodes[0];
                //	node.setAttribute("src",src);
                    childNode.parentNode.replaceChild(node,childNode);//替换节点	 
                }
                
                //处理表格 (解决Chrome内核浏览器DPI缩放比例高于100%时部分边框变粗问题，需要CSS配合)
                if(childNode.nodeName.toLowerCase() == "table" ){
                    childNode.removeAttribute("border");
                    childNode.removeAttribute("bordercolor");
                }


                
                //处理视频标签
                if(childNode.nodeName.toLowerCase() == "player" ){
                    
                    let id = "player_"+random+"_"+i;
                    childNode.setAttribute("id",id);//设置Id
                    state.playerIdList.push(id);	
                }

                
                //处理代码标签
                if(childNode.nodeName.toLowerCase() == "pre" ){
                    let pre_html = childNode.innerHTML;
                    let class_val = childNode.className;
                    let lan_class = "";
                    
                    let class_arr = new Array();
                    class_arr = class_val.split(' ');
                    
                    for(let k=0; k<class_arr.length; k++){
                        let className = class_arr[k].trim();
                        
                        if(className != null && className != ""){
                            if (className.lastIndexOf('lang-', 0) === 0) {
                                lan_class = className;
                                break;
                            }
                        }
                    }
                    
                    childNode.className = "line-numbers "+getLanguageClassName(lan_class);
                    childNode.setAttribute("data-prismjs-copy","复制");
                    childNode.setAttribute("data-prismjs-copy-error","按Ctrl+C复制");
                    childNode.setAttribute("data-prismjs-copy-success","复制成功");


                    let nodeHtml = "";

                    //删除code节点
                    let preChildNodeList = childNode.childNodes;
                    for(let p = 0;p < preChildNodeList.length;p++){
                        let preChildNode = preChildNodeList[p];
                        if(preChildNode.nodeName.toLowerCase() == "code" ){
                            nodeHtml += preChildNode.innerHTML;
                            preChildNode.parentNode.removeChild(preChildNode);
                        }
                        
                    }
                    
                    let dom = document.createElement('code');
                    dom.className = "line-numbers "+getLanguageClassName(lan_class);
                    dom.innerHTML=nodeHtml;
                    
                   
                    childNode.appendChild(dom);
                
                }
                
                bindNode(childNode,topicId);

                
            }
        }
    }


    //递归渲染绑定节点
    const renderBindNode = (node:any) => {	
         //先找到子节点
         let nodeList = node.childNodes;
        for(let i = 0;i < nodeList.length;i++){
            //childNode获取到到的节点包含了各种类型的节点
            //但是我们只需要元素节点  通过nodeType去判断当前的这个节点是不是元素节点
            let childNode = nodeList[i];
            let random = Math.random().toString().slice(2);
            //判断是否是元素节点。如果节点是元素(Element)节点，则 nodeType 属性将返回 1。如果节点是属性(Attr)节点，则 nodeType 属性将返回 2。
            if(childNode.nodeType == 1){
                //处理代码标签
                if(childNode.nodeName.toLowerCase() == "pre" ){
                    Prism.highlightAllUnder(childNode);
                }
                renderBindNode(childNode);
            }
        }
    }

    //清空播放器
    const clearVideoPlayer = () => {
        for(let i=0; i< state.playerObjectList.length; i++){
            let playerObject = state.playerObjectList[i];
            playerObject.destroy();//销毁播放器
        }
        for(let i=0; i< state.playerHlsList.length; i++){
            let hls = state.playerHlsList[i];
            hls.destroy();//销毁视频流
        }
        
        state.playerObjectList.length = 0;//清空数组
        state.playerHlsList.length = 0;//清空数组
        state.playerIdList.length = 0;//清空数组
        state.playerNodeList.length = 0;//清空数组
    }






    //渲染视频播放器
    const renderVideoPlayer = () => {
        
        for(let i=0; i< state.playerIdList.length; i++){
            let playerId = state.playerIdList[i];
            let url = document.getElementById(playerId)?.getAttribute("url");
            let cover = document.getElementById(playerId)?.getAttribute("cover");//封面
            let thumbnail = document.getElementById(playerId)?.getAttribute("thumbnail");//缩略图
            
            let dp = null;
            if(url == ""){//如果视频处理中
                dp = new DPlayer({
                    container: document.getElementById(playerId),//播放器容器元素
                    screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                    
                    video: {
                        
                    }
                });
                let dom = document.createElement('div');
                dom.innerHTML="<div class='dplayer-process'><div class='box'><div class='prompt'>视频处理中，请稍后再刷新</div></div></div>";
                document.getElementById(playerId)?.appendChild(dom);
            }else{

                if(cover != undefined && cover != "" && thumbnail != undefined && thumbnail != ""){//切片视频
                    let hls = null;
                    dp = new DPlayer({
                        container: document.getElementById(playerId),//播放器容器元素
                        screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                        
                        video: {
                            url: url,
                            pic: cover,//视频封面
                            thumbnails: thumbnail,//视频预览图
                            type: 'customHls',
                            customType: {
                                customHls: function (video:any, player:any) {
                                    hls= new Hls();
                                    hls.loadSource(video.src);
                                    hls.attachMedia(video);
                                    hls.config.xhrSetup = (xhr, url) => {
                                        
                                        if(url.startsWith(store.state.apiUrl+"videoRedirect?")){//如果访问视频重定向页
                                            //如果使用重定向跳转时会自动将标头Authorization发送到seaweedfs，seaweedfs会报501错误 A header you provided implies functionality that is not implemented
                                            //这里发送X-Requested-With标头到后端，让后端返回需要跳转的地址
                                            let videoRedirectDate = {} as any;
                                            nativeQueryVideoRedirect(url,function(date:any){
                                                if(store.state.systemUser != null && Object.keys(store.state.systemUser).length>0 && date.isLogin == false && date.isPermission == false){
                                                    //会话续期
                                                    nativeRefreshToken();
                                                    nativeQueryVideoRedirect(url,function(date:any){
                                                        videoRedirectDate = date;
                                                    });
                                                }else{
                                                    videoRedirectDate = date;
                                                }
                                                
                                            });

                                            if(videoRedirectDate != null && Object.keys(videoRedirectDate).length>0 && videoRedirectDate.redirect != ''){
                                                //告诉hls重新发送ts请求
                                                xhr.open("GET", videoRedirectDate.redirect, true);//用重定向后的地址请求
                                                //xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                                            }
                                        }else{
                                            // 请求ts的url 添加参数 props.fileid
                                            //url = url + "?t=" + props.fileid;
                                            // 这一步必须 告诉hls重新发送ts请求
                                            xhr.open("GET", url, true);
                                            //xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                                        }
                                    };
                                },
                            },
                        }
                    });
                    state.playerHlsList.push(hls);
                }else{
                    dp = new DPlayer({
                        container: document.getElementById(playerId),//播放器容器元素
                        screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                        
                        video: {
                            url: url
                        }
                    });
                }
                
            }
            state.playerObjectList.push(dp);
        }
        
        
        //添加播放器节点数据
        if(state.playerObjectList.length >0){
            
            for(let i=0; i< state.playerIdList.length; i++){
                let playerId = state.playerIdList[i];
                let node = document.getElementById(playerId);//节点对象
                state.playerNodeList.push(node);
            }
        }
        
    }



    //“阅读更多”功能处理
    const readMoreProcess = () => {
        
		if(state.pageView.records != undefined && state.pageView.records != null && state.pageView.records.length >0){
            for(let i:number=0; i<state.pageView.records.length; i++){
                let userDynamic = state.pageView.records[i];
                let refValue =  (proxy?.$refs['readMore_'+userDynamic.id] as any);

                if(state.isReadMoreText.get(userDynamic.id) == false){//如果已经展开
                    continue;
                }

                if(refValue && refValue[0]){
                    
                    if (typeof window.getComputedStyle != "undefined"){
                        let height = window.getComputedStyle(refValue[0]).height;
                        if(parseInt(height) > state.collapsedHeight){
                            state.isReadMoreText.set(userDynamic.id,true);
                            refValue[0].children[0].setAttribute('style', 'max-height: none; height: '+state.collapsedHeight+'px;');
                            
                        }
                    }
                }
            }
        }
	}
    //“阅读更多”功能点击
    const readMoreClick = (userDynamicId:string) => {
        let refValue =  (proxy?.$refs['readMore_'+userDynamicId] as any);
		if(state.isReadMoreText.get(userDynamicId) == true){
            state.isReadMoreText.set(userDynamicId,false);
            
            if(refValue && refValue[0]){
                refValue[0].children[0].removeAttribute("style");
                let height = refValue[0].children[0].offsetHeight;
                refValue[0].children[0].setAttribute('style', 'max-height: none; height: '+state.collapsedHeight+'px;');

                setTimeout(function () {
                    refValue[0].children[0].setAttribute('style', 'max-height: none; height: '+height+'px;');
                }, 0);
                
            }
        }else{
            if(refValue && refValue[0]){
                refValue[0].children[0].setAttribute('style', 'max-height: none; height: '+state.collapsedHeight+'px;');
            }               
            state.isReadMoreText.set(userDynamicId,true)
        }
	}
    

    //查询用户中心
    const queryHome = (userName:string,callback:any) => {
        //清空用户信息
        state.user = {}as User;
        state.avatar = store.state.transparentImage;


        proxy?.$axios({
            url: '/user/control/home',
            method: 'get',
            params:  {
                userName:userName
            },
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result.user != null){
                    state.user = result.user;

                    if(state.user.avatarName == null){
                        if(state.user.nickname != null && state.user.nickname !=''){
                            state.avatar = letterAvatar(state.user.nickname, 140);
                        }else{
                            state.avatar = letterAvatar(state.user.account, 140);
                        }
                     }
                     callback();
                }
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }
    //查询话题用户收藏总数
    const queryTopicFavoriteCount = (key:string,topicId:string) => {
        proxy?.$axios({
            url: '/queryFavoriteCount',
            method: 'get',
            params:  { 
                topicId: topicId,
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                let count = JSON.parse(data);
                state.favoriteCount.set(key,count);
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //查询问题用户收藏总数
    const queryQuestionFavoriteCount = (key:string,questionId:string) => {
        proxy?.$axios({
            url: '/queryQuestionFavoriteCount',
            method: 'get',
            params:  { 
                questionId: questionId,
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                let count = JSON.parse(data);
                state.favoriteCount.set(key,count);
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    //查询话题用户点赞总数
    const queryTopicLikeCount = (key:string,topicId:string) => {
        proxy?.$axios({
            url: '/queryLikeCount',
            method: 'get',
            params:  { 
                topicId: topicId,
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                let count = JSON.parse(data);
                state.likeCount.set(key,count);;
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //查询粉丝总数
    const queryFollowerCount = (userName:string) => {
        //清空信息
        state.followerCount = '0';


        proxy?.$axios({
            url: '/queryFollowerCount',
            method: 'get',
            params:  {
                userName:userName
            },
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                state.followerCount = result;
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }

    //接收子组件消息
    const receive_unreadMessage = (unreadMessage:UnreadMessage) => {
        state.unreadMessage = unreadMessage;
    }


    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'home'){
            let userName:string = '';
            let page:number = 1;
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            if(to.query.userName != undefined){
                userName =to.query.userName as string;
            }
            queryHome(userName, () =>{
                if(store.state.systemUser != null && Object.keys(store.state.systemUser).length>0 && state.user.userName != store.state.systemUser.userName){//如果查询用户自已的动态，则不显示
                    queryUserDynamicList(userName,page);
                }
                
            });//查询用户中心
            

            queryFollowerCount(userName);//查询粉丝总数

            queryFollowing(userName);//查询是否已关注该用户
        }
        
        next();
    });
    


    //监听完成基础信息查询（queryUserDynamicList()方法查询需要先获得/baseInfo的返回值，本方法会判断有返回值后再执行）
    watch(() => store.state.systemUser, (val, old) => {
        if(state.user != null && Object.keys(state.user).length > 0
            && store.state.systemUser != null && Object.keys(store.state.systemUser).length>0 && state.user.userName != store.state.systemUser.userName){
             //获取URL中的参数
            let userName:string = router.currentRoute.value.query.userName != undefined ? router.currentRoute.value.query.userName as string : '';
            let page:number = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :1;

            queryUserDynamicList(userName,page);
        }
    })

    onMounted(()=>{
        //获取URL中的参数
        let userName:string = router.currentRoute.value.query.userName != undefined ? router.currentRoute.value.query.userName as string : '';

       init(userName);

    });





    //初始化
    const init = (userName:string) => {
        let page:number = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :1;
         
        queryHome(userName, () =>{
            if(store.state.systemUser != null && Object.keys(store.state.systemUser).length>0 && state.user.userName != store.state.systemUser.userName){//如果查询用户自已的动态，则不显示
                queryUserDynamicList(userName,page);
            }
        });//查询用户中心
        

        queryFollowerCount(userName);//查询粉丝总数

        queryFollowing(userName);//查询是否已关注该用户
    }
    
    //卸载组件实例后调用
    onUnmounted (()=>{
        //清除播放器
        clearVideoPlayer();
    })

</script>

<style scoped lang="scss">
.homeModule{


    .user-home-header{
        width: 1205px;
        margin-top: 50px;
        position: relative;
        box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);

        .avatarRing {
            width: 160px;
            height: 110px;
            background: #fff;
            border-radius: 4px;
            box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
            position: absolute;
            left: 15px;
            top: -40px
        }
        .inner {
            height: 170px;
            background: #fff;
            position: relative;
            padding-left: 180px;
            margin-right: 0;
            border-right: 0
        }
        .avatar {
            background: #fff;
            border-radius: 4px;
            position: absolute;
            left: 25px;
            top: -30px;
            width: 140px;
            .img-box {
                position: relative;
                height: 140px;
                img {
                    max-height: 140px;
                    max-width: 140px;
                    border-radius: 2px;
                }
            }
            .counts {
                background: $color-black-10;
                text-align: center;
               
                .point {
                    display: block;
                    float: left;
                    width: 70px;
                    height: 40px;
                    padding-top: 10px;
                    text-decoration: none;
                    position: relative;
                    :after{
                        content: ' ';
                        position: absolute;
                        width: 1px;
                        height: 34px;
                        border-radius: 2px;
                        top: 8px;
                        right: -1px;
                        background: hsla(228, 14%, 93%,.6);//$color-black-25
                    }
                }
                .follows {
                    display: block;
                    height: 40px;
                    padding-top: 10px;
                    text-decoration: none
                }
                .num {
                    font-size: 16px;
                    font-weight: 400;
                    color: $color-black-90;
                    line-height: 1;
                    margin-bottom: 5px
                }
                .sub {
                    font-size: 12px;
                    line-height: 1;
                    color: $color-black-60;
                }
                a{
                   &:hover {
                        div{
                            color: orange;
                        }
                    }   
                }
            }
        }
        .head-line {
            margin: 20px 0 10px;
            line-height: 1;
            position: relative;
            .name {
                font-size: 24px;
                font-weight: 400;
                color: $color-black-90;
                display: inline-block;
                margin-top: 15px;
            }
            .grade {
                display: inline-block;
                background-color: $color-black-20;
                border-radius: 2px;
                color: $color-black-80;
                font-size: 14px;
                padding: 3px 8px 3px 8px;
                vertical-align: middle;
                line-height: 20px;
                height: 20px;
                margin-top: -10px;
                margin-left: 8px;
                
            }
        }
        .nickname{
            font-size: 16px;
            color: $color-black-90;
            display: inline-block;
            .nicknameLabel{
                color: $color-black-50;
            }
        }
        .role{
            margin-top:10px;
            .userRoleName{
                display: inline-block;
                white-space:nowrap;
                vertical-align: middle;
                padding: 3px 4px;
                margin-right:3px;
                font-size: 13px;
                line-height: 14px;
                -webkit-border-radius: 2px;
                -moz-border-radius: 2px;
                border-radius: 2px;
                color:#e2b46e;
                background-color:#f8e7c4;
            }
        }
        .ipAddress{
            font-size: 16px;
            color:  $color-black-50;
            display: inline-block;
            margin-top: 10px;
            .icon{
                font-size: 16px;
                margin-right: 3px;
                position: relative;
                top: 2px;
            }
        }
        .action-button {
            position: absolute;
            right: 20px;
            top: 20px;
            :deep(.el-button--primary){
                padding: 16px 15px 16px 15px;
            }
            .action-followBox{
                margin-right: 10px;
            }
        }
    }

    .selfService {
         margin-left: -5px;
         margin-top: 5px;

        .box{
            overflow:hidden;
            zoom:1; 
            margin:0 0px;
            margin-bottom:-5px;
            .ul{
                overflow:hidden;
                zoom:1;
                background-position:0 0px;
                .item{
                    width:19%; position:relative;float:left; height:130px;border:1px solid #fff;
                    margin:5px 5px 5px 5px;
                    display:block;background-color:#fff;
                    box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);

                    .a-pic{
                        width: 100%;
                        height: 100%;
                        display: block; 
                        text-align: center;
                        color: $color-black-60;
                        &:hover {
                            .img{
                                color: $color-blue-60;
                            }
                            .title{
                                color: $color-blue-60;
                            }
                        }
                        .img {
                            display: block;
                            padding-top:20px;
                            color: $color-black-50; 
                        }
                        .title{
                            position:absolute; 
                            left:0px;
                            right:0px;
                            bottom:12px; 
                            line-height:40px;
                            font-size: 16px;
                            text-align: center;
                            font-weight: normal;
                        }
                        .badge{
                            :deep(.el-badge__content.is-fixed){
                                top: 23px;
                            }
                        }
                     }
                }
            }
        }
    }
}

.userDynamicModule{
    width: 1205px;
        background: #fff;
        margin-top: 10px;
        position: relative;
        padding-top:18px;
        padding-bottom: 30px;
        box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
    /**
    background: #fff;
    padding-right:8px;
    padding-left:8px;
    padding-top:18px;
    padding-bottom: 30px;**/
    .userDynamicList{
        list-style:none;
        font-size: 14px;
        margin-bottom: 10px;
        
        padding-right:8px;
        padding-left:8px;
        .userDynamic-author{
            position:relative;
            img{
                width:72px;
                height:72px;
                position:absolute;
                left:-91px;
                -webkit-border-radius:50%;
                -moz-border-radius:50%;
                border-radius:50%;
                display:block;
            }
            .userName{
                color:$color-black-60;
            }
        }
        cite{
            font-style:normal;
        }
        .userDynamicTime{
            margin-bottom:5px;
            color:$color-black-40;
            font-size: 13px;
            a{
                color:$color-black-60;
            }
        }
        .topicRoleName{
            display: inline-block;
            white-space:nowrap;
            vertical-align: middle;
            padding: 2px 4px;
            margin-left: 5px;
            font-size: 13px;
            line-height: 14px;
            -webkit-border-radius: 2px;
            -moz-border-radius: 2px;
            border-radius: 2px;
            color: #fff;
            background-color:#ffcc00;
            position: relative;
            top: -5px;
        }
        .userDynamic{
            padding:10px 0 5px 100px;
            border-bottom:1px solid $color-black-20;
            position: relative;
            .topicTitle{
                padding:0px;word-wrap:break-word;margin-top: 5px;
                font-size:0;/*父级元素设置font-size:0; 解决 display：inline-block两个元素之间的默认空格 */
                .info{
                    background-color: $color-black-20;
                    border-radius: 4px;
                    color: $color-black-80;
                    font-size: 13px;
                    padding: 5px 8px 5px 8px;
                    line-height: 32px;
                }
                a{
                    color: #1890ff;
                    font-size: 15px;
                    line-height: 32px;
                    margin-left: 5px;
                }
                .hideTagType{
                    font-size:0;/*父级元素设置font-size:0; 解决 display：inline-block两个元素之间的默认空格 */
                    position:relative;
                    top:-4px;
                    .circle{
                        border-radius:12px;display: inline-block;margin-left:5px;
                        width: 24px;height: 24px;
                        position:relative;
                        .icon{
                            margin-left: 5px;position:relative;top:4px;
                        }
                    }
                    .point{
                        &:before{
                            content: ' ';
                            position: absolute;
                            width: 4px;
                            height: 4px;
                            border-radius: 2px;
                            top: 13px;
                            left: 10px;
                        }
                    }
                }
                .hide_10{
                    .circle{
                        background: #ebebeb;
                        .icon{
                            color: #b2b2b2;
                        }
                    }
                    .point{
                        &:before{
                            background-color: #ebebeb;
                        }
                    }
                }
                .hide_20{
                    .circle{
                        background: #bbf9d5;
                        .icon{
                            color: #21de70;
                        }
                    }
                    .point{
                        &:before{
                            background-color: #bbf9d5;
                        }
                    }
                }
                .hide_30{
                    .circle{
                        background: #bfebfb;
                        .icon{
                            color: #27c3fc;
                        }
                    }
                        .point{
                        &:before{
                            background-color: #bfebfb;
                        }
                        }
                }
                .hide_40{
                    .circle{
                        background: #e2cffe;
                        .icon{
                            color: #af82f2;
                        }
                    }
                    .point{
                        &:before{
                            background-color: #e2cffe;
                        }
                    }
                }
                .hide_50{
                    .circle{
                        background: #fedbb2;
                        .icon{
                            color: #fe9d2d;
                        }
                    }
                    .point{
                        &:before{
                            background-color: #fedbb2;
                        }
                    }
                }
                
            }
            :deep(.topicContent){
                padding:0px;
                word-wrap:break-word;
                color:$color-black-90;
                font-size:16px; 
                line-height:1.75; 
                margin-top:12px;
                p{
                    font-size:16px;
                    word-wrap:break-word;
                }
                img{
                    max-width:100%;
                    height:auto;
                    border:none;
                    background:none;
                    margin:0;
                    padding:0;
                    vertical-align: sub;
                }
                /** 解决Chrome内核浏览器DPI缩放比例高于100%时部分边框变粗问题   本方案需删除table样式 border="1" bordercolor="#000000" */
                table {
                    border-collapse: separate; 
                    border-spacing: 0; 
                    border-top: 1px solid $color-black-30;
                    border-left: 1px solid $color-black-30;
                    th {
                        font-weight: 600
                    }
                    th, td {
                        border-right: 1px solid $color-black-30;
                        border-bottom: 1px solid $color-black-30;
                        padding: 6px 13px
                    }
                    tr {
                        background-color: #fff;
                        border-top: 1px solid $color-black-30;
                        &:nth-child(2n) {
                            background-color: $color-black-10;
                        }
                    }
                    /**
                    table {
                        width: 100%;
                        th {
                            font-weight: 600
                        }
                        td,th {
                            border: 1px solid $color-black-30;
                            padding: 6px 13px
                        }
                        tr {
                            background-color: #fff;
                            border-top: 1px solid $color-black-30;
                            &:nth-child(2n) {
                                background-color: $color-black-10;
                            }
                        }
                    }**/
                }
                ol{
                    li{ 
                        list-style-type:decimal;
                        list-style-position:inside;
                    }
                }
                ul{
                    li{ 
                        margin-left:20px;
                        list-style-type:disc;
                    }
                }
                iframe{
                    width:100%; height: 550px;padding:10px 0px; 
                }
                pre{
                    white-space:pre-wrap;
                }
                player{
                    width: 480px;
                    height: 270px;
                    display: block;
                    margin-right: 5px;
                    background: #000;
                    position: relative;
                    text-align: center;
                    .cover{
                        max-height: 100%;  
                        max-width: 100%; 
                        width: auto;
                        height: auto;
                        position: absolute;  
                        top: 0;  
                        bottom: 0;  
                        left: 0;  
                        right: 0;  
                        margin: auto;
                    }
                    .buttonCircle{
                        display: inline-block;
                        position: absolute;
                        top: 0;  
                        bottom: 0;  
                        left: 0;  
                        right: 0;  
                        margin: auto;
                        line-height:270px;
                        border-radius:30px;
                        width: 60px;
                        height: 60px;
                        background-color: rgba(0,0,0,0.5);
                    }
                    .iconBox{
                        display: block;
                        position: relative;
                        width: 60px;
                        height: 60px;
                        .playIcon{
                            font-size: 30px;
                            position: absolute;  
                            line-height:22px; 
                            width: 22px;
                            height: 22px;
                            top: 0;  
                            bottom: 0;  
                            left: -5px;  
                            right: 0;  
                            margin: auto;
                            color: #fff;
                        }
                    }
                }
                .dplayer-process {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 99;
                    .box{
                        position: relative;
                        width: 100%;
                        height: 100%;
                        .prompt{
                            width: 250px;
                            height: 80px;
                            position: absolute;
                            left: 0;
                            top: 0;
                            right: 0;
                            bottom: 0;
                            margin: auto;
                            padding :0px 30px;
                            border-radius :3px;
                            color: #fff;
                            line-height: 50px;
                            font-size: 16px;
                            background-color:rgb(0,0,0);
                            opacity:0.7;
                            filter:alpha(opacity=70);
                            text-align: center;
                        }
                    }
                }
                hide{
                    display:block;
                    background: $color-black-10;
                    min-height:100px;
                    margin-left: 10px;
                    margin-right: 10px;
                    margin-top: 17px;
                    margin-bottom: 15px;
                    border: 3px dashed $color-black-30;
                    border-radius: 5px;
                    .hide-box{
                        margin: 20px;position: relative;text-align: center;
                    }
                    .background-image{
                        margin: auto;
                        margin-top:15px;
                        color: $color-black-40;
                    }
                    .background-prompt{
                        margin-top: 5px; color: $color-black-50;font-size: 16px;
                    }
                    .highlight{
                        font-weight:bold;
                    }
                    .input-box{
                        pointer-events: none;
                        margin: auto; 
                        margin-top: 10px;
                        margin-bottom:25px; 
                        border:$color-black-70 solid 2px;
                        width:226px; 
                        height:26px; 
                        // overflow:hidden; 
                        border-radius: 2px;
                        position: relative;
                        
                        &:hover{
                            border:$color-black-80 solid 2px;
                            .button{
                                border:transparent solid 0px; 
                                background:$color-black-80;
                            }
                        }
                        .text{ 
                            pointer-events:auto;
                            width:145px; 
                            height:26px; 
                            line-height:26px; 
                            border:0; 
                            float:left; 
                            font-size:14px; 
                            color:$color-black-80;
                            text-indent: 6px; 
                            vertical-align:middle;
                            outline:none; 
                            background: $color-black-10;
                            &::-webkit-input-placeholder {
                                color: $color-black-70;
                            }
                            &:-ms-input-placeholder {
                                color: $color-black-70;
                            }
                            &:-moz-placeholder {
                                color: $color-black-70;
                            }
                            &::-moz-placeholder {
                                color: $color-black-70;
                            }
                        }
                        .button{
                            position: absolute;
                            top: -1px;
                            right: -2px;
                            pointer-events:auto; 
                            display: inline-block;
                            white-space:nowrap;
                            width:80px;
                            height:28px; 
                            vertical-align: middle;
                            font-size: 15px;
                            line-height: 28px;
                            -webkit-border-radius: 0px 2px 2px 0px;
                            -moz-border-radius: 0px 2px 2px 0px;
                            border-radius: 0px 2px 2px 0px;
                            color:#fff;
                            background-color:$color-black-70;
                            cursor:pointer;
                            user-select:none;
                            &:hover{
                                background:$color-black-80;
                            }
                        }
                    }
                    
                    .submit-box{
                        margin-top: 10px;
                        margin-bottom:5px; 
                        display: inline-block;
                        white-space:nowrap;
                        width:80px;
                        height:30px; 
                        vertical-align: middle;
                        font-size: 15px;
                        line-height: 30px;
                        -webkit-border-radius: 2px;
                        -moz-border-radius: 2px;
                        border-radius: 2px;
                        color:#fff;
                        background-color:$color-black-70;
                        cursor:pointer;
                        user-select:none;
                        &:hover{
                            background:$color-black-80;
                        }
                    }
                }
            }
            .commentContent{
                padding:0px;
                word-wrap:break-word;
                color:$color-black-90;
                font-size:16px; 
                line-height:1.75;
                margin-top:12px;
                p{
                    font-size:16px;
                    word-wrap:break-word;
                }
                img{
                    max-width:100%;
                    height:auto;
                    border:none;
                    background:none;
                    margin:0;
                    padding:0;
                    vertical-align: sub;
                }
            }
            .quoteContent{
                position: relative;
                margin: 20px 0px 0px 0px;
                padding: 15px;
                border-radius: 3px;
                background: $color-black-10;
                border: 1px solid $color-black-30;
                &:before{
                    position: absolute;
                    content: '';
                    width: 0;
                    height: 0;
                    top: -7px;
                    border-width: 0 7px 7px 7px;
                    border-style: solid;
                    border-color: transparent transparent $color-black-10 transparent;
                    z-index: 1
                }
                &:after{
                    position: absolute;
                    content: '';
                    width: 0;
                    height: 0;
                    top: -8px;
                    border-width: 0 7px 7px 7px;
                    border-style: solid;
                    border-color: transparent transparent $color-black-30 transparent
                }
                .text{
                    color:$color-black-90;line-height:1.75;
                    font-size: 16px;
                }
            }
            .replyContent{
                padding:0px;
                word-wrap:break-word;
                color:$color-black-90;
                font-size:16px; 
                line-height:1.75;
                margin-top:12px;
                p{
                    font-size:16px;
                    word-wrap:break-word;
                }
            }
        }
        .tipBottom {
            font-size: 10pt;
            color: $color-black-50;
            margin: 15px 10px 5px 0px;
            text-align: left;
            .a-toolbar {
                display: block;
                width: 100%;
                a {
                    color: $color-black-50;margin-right: 15px;
                }
                span {
                    color: $color-black-50;margin-right: 15px;
                }
            }
        }
    }
         
    //阅读更多
    :deep(.collapsedContainer){
        transition: height 300ms; 
        overflow: hidden; 
        display: block;
        width: 100%;
    }
    :deep(.readMore){
        position: relative;
        display: block;
        color: #FF7D00;
        text-align:center;
        height: 65px;
        line-height:110px;
        font-size:15px;
        margin-top: -65px;
        user-select: none;
        cursor: pointer;
        background-image: -webkit-gradient(linear,left top, left bottom,from(rgba(255,255,255,0)),color-stop(70%, #fff));
        background-image: linear-gradient(-180deg,rgba(255,255,255,0) 0%,#fff 70%);
    }
    :deep(.shrinkMore){
        position: relative;
        display: block;
        color: #FF7D00;
        text-align:center;
        height: 30px;
        line-height:30px;
        font-size:15px;
        margin-top: 10px;
        user-select: none;
        cursor: pointer;
    }
   
    .page{
        margin-top: 30px;
        padding-right:8px;
        padding-left:8px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>