<!-- 搜索 -->
<template>
    <!-- 页头 -->
    <Header/>
    
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="searchModule">
                <div class="topic-box">
                    <div class="topicList">
                        <template v-if="state.searchResultPage != undefined && state.searchResultPage != null  && state.searchResultPage.records != null && state.searchResultPage.records.length >0">
                            <template v-for="searchResult in state.searchResultPage.records">
                                <div class="topicItem" v-if="searchResult.indexModule == 10">
                                    <div class="avatarBox">
                                        <router-link tag="a" v-if="searchResult.topic.userName != null && searchResult.topic.userName != ''" class="avatarLink" :to="{path:'/user/control/home',query: {userName: searchResult.topic.userName}}" target="_blank">
                                            <img v-if="searchResult.topic.avatarName != null" :src="searchResult.topic.avatarPath+'100x100/'+searchResult.topic.avatarName" class="img">
                                            <img v-if="searchResult.topic.avatarName == null" :src="searchResult.topic.avatar" width="62" height="62" class="img"/>
                                        </router-link>
                                        <a class="avatarLink" v-if="searchResult.topic.userName == null || searchResult.topic.userName == ''">
                                           <img :src="searchResult.topic.avatar" width="62" height="62" class="img"/>
                                        </a>
                                    </div>
                                    <div class="content clearfix">
										<ul class="info">
								        	<li>
								        		<span class="module">话题</span>
								            	<span class="tag">{{searchResult.topic.tagName}}</span>
                                                <router-link tag="a" class="userName" :to="{path:'/user/control/home',query: {userName: searchResult.topic.userName}}" target="_blank">
                                                    {{searchResult.topic.nickname != null && searchResult.topic.nickname != '' ?searchResult.topic.nickname : searchResult.topic.account}}
                                                </router-link>
                                                <span v-if="searchResult.topic.account == null || searchResult.topic.account == ''" class='cancelNickname'>已注销</span>   
								            	<span class="userRoleName" v-for="roleName in searchResult.topic.userRoleNameList">{{roleName}}</span>
								            	<span class="staff" v-if="searchResult.topic.isStaff">官方人员</span>
                                                <span class="postTime">发表时间：{{searchResult.topic.postTime}}</span>
                                                <span class="lastReplyTime" v-if="searchResult.topic.lastReplyTime != null">最新回复：{{searchResult.topic.lastReplyTime}}</span>
								        	</li>
								        </ul>
                                       
										<h2 class="title highlight clearfix">
                                            <router-link tag="a" :to="{path:'/thread',query: {topicId: searchResult.topic.id}}" target="_blank">
                                                <span v-html="searchResult.topic.title"></span>
                                            </router-link>
											<span class="topicRoleName" v-for="roleName in searchResult.topic.allowRoleViewList">{{roleName}}</span>

								            <span class="essence" v-if="searchResult.topic.essence">精华</span>
                                    
                                            <span class="top" v-if="searchResult.topic.sort > 0">置顶</span>
										</h2>
										<div class="clearfix"></div>
										<div class="detail">
                                            <h2 class="summary highlight">
                                                <span v-html="searchResult.topic.content"></span>
                                            </h2>
						                </div>
									</div>
                                    <div class="statistic clearfix">
					                	<div class="viewTotal">
                                            <Icon name="view" size="14px" class="icon"/>
                                            {{searchResult.topic.viewTotal}}
                                        </div>
                                        
                                        <div class="commentTotal">
                                            <Icon name="commentCount" size="14px" class="icon"/>
                                            {{searchResult.topic.commentTotal}}
                                        </div>
									</div>
                                </div>
                                <div class="topicItem" v-if="searchResult.indexModule == 20">
                                    <div class="avatarBox">
                                        <router-link tag="a" v-if="searchResult.question.userName != null && searchResult.question.userName != ''" class="avatarLink" :to="{path:'/user/control/home',query: {userName: searchResult.question.userName}}" target="_blank">
                                            <img v-if="searchResult.question.avatarName != null" :src="searchResult.question.avatarPath+'100x100/'+searchResult.question.avatarName" class="img">
                                            <img v-if="searchResult.question.avatarName == null" :src="searchResult.question.avatar" width="62" height="62" class="img"/>
                                        </router-link>
                                        <a class="avatarLink" v-if="searchResult.question.userName == null || searchResult.question.userName == ''">
                                           <img :src="searchResult.question.avatar" width="62" height="62" class="img"/>
                                        </a>
                                    </div>
                                    <div class="content clearfix">
										<ul class="info">
								        	<li>
								        		<span class="module">问题</span>
                                                <router-link tag="a" class="userName" :to="{path:'/user/control/home',query: {userName: searchResult.question.userName}}" target="_blank">
                                                    {{searchResult.question.nickname != null && searchResult.question.nickname != '' ?searchResult.question.nickname : searchResult.question.account}}
                                                </router-link>
                                                <span v-if="searchResult.question.account == null || searchResult.question.account == ''" class='cancelNickname'>已注销</span>   
								            	<span class="userRoleName" v-for="roleName in searchResult.question.userRoleNameList">{{roleName}}</span>
								            	<span class="staff" v-if="searchResult.question.isStaff">官方人员</span>
                                                <span class="postTime">发表时间：{{searchResult.question.postTime}}</span>
                                                <span class="lastReplyTime" v-if="searchResult.question.lastAnswerTime != null">最新回复：{{searchResult.question.lastAnswerTime}}</span>

								        	</li>
								        </ul>
										<h2 class="title highlight clearfix">
                                            <router-link tag="a" :to="{path:'/question',query: {questionId: searchResult.question.id}}" target="_blank">
                                                <span v-html="searchResult.question.title"></span>
                                            </router-link>
										</h2>
										<div class="clearfix"></div>
										<div class="detail">
											<h2 class="summary highlight">
                                                <span v-html="searchResult.question.content"></span>
											</h2>
						                </div>
									</div>
                                    <div class="statistic clearfix">
					                	<div class="viewTotal">
                                            <Icon name="view" size="14px" class="icon"/>
                                            {{searchResult.question.viewTotal}}
                                        </div>
                                        
                                        <div class="commentTotal">
                                            <Icon name="commentCount" size="14px" class="icon"/>
                                            {{searchResult.question.answerTotal}}
                                        </div>
									</div>
                                </div>
                            </template>
                        </template>
                        <el-skeleton :loading="state.loading" style="padding-top: 25px;"></el-skeleton>
                        <div class="page" v-if="state.isShowPage">
                            <el-pagination background @current-change="handlePage" :current-page="state.currentpage"  :page-size="state.maxresult" :total="state.totalrecord" layout="total, prev, pager, next,jumper" />
                        </div>
                        <el-result v-if="state.loading == false && state.isShowPage == false" icon="info" title="没有找到相关记录" sub-title="建议尝试其他关键字"></el-result>
                    </div>
                </div>      
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
    import { onMounted, getCurrentInstance, ComponentInternalInstance, reactive, computed, } from 'vue'
    import { appStore } from "@/store";
    import { useMeta} from 'vue-meta'
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import { PageView,SearchResult,} from "@/types/index";
    import { AxiosResponse } from 'axios';
    import { letterAvatar } from '@/utils/letterAvatar';


    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();
    


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '搜索 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '搜索 - ' + store.state.title
                },{
                    name: "description",
                    content: '搜索 - ' + store.state.title
                }
            ]
        }))
    )
    
    const state = reactive({
        keyword : '', //关键词
        searchResultPage: {} as PageView<SearchResult>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数  
        
        loading:true,//是否显示骨架屏
        isShowPage:false,//是否显示分页

    });

    //搜索数据
    const searchData = (page: number| undefined) => {
        //清空
        state.searchResultPage = {} as PageView<SearchResult>;
        state.totalrecord = 0
        state.currentpage = 1
        state.totalpage = 1
        state.maxresult = 12
        state.isShowPage = false;//显示分页栏

        let param = {} as any
        if(state.keyword){
			param.keyword = state.keyword
		}
        if(page){
            param.page = page
        }
        proxy?.$axios({
            url: '/search',
            method: 'get',
            params:  param,
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                state.loading = false;//关闭骨架屏
                if(JSON.parse(result.success)){
                    let searchResultPage = result.searchResultPage;
                    if(searchResultPage.records != null && searchResultPage.records.length >0){
                        for(let i:number=0; i<searchResultPage.records.length; i++){
                            let searchResult = searchResultPage.records[i];
                            if(searchResult.indexModule == 10){
                                if(searchResult.topic.nickname != null && searchResult.topic.nickname !=''){
                                    searchResult.topic.avatar = letterAvatar(searchResult.topic.nickname, 62);
                                }else{
                                    searchResult.topic.avatar = letterAvatar(searchResult.topic.account, 62);
                                }
                            }else if(searchResult.indexModule == 20){
                                if(searchResult.question.nickname != null && searchResult.question.nickname !=''){
                                    searchResult.question.avatar = letterAvatar(searchResult.question.nickname, 62);
                                }else{
                                    searchResult.question.avatar = letterAvatar(searchResult.question.account, 62);
                                }
                            }
                        }

                        
                    }

                    state.searchResultPage = searchResultPage;
                    state.totalrecord = parseInt(state.searchResultPage.totalrecord);//服务器返回的long类型已转为String类型
                    state.currentpage = state.searchResultPage.currentpage;
                    state.totalpage = parseInt(state.searchResultPage.totalpage);//服务器返回的long类型已转为String类型
                    state.maxresult = state.searchResultPage.maxresult;

                    if(state.totalrecord >0){
                        state.isShowPage = true;//显示分页栏
                    }
                    
                    
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //分页
    const handlePage = (page: number) => {
        let keyword:string = router.currentRoute.value.query.keyword != undefined ?router.currentRoute.value.query.keyword as string :'';
        let param = {} as any
        if(keyword){
			param.keyword = keyword
		}
        if(page){
            param.page = page
        }

		router.push({
            path: '/search', 
            query:param
		});

        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}

    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'search'){
            let page:number | undefined = undefined;
            let keyword:string = '';
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            if(to.query.keyword != undefined){
                keyword = to.query.keyword as string
            }
            state.keyword = decodeURIComponent(keyword);
            searchData(page);
        }
        
        next();
    });


    onMounted(() => {
        let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
        let keyword:string = router.currentRoute.value.query.keyword != undefined ?router.currentRoute.value.query.keyword as string :'';
        state.keyword = decodeURIComponent(keyword);
        searchData(page);
    }) 
</script>
<style scoped lang="scss">
.searchModule{
    background: #fff;
    padding:0px 15px 0px 15px;
    .topic-box{
        .topicList {
            margin-bottom: 10px;
            .topicItem {
                margin: 0;
                border-bottom: 1px solid $color-black-20;
                padding: 15px 0 10px 0;
                position: relative;
                .avatarBox {
                    position: relative;
                    margin-left: 0px;
                    padding: 0;
                    float: left;
                    .avatarLink {
                        display: block;
                        position: relative;
                        float: left;
                        padding-left: 4px;
                        img {
                            float: none;
                            display: block;
                            width: 62px;
                            height: 62px;
                            float: left;
                            margin-right: 10px;
                            border-radius:62px;
                            position:relative;
                        }
                    }
                }
                .content {
                    /**
                    overflow: auto;
                    overflow-x: hidden;**/
                    margin-left:88px;
                    margin-right:100px;
                    
                    .info {
                        margin-top:2px;
                        margin-bottom: 8px;
                        color: $color-black-40;
                        padding-left: 0;
                        list-style: none;
                        font-size:0;/*父级元素设置font-size:0; 解决 display：inline-block两个元素之间的默认空格 */
                        .tag-container{
                            margin-left:-5px;
                        }
                        .tag{
                            display: inline-block;
                            white-space:nowrap;
                            vertical-align: middle;
                            padding: 4px 7px;
                            margin-left:5px;
                            font-size: 13px;
                            line-height: 14px;
                            -webkit-border-radius: 2px;
                            -moz-border-radius: 2px;
                            border-radius: 2px;
                            color: $color-black-80;
                            background-color: $color-black-20;
                            position: relative;
                            top: -4px;
                        }
                        .module{
                            display: inline-block;
                            min-width: 10px;
                            padding: 4px 7px;
                            font-size: 13px;
                            color: #1890ff;
                            line-height: 1;
                            vertical-align: baseline;
                            white-space: nowrap;
                            text-align: center;
                            background-color: #E8F7FF;
                            border-radius: 2px;
                            
                        }
                        .userName{
                            color: $color-black-60;
                            font-size: 14px;
                            margin-left: 10px;
                        }
                        .cancelNickname{
                            font-size: 14px;
                            font-weight:normal;
                            margin-right: 3px;
                            color: transparent;
                            text-shadow: 0 0 5px rgba(0,0,0,0.4);
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
                        .lastReplyTime{
                            margin-left: 10px;
                            font-size: 14px;
                        }
                    }
                    .info>li{
                        display: inline-block;
                    }
                    .essence{
                        display: inline-block;
                        vertical-align: middle;
                        padding: 2px 4px;
                        margin-left:5px;
                        font-size: 13px;
                        line-height: 14px;
                        -webkit-border-radius: 2px;
                        -moz-border-radius: 2px;
                        border-radius: 2px;
                        color: #fff;
                        background-color: #F76560;
                        position: relative;
                        top: -6px;
                    }
                    .top{
                        display: inline-block;
                        vertical-align: middle;
                        padding: 2px 4px;
                        margin-left:5px;
                        font-size: 13px;
                        line-height: 14px;
                        -webkit-border-radius: 2px;
                        -moz-border-radius: 2px;
                        border-radius: 2px;
                        color: #fff;
                        background-color: #57A9FB;
                        position: relative;
                        top: -6px;
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
                        margin-bottom: 6px;
                    }
                    .title {
                        margin: 0 5px 0 0;
                        font-size:0;/*父级元素设置font-size:0; 解决 display：inline-block两个元素之间的默认空格 */
                        font-weight: normal;
                        a{
                            color: $color-black-90;
                            font-size: 18px;
                            line-height: 32px;
                            &a:hover {
                                text-decoration: none;
                                color: #1890ff;
                            }
                        }
                        .topicRoleName{
                            display: inline-block;
                            white-space:nowrap;
                            vertical-align: middle;
                            padding: 2px 4px;
                            margin-left:5px;
                            font-size: 13px;
                            line-height: 14px;
                            -webkit-border-radius: 2px;
                            -moz-border-radius: 2px;
                            border-radius: 2px;
                            color: #fff;
                            background-color:#F9CC45;
                            position: relative;
                            top: -6px;
                        }
                        .redEnvelope{
                            font-size: 22px;
                            position:relative;
                            top:4px;
                            color: #ff483a;
                            margin-left: 3px;
                        }
                        .hideTagType{
                            font-size:0;/*父级元素设置font-size:0; 解决 display：inline-block两个元素之间的默认空格 */
                            position:relative;top:-4px;
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
                    .detail{
                        position: relative;
                        
                        .videoInfo{
                            margin: 8px 5px 0 0;
                            player{
                                width: 320px;
                                height: 180px;
                                display: block;
                                float: left;
                                margin-right: 8px;
                                margin-bottom: 8px;
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
                                 .circle{
                                    display: inline-block;
                                    position: absolute;
                                    top: 0;  
                                    bottom: 0;  
                                    left: 0;  
                                    right: 0;  
                                    margin: auto;
                                    line-height:180px;
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
                                        left: 0;  
                                        right: 0;  
                                        margin: auto;
                                        color: #fff;
                                    }
                                }
                                :deep(.dplayer-process) {
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
                                            height: 40px;
                                            position: absolute;
                                            left: 0;
                                            top: -100px;
                                            right: 0;
                                            bottom: 0;
                                            margin: auto;
                                            padding :0px 30px;
                                            border-radius :3px;
                                            color: #fff;
                                            line-height: 30px;
                                            font-size: 16px;
                                            background-color:rgb(0,0,0);
                                            opacity:0.7;
                                            text-align: center;
                                            &:before{
                                                content: '';
                                                position: absolute;
                                                left: 0;
                                                top: 0;
                                                right: 0;
                                                bottom: -100px;
                                                margin: auto;
                                                background-color: rgba(255,255,255);
                                                border-radius:30px;
                                                width: 60px;
                                                height: 60px;
                                                opacity:0.3;
                                            }
                                        }
                                    }
                                }
                            }
                            
                        }
                        
                        .summary{
                            margin: 0px 50px 0 0;
                            font-size: 15px;
                            line-height: 28px;
                            font-weight:normal;
                            text-decoration:none;
                            color: $color-black-60;
                        }
                    }

                }
                .statistic {
                    position:absolute;
                    top:17px;
                    right:0px;
                    font-size: 14px;
                    color: $color-black-40;
                    .viewTotal{
                        float: left;margin-right: 4px;min-width: 60px;
                        .icon{
                            margin-left: 3px;position:relative;top: 2px;color: $color-black-30;
                        }
                    }
                    .commentTotal{
                        float: right;margin-right: 10px;min-width: 50px;
                        .icon{
                            margin-left: 3px;position:relative;top: 2px;color: $color-black-30;
                        }
                    }
                }
            }
        }
    }
    :deep(.highlight){
        B{
            color: #F53F3F;
            font-weight:normal;
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
</style>