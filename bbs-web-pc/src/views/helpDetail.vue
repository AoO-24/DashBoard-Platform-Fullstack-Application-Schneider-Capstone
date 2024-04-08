<!--帮助内容-->
<template>
    <!-- 页头 -->
    <Header/>

    <div class="main">
        <div class="main-container wrap">
            <div class="helpDetailModule">
                <div class="left">
                    <div class="nav-wrap">
                        <!-- 导航 -->
                        <div class="helpTypeName">
                            <div class="name">{{state.helpNavigationName}}</div>
                        </div>
                        
                        <!-- 帮助列表 -->
                        <div class="helpName" v-if="state.helpList != null && state.helpList.length >0">
                            <template v-for="help in state.helpList">
                                <router-link tag="a" :to="{path:'/helpDetail?',query: {helpTypeId: state.helpTypeId,helpId:help.id}}" >
                                    <span>{{help.name}}</span>
                                </router-link>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <!-- 帮助内容-->
                    <div class="help-wrap">
                        <div class="helpBox" v-if="state.help != null && Object.keys(state.help).length > 0">
                            <div class="title">{{state.help.name}}</div>
                            
                            <div class="helpInfo clearfix" >
                                <div class="postTime">{{state.help.times}}</div>
                            </div>
                            
                            <div :class="[state.help.isMarkdown != null && state.help.isMarkdown == true ? 'markdown-body-custom helpMarkdownContent' : 'content']" :ref="'help_'+state.help.id">
                                <RenderTemplate @click-onDownload="onDownload" :html="state.help.content"></RenderTemplate>       
                            </div>
                        </div>
                        <el-result v-if="state.loading == false && (state.help == null || Object.keys(state.help).length == 0)" icon="info" title="没有找到相关记录"></el-result>
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
    import { onMounted, nextTick, getCurrentInstance, ComponentInternalInstance, reactive, onUnmounted, computed, onUpdated, watchEffect,} from 'vue'
    import { ElImage} from 'element-plus'
    import { appStore } from "@/store";
    import { useMeta} from 'vue-meta'
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import { Help } from "@/types/index";
    import { AxiosResponse } from 'axios';
    import Icon from "@/components/icon/Icon.vue";
    import Hls from 'hls.js';
    import DPlayer from 'dplayer';
    import { escapeHtml, escapeVueHtml,unescapeHtml } from '@/utils/escape';
    import { getLanguageClassName, insertAfter} from '@/utils/tool';
    import Prism from "prismjs";
    import { nativeQueryVideoRedirect, nativeRefreshToken } from '@/utils/http';
    import mermaid from "mermaid";
    import katex from 'katex'
    import 'katex/dist/katex.css'   


    mermaid.mermaidAPI.initialize({ startOnLoad: false });


    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    //html页元信息
    const computedMeta = computed(() => ({ 
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
    }))
    const { meta } = useMeta(
        computedMeta
    )
    //监听网站标题
    watchEffect(() => {
        const titleValue = computedMeta.value.title
        if(titleValue != null && titleValue != '' && state.help != null && Object.keys(state.help).length > 0){
            meta.title = (state.help.name != null ? state.help.name : '') +  ' - ' + computed(() => store.state.title).value;	
            meta.meta[0].content = (state.help.name != null ? state.help.name : '') +  ' - ' + computed(() => store.state.title).value;
            meta.meta[1].content = (state.help.name != null ? state.help.name : '') +  ' - ' + computed(() => store.state.title).value;
        }
    }, {
        flush: 'post'//在组件更新后触发，第一次运行需要组件渲染完成才执行
    })
    
    const state = reactive({
        helpTypeId : '',//帮助分类Id
        helpId : '',//帮助Id
        help : {} as Help, //帮助
        helpList : [] as Array<Help>, //帮助列表
        helpNavigationName : '', //帮助导航名称(导航最后一个节点名称)

        playerIdList: [] as Array<string>,//视频播放Id列表
		playerObjectList: [] as Array<any>,//视频播放对象集合
        playerHlsList: [] as Array<any>,//视频播放流对象集合
		playerNodeList: [] as Array<any>,//视频节点对象集合

        loading:true,//是否显示骨架屏
    });

    

    //查询帮助导航
    const queryHelpNavigation = (helpTypeId:string) => {
        proxy?.$axios({
            url: '/queryHelpNavigation',
            method: 'get',
            params:  {
                helpTypeId:helpTypeId
            },
            //showLoading: false,//是否显示加载图标
            //loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                
                if(result && Object.keys(result).length >0){
                    for(let key in result){
                        state.helpNavigationName = result[key];
					}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //查询帮助列表
    const queryHelpList = (helpTypeId:string,callback: any) => {
        proxy?.$axios({
            url: '/queryHelpList',
            method: 'get',
            params:  {
                helpTypeId: helpTypeId
            },
            //showLoading: false,//是否显示加载图标
            //loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: Array<Help>) => {
            if(data != null && data.length > 0){
                state.helpList = data;
                callback();
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //查询帮助
    const queryHelp = (helpId:string) => {
        proxy?.$axios({
            url: '/queryHelp',
            method: 'get',
            params:  {
                helpId: helpId
            },
            //showLoading: false,//是否显示加载图标
            //loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: Help) => {
            state.loading = false;//关闭骨架屏
            if(data){
                //清空播放器
                clearVideoPlayer();
                
                //处理隐藏标签
                let contentNode = document.createElement("div");
                contentNode.innerHTML = data.content;
                
                bindNode(contentNode);
                data.content = escapeVueHtml(contentNode.innerHTML);
        
                
                state.help = data;

                nextTick(function() {
                    setTimeout(function() {
                        renderVideoPlayer();//渲染视频播放器
                    }, 30);
                    
                    //渲染代码
                    let helpRefValue = proxy?.$refs['help_'+helpId];
                    if(helpRefValue != undefined){
                        renderBindNode(helpRefValue); 
                    }
                }); 
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //文件下载
    const onDownload = (href: string) => {
        let regx = new RegExp("^"+store.state.apiUrl,"i");//忽略大小写
        let path = href.replace(regx,"")

        proxy?.$axios({
            url: '/'+path,
            method: 'get',
            params:  {
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(JSON.parse(result.success)){
                    location.href = result.redirect;
                }
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }

    //递归绑定节点参数
    const bindNode = (node:any) => {
        
        
        //先找到子节点
        let nodeList = node.childNodes;
        for(let i = 0;i < nodeList.length;i++){
            //childNode获取到到的节点包含了各种类型的节点
            //但是我们只需要元素节点  通过nodeType去判断当前的这个节点是不是元素节点
            let childNode = nodeList[i];
            let random = Math.random().toString().slice(2);
            //判断是否是元素节点。如果节点是元素(Element)节点，则 nodeType 属性将返回 1。如果节点是属性(Attr)节点，则 nodeType 属性将返回 2。
            if(childNode.nodeType == 1){
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
                    
                        html = '<el-image src="'+src+'" '+style+' :preview-src-list=["'+src+'"] lazy hide-on-click-modal ></el-image>';
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

                
                 //处理下载
                 if(childNode.nodeName.toLowerCase() == "a" ){
                    let href = childNode.getAttribute("href")
                    let title = childNode.getAttribute("title")
                    let linkType = childNode.getAttribute("linkType")
                    let startUrl = store.state.apiUrl+"fileDowload?jump=";
                    if(linkType == "download" && href != ""){
                        let downloadHtml = "";
                        if(href.toLowerCase().startsWith(startUrl.toLowerCase())){
                            downloadHtml ='<span class="download" @click="onDownload_renderTemplate(`'+href+'`);"><Icon name="download-2-line" size="20px" class="link-icon"></Icon>'+escapeHtml(title)+'</span>';
                        }else{
                            downloadHtml ='<a class="download" href="'+href+'"><Icon name="download-2-line" size="20px" class="link-icon"></Icon>'+escapeHtml(title)+'</a>';
                        }
                        let downloadDom = document.createElement('div');
                        downloadDom.innerHTML=downloadHtml;

                        childNode.replaceWith(downloadDom.firstElementChild);
                    }
                }
                

                
                //处理视频标签
                if(childNode.nodeName.toLowerCase() == "player" ){
                    
                    let id = "player_"+random+"_"+i;
                    childNode.setAttribute("id",id);//设置Id
                    state.playerIdList.push(id);	
                }

                
                //处理代码标签
                if(childNode.nodeName.toLowerCase() == "pre" ){

                    
                    let firstChildNode = null;//第一个子节点

                    for(let p = 0;p < childNode.childNodes.length;p++){
                        let preChildNode = childNode.childNodes[p];
                        if(preChildNode.nodeName.toLowerCase() == "code" ){
                            firstChildNode = preChildNode;
                            break;
                        }
                    }
                    
                    if(firstChildNode != null && firstChildNode.getAttribute("class")!= null && firstChildNode.getAttribute("class").indexOf("language-") != -1){//Markdown代码
                        
                        let class_val = firstChildNode.className;
                        let lan_class = "";
                        let class_arr = new Array();
                        class_arr = class_val.split(' ');
                        
                        for(let k=0; k<class_arr.length; k++){
                            let className = class_arr[k].trim();
                            
                            if(className != null && className != ""){
                                if (className.lastIndexOf('language-', 0) === 0) {
                                    lan_class = className;
                                    break;
                                }
                            }
                        }
                        if(firstChildNode.getAttribute("class").indexOf("language-mermaid") == -1){
                            childNode.className = "line-numbers "+lan_class;
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
                            dom.className = "line-numbers "+lan_class;
                            dom.innerHTML=nodeHtml;
                            
                        
                            childNode.appendChild(dom);
                        }
                    }


                    if(childNode.className != null && childNode.className.indexOf("lang-") != -1){//富文本编辑器代码
                       
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

                    
                    
                   
                }
                
                bindNode(childNode);

                
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
                    let firstChildNode:any = null;//第一个子节点
                    for(let p = 0;p < childNode.childNodes.length;p++){
                        let preChildNode = childNode.childNodes[p];
                        if(preChildNode.nodeName.toLowerCase() == "code" ){
                            firstChildNode = preChildNode;
                            break;
                        }
                    }
                   
                    if(firstChildNode != null && firstChildNode.getAttribute("class")!= null){
                        if(firstChildNode.getAttribute("class") != null && firstChildNode.getAttribute("class").indexOf("language-mermaid") != -1){
                           
                            if(firstChildNode.innerHTML){
                                  //  const { svg } = await mermaid.render('mermaid_'+random, unescapeHtml(firstChildNode.innerHTML));

                              //  childNode.innerHTML = svg;

                              const mermaid_container = document.createElement('div')
                                mermaid_container.style.lineHeight = 'initial' //重置行高

                                childNode.replaceWith(mermaid_container);
                                mermaid.render(
                                    'mermaid_'+random,
                                    unescapeHtml(firstChildNode.innerHTML),
                                    // @ts-ignore
                                    mermaid_container
                                ).then((svgCode) => {
                                    // @ts-ignore
                                    mermaid_container.innerHTML = svgCode.svg
                                
                                })
                                .catch((err) => {
                                // console.error(err);
                                })
                            }
                        }else if(firstChildNode.getAttribute("class").indexOf("language-mermaid") != -1){
                            
                        }else{
                            Prism.highlightAllUnder(childNode);
                        }
                    }
                   
                    
                   
                }else if(childNode.nodeName.toLowerCase() == "span"){
                    if(childNode.getAttribute("class") != null && childNode.getAttribute("class").indexOf("math-inline") != -1 && childNode.childNodes.length==1 && childNode.childNodes[0].nodeType ==3){
                        let tex = katex.renderToString(unescapeHtml(childNode.innerHTML), {
                            throwOnError: false,
                            displayMode:false//内联模式
                        });
                        childNode.innerHTML = tex;
                    }
                }else if(childNode.nodeName.toLowerCase() == "div"){
                    if(childNode.getAttribute("class") != null && childNode.getAttribute("class").indexOf("math-display") != -1 && childNode.childNodes.length==1 && childNode.childNodes[0].nodeType ==3){
                        let tex = katex.renderToString(unescapeHtml(childNode.innerHTML), {
                            throwOnError: false,
                            displayMode:true//块模式
                        });
                        childNode.innerHTML = tex;

                    }
                }

                renderBindNode(childNode);
            }
        }
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

    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'helpDetail'){
            let helpTypeId:string = '';
            if(to.query.helpTypeId != undefined){
                helpTypeId = to.query.helpTypeId as string
            }
            if(to.query.helpId != undefined){
                state.helpId = to.query.helpId as string;
            }
            
            queryHelpNavigation(helpTypeId);
            queryHelpList( helpTypeId,()=>{
                if(state.helpId == null || state.helpId == ''){
                    //查询第一个帮助
                    if(state.helpList != null && state.helpList.length >0){
                        for(let i=0; i<state.helpList.length; i++){
                            let help = state.helpList[i];
                            
                            state.helpId = help.id;
                            break;
                        }
                    }
                }
                if(state.helpId != null && state.helpId != ''){
                    queryHelp(state.helpId);
                }
            })
        }
        
        next();
    });

    
 

    onMounted(() => {
        let helpTypeId:string = router.currentRoute.value.query.helpTypeId != undefined ?router.currentRoute.value.query.helpTypeId as string :'';
        let helpId:string = router.currentRoute.value.query.helpId != undefined ?router.currentRoute.value.query.helpId as string :'';
          
        state.helpTypeId = helpTypeId;
        state.helpId = helpId;

        queryHelpNavigation(helpTypeId);
        queryHelpList( helpTypeId,()=>{
            if(state.helpId == null || state.helpId == ''){
                //查询第一个帮助
                if(state.helpList != null && state.helpList.length >0){
                    for(let i=0; i<state.helpList.length; i++){
                        let help = state.helpList[i];
                        
                        state.helpId = help.id;
                        break;
                    }
                }
            }
            if(state.helpId != null && state.helpId != ''){
                queryHelp(state.helpId);
            }
        })
    }) 

    //卸载组件实例后调用
    onUnmounted (()=>{
        //清除播放器
        clearVideoPlayer();

    })



</script>
<style scoped lang="scss">
.helpDetailModule{
	margin:10px auto auto auto;height: 100%;
    .left{
        float: left;
        width: 300px;
        height: auto;
        .nav-wrap{
            background: #fff;
            box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
            padding-bottom: 20px;
            .helpTypeName{ 
                padding:10px 10px 5px 10px;
                .name{
                    line-height:44px; 
                    font-size:18px;
                    color:$color-black-80;
                    background: $color-black-10;
                    border-radius:3px;
                    padding: 0px 10px;
                }
            }
            .helpName{
                margin-left:20px; 
                margin-right: 20px;
                padding-bottom:8px; 
                a{
                    span{
                        display:block;
                        color:$color-black-80;
                        font-size: 15px;
                        margin-top:8px; 
                        line-height:26px; 
                        cursor:pointer;
                    }
                    &:hover{
                        span{ 
                            color:#1890ff;
                        }
                    }
                }
            }
        }
    }
    .right {
        float: right;
        width: 900px;
        height: 100%;
        padding-bottom: 10px;
        .help-wrap{
            background: #fff;
            box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
            position: relative;
            height: -moz-calc(100% - 10px);
            height: -webkit-calc(100% - 10px);
            height: calc(100% - 10px);
            .helpBox{
                height: auto;
                padding:15px 15px 15px 15px;
                .title{
                    color:$color-black-90;
                    font-weight:600;
                    font-size:22px;
                    border:none;
                    line-height:34px; 
                    margin:9px 0 18px 0;
                }
                .helpInfo{
                    color: #ccc;font-size: 14px;border-bottom:1px solid $color-black-20;padding-bottom: 5px;
                    .postTime{
                        float: left;
                    }
                }
                :deep(.helpMarkdownContent){
                    margin-top:5px;
                    padding:20px 0px;
                    color:$color-black-90;
                    font-size:16px; 
                    line-height:1.75; 
                    word-wrap:break-word;
                    min-height: 100px;
                    a{
                        color: #1890ff;
                        font-size:16px;
                    }
                    //自动换行
                    pre{
                        white-space:pre-wrap;
                    }
                    
                    ol{
                        list-style: decimal;
                    }
                    ol li{
                        list-style-type:decimal;
                        list-style-position:inside;
                    }
                    ul{
                        list-style: disc;
                    }
                   // ul li{
                     //   list-style-type:disc;
                  //  }
                    .task-list-item {
                        list-style-type:none;
                    }
                    .download{
                        color: #1890ff;
                        margin: 0 5px 0 5px;
                        cursor: pointer;
                        font-size:16px;
                        .link-icon {
                            position: relative;
                            top: 4px;
                            margin-right: 2px;
                            color:#1890ff;
                        }
                    }
                    p{
                        font-size:16px;
                        word-wrap:break-word
                    }
                    code[class*="language-"]{
                        padding: 0 0;
                    }
                    img{
                        max-width:100%;height:auto;border:none;background:none;margin:0;padding:0; 
                        cursor: -webkit-zoom-in;
                        cursor: zoom-in;
                        vertical-align: sub;
                    }

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
                    }
                    iframe{
                        width:100%; height: 550px;padding:10px 0px; 
                    }
                    player{
                        width: 100%;
                        height: 576px;
                        display: block;
                        margin-top: 10px;
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
                                line-height: 80px;
                                font-size: 20px;
                                background-color:rgb(0,0,0);
                                opacity:0.7;
                                filter:alpha(opacity=70);
                                text-align: center;
                            }
                        }
                    }
                }
                :deep(.content){
                    margin-top:5px;
                    padding:20px 0px;
                    color:$color-black-90;
                    font-size:16px; 
                    line-height:1.75; 
                    word-wrap:break-word;
                    min-height: 100px;
                    a{
                        color: #1890ff;
                    }
                    p{
                        font-size:16px;
                        word-wrap:break-word;
                    }
                    img{
                        max-width:100%;height:auto;border:none;background:none;margin:0;padding:0;
                        cursor: -webkit-zoom-in;
                        cursor: zoom-in;
                        vertical-align: sub;
                    }
                    iframe{
                        width:100%; height: 550px;padding:10px 0px; 
                    }
                    .download{
                        color: #1890ff;
                        margin: 0 5px 0 5px;
                        cursor: pointer;
                        font-size:16px;
                        .link-icon {
                            position: relative;
                            top: 4px;
                            margin-right: 2px;
                            color:#1890ff;
                        }
                    }
                    player{
                        width: 100%;
                        height: 576px;
                        display: block;
                        margin-top: 10px;
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
                                line-height: 80px;
                                font-size: 20px;
                                background-color:rgb(0,0,0);
                                opacity:0.7;
                                filter:alpha(opacity=70);
                                text-align: center;
                            }
                        }
                    }
                    pre{
                        white-space:pre-wrap;
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
                }
            }
        }
    }
}
</style>