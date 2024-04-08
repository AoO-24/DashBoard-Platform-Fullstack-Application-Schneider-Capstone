<!-- 服务导航 -->
<template>
    <div class="main-container wrap">
        <ul class="serviceNav">
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/userDynamicList'}"><router-link tag="a" to="/user/control/userDynamicList">动态</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/topicList' || router.currentRoute.value.path == '/user/control/topicUnhideList' || router.currentRoute.value.path == '/user/control/topicFavoriteList' || router.currentRoute.value.path == '/user/control/topicLikeList'}"><router-link tag="a" to="/user/control/topicList">话题</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/commentList'}"><router-link tag="a" to="/user/control/commentList">评论</router-link></li>
            
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/replyList'}"><router-link tag="a" to="/user/control/replyList">评论回复</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/questionList' || router.currentRoute.value.path =='/user/control/questionFavoriteList'}"><router-link tag="a" to="/user/control/questionList">问题</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/answerList'}"><router-link tag="a" to="/user/control/answerList">答案</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/answerReplyList'}"><router-link tag="a" to="/user/control/answerReplyList">答案回复</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/favoriteList'}"><router-link tag="a" to="/user/control/favoriteList">收藏夹</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/likeList'}"><router-link tag="a" to="/user/control/likeList">点赞</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/followList'}"><router-link tag="a" to="/user/control/followList">关注</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/followerList'}"><router-link tag="a" to="/user/control/followerList">粉丝</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/privateMessageList' || router.currentRoute.value.path == '/user/control/privateMessageChatList'}"><router-link tag="a" to="/user/control/privateMessageList">私信</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/remindList'}"><router-link tag="a" to="/user/control/remindList">提醒</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/systemNotifyList'}"><router-link tag="a" to="/user/control/systemNotifyList">系统通知</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/membershipCardOrderList'}"><router-link tag="a" to="/user/control/membershipCardOrderList">会员卡订单</router-link></li>
            <li class="title" :class="{ 'active': router.currentRoute.value.path == '/user/control/balance'}"><router-link tag="a" to="/user/control/balance">余额</router-link></li>
            
            <el-dropdown>
                <li class="title more hide" >
                    <span>更多</span><Icon name="angle-down" size="16px" class="icom"/>
                </li>


                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="router.push({path: '/user/control/giveRedEnvelopeList'})"> 发红包 </el-dropdown-item>
                        <el-dropdown-item @click="router.push({path: '/user/control/receiveRedEnvelopeList'})"> 收红包 </el-dropdown-item>
                        <el-dropdown-item @click="router.push({path: '/user/control/editUser'})"> 修改个人资料 </el-dropdown-item>
                        <el-dropdown-item @click="router.push({path: '/user/control/realNameAuthentication'})"> 实名认证 </el-dropdown-item>
                        <el-dropdown-item @click="router.push({path: '/user/control/reportList'})"> 举报 </el-dropdown-item>
                        <el-dropdown-item @click="router.push({path: '/user/control/point'})"> 积分日志 </el-dropdown-item>
                        <el-dropdown-item @click="router.push({path: '/user/control/userLoginLogList'})"> 登录日志 </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </ul>
    </div>
</template>

<script lang="ts" setup>
    import { useRouter } from 'vue-router'
    
    const router = useRouter();

</script>

<style scoped lang="scss">
.serviceNav {
	margin-top:-9px;
	height: 46px;
	background-color: $color-black-10;
	font-size: 15px;
    &:after{
        height: 30px;
        width: 100%;
        position: absolute;
        top: 0px;
    }
    .title {
        float: left;
        padding: 0 15px;
        height: 46px;
        line-height: 46px;
        cursor: pointer;
        position: relative;
        a {
            color: $color-black-60;
            &:hover {
                color: $color-blue-60;
            }
        }
    }
    .active {
        background-color: #fff;
        cursor: default;
        box-shadow:4px 0 3px -4px rgba(0,0,0,.06),-4px 0 3px -4px rgba(0,0,0,.06);
        a{
            color: $color-black-70;
        }
    }
    .more{
        color: $color-black-60;
        .icom{
            margin-left: 5px;
            position: relative;
            top: 3px;
        }
    }
}

</style>