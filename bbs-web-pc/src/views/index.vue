<!-- 首页 -->
<template>
    <!-- 页头 -->
    <Header @floatWindow="receive_floatWindow"/>

    <div class="main">
        <div class="main-container wrap main-fullScreen">
            <div class="topicModule">
                <div class="left-container" >
                    <div class="left-navigation" ref="headerNavigation">
                        <el-scrollbar ref="tagScrollbar" :max-height="state.tagScrollbarMaxHeight" wrap-style="transition: max-height 0.3s ease 0s;">
                            <div class="item">
                                <router-link tag="a" to="/" class="title" :class="router.currentRoute.value.query.tagId == undefined || router.currentRoute.value.query.tagId == '' ? 'active' :''">
                                    <div class="svg-container">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 20.0001C20 20.5524 19.5523 21.0001 19 21.0001H5C4.44772 21.0001 4 20.5524 4 20.0001V11.0001L1 11.0001L11.3273 1.61162C11.7087 1.26488 12.2913 1.26488 12.6727 1.61162L23 11.0001L20 11.0001V20.0001ZM8 15.0001V17.0001H16V15.0001H8Z"></path></svg>
                                    </div>
                                    <div class="text">全部</div>
                                </router-link>
                        
                                <div class="allowRoleView"></div>
                            </div>
                            
                            <div class="item" v-for="tag in state.tagList">
                                <el-tooltip effect="tag-customized" :disabled="tagTooltipDisabled" :content="tag.name" placement="right">
                                    <router-link v-if="tag.allowRoleViewList != null && tag.allowRoleViewList.length > 0" tag="a" @mouseenter="tagTooltip($event,tag.name)" :to="{path: '/', query:{ tagId : tag.id}}" class="title allowRole" :class="router.currentRoute.value.query.tagId == tag.id ? 'active' :''">
                                        <div class="svg-container">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.80577 5.20031L7.00505 7.99983L11.1913 2.13905C11.5123 1.68964 12.1369 1.58555 12.5863 1.90656C12.6761 1.9707 12.7546 2.04926 12.8188 2.13905L17.0051 7.99983L21.2043 5.20031C21.6639 4.89395 22.2847 5.01813 22.5911 5.47766C22.7228 5.67527 22.7799 5.91332 22.7522 6.1492L21.109 20.1167C21.0497 20.6203 20.6229 20.9998 20.1158 20.9998H3.8943C3.38722 20.9998 2.9604 20.6203 2.90115 20.1167L1.25792 6.1492C1.19339 5.6007 1.58573 5.10374 2.13423 5.03921C2.37011 5.01146 2.60816 5.06856 2.80577 5.20031ZM12.0051 14.9998C13.1096 14.9998 14.0051 14.1044 14.0051 12.9998C14.0051 11.8953 13.1096 10.9998 12.0051 10.9998C10.9005 10.9998 10.0051 11.8953 10.0051 12.9998C10.0051 14.1044 10.9005 14.9998 12.0051 14.9998Z"></path></svg>
                                        </div>
                                        <!-- cell 用js来判断text-overflow是否生效 -->
                                        <div class="text cell">{{tag.name}}</div>
                                    </router-link>
                                    <router-link else tag="a"  @mouseenter="tagTooltip($event,tag.name)" :to="{path: '/', query:{ tagId : tag.id}}" class="title" :class="router.currentRoute.value.query.tagId == tag.id ? 'active' :''">
                                        <div class="svg-container">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.8 19L14 22.5L11.2 19H6C5.44772 19 5 18.5523 5 18V7.10256C5 6.55028 5.44772 6.10256 6 6.10256H22C22.5523 6.10256 23 6.55028 23 7.10256V18C23 18.5523 22.5523 19 22 19H16.8ZM2 2H19V4H3V15H1V3C1 2.44772 1.44772 2 2 2Z"></path></svg>
                                        </div>
                                        <!-- cell 用js来判断text-overflow是否生效 -->
                                        <div class="text cell">{{tag.name}}</div>
                                    </router-link>
                                </el-tooltip>
                                <div class="allowRoleView">
                                    <template v-for="(allowRoleView,index) in tag.allowRoleViewList">
                                        <span class="roleItem">{{allowRoleView}}</span>     
                                    </template>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
                <div class="middle-container">
                    <div class="topic-box">
                        <div class="topicList">
                            <div class="topicItem" v-for="topic in state.pageView.records" >
                            
                                <div class="avatarBox">
                                    <router-link tag="a"  v-if="topic.userName != null && topic.userName != ''" class="avatarLink" :to="{path:'/user/control/home',query: {userName: topic.userName}}" target="_blank">
                                        <img v-if="topic.avatarName != null" :src="topic.avatarPath+'100x100/'+topic.avatarName" class="img">
                                        <img v-if="topic.avatarName == null" :src="topic.avatar" width="62" height="62" class="img"/>
                                        
                                    </router-link>
                                    <a class="avatarLink" v-if="topic.userName == null || topic.userName == ''">
                                        <img :src="topic.avatar" width="62" height="62" class="img"/>
                                    </a>
                                </div>
                                
                                <div class="content clearfix">
                                    
                                    <ul class="info">
                                        <li>
                                            <router-link tag="a" class="userName" :to="{path:'/user/control/home',query: {userName: topic.userName}}" target="_blank">
                                                {{topic.nickname != null && topic.nickname != '' ?topic.nickname : topic.account}}
                                            </router-link>
                                            <span v-if="topic.account == null || topic.account == ''" class='cancelNickname'>已注销</span>   
                                            <span class="userRoleName" v-for="roleName in topic.userRoleNameList">{{roleName}}</span>
                                            
                                            <span class="staff" v-if="topic.isStaff">官方人员</span>
                                        </li>
                                    </ul>
                                    <div class="time clearfix">
                                        <div class="postTime">
                                            {{topic.postTime}}
                                        </div>
                                        <!--
                                        <div class="lastReplyTime" v-if="topic.lastReplyTime != null">
                                            <Icon name="view" size="14px" class="icon"/>
                                            {{topic.lastReplyTime}}
                                        </div>-->
                                    </div>
                                    <div class="cancelAccount" v-if="topic.account == null || topic.account == ''">此用户账号已注销</div>

                                    <h2 class="title clearfix">
                                        <router-link tag="a" :to="{path:'/thread',query: {topicId: topic.id}}" target="_blank">
                                            {{topic.title}}
                                        </router-link>
                                        <span class="topicRoleName" v-for="roleName in topic.allowRoleViewList">{{roleName}}</span>
                                        
                                        <span v-for="(value,key) in topic.hideTagTypeMap" :class="'hideTagType hide_'+key">

                                            <el-tooltip effect="dark" popper-class="popper-transparent" :hide-after="0" :show-after="200" placement="top-start">
                                                <template #content>
                                                    <span v-if="key == 10">输入密码可见</span>
                                                    <span v-if="key == 20">评论话题可见</span>
                                                    <span v-if="key == 30">达到等级可见</span>
                                                    <span v-if="key == 40">积分购买可见</span>
                                                    <span v-if="key == 50">余额购买可见</span>
                                                </template>
                                                <span class="circle point" v-if="value">
                                                    <Icon name="unlock-solid" size="14px" class="icon"/>
                                                </span>
                                            
                                                <span class="circle" v-if="!value">
                                                    <Icon name="lock-solid" size="14px" class="icon"/>
                                                </span>
                                            </el-tooltip>
                                            
                                            
                                        </span>
                                        <span class="essence" v-if="topic.essence">精华</span>
                                        
                                        <span class="top" v-if="topic.sort > 0">置顶</span>
                                        
                                        <span class="redEnvelope" v-if="topic.giveRedEnvelopeId != null && topic.giveRedEnvelopeId != ''" alt="红包" title="红包" >
                                            <Icon name="redEnvelope-1" size="22px"/>
                                        </span>
                                        
                                    </h2>
                                    <div class="clearfix"></div>
                                    
                                    <div class="detail clearfix">
                                        <div class="imageZoom clearfix" v-if="topic.imageInfoList.length > 0" ref="thumbnailRef" :topicId="topic.id">
                                            <ul class="imageZoom-container">
                                                <template v-for="(imageInfo,index) in topic.imageInfoList" >
                                                    <!-- 最多显示5张图片 -->
                                                    <li  v-if="index <5" @click="imageZoom_clickThumbnail(topic.id,imageInfo,index)" ref="imageInfoGroupRef" :topicId="topic.id" :imageInfoIndex="index">
                                                        <!-- 本地缩略图 -->
                                                        <div class="img" v-if="$store.state.fileStorageSystem ==0" :style="{backgroundImage: 'url('+imageInfo.path+'240x240/'+imageInfo.name+')'}"></div>
                                                        
                                                        <!-- SeaweedFS缩略图 使用nginx image_filter的缩略图处理功能 -->
                                                        <div class="img" v-if="$store.state.fileStorageSystem ==10" :style="{backgroundImage: 'url('+imageInfo.path+imageInfo.name+'?width=240)'}"></div>
                                                        
                                                        <!--  MinIO缩略图 使用nginx image_filter的缩略图处理功能 -->
                                                        <div class="img" v-if="$store.state.fileStorageSystem ==20" :style="{backgroundImage: 'url('+imageInfo.path+imageInfo.name+'?width=240)'}"></div>
                                                    
                                                        <!-- 阿里云OSS缩略图 -->
                                                        <div class="img" v-if="$store.state.fileStorageSystem ==30" :style="{backgroundImage: 'url('+imageInfo.path+imageInfo.name+'?x-oss-process=image/resize,w_240)'}"></div>
                                                        
                                                        <b class="photos-arrow"></b> 
                                                    </li>
                                                </template>     
                                            </ul>
                                            <div class="photo-viewer imageZoom-transition" ref="imageViewGroupRef" :topicId="topic.id"> 
                                                <img :src="$store.state.transparentImage"> 
                                                <span class="photo-viewer-navleft" ref="prevButtonRef" @mouseenter="imageZoom_leftHover(topic.id)" @click="imageZoom_leftClick(topic.id,topic.imageInfoList)" :topicId="topic.id"></span> 
                                                <span class="photo-viewer-navright " ref="nextButtonRef" @mouseenter="imageZoom_rightHover(topic.id)" @click="imageZoom_rightClick(topic.id,topic.imageInfoList)" :topicId="topic.id"></span> 
                                            </div>
                                        </div>
                                        
                                        <div class="videoInfo clearfix" v-if="topic.mediaInfoList.length > 0">
                                            <template v-for="(mediaInfo,index) in topic.mediaInfoList">
                                            <!--视频最多显示2个-->
                                                <player v-if="index <2" :ref="'player_'+topic.id+'_'+index"  @click="createVideoPlayer(mediaInfo,index,topic.id);">
                                                    <img class="cover" :src="mediaInfo.cover"/>
                                                    <span class="circle">
                                                        <span class="iconBox">
                                                            <Icon name="control-play" size="30px" class="playIcon"/>
                                                        </span>
                                                    </span>
                                                    
                                                </player>
                                            </template>
                                        </div>

                                        
                                        <h2 class="summary" v-if="topic.imageInfoList.length == 0 && topic.mediaInfoList.length == 0">
                                            {{topic.summary}}
                                        </h2>
                                        
                                    </div>
                                
                                    <div class="bottomInfo clearfix">
                                        <div class="tag-container">
                                            <span class="tag">{{topic.tagName}}</span>
                                        </div>
                                        <div class="statistic">
                                            <div class="viewTotal">
                                                <Icon name="view" size="14px" class="icon"/>
                                                {{topic.viewTotal}}
                                            </div>
                                            <div class="commentTotal">
                                                <Icon name="commentCount" size="14px" class="icon"/>
                                                {{topic.commentTotal}}
                                            </div>
                                        </div>
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
                <div class="right-container">
                    <div class="affix-container">
                        <el-affix target=".affix-container" :offset="state.affix_offset" z-index="1" @scroll="onRightScroll">
                            <div ref="right_ref">
                        
                                <div class="postTopicButton">
                                    <el-button type="primary" size="large" @click="router.push({path: '/addTopic'})" plain style="width: 100%;" ><Icon name="topic" size="15px" class="icon"/> 发话题</el-button>
                                </div>
                                <div class="hotTopic" v-if="state.hotTopicList != null && state.hotTopicList.length >0">

                                    <div class="hot-container">
                                        <div class="title">热门话题</div>
                                        <div class="topicList">
                                            <div class="topicItem" v-for="hotTopic in state.hotTopicList">
                                                <div class="topicIcon"></div>
                                                <div class="info">
                                                    <router-link class="content" :to="{path: '/thread', query:{ topicId : hotTopic.id}}" target="_blank">{{hotTopic.title}}</router-link>
                                                    <div class="statistic">
                                                        <div class="viewTotal">{{hotTopic.viewTotal}} 浏览</div>
                                                        <div class="commentCount">{{hotTopic.commentTotal}} 评论</div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-affix>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="main-container wrap linkModule" v-if="state.linkList != null && Object.keys(state.linkList).length>0 && state.linkList.length >0">
        <div class="link-box">
            <div class="title">友情链接</div>
            <!-- 有图片 -->
            <div class="links-logo">
                <ul class="clearfix">
                    <template v-for="(links) in state.linkList">
                        <li v-if="links.image != null && links.image != ''">
                            <a target="_blank" :href="links.website">
                            <img width="88" height="31" border="0" :alt="links.name" :title="links.name" :src="links.image"></a>
                        </li>
                    </template>
                </ul>
            </div>
            
            <!-- 无图片 -->
            <div class="links-text">
                <ul class="clearfix">
                    <template v-for="(links) in state.linkList">
                        <li v-if="links.image == null || links.image == ''">
                            <a target="_blank" :href="links.website">{{links.name}}</a>
                        </li>
                    </template>
                </ul>
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
    import { onMounted, ref ,nextTick, getCurrentInstance, ComponentInternalInstance, reactive, onUnmounted, computed,} from 'vue'
    import { appStore } from "@/store";
    import { useMeta} from 'vue-meta'
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import { ImageInfo, Links, MediaInfo, PageView,Tag,Topic } from "@/types/index";
    import { AxiosResponse } from 'axios';
    import { letterAvatar } from '@/utils/letterAvatar';
    import pre from '@/assets/images/imageZoom/pre.cur'
    import next from '@/assets/images/imageZoom/next.cur'

    import * as extension from "@/utils/extension";
    import Hls from 'hls.js';
    import DPlayer from 'dplayer';
    import { nativeQueryVideoRedirect, nativeRefreshToken } from '@/utils/http';
    import { isEllipsis } from '@/utils/tool';

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();
    
    const extensionFunction = extension;
    
    //标签导航
    const headerNavigation = ref();
    //缩略图
    const thumbnailRef = ref()
    //图片信息组
    const imageInfoGroupRef = ref()
    //图片展示框组
    const imageViewGroupRef = ref()
    //上一幅图片按钮
    const prevButtonRef = ref()
    //下一幅图片按钮
    const nextButtonRef = ref()

    //标签提示是否禁用
    const tagTooltipDisabled = ref(true)
    //标签滚动条
    const tagScrollbar = ref()

    const right_ref = ref()

    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title: store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: store.state.keywords
                },{
                    name: "description",
                    content: store.state.description
                }
            ]
        })
    ))






    const state = reactive({
        tagList:[] as Array<Tag>,//标签
        pageView: {} as PageView<Topic>,//分页
        totalrecord : 0, //总记录数
		currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数  
        
        loading:true,//是否显示骨架屏
        isShowPage:false,//是否显示分页

        
        tagScrollbarMaxHeight:"calc(100vh - 186px)",

        videoPlayerBind: [] as Array<string>,//视频播放器绑定Id集合
		videoPlayerList: [] as Array<any>,//视频播放器集合
        playerHlsList: [] as Array<any>,//视频播放流对象集合   
		placeholder_DPlayer:'' as any,//占位播放器
		lastPlayerId:'',//最后运行的播放Id

        hotTopicList:[] as Array<Topic>, //热门话题集合

        linkList:[] as Array<Links>,//友情链接

        affix_offset:10,//固钉偏移距离

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

    //右边栏滚动事件
    const onRightScroll = (value: { scrollTop: number, fixed: boolean }) => {
        let clientHeight = document.documentElement.clientHeight;
        let rightOffsetHeight = right_ref.value.offsetHeight;
        if(rightOffsetHeight > clientHeight){
            state.affix_offset = -(rightOffsetHeight - clientHeight + 10);
        }
    }

    //查询标签列表
    const queryTagList = () => {
        proxy?.$axios({
            url: '/allTag',
            method: 'get',
            params:  {},
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: Array<Tag>) => {
            state.tagList = data;
            
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //查询话题列表
    const queryTopicList = (tagId:string,page: number) => {
        let param = {} as any
        if(tagId){
			param.tagId = tagId
		}
        if(page){
            param.page = page
        }
        
        proxy?.$axios({
            url: '/queryTopicList',
            method: 'get',
            params:  param,
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: PageView<Topic>) => {

            //清除播放器
            clearPlayer();
            state.loading = false;//关闭骨架屏
            if(data.records != null && data.records.length >0){
                for(let i:number=0; i<data.records.length; i++){
                    let topic = data.records[i];
                    if(topic.nickname != null && topic.nickname !=''){
                        topic.avatar = letterAvatar(topic.nickname, 62);
                    }else{
                        topic.avatar = letterAvatar(topic.account, 62);
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
        let tagId:string = router.currentRoute.value.query.tagId != undefined ?router.currentRoute.value.query.tagId as string :'';
        let param = {} as any
        if(tagId){
			param.tagId = tagId
		}
        if(page){
            param.page = page
        }

		router.push({
            path: '/index', 
            query:param
		});

        router.afterEach(() => {
            window.scrollTo(0,0); //切换路由之后滚动条始终在最顶部
        });
	}

    //图片放大 -- 初始化
    const imageZoomInit = () => {

    }
    //图片放大 -- 点击缩略图
    const imageZoom_clickThumbnail = (topicId:string,imageInfo:ImageInfo,index:number) => {
        if(imageInfoGroupRef.value && imageInfoGroupRef.value.length >0){
            for(let i =0; i< imageInfoGroupRef.value.length; i++){
                let imageInfoGroup = imageInfoGroupRef.value[i];
                let imageInfo_topicId = imageInfoGroup.getAttribute("topicId");
                let imageInfo_index = imageInfoGroup.getAttribute("imageInfoIndex");
                let imageInfo_class = imageInfoGroup.getAttribute("class");
                let isSelected = (imageInfo_class == 'item-current') ? true :false//是否选中

                let src = imageInfo.path+imageInfo.name;
                
                //获取放大框的宽度
                let thumbnailContainerWidth = 0
                for(let k =0; k< thumbnailRef.value.length; k++){
                    let thumbnail = thumbnailRef.value[k];
                    let thumbnail_topicId = thumbnail.getAttribute("topicId");
                    if(thumbnail_topicId == topicId){
                        thumbnailContainerWidth = parseInt(getComputedStyle(thumbnail).width)
                    }
                }

                if(imageInfo_topicId == topicId){
                    //全部取消选中
                    imageInfoGroup.setAttribute("class","")
                }
                

                if(imageInfo_topicId == topicId && parseInt(imageInfo_index) == index){
                    imageInfoGroup.setAttribute("class","item-current")//选中
                    
                    for(let j =0; j< imageViewGroupRef.value.length; j++){
                        let imageViewGroup = imageViewGroupRef.value[j];
                        let imageView_topicId = imageViewGroup.getAttribute("topicId");
                        if(imageInfo_topicId == imageView_topicId){
                            if (!isSelected) {//伸展
                                //计算图片大小
                                imageZoom_setImageSize(thumbnailContainerWidth,topicId,imageViewGroup,src,(img:any) =>{
                                    imageViewGroup.querySelector('img').setAttribute("src", src);
                                })
                            }
                            if (isSelected) {//收缩
                                imageViewGroup.setAttribute("style", "width: 0px; height: 0px;padding-bottom: 0px");
                                imageInfoGroup.setAttribute("class","")
                            }
                        }
                    }
                }
            }
        }
    }


    //图片放大 -- 鼠标经过
    const imageZoom_leftHover = (topicId:string) => {

        //选中索引
        let index = 0;

        if(imageInfoGroupRef.value && imageInfoGroupRef.value.length >0){
            for(let i =0; i< imageInfoGroupRef.value.length; i++){
                let imageInfoGroup = imageInfoGroupRef.value[i];
                let imageInfo_topicId = imageInfoGroup.getAttribute("topicId");
                let imageInfo_index = imageInfoGroup.getAttribute("imageInfoIndex");
                let imageInfo_class = imageInfoGroup.getAttribute("class");
                let isSelected = (imageInfo_class == 'item-current') ? true :false//是否选中
                if(imageInfo_topicId == topicId && isSelected){
                    index = parseInt(imageInfo_index);
                }
            }
        }

        for(let i =0; i< prevButtonRef.value.length; i++){
            let prevButton = prevButtonRef.value[i];
            let prevButton_topicId = prevButton.getAttribute("topicId");
            if(prevButton_topicId == topicId){
                if (index < 1) {
                    prevButton.style.cursor = "auto"
                }else{
                    prevButton.style.cursor = "url('"+pre+"'), auto"
                }
            }
        }
    }

    //图片放大 -- 鼠标经过
    const imageZoom_rightHover = (topicId:string) => {
        //选中索引
        let index = 0;
        let count = 0;
        if(imageInfoGroupRef.value && imageInfoGroupRef.value.length >0){
            for(let i =0; i< imageInfoGroupRef.value.length; i++){
                let imageInfoGroup = imageInfoGroupRef.value[i];
                let imageInfo_topicId = imageInfoGroup.getAttribute("topicId");
                let imageInfo_index = imageInfoGroup.getAttribute("imageInfoIndex");
                let imageInfo_class = imageInfoGroup.getAttribute("class");
                let isSelected = (imageInfo_class == 'item-current') ? true :false//是否选中
                if(imageInfo_topicId == topicId && isSelected){
                    index = parseInt(imageInfo_index);
                }
                if(imageInfo_topicId == topicId){
                    count ++;
                }
            }
            
        }

        for(let i =0; i< nextButtonRef.value.length; i++){
            let nextButton = nextButtonRef.value[i];
            let nextButton_topicId = nextButton.getAttribute("topicId");
            if(nextButton_topicId == topicId){
                if (index >= count - 1) {
                    nextButton.style.cursor = "auto"
                }else{
                    nextButton.style.cursor = "url('"+next+"'), auto"
                }
            }
        }
    }

    //图片放大 -- 左切换
    const imageZoom_leftClick = (topicId:string,imageInfoList:Array<ImageInfo>) => {
       
        //获取放大框的宽度
        let thumbnailContainerWidth = 0
        for(let k =0; k< thumbnailRef.value.length; k++){
            let thumbnail = thumbnailRef.value[k];
            let thumbnail_topicId = thumbnail.getAttribute("topicId");
            if(thumbnail_topicId == topicId){
                thumbnailContainerWidth = parseInt(getComputedStyle(thumbnail).width)
            }
        }
        //选中话题内图片索引
        let index = 0;
        //索引
        let imageInfoGroupRefIndex = 0;
        if(imageInfoGroupRef.value && imageInfoGroupRef.value.length >0){
            for(let i =0; i< imageInfoGroupRef.value.length; i++){
                let imageInfoGroup = imageInfoGroupRef.value[i];
                let imageInfo_topicId = imageInfoGroup.getAttribute("topicId");
                let imageInfo_index = imageInfoGroup.getAttribute("imageInfoIndex");
                let imageInfo_class = imageInfoGroup.getAttribute("class");
                let isSelected = (imageInfo_class == 'item-current') ? true :false//是否选中
                if(imageInfo_topicId == topicId && isSelected){
                    index = parseInt(imageInfo_index);//选中
                    imageInfoGroupRefIndex = i;
                }
                
            }

            if(index-1 >= 0){
                for(let i =0; i< imageInfoGroupRef.value.length; i++){
                    let imageInfoGroup = imageInfoGroupRef.value[i];
                    let imageInfo_topicId = imageInfoGroup.getAttribute("topicId");
                    if(imageInfo_topicId == topicId){
                        //全部取消选中
                        imageInfoGroup.setAttribute("class","")
                    }
                }
                //上一项
                let before_imageInfoGroup = imageInfoGroupRef.value[imageInfoGroupRefIndex-1];
                let before_imageInfo_topicId = before_imageInfoGroup.getAttribute("topicId");

                let before_src = imageInfoList[index-1].path+imageInfoList[index-1].name;
               

                before_imageInfoGroup.setAttribute("class","item-current")//选中
                
                for(let j =0; j< imageViewGroupRef.value.length; j++){
                    let imageViewGroup = imageViewGroupRef.value[j];
                    let imageView_topicId = imageViewGroup.getAttribute("topicId");
                    if(before_imageInfo_topicId == imageView_topicId){
                        
                        //计算图片大小
                        imageZoom_setImageSize(thumbnailContainerWidth,topicId,imageViewGroup,before_src,(img:any) =>{
                            imageViewGroup.querySelector('img').setAttribute("src", before_src);
                        })
                        
                    }
                }

                
            }
            if(index <=1){
                for(let k =0; k< prevButtonRef.value.length; k++){
                    let prevButton = prevButtonRef.value[k];
                    let prevButton_topicId = prevButton.getAttribute("topicId");
                    if(prevButton_topicId == topicId){
                        prevButton.style.cursor = "auto"
                    }
                }
            }
        }
    }

    //图片放大 -- 右切换
    const imageZoom_rightClick = (topicId:string,imageInfoList:Array<ImageInfo>) => {
        //获取放大框的宽度
        let thumbnailContainerWidth = 0
        for(let k =0; k< thumbnailRef.value.length; k++){
            let thumbnail = thumbnailRef.value[k];
            let thumbnail_topicId = thumbnail.getAttribute("topicId");
            if(thumbnail_topicId == topicId){
                thumbnailContainerWidth = parseInt(getComputedStyle(thumbnail).width)
            }
        }
         //选中话题内图片索引
        let index = 0;
        //索引
        let imageInfoGroupRefIndex = 0;
        let count = 0;
        if(imageInfoGroupRef.value && imageInfoGroupRef.value.length >0){
            for(let i =0; i< imageInfoGroupRef.value.length; i++){
                let imageInfoGroup = imageInfoGroupRef.value[i];
                let imageInfo_topicId = imageInfoGroup.getAttribute("topicId");
                let imageInfo_index = imageInfoGroup.getAttribute("imageInfoIndex");
                let imageInfo_class = imageInfoGroup.getAttribute("class");
                let isSelected = (imageInfo_class == 'item-current') ? true :false//是否选中
                if(imageInfo_topicId == topicId && isSelected){
                    index = parseInt(imageInfo_index);//选中
                    imageInfoGroupRefIndex = i;
                }
                if(imageInfo_topicId == topicId){
                    count ++;
                }
            }
           
            if(index+1 < count){
                for(let i =0; i< imageInfoGroupRef.value.length; i++){
                    let imageInfoGroup = imageInfoGroupRef.value[i];
                    let imageInfo_topicId = imageInfoGroup.getAttribute("topicId");
                    if(imageInfo_topicId == topicId){
                        //全部取消选中
                        imageInfoGroup.setAttribute("class","")
                    }
                }
                //下一项
                let after_imageInfoGroup = imageInfoGroupRef.value[imageInfoGroupRefIndex+1];
                let after_imageInfo_topicId = after_imageInfoGroup.getAttribute("topicId");

                let after_src = imageInfoList[index+1].path+imageInfoList[index+1].name;
              
                after_imageInfoGroup.setAttribute("class","item-current")//选中
                
                for(let j =0; j< imageViewGroupRef.value.length; j++){
                    let imageViewGroup = imageViewGroupRef.value[j];
                    let imageView_topicId = imageViewGroup.getAttribute("topicId");
                    if(after_imageInfo_topicId == imageView_topicId){
                        
                        //计算图片大小
                        imageZoom_setImageSize(thumbnailContainerWidth,topicId,imageViewGroup,after_src,(img:any) =>{
                            imageViewGroup.querySelector('img').setAttribute("src", after_src);
                        })
                        
                    }
                }

                
            }
            
            for(let i =0; i< nextButtonRef.value.length; i++){
                let nextButton = nextButtonRef.value[i];
                let nextButton_topicId = nextButton.getAttribute("topicId");
                if(nextButton_topicId == topicId){
                    if ((index+1) >= count - 1) {
                        nextButton.style.cursor = "auto"
                    }
                }
            }
            
        }
    }

    /**
     * 设置图片框大小
     * width 放大框的宽度
     * topicId 
     * imageView 图片展示区域
     * src 图片路径
     * callback 回调
     */
    const imageZoom_setImageSize = (width:number,topicId:string,imageView:any,src:string,callback:any) => {
        if(src){
            let img = new Image();
            img.onload = function () {
                let imageWidth = img.width;
                let imageHeight = img.height;
                //最大宽度
                if(imageWidth >width){
                	imageWidth = width;
                //	imageHeight = img.height/(img.width/imageWidth);
                	imageHeight =  width*img.height/img.width;
                }
                imageView.setAttribute("style", "width: "+imageWidth+"px; height: "+imageHeight+"px;padding-bottom: 8px");

                for(let i =0; i< prevButtonRef.value.length; i++){
                    let prevButton = prevButtonRef.value[i];
                    let prevButton_topicId = prevButton.getAttribute("topicId");
                    if(prevButton_topicId == topicId){
                       prevButton.style.width = (imageWidth / 2)+'px';
                       prevButton.style.height = imageHeight +'px';

                    }
                }
                for(let i =0; i< nextButtonRef.value.length; i++){
                    let nextButton = nextButtonRef.value[i];
                    let nextButton_topicId = nextButton.getAttribute("topicId");
                    if(nextButton_topicId == topicId){
                        nextButton.style.width = (imageWidth / 2)+'px';
                        nextButton.style.height = imageHeight+'px';
                    }
                }
     
                callback(img);
            }
            img.src = src;//src 属性要写到 onload 的后面


        }
    }

    //创建视频播放器
    const createVideoPlayer = (mediaInfo:MediaInfo,index:number,topicId:string) => {
        if(state.videoPlayerBind.contains(topicId+'_'+index)){
		    return;
		}
        
        let playerRefValue = (proxy?.$refs['player_'+topicId+'_'+index] as any)[0];
        playerRefValue.setAttribute('id','player_'+topicId+'_'+index);
 
        if(mediaInfo.mediaUrl == null || mediaInfo.mediaUrl == ""){
            if(playerRefValue.querySelector('.dplayer-process') == null){
                let dom = document.createElement('div');
                dom.innerHTML="<div class='dplayer-process'><div class='box'><div class='prompt'>视频处理中，请稍后再刷新</div></div></div>";
                playerRefValue.appendChild(dom);
            }
        }else{
            state.videoPlayerBind.push(topicId+'_'+index);//视频播放器绑定Id
            
            if(mediaInfo.cover != undefined && mediaInfo.cover != "" && mediaInfo.thumbnail != undefined && mediaInfo.thumbnail != ""){//切片视频
                let hls = null;
                let dp = new DPlayer({
                    container: playerRefValue,//播放器容器元素
                    screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
					hotkey: true,//开启热键，支持快进、快退、音量控制、播放暂停
					preload: 'none', //禁止视频预加载
                    video: {
                        url: mediaInfo.mediaUrl,
                        pic: mediaInfo.cover,//视频封面
                        thumbnails: mediaInfo.thumbnail,//视频预览图
                        type: 'customHls',
                        customType: {
                            customHls: function (video:any, player:any) {
                                hls = new Hls();
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
                dp.play();//播放视频
                
                dp.on('play', function () {//播放事件
                    state.lastPlayerId = dp.container.getAttribute('id');
                });
                dp.on('pause', function () {//暂停事件
                    playPlaceholderPlayer(dp.container.getAttribute('id'));
                });
                state.videoPlayerList.push(dp);//视频播放器
                state.playerHlsList.push(hls);
            }else{
                let dp = new DPlayer({
                    container: playerRefValue,//播放器容器元素
                    screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                    hotkey: true,//开启热键，支持快进、快退、音量控制、播放暂停
					preload: 'none', //禁止视频预加载
                    video: {
                        url: mediaInfo.mediaUrl
                    }
                });
                dp.play();//播放视频
                
                dp.on('play', function () {//播放事件
                    state.lastPlayerId = dp.container.getAttribute('id');
                });
                dp.on('pause', function () {//暂停事件
                    playPlaceholderPlayer(dp.container.getAttribute('id'));
                });
                state.videoPlayerList.push(dp);//视频播放器
            }
            
            
        }
    }

     //占位播放器播放
     const playPlaceholderPlayer = (playerId:string) => {
        if(state.placeholder_DPlayer != ""){
            if(state.lastPlayerId == playerId){
                state.placeholder_DPlayer.play();
            }
        }
     }

      //清除播放器
      const clearPlayer = () => {
        for(let i =0; i<state.videoPlayerList.length; i++){
			var videoPlayer = state.videoPlayerList[i];
			videoPlayer.destroy();//销毁播放器
		}
        for(let i=0; i< state.playerHlsList.length; i++){
            let hls = state.playerHlsList[i];
            hls.destroy();//销毁视频流
        }
		if(state.placeholder_DPlayer != ""){
			state.placeholder_DPlayer.destroy();//销毁播放器
		}
        state.videoPlayerBind.length =0
        state.videoPlayerList.length =0;
        state.playerHlsList.length = 0;//清空数组
        state.lastPlayerId = '';

        if(state.placeholder_DPlayer != ""){
			state.placeholder_DPlayer.destroy();//销毁播放器
		}
     }

     //查询热门话题
    const queryHotTopic = () => {
        proxy?.$axios({
            url: '/queryHotTopic',
            method: 'get',
            params:  {
            },
        })
        .then((response: AxiosResponse) => {
            return response?.data;
        })
        .then((data: Array<Topic>) => {
            state.hotTopicList.length =0;

            if(data){
                state.hotTopicList = data;
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }

     //查询友情链接
     const queryLink = () => {
        proxy?.$axios({
            url: '/queryLink',
            method: 'get',
            params:  {},
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: Array<Links>) => {
            if(data != null && data.length >0){
                for(let i:number=0; i<data.length; i++){
                    let links = data[i];
                }
            }
            state.linkList = data;
        })
        .catch((error: any) =>{
            console.log(error);
        });
     }

     

    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'index'){
            let page:number = 1;
            let tagId:string = '';
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            if(to.query.tagId != undefined){
               tagId = to.query.tagId as string
            }
            queryTagList();
            queryTopicList(tagId,page);
            //查询热门话题
            queryHotTopic();
             //查询友情链接
            queryLink();
        }
        
        next();
    });

    onMounted(() => {
        let page:number = (router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != '') ? parseInt(router.currentRoute.value.query.page as string) :1;

        let tagId:string = router.currentRoute.value.query.tagId != undefined ?router.currentRoute.value.query.tagId as string :'';
        
        queryTagList();
        queryTopicList(tagId,page);

        //查询热门话题
        queryHotTopic();

        //查询友情链接
        queryLink();
    }) 

    //卸载组件实例后调用
    onUnmounted (()=>{
        //清除播放器
        clearPlayer();
    })
</script>

<style scoped lang="scss">
.topicModule{
    display: flex;
    .left-container{
        width: 180px;
        margin-right: 10px;
        .left-navigation{
            width: 180px;
            background: #fff;
            padding: 8px 0px 8px 0px;
            box-sizing: border-box;
            border-radius: 2px;
            box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
            position: fixed;
            top:70px;
            transition: top 0.3s ease 0s;
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
                            fill: $color-black-60;
                            margin-right: 10px;
                            transition: fill .3s;
                            width: 16px;
                            height: 16px;
                        }
                    }
                    
                    &:hover {
                        color: $color-black-90;
                        background: $color-black-10;
                    }

                    &:hover svg {
                        fill: $color-black-70;
                    }
                }
                .mouse{
                    cursor:default;
                    &:hover {
                        color: $color-black-90;
                        background: #fff;
                    }

                    &:hover svg {
                        fill: $color-black-60;
                    }
                }
                .title.active{
                    color: $color-black-90;
                    background: $color-black-10 !important;
                    svg{
                        fill: $color-black-70;
                    }
                }
                .allowRole{
                    color: #e2b46e;
                    .svg-container{
                        svg {
                            fill: #e2b46e;
                        }
                    }
                    &:hover {
                        color: #e2b46e;
                        background-color: #f8e7c4;
                    }
                    &:hover svg {
                        fill: #e2b46e;
                    }
                }
                .allowRole.active{
                    color: #e2b46e;
                    background: #f8e7c4 !important;
                    svg{
                        fill: #e2b46e;
                    }
                }
            }
            .allowRoleView{
                margin-left: 38px;
                margin-top: 4px;
                margin-bottom: 4px;
                .roleItem {
                    font-size: 14px;
                    line-height: 28px;
                    color: #EDCD99;
                    word-break: break-all;
                    margin-right: 12px;
                    &:last-child{
                        margin-right: 0px;
                    }
                }

            }
        }
    }

    .middle-container{
        flex: 1;

        .topic-box{
            background: #fff;
            box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
            .topicList {
                margin-left: 10px;
                margin-right: 10px;
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
                        
                        .info {
                            margin-top:2px;
                            margin-bottom: 2px;
                            color: $color-black-40;
                            padding-left: 0;
                            list-style: none;
                            font-size:0;/*父级元素设置font-size:0; 解决 display：inline-block两个元素之间的默认空格 */
                            
                            .module{
                                display: inline-block;
                                min-width: 10px;
                                padding: 4px 7px;
                                font-size: 12px;
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
                                font-size: 15px;
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
                        }
                        .info>li{
                            display: inline-block;
                        }
                        .time {
                            font-size: 14px;
                            color: $color-black-50;
                        }
                        .essence{
                            display: inline-block;
                            vertical-align: middle;
                            padding: 2px 4px;
                            margin-left:5px;
                            font-size: 14px;
                            line-height: 16px;
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
                            font-size: 14px;
                            line-height: 16px;
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
                                &:hover {
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
                                font-size: 14px;
                                line-height: 16px;
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
                                    width: 319px;
                                    height: 180px;
                                    display: block;
                                    float: left;
                                    margin-right: 8px;
                                    margin-bottom: 8px;
                                    background: #000;
                                    position: relative;
                                    text-align: center;
                                    &:last-child{
                                        margin-right: 0px;
                                    }
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
                                margin: 5px 50px 0 0;
                                font-size: 15px;
                                line-height: 28px;
                                font-weight:normal;
                                text-decoration:none;
                                color: $color-black-60;
                            }
                        }
                        .bottomInfo{
                            margin-top:10px;
                            .tag-container{
                                float: left;
                                .tag{
                                    display: inline-block;
                                    white-space:nowrap;
                                    vertical-align: middle;
                                    padding: 0px 8px;
                                    font-size: 14px;
                                    line-height: 24px;
                                    -webkit-border-radius: 2px;
                                    -moz-border-radius: 2px;
                                    border-radius: 2px;
                                    color: $color-black-80;
                                    background-color: $color-black-20;
                                    position: relative;
                                    top: 0px;
                                }
                            }
                            .statistic{
                                float: right;
                                font-size: 14px;
                                position: relative;
                                top: 2px;
                                color: $color-black-50;
                                .viewTotal{
                                    float: left;margin-right: 30px;
                                    .icon{
                                        margin-left: 3px;position:relative;top: 2px;color: $color-black-40;
                                    }
                                }
                                .commentTotal{
                                    float: left;margin-right: 8px;
                                    .icon{
                                        margin-left: 3px;position:relative;top: 2px;color: $color-black-40;
                                    }
                                }
                            }
                            
                        }
                    }
                }
            }
        }
        .highlight{
            B{
                color: #F53F3F;
                font-weight:normal;
            }
        }
        .page{
            height: 100px;
            padding-top: 50px;
            display: flex;
            justify-content: flex-end;
            background: #fff;
        }
    }


    .right-container{
        width: 250px;
        margin-left: 10px;
        .affix-container{
            height: 100%;
        }
        .postTopicButton{
            box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
            padding: 30px 30px;
            background: #fff;
            border-radius:2px;
            .icon{
                margin-right: 3px;
            }
        }
        .hotTopic{
            margin-top: 10px;
            box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
            .hot-container{
                background-color: #fff;
                border-radius: 2px;
                padding: 0 15px 0;
                .title{
                    display: -webkit-box;
                    display: -moz-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-align: center;
                    -moz-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;

                    font-size: 18px;
                    padding: 20px 0 15px;
                    color: $color-black-90;
                    border-bottom: 1px solid $color-black-20;
                }
                .topicList{
                    .topicItem{
                        padding: 12px 0;
                        cursor: pointer;
                        display: -webkit-box;
                        display: -moz-box;
                        display: -ms-flexbox;
                        display: flex;
                        .info{
                            .content{
                                margin-bottom: 8px;
                                font-size: 15px;
                                line-height: 24px;
                                color: $color-black-80;
                                
                                overflow : hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;
                                &:hover {
                                    color: #1890ff;
                                }
                            }
                            .statistic{
                                display: -webkit-box;
                                display: -moz-box;
                                display: -ms-flexbox;
                                display: flex;
                                -webkit-box-align: center;
                                -moz-box-align: center;
                                -ms-flex-align: center;
                                align-items: center;
                                .viewTotal{
                                    height: 17px;
                                    font-size: 12px;
                                    color: $color-black-50;
                                    line-height: 17px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                }
                                .commentCount{
                                    height: 17px;
                                    font-size: 12px;
                                    color: $color-black-50;
                                    line-height: 17px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                    margin-left: 24px;
                                }
                            }
                        }
                    }
                }
            }
            
        }
    }
}



.imageZoom{
	margin-top: 8px;
	zoom: 1;
    .imageZoom-transition{
        transition: all 0.2s ease-in;
    }
    .imageZoom-container {
        margin: 2px 0px 0px 0px;
        list-style-type: none;
        height: 115px;
        zoom: 1;
        li {
            float: left;
            border: 2px solid #f2f2f2;
            padding: 2px;
            margin-right: 5px;
            margin-bottom: 4px;
            position: relative;
            transition: border-color .2s ease-out;
            width:110px;
            height: 110px;
        }
        .item-current {
            border: 2px solid #f4931a;
            border-radius: 2px;
            -webkit-border-radius: 2px;
            -moz-border-radius: 2px;
            -o-border-radius: 2px;
            
            .photos-arrow {
                filter: alpha(opacity=100);
                opacity: 1;
                bottom: -13px;
            }
            .img {
                cursor:zoom-out;
            }
        }
        .photos-arrow {
            width: 0;
            height: 0;
            line-height: 0;
            font-size: 0;
            border: 6px dashed transparent;
            border-top: 6px solid #f4931a;
            position: absolute;
            left: 53px;
            filter: alpha(opacity=0);
            opacity: 0;
            bottom: -8px;
            background: 0 0;
        }
        .img {
            padding-bottom: 100%;
            height: 0;
            background:no-repeat ;
            background-size:cover;
            display: block;
            cursor:zoom-in;
        }
    }
    .photo-viewer {
        position: relative;
        margin: 10px 0px -5px 0px;
        width: 0px;
        height: 0px;
        background: #fff;
        overflow: hidden;
        img{
            max-width:100%;
            height:auto;
            border:none;
            background:none;
            margin:0;
            padding:0;
        }
        .photo-viewer-navleft {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 50px;
            background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==);
        }
        .photo-viewer-navright {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 50px;
            background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==);
        }
    }
}


/* 友情链接 */
.linkModule {
    margin-top: 10px;
	.link-box{
        background:#fff;padding:0px 15px 0px 15px;
        margin-left: 190px;
        box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
        .title {
            clear: both;
            padding: 10px 0 0px 2px;
            margin-bottom: 12px;
            color: $color-black-50;
            font-weight: bold;
            font-size: 15px;
            line-height: 38px;
            border-bottom: 1px dashed $color-black-30;
        }
        .links-logo {
            clear: both;
            li {
                padding: 0px 0px 12px 0px;
                width: 155px;
                height: 32px;
                float: left;
                margin-right: 10px;
            }
        }
        .links-text {
            padding: 0px 0px 12px 0px;
            li {
                float: left;
                width: 155px;
                font-size: 14px;
                line-height: 36px;
                margin-right: 10px;
            }
        }
    }
}

</style>
