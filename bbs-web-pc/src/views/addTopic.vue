<!-- 发表话题页 -->
<template>
    <!-- 页头 :sticky="false"关闭浮动置顶功能 -->
    <Header :sticky="false"/>

    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="addTopicModule" >
                <el-form label-position="right" :rules="rules" ref="formMobileRef" :model="form" class="iconForm-container" size="large" v-if="form.allowTopic">
                    
                    <el-row>
                        <el-col :span="5" >
                            <el-form-item :error="error.tagId" >
                                <el-select v-model="form.tagIdGroup" @focus="queryTagList" @change="selectedTag" no-match-text="还没有标签" placeholder="选择标签">
                                    <el-option v-for="item in form.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="15" style="margin-left: 8px;">
                            <el-form-item :error="error.title" >
                                <el-input v-model.trim="form.title" placeholder="标题" maxlength="90" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1" :offset="2">
                            <div class="redEnvelopeButton" v-if="form.showRedEnvelopeText" @click="redEnvelopeForm">
                                <span class="text">红包</span>
                                <Icon name="angle-down" size="16px" class="icon" />
                            </div>
                        </el-col>
                    </el-row>
                    <div v-if="form.showRedEnvelopeForm">
                        <el-form-item>
                            <el-radio-group v-model="form.giveRedEnvelope_type" @change="selectRedEnvelopeType()">
                                <el-radio :label="20">随机金额红包</el-radio>
                                <el-radio :label="30">固定金额红包</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :error="error.totalAmount" v-if="form.giveRedEnvelope_type == 20">
                            红包总金额 <el-input v-model.trim="form.giveRedEnvelope_totalAmount" placeholder="输入金额" maxlength="12" @input="totalAmountCalculate()" clearable style="width: 150px;margin-left:10px;margin-right:10px;"></el-input>元
                            <span class="help-text">
                                <span v-if="parseFloat(form.giveRedEnvelopeAmountMin) >0">合计总金额不能少于 {{form.giveRedEnvelopeAmountMin}} 元；</span>	
								<span v-if="form.giveRedEnvelopeAmountMax != null && parseFloat(form.giveRedEnvelopeAmountMax) >0">合计总金额不能超过 {{form.giveRedEnvelopeAmountMax}} 元；</span>	
								<span>用户共有金额 {{form.deposit}} 元</span>
                            </span>
                        </el-form-item>
                        <el-form-item :error="error.singleAmount" v-if="form.giveRedEnvelope_type == 30">
                            单个红包金额 <el-input v-model.trim="form.giveRedEnvelope_singleAmount" placeholder="输入金额" maxlength="12" @input="singleAmountCalculate()" clearable style="width: 150px;margin-left:10px;margin-right:10px;"></el-input>元
                            <span class="help-text">
                                <span v-if="parseFloat(form.giveRedEnvelopeAmountMin) >0">合计总金额不能少于 {{form.giveRedEnvelopeAmountMin}} 元；</span>	
								<span v-if="form.giveRedEnvelopeAmountMax != null && parseFloat(form.giveRedEnvelopeAmountMax) >0">合计总金额不能超过 {{form.giveRedEnvelopeAmountMax}} 元；</span>	
								<span>用户共有金额 {{form.deposit}} 元</span>
                            </span>
                        </el-form-item>
                        <el-form-item :error="error.giveQuantity">
                            <el-input v-model.trim="form.giveRedEnvelope_giveQuantity" placeholder="输入数量" maxlength="8" @input="singleAmountCalculate()" clearable style="width: 100px;margin-right:10px;"></el-input>个红包
                        </el-form-item>
                        <el-form-item :error="error.redEnvelopeLimit">
                            合计总金额<span class="totalAmountView">{{form.giveRedEnvelope_totalAmountView}}</span>
                        </el-form-item>
                    </div>

                    <el-form-item :error="error.content" >
                        <div v-show="!form.isMarkdown" style="width: 100%;">
                            <textarea :editorId="'addTopic'" ref="contentRef" style="width:100%;height:400px;visibility:hidden;"></textarea>
                        </div>
                        <div v-if="form.isMarkdown" style="width: 100%;">
                            <Editor  :editorId="'addTopic'" :value="form.markdownContent" :plugins="form.addTopicEditorPlugin" :locale="zhHans" :editorConfig="markdownEditorConfig" :sanitize="addTopicSanitize" placeholder="请输入内容..." @change="handleMarkdownChange"/>
                        </div>
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
                        <el-button type="primary" size="large" style="width: 130px;" @mousedown.native="onSubmit"  :disabled="form.allowSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
                <el-result v-if="!form.allowTopic" icon="warning" title="发表话题功能已关闭"></el-result>
            </div>
        </div>
    </div>


    <!-- 页脚 -->
    <Footer/>
