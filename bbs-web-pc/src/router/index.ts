import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/index',//首页
        name: 'index',
        component: () => import('@/views/index.vue')
    },
    {
        path: '/search',//搜索
        name: 'search',
        component: () => import('@/views/search.vue')
    },
    {
        path: '/addTopic',//发表话题
        name: 'addTopic',
        component: () => import('@/views/addTopic.vue')
    },
    {
        path: '/thread',//话题内容
        name: 'thread',
        component: () => import('@/views/thread.vue')
    },
    {
        path: '/user/editTopic',//修改话题
        name: 'editTopic',
        component: () => import('@/views/editTopic.vue')
    },
    {
        path: '/askList',//问答列表
        name: 'askList',
        component: () => import('@/views/askList.vue')
    },
    {
        path: '/addQuestion',//提问题
        name: 'addQuestion',
        component: () => import('@/views/addQuestion.vue')
    },

    {
        path: '/question',//问题内容
        name: 'question',
        component: () => import('@/views/question.vue')
    },
    {
        path: '/membershipCardList',//会员卡列表
        name: 'membershipCardList',
        component: () => import('@/views/membershipCardList.vue')
    },
    {
        path: '/membershipCard',//会员卡明细
        name: 'membershipCard',
        component: () => import('@/views/membershipCard.vue')
    },
    {
        path: '/help',//帮助中心
        name: 'help',
        component: () => import('@/views/help.vue')
    },
    {
        path: '/helpDetail',//帮助内容
        name: 'helpDetail',
        component: () => import('@/views/helpDetail.vue')
    },
    {
        path: '/login',//登录
        name: 'login',
        component: () => import('@/views/login.vue')
    },
    {
        path: '/thirdParty/loginRedirect',//第三方重定向登录
        name: 'loginRedirect',
        component: () => import('@/views/loginRedirect.vue')
    },
    {
        path: '/register',//注册
        name: 'register',
        component: () => import('@/views/register.vue')
    },
    {
        path: '/termsService',//服务条款
        name: 'termsService',
        component: () => import('@/views/termsService.vue')
    },
    {
        path: '/feedback',//在线留言
        name: 'feedback',
        component: () => import('@/views/feedback.vue')
    },
    
    {
        path: '/user/control/home',//用户中心
        name: 'home',
        component: () => import('@/views/home/home.vue')
    },
    {
        path: '/user/control/userDynamicList',//用户动态
        name: 'userDynamicList',
        component: () => import('@/views/home/userDynamicList.vue')
    },
    {
        path: '/user/control/topicList',//我的话题
        name: 'topicList',
        component: () => import('@/views/home/topicList.vue')
    },
    {
        path: '/user/control/topicUnhideList',//解锁隐藏标签用户
        name: 'topicUnhideList',
        component: () => import('@/views/home/topicUnhideList.vue')
    },
    {
        path: '/user/control/topicFavoriteList',//话题收藏用户
        name: 'topicFavoriteList',
        component: () => import('@/views/home/topicFavoriteList.vue')
    },
    {
        path: '/user/control/topicLikeList',//话题点赞用户
        name: 'topicLikeList',
        component: () => import('@/views/home/topicLikeList.vue')
    },
    {
        path: '/user/control/commentList',//我的评论
        name: 'commentList',
        component: () => import('@/views/home/commentList.vue')
    },
    {
        path: '/user/control/replyList',//我的回复
        name: 'replyList',
        component: () => import('@/views/home/replyList.vue')
    },
    {
        path: '/user/control/questionList',//我的问题
        name: 'questionList',
        component: () => import('@/views/home/questionList.vue')
    },
    {
        path: '/user/control/questionFavoriteList',//问题收藏用户
        name: 'questionFavoriteList',
        component: () => import('@/views/home/questionFavoriteList.vue')
    },
    
    {
        path: '/user/control/answerList',//我的答案
        name: 'answerList',
        component: () => import('@/views/home/answerList.vue')
    },
    {
        path: '/user/control/answerReplyList',//我的答案回复
        name: 'answerReplyList',
        component: () => import('@/views/home/answerReplyList.vue')
    },
    {
        path: '/user/control/favoriteList',//收藏夹
        name: 'favoriteList',
        component: () => import('@/views/home/favoriteList.vue')
    },
    {
        path: '/user/control/likeList',//点赞
        name: 'likeList',
        component: () => import('@/views/home/likeList.vue')
    },
    {
        path: '/user/control/followList',//关注
        name: 'followList',
        component: () => import('@/views/home/followList.vue')
    },
    {
        path: '/user/control/followerList',//粉丝
        name: 'followerList',
        component: () => import('@/views/home/followerList.vue')
    },
    {
        path: '/user/control/privateMessageList',//私信列表
        name: 'privateMessageList',
        component: () => import('@/views/home/privateMessageList.vue')
    },
    {
        path: '/user/control/privateMessageChatList',//私信对话
        name: 'privateMessageChatList',
        component: () => import('@/views/home/privateMessageChatList.vue')
    },
    {
        path: '/user/control/remindList',//提醒
        name: 'remindList',
        component: () => import('@/views/home/remindList.vue')
    },
    {
        path: '/user/control/systemNotifyList',//系统通知
        name: 'systemNotifyList',
        component: () => import('@/views/home/systemNotifyList.vue')
    },
    {
        path: '/user/control/membershipCardOrderList',//会员卡订单
        name: 'membershipCardOrderList',
        component: () => import('@/views/home/membershipCardOrderList.vue')
    },
    {
        path: '/user/control/balance',//余额
        name: 'balance',
        component: () => import('@/views/home/balance.vue')
    },
    {
        path: '/user/control/payment',//付款
        name: 'payment',
        component: () => import('@/views/home/payment.vue')
    },
    {
        path: '/paymentCompleted/:interfaceProduct/:paymentModule/:parameterId',//支付完成
        name: 'paymentCompleted',
        component: () => import('@/views/paymentCompleted.vue')
    },
    {
        path: '/user/control/giveRedEnvelopeList',//发红包列表
        name: 'giveRedEnvelopeList',
        component: () => import('@/views/home/giveRedEnvelopeList.vue')
    },
    {
        path: '/user/control/redEnvelopeAmountDistributionList',//发红包金额分配列表
        name: 'redEnvelopeAmountDistributionList',
        component: () => import('@/views/home/redEnvelopeAmountDistributionList.vue')
    },
    {
        path: '/user/control/receiveRedEnvelopeList',//收红包列表
        name: 'receiveRedEnvelopeList',
        component: () => import('@/views/home/receiveRedEnvelopeList.vue')
    },
    {
        path: '/user/control/realNameAuthentication',//实名认证
        name: 'realNameAuthentication',
        component: () => import('@/views/home/realNameAuthentication.vue')
    },
    {
        path: '/user/control/editUser',//修改个人资料
        name: 'editUser',
        component: () => import('@/views/home/editUser.vue')
    },
    {
        path: '/user/control/phoneBinding',//手机绑定
        name: 'phoneBinding',
        component: () => import('@/views/home/phoneBinding.vue')
    },
    {
        path: '/user/control/updatePhoneBinding/step1',//修改手机绑定 第一步验证旧手机
        name: 'updatePhoneBinding_step1',
        component: () => import('@/views/home/updatePhoneBinding_step1.vue')
    },
    {
        path: '/user/control/updatePhoneBinding/step2',//修改手机绑定 第二步验证新手机
        name: 'updatePhoneBinding_step2',
        component: () => import('@/views/home/updatePhoneBinding_step2.vue')
    },
    {
        path: '/user/control/point',//积分
        name: 'point',
        component: () => import('@/views/home/point.vue')
    },
    {
        path: '/user/control/userLoginLogList',//用户登录日志列表
        name: 'userLoginLogList',
        component: () => import('@/views/home/userLoginLogList.vue')
    },
    {
        path: '/user/control/reportList',//举报列表
        name: 'reportList',
        component: () => import('@/views/home/reportList.vue')
    },
    {
        path: '/findPassWord/step1',//找回密码 第一步
        name: 'findPassWord_step1',
        component: () => import('@/views/findPassWord_step1.vue')
    },
    {
        path: '/findPassWord/step2',//找回密码 第二步
        name: 'findPassWord_step2',
        component: () => import('@/views/findPassWord_step2.vue')
    },

    

    
//    {path : '/:pathMatch(.*)*', redirect:{name:'index'}}//其余路由重定向至首页。
    { path: '/:pathMatch(.*)*', redirect: (to: any) => {

        return { name: 'index' };//重定向的 字符串路径/路径对象
    }},
    
]

export default createRouter({
    history: createWebHistory(),
    routes
})