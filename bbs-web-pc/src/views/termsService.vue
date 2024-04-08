<!-- 服务条款 -->
<template>
    <!-- 页头 -->
    <Header/>

    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="termsServiceModule">
                <div class="container">
                    <div class="title">{{state.title}}</div>

                    <div class="content" ref="content">
                        <RenderTemplate :html="state.content"></RenderTemplate>     
                    </div>
                    <el-skeleton :loading="state.loading"></el-skeleton>
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
    import { onMounted, getCurrentInstance, ComponentInternalInstance, reactive, computed,} from 'vue'
    import { appStore } from "@/store";
    import { useMeta} from 'vue-meta'
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import { CustomHTML, } from "@/types/index";
    import { AxiosResponse } from 'axios';

    import { getLanguageClassName} from '@/utils/tool';
    import { escapeVueHtml } from '@/utils/escape';
    import { ElImage} from 'element-plus';

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '服务条款 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '服务条款 - ' + store.state.title
                },{
                    name: "description",
                    content: '服务条款 - ' + store.state.title
                }
            ]
        }))
    )
    
    const state = reactive({
        title : '', //标题
        content : '', //服务协议内容
        loading:true,//是否显示骨架屏
    });
    //错误
    const error = reactive({
    })

    //查询服务条款
    const queryTermsService = () => {
        proxy?.$axios({
            url: '/queryTermsService',
            method: 'get',
            params:  {},
            //showLoading: false,//是否显示加载图标
            //loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: CustomHTML) => {
            state.loading = false;//关闭骨架屏
            if(data){
                //处理自定义标签
                let contentNode = document.createElement("div");
                contentNode.innerHTML = data.content;
                bindNode(contentNode);
                
                state.content = escapeVueHtml(contentNode.innerHTML);

                state.title = data.forumTitle
            }
        })
        .catch((error: any) =>{
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
                        html = '<el-image src="'+src+'" '+style+' loading="lazy" ></el-image>';
                    }else{
                    
                        html = '<el-image src="'+store.state.apiUrl+src+'" '+style+' :preview-src-list=["'+store.state.apiUrl+src+'"] lazy hide-on-click-modal ></el-image>';
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
                
                bindNode(childNode);

                
            }
        }
    }

    

    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'termsService'){
            queryTermsService()
        }
        
        next();
    });

    onMounted(() => {
        queryTermsService()
    }) 

</script>
<style scoped lang="scss">

/* 会员卡 */
.termsServiceModule{
    background: #fff;
    padding:0px 15px 0px 15px;
    .container{
        .title{
            padding:40px 5px 20px 5px;
            color:$color-black-100;
            font-size:24px;
            border:none;
            line-height:34px; 
            text-align: center;
        }
        :deep(.content){
            padding:40px 5px;
            color:$color-black-70;
            font-size:16px;
            line-height:2; 
            word-wrap:break-word;
            p{
                font-size:16px;
                word-wrap:break-word
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
        }
    }
    
}
</style>