</template>

<script setup lang="ts">
    import { onMounted, ref ,nextTick, getCurrentInstance, ComponentInternalInstance, reactive, onUnmounted, computed, watch,} from 'vue'
    import { ElMessage, ElNotification, FormInstance} from 'element-plus'
    import { useRouter } from 'vue-router'
    import { useMeta} from 'vue-meta';
    import { appStore } from "@/store";
    import { AxiosResponse } from 'axios';
    import { Tag } from '@/types';
    import { onBeforeRouteUpdate } from 'vue-router';
    import { calc_add, calc_multiply, processErrorInfo } from '@/utils/tool';
    import { createEditor } from '@/utils/editor';
    import { markdownPlugins,markdownEditorConfig,sanitize, markdownToHtml } from '@/utils/markdownEditor';
    import { toggleEditor } from '@/utils/markdownPlugin/plugin-toggle-editor';
    import { help } from '@/utils/markdownPlugin/plugin-help';
    import { emoji } from '@/utils/markdownPlugin/plugin-emoji';
    import { imageUpload } from '@/utils/markdownPlugin/plugin-image-upload';
    import { pasteImageUpload } from '@/utils/markdownPlugin/plugin-paste-image';
    import { fileUpload } from '@/utils/markdownPlugin/plugin-file-upload';
    import { videoUpload } from '@/utils/markdownPlugin/plugin-video-upload';
    import { hideContent } from '@/utils/markdownPlugin/plugin-hide-content';
    import type { BytemdPlugin } from 'bytemd'
    import { Editor } from '@bytemd/vue-next'
    import zhHans from 'bytemd/locales/zh_Hans.json'

    const store = appStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;

    const formMobileRef = ref<FormInstance>();
    const contentRef = ref()

    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '发表话题 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '发表话题 - ' + store.state.title
                },{
                    name: "description",
                    content: '发表话题 - ' + store.state.title
                }
            ]
        }))
    )

    //Select 选择器选项
    interface OptionsItem {
        value: string;
        label: string;
    }

    const form = reactive({
        emojiIndex:"",

        tagList:[] as Array<Tag>,//标签
        deposit:'',//用户共有预存款
        allowTopic:true,//是否允许提交话题
        giveRedEnvelopeAmountMin:'',//发红包金额下限
        giveRedEnvelopeAmountMax:'',//发红包金额上限  空为无限制 0则不允许发红包 
        userGradeList:[],//用户等级
        availableTag:[] as Array<string>,//话题编辑器允许使用标签
        fileSystem:0,//文件存储系统
        supportEditor:10,//支持编辑器

        showRedEnvelopeText:false,//显示发红包按钮
        showRedEnvelopeForm:false,//显示发红包表单
        giveRedEnvelope_type:20, //发红包类型
		giveRedEnvelope_totalAmount:'',//红包总金额
		giveRedEnvelope_singleAmount:'',//红包单个金额
		giveRedEnvelope_giveQuantity:'',//红包数量
		giveRedEnvelope_totalAmountView:'0.00',//红包合计总金额

        isAllowLoadTagGroup:true,//是否允许加载标签组
        tagIdGroup :[],//标签Id组
        loading :false,//是否正在从远程获取数据
        options: [] as Array<OptionsItem>,//Select 选择器标签数据

        tagId:'',//标签Id
        title:'',//标题
        content:'',//内容
        markdownContent:'',//markdown内容
        isMarkdown:false,//是否使用markdown编辑器

        showCaptcha:false,//是否显示验证码
        captchaKey: '',//验证码key
        captchaValue: '',//验证码值
        imgUrl: '',//验证码图片
        allowSubmit:false,//提交按钮disabled状态

        addTopicEditor :{} as any,//添加话题编辑器
		addTopicEditorCreateParameObject :{} as any,//添加话题编辑器的创建参数

        addTopicEditorPlugin:[] as BytemdPlugin[],//添加话题Markdown编辑器插件
    });
    



    //错误
    const error = reactive({
        tagId:'',//标签Id
        title:'',//标题
        content:'',//内容
        totalAmount:'',//红包总金额
        singleAmount:'',//单个红包金额
		giveQuantity: '',//红包数量
		redEnvelopeLimit: '',//合计总金额
        captchaValue:'',//验证码
    })

    //处理Markdown
    const handleMarkdownChange = (value: string) => {
        form.markdownContent = value;
    }

    //白名单
    const addTopicSanitize = (schema: any) => {
        schema = sanitize(schema);
        
        if(form.availableTag?.indexOf('embedVideo') != -1){//嵌入视频
            schema.tagNames.push('iframe');
        }

        return schema;
    }

    //markdown生成Html
    const onHtml = () => {
        let html = markdownToHtml(addTopicSanitize,form.addTopicEditorPlugin,form.markdownContent);
        console.log("Html内容--",html);
    }
    



    //处理切换到富文本编辑器
    const handleToggleRichtextEditor = (editorId: string) => {
        form.isMarkdown = false;
        nextTick(()=>{
            if (Object.keys(form.addTopicEditorCreateParameObject).length != 0) {//不等于空
                //创建富文本编辑器
                form.addTopicEditor = createEditor(
                    form.addTopicEditorCreateParameObject.ref, 
                    form.addTopicEditorCreateParameObject.availableTag, 
                    form.addTopicEditorCreateParameObject.uploadPath, 
                    form.addTopicEditorCreateParameObject.userGradeList,
                    form.fileSystem,
                    ()=>{
                        handleToggleMarkdownEditor(editorId);
                    }
                );
            }
        })
        
        
    }

    //处理切换到Markdown编辑器
    const handleToggleMarkdownEditor = (editorId: string) => {
        
        if (Object.keys(form.addTopicEditor).length != 0) {//不等于空
			form.addTopicEditor.remove();
            form.addTopicEditor = {};
		}
        form.isMarkdown = true;
    }



    //查询标签
    const queryTagList = () => {
        if(!form.isAllowLoadTagGroup){
	        return;
	    }

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
            form.isAllowLoadTagGroup = false;
            if(data != null && data.length >0){
                for(let i=0; i<data.length; i++){
                    let tag = data[i];
                    let obj = {} as OptionsItem;
                    obj.value = tag.id;
                    obj.label = tag.name;
                    form.options.push(obj);
                }
            }
             form.tagList = data;
        })
        .catch((error: any) =>{
            console.log(error);
        });

    }

    //查询发表话题页
    const queryAddTopic = () => {
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        //重置表单
        formMobileRef.value?.resetFields();

        proxy?.$axios({
            url: '/user/queryAddTopic',
            method: 'get',
            params:  {},
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                
                form.allowTopic = data.allowTopic;//是否允许提交话题

                if(data.allowTopic){
                    form.deposit = data.deposit;//用户共有预存款
                    form.giveRedEnvelopeAmountMin = data.giveRedEnvelopeAmountMin;//发红包金额下限
                    form.giveRedEnvelopeAmountMax = data.giveRedEnvelopeAmountMax;//发红包金额上限  空为无限制 0则不允许发红包 
                    if(data.userGradeList != null && data.userGradeList != ''){
                        form.userGradeList = JSON.parse(data.userGradeList);//JSON转为对象
                    }
                    if(data.availableTag != null && data.availableTag != ''){
                        let availableTagObject = JSON.parse(data.availableTag);//JSON转为对象

                        let flag = false;
                        if(availableTagObject != null && availableTagObject.length >0){
                            for(let i=0; i< availableTagObject.length; i++){
                                let availableTag = availableTagObject[i];
                                if(availableTag == "hidePassword" || availableTag == "hideComment" ||
                                availableTag == "hideGrade" || availableTag == "hidePoint" || availableTag == "hideAmount"){
                                    availableTagObject.splice(i, 0, 'hide');//在指定索引处插入元素
                                    break;
                                }
                            }
                            for(var i=0; i< availableTagObject.length; i++){
                                let availableTag = availableTagObject[i];
                                if(availableTag == "image"){//增加批量插入图片按钮
                                    availableTagObject.splice(i+1, 0, 'multiimage');//在指定索引处插入元素
                                    break;
                                }
                            }
                        }

                        if(data.supportEditor == 30 || data.supportEditor == 40){
                            availableTagObject.push("toggleEditor");
                        }
                        form.availableTag = availableTagObject;//话题编辑器允许使用标签
                    }
                    
                    form.fileSystem = data.fileSystem;//文件存储系统
                    form.supportEditor = data.supportEditor;//支持编辑器 10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                

                    if(data.giveRedEnvelopeAmountMax == null || (data.giveRedEnvelopeAmountMax != null && parseInt(data.giveRedEnvelopeAmountMax) >0)){
                        //显示发红包
                        form.showRedEnvelopeText = true;
                    }

                    if (data.captchaKey != undefined && data.captchaKey != '') {
                        form.showCaptcha = true;
                        form.captchaKey = data.captchaKey;
                        replaceCaptcha();//刷新验证码
                    }

                    if(form.supportEditor == 20 || form.supportEditor == 40){
                        form.isMarkdown = true;
                    }


                    if(form.addTopicEditorPlugin != null && form.addTopicEditorPlugin.length ==0){
                        //添加插件
                        form.addTopicEditorPlugin.push(...markdownPlugins);

                        form.addTopicEditorPlugin.push(emoji());
                        if(form.supportEditor == 30 || form.supportEditor == 40){//10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                            form.addTopicEditorPlugin.push(
                                toggleEditor((editorId: string)=>{handleToggleRichtextEditor(editorId)})
                            );
                        }
                        form.addTopicEditorPlugin.push(
                            help(form.availableTag,form.userGradeList)
                        );

                        if(form.availableTag?.indexOf('insertfile') != -1){
                            form.addTopicEditorPlugin.push(
                                fileUpload("user/control/topic/upload?method=upload",'file',form.fileSystem)
                            );
                        }
                        if(form.availableTag?.indexOf('image') != -1){
                            form.addTopicEditorPlugin.push(
                                imageUpload("user/control/topic/upload?method=upload",'file',form.fileSystem)
                            );
                            form.addTopicEditorPlugin.push(
                                pasteImageUpload("user/control/topic/upload?method=upload",'file',form.fileSystem)
                            );
                        }  

                        if(form.availableTag?.indexOf('uploadVideo') != -1){
                            form.addTopicEditorPlugin.push(
                                videoUpload("user/control/topic/upload?method=upload","file",form.fileSystem)
                            );
                        }
                        if(form.availableTag?.indexOf('hidePassword') != -1 
                            || form.availableTag?.indexOf('hideComment') != -1
                            || form.availableTag?.indexOf('hideGrade') != -1 
                            || form.availableTag?.indexOf('hidePoint') != -1 
                            || form.availableTag?.indexOf('hideAmount') != -1
                            ){
                            form.addTopicEditorPlugin.push(
                                hideContent(form.availableTag,form.userGradeList)
                            );
                        }
                    }

                    
                    if (Object.keys(form.addTopicEditorCreateParameObject).length === 0) {//等于空
                        let uploadPath = "user/control/topic/upload?method=upload";
                        if(!form.isMarkdown){
                            //创建富文本编辑器
                            form.addTopicEditor = createEditor(contentRef.value, form.availableTag, uploadPath, form.userGradeList,form.fileSystem,(editorId: string)=>{
                                handleToggleMarkdownEditor(editorId);
                            });
                        }
                        form.addTopicEditorCreateParameObject = {
                            ref:contentRef.value,
                            availableTag:form.availableTag,
                            uploadPath:uploadPath,
                            userGradeList:form.userGradeList
                        }
                    }
                   
                    
                }
                
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });

    }

    //选中标签
    const selectedTag = (val:string) => {
        form.tagId = val;
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


    //控制只能输入小数点后2位
    const clearNoNum = (val:string) => {
        val = val.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
        val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数   
        if (val.indexOf(".") < 0 && val != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
            val = parseFloat(val).toString();
        }
        return val;
    }

    //显示/隐藏红包表单层
    const redEnvelopeForm = () => {
        if(form.showRedEnvelopeForm == false){
            form.showRedEnvelopeForm = true;
            
        }else{
            form.showRedEnvelopeForm = false;
        }
        selectRedEnvelopeType();
    }

    //选择红包类型
    const selectRedEnvelopeType = () => {
        if(form.giveRedEnvelope_type == 20){//随机
            totalAmountCalculate();
            
        }else if(form.giveRedEnvelope_type == 30){//固定
            singleAmountCalculate();
        }
       
        
    }
    //总金额计算
    const totalAmountCalculate = () => {
        //红包总金额输入限制
        form.giveRedEnvelope_totalAmount = clearNoNum(form.giveRedEnvelope_totalAmount);

        
        if(form.giveRedEnvelope_type == 20){//随机
            let exp = /(^[1-9]([0-9]+)?(\.[0-9]{1,10})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if(exp.test(form.giveRedEnvelope_totalAmount.trim())) {
                let amount = calc_add(form.giveRedEnvelope_totalAmount.trim(), '0', 2);
                form.giveRedEnvelope_totalAmountView = String(amount);
            }else{
                form.giveRedEnvelope_totalAmountView = '0.00';
            }
            
        }
    }
		
    //单个红包金额计算
    const singleAmountCalculate = () => {
        //单个红包金额输入限制
        form.giveRedEnvelope_singleAmount = clearNoNum(form.giveRedEnvelope_singleAmount);

       
        if(form.giveRedEnvelope_type == 30){//固定
            //金额 只允许正数  正则判断最多10位小数
            var exp_singleAmount = /(^[1-9]([0-9]+)?(\.[0-9]{1,10})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            //数量 正整数
            var exp_giveQuantity = /^\+?[1-9][0-9]*$/;
            if(exp_singleAmount.test(form.giveRedEnvelope_singleAmount.trim()) && exp_giveQuantity.test(form.giveRedEnvelope_giveQuantity.trim())) {
                var amount = calc_multiply(form.giveRedEnvelope_singleAmount.trim(), form.giveRedEnvelope_giveQuantity.trim(), 2);
                form.giveRedEnvelope_totalAmountView = String(amount);
            }else{
                form.giveRedEnvelope_totalAmountView = '0.00';
            }
        }
        
    }

    //校验规则
    const rules = reactive({
       captchaValue: [{ validator: checkCaptchaValue, trigger: 'blur' }],
    })

    //提交数据
    const onSubmit = () => {
        form.allowSubmit = true;//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            formMobileRef.value?.validate((valid: boolean) => {
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
                formData.append('tagId', form.tagId);

                if(form.title != null && form.title != ''){
                    formData.append('title', form.title);
                }

                if(form.isMarkdown){
                    formData.append('isMarkdown', form.isMarkdown.toString());
                    formData.append('markdownContent', form.markdownContent);
                }else{
                    if(contentRef.value.value != null && contentRef.value.value !=''){
                        formData.append('content', contentRef.value.value);
                    }
                }

                

                //如果显示红包表单
                if(form.showRedEnvelopeForm){
                    formData.append('type', String(form.giveRedEnvelope_type));//发红包类型
                    formData.append('totalAmount', form.giveRedEnvelope_totalAmount);//红包总金额
                    formData.append('singleAmount', form.giveRedEnvelope_singleAmount);//单个红包金额
                    formData.append('giveQuantity', form.giveRedEnvelope_giveQuantity);//红包数量
                }

                
                //验证码Key
                formData.append('captchaKey', form.captchaKey);
                //验证码值
                if(form.captchaValue != ''){
                    formData.append('captchaValue', form.captchaValue.trim());
                }

                proxy?.$axios({
                    url: '/user/control/topic/add',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                    
                        if(JSON.parse(result.success)){//登录成功
                            ElMessage({
                                showClose: true,
                                message: '提交成功，3秒后自动跳转到首页',
                                type: 'success',
                                onClose: ()=>{
                                        router.push({
                                        path : '/index'
                                    });
                                }
                            })


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

                            form.allowSubmit = false;//提交按钮disabled状态
                        }
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
        if(to.name == 'addTopic'){
            queryAddTopic();
            queryTagList();
        }
        
        next();
    });

    onMounted(() => {
        queryAddTopic();
        queryTagList();
    }) 

    //卸载组件实例后调用
    onUnmounted (()=>{
        if (Object.keys(form.addTopicEditor).length != 0) {//不等于空
            form.addTopicEditor.remove();
            form.addTopicEditor = {};
        }
    })
</script>



<style scoped lang="scss">
.addTopicModule{
    background: #fff;
    padding:25px 40px 40px 40px;
    margin:0px auto;

    :deep(.bytemd){
        height: calc(100vh - 100px);
        
    }
    :deep(.CodeMirror-scroll){//让外层滚动条不滚动
        overscroll-behavior:  contain;
    }
    :deep(.bytemd-preview){//让外层滚动条不滚动
        overscroll-behavior:  contain;
    }
    

    .redEnvelopeButton{
        cursor:pointer;
        user-select:none;
        .text{
            position: relative; top: 10px;
        }
        .icon{
            margin-left: 3px;
            position: relative; top: 13px;
        }
        &:hover{
            color: $color-blue-60;
        }
    }

    .help-text{
        font-size: 13px;
        color: $color-black-50;
        margin-left: 15px;
    }
    .totalAmountView{
        margin-left: 10px;
        font-size: 18px;
    }

    //图标表单
    .iconForm-container{
        margin-top: 15px;
        :deep(.el-form-item__content) {
            line-height: normal;
        }
        :deep(.el-form-item__error) {
            width: 100%;
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