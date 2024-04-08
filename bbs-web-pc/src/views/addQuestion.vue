<!-- 提问题页 -->
<template>
    <!-- 页头 :sticky="false"关闭浮动置顶功能 -->
    <Header :sticky="false"/>

    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="addQuestionModule" >
                <el-form label-position="right" :rules="rules" ref="formMobileRef" :model="form" class="iconForm-container" size="large" v-if="form.allowQuestion">
                    <el-row>
                        <el-col :span="18" >
                            <el-form-item prop="title" :error="error.title">
                                <el-input v-model.trim="form.title" placeholder="标题" maxlength="90" width="100" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" ></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="18" >
                            <el-form-item prop="tagIdGroup" :error="error.tagIdGroup">
                                <el-select ref="questionTagRef"  v-model="form.tagIdGroup" @remove-tag="processRemoveTag" @focus="loadQuestionTag" style="width: 100%;" multiple :placeholder="form.select_placeholder" >
                                    <el-option v-for="item in form.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-tooltip content="已选择数量 / 可选择数量" placement="top" effect="light">
                                <div class="selectCount">
                                    <div class="count">
                                        <el-breadcrumb separator="/">
                                            <el-breadcrumb-item>{{form.tagIdGroup.length}}</el-breadcrumb-item>
                                            <el-breadcrumb-item>{{form.maxQuestionTagQuantity}}</el-breadcrumb-item>
                                        </el-breadcrumb>
                                    </div>
                                </div>
                            </el-tooltip>
                        </el-col>
                    </el-row>
                    <el-form-item :error="error.amount" v-if="form.questionRewardAmountMax == null || (form.questionRewardAmountMax != null && parseFloat(form.questionRewardAmountMax) >0)">
                        <el-input v-model.trim="form.amount" placeholder="悬赏金额" maxlength="10" clearable style="width: 150px;margin-right:10px;"></el-input>
                        <span class="help-text">
                            <span v-if="parseFloat(form.questionRewardAmountMin) >0">悬赏金额不能少于 {{form.questionRewardAmountMin}} 元；</span>	
                            <span v-if="form.questionRewardAmountMax != null && parseFloat(form.questionRewardAmountMax) >0">悬赏金额不能超过 {{form.questionRewardAmountMax}} 元；</span>	
                            <span>用户共有金额 {{form.maxDeposit}} 元</span>
                        </span>
                    </el-form-item>
                    <el-form-item :error="error.point" v-if="form.questionRewardPointMax == null || (form.questionRewardPointMax != null && parseInt(form.questionRewardPointMax) >0)">
                        <el-input v-model.trim="form.point" placeholder="悬赏积分" maxlength="9" clearable style="width: 150px;margin-right:10px;"></el-input>
                        <span class="help-text">
                            <span v-if="parseInt(form.questionRewardPointMin) >0">悬赏积分不能少于 {{form.questionRewardPointMin}} ；</span>	
                            <span v-if="form.questionRewardPointMax != null && parseInt(form.questionRewardPointMax) >0">悬赏积分不能超过 {{form.questionRewardPointMax}}；</span>	
                            <span>用户共有积分 {{form.maxPoint}} 元</span>
                        </span>
                    </el-form-item>
                    
                    <el-form-item :error="error.content">
                        <div v-show="!form.isMarkdown" style="width: 100%;">
                            <textarea :editorId="'addQuestion'" ref="contentRef" style="width:100%;height:400px;visibility:hidden;"></textarea>
                        </div>
                        <div v-if="form.isMarkdown" style="width: 100%;">
                            <Editor  :editorId="'addQuestion'" :value="form.markdownContent" :plugins="form.addQuestionEditorPlugin" :locale="zhHans" :editorConfig="markdownEditorConfig" :sanitize="addQuestionSanitize" placeholder="请输入内容..." @change="handleMarkdownChange"/>
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

                <el-result v-if="!form.allowQuestion" icon="warning" title="提问题功能已关闭"></el-result>

                <div class="selectQuestionTagModule">
                    <el-dialog title="选择标签" v-model="form.popup_tag" @close="closeQuestionTag" :draggable="true" top="40vh">
                        <div class="questionTagNavigation">
                            <ul class="nav">
                                <li class="nav-item" v-for="questionTag in form.allTagList" >
                                    <span :class="selectedTagClass(questionTag.id)"  @click="selectChildTag(questionTag.id)" >{{questionTag.name}}</span>
                                </li>
                            </ul>
                            <!-- 二级标签 -->
                            <div class="tab-content">
                                <div class="tab-pane">
                                    <span :class="selectedChildTagClass(childQuestionTag.id)" @click="selectedQuestionTag(childQuestionTag)"  v-for="childQuestionTag in form.childTagList" >{{childQuestionTag.name}}</span>
                                </div>
                            </div>
                        </div>
                    </el-dialog>
                </div>
            </div>
        </div>
    </div>
    <!-- 页脚 -->
    <Footer/>
</template>

<script setup lang="ts">
    import { onMounted, ref, getCurrentInstance, ComponentInternalInstance, reactive, onUnmounted, computed, watch, nextTick,} from 'vue'
    import { ElMessage, FormInstance} from 'element-plus'
    import { useRouter } from 'vue-router'
    import { useMeta} from 'vue-meta';
    import { appStore } from "@/store";
    import { AxiosResponse } from 'axios';
    import { QuestionTag, Tag } from '@/types';
    import { onBeforeRouteUpdate } from 'vue-router';
    import { processErrorInfo } from '@/utils/tool';
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
    const questionTagRef = ref()
    const contentRef = ref()

    
    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '提问题 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '提问题 - ' + store.state.title
                },{
                    name: "description",
                    content: '提问题 - ' + store.state.title
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
        tagList:[] as Array<Tag>,//标签
        allowQuestion:true,//是否允许提问题
        userGradeList:[],//用户等级
        availableTag:[] as Array<string>,//问题编辑器允许使用标签
        fileSystem:0,//文件存储系统
        supportEditor:10,//支持编辑器

        maxDeposit: '',//用户共有预存款
        maxPoint: '',//用户共有积分
        questionRewardPointMin: '',//问题悬赏积分下限
        questionRewardPointMax: '',//问题悬赏积分上限
        questionRewardAmountMin: '',//问题悬赏金额下限
        questionRewardAmountMax: '',//问题悬赏金额上限
        maxQuestionTagQuantity:0,//标签最多可选数量

        amount: '',//悬赏金额
        point: '',//悬赏积分

        tagIdGroup :[] as Array<string>,//标签Id组
        options: [] as Array<OptionsItem>,//Select 选择器标签数据
        popup_tag :false,//是否弹出问题标签表单
        allTagList: [] as Array<QuestionTag>,//标签,//全部标签
        selectedFirstTagId: '',//选中的一级标签Id
        childTagList: [] as Array<QuestionTag>,//选中一级标签的子标签集合
        select_placeholder: '添加标签',



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

        addQuestionEditor :{} as any,//添加问题编辑器
		addQuestionEditorCreateParameObject :{} as any,//添加问题编辑器的创建参数

        addQuestionEditorPlugin:[] as BytemdPlugin[],//添加问题Markdown编辑器插件
    });
    



    //错误
    const error = reactive({
        tagId:'',//标签Id
        tagIdGroup:'',//标签Id
        title:'',//标题
        content:'',//内容
        amount: '',//悬赏金额
        point: '',//悬赏积分
        captchaValue:'',//验证码
    })

    //处理Markdown
    const handleMarkdownChange = (value: string) => {
        form.markdownContent = value;
    }

    //白名单
    const addQuestionSanitize = (schema: any) => {
        schema = sanitize(schema);

        return schema;
    }

     //处理切换到富文本编辑器
     const handleToggleRichtextEditor = (editorId: string) => {
        form.isMarkdown = false;
        nextTick(()=>{
            if (Object.keys(form.addQuestionEditorCreateParameObject).length != 0) {//不等于空
                //创建富文本编辑器
                form.addQuestionEditor = createEditor(
                    form.addQuestionEditorCreateParameObject.ref, 
                    form.addQuestionEditorCreateParameObject.availableTag, 
                    form.addQuestionEditorCreateParameObject.uploadPath, 
                    form.addQuestionEditorCreateParameObject.userGradeList,
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
        
        if (Object.keys(form.addQuestionEditor).length != 0) {//不等于空
			form.addQuestionEditor.remove();
            form.addQuestionEditor = {};
		}
        form.isMarkdown = true;
    }


    
    //查询问题标签
    const loadQuestionTag = () => {
        form.popup_tag = true;
	    questionTagRef.value.blur();//使Select选择器失去焦点，并隐藏下拉框
        if(form.tagIdGroup.length ==0){
            form.options.length = 0;//清空	
        }
	       	
	    queryQuestionTagList();

    }
    //关闭问题标签弹出框
    const closeQuestionTag = () => {
        form.popup_tag = false;
    }
		
    //处理删除标签
    const processRemoveTag = (val:any) => {
        if(form.tagIdGroup.length ==0){
            
            form.select_placeholder = "添加标签";
        }
    }
    //查询所有标签
    const queryQuestionTagList = () => {
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
            form.allTagList = data;
            if(data != null && data.length >0){
                for(let i=0; i<data.length; i++){
                    let questionTag = data[i];

                    //第一次选中第一个标签
                    if(form.selectedFirstTagId == ''){
                        form.childTagList = questionTag.childTag;
                        form.selectedFirstTagId = questionTag.id;
                        break;
                    }else{
                        if(form.selectedFirstTagId == questionTag.id){
                            form.childTagList = questionTag.childTag;
                            break;
                        }
                    }
                }
            }

        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    //选择子标签
    const selectChildTag = (questionTagId :string) => {
        form.selectedFirstTagId = questionTagId;
			
        if(form.allTagList != null && form.allTagList.length >0){
            for (let i= 0; i < form.allTagList.length; i++) {
                let questionTag = form.allTagList[i];
                
                if(questionTagId == questionTag.id){
                    form.childTagList = questionTag.childTag;
                    
                    //如果只有一个节点，则允许选择本标签
                    if(questionTag.childNodeNumber == 0){
                        selectedQuestionTag(questionTag);
                    }

                    break;
                }
                
            }
            
        }

    }
    //选中标签
    const selectedQuestionTag = (childQuestionTag :QuestionTag) => {
        //判断是否重复选择,如果重复则取消选择
        if(form.options != null && form.options.length >0){
            for(let i=0; i<form.options.length; i++){
                let selectedTag = form.options[i];
                if(selectedTag.value == childQuestionTag.id){
                    //删除标签
                    deleteTag(selectedTag.value);
                    return;
                }
            }
            
        }

        //如果超过最大允许选择数量
        if(form.tagIdGroup.length >= form.maxQuestionTagQuantity){
            ElMessage({
                showClose: true,
                message: '已超过允许选择的最大标签数量',
                type: 'error',
            })
            return;
        }


        let o = {} as OptionsItem;
        o.value = childQuestionTag.id;
        o.label = childQuestionTag.name;

        form.options.push(o);
        
        
        form.tagIdGroup.push(childQuestionTag.id);
        
        form.select_placeholder = "";
    }

    //删除标签
    const deleteTag = (questionTagId :string) => {
        if(form.options != null && form.options.length >0){
            for(let i=0; i<form.options.length; i++){
                let selectedTag = form.options[i];
                if(selectedTag.value == questionTagId){
                    form.options.splice(i, 1);
                    for(let j=0; j<form.tagIdGroup.length; j++){
                        if(form.tagIdGroup[j] == questionTagId){
                            form.tagIdGroup.splice(j, 1);
                            break;
                        }
                        
                    }
                    
                    if(form.tagIdGroup.length ==0){
                        form.select_placeholder = "添加标签";
                    } 
                    return;
                }
            }
            
		}
    }
    //选中一级标签样式
    const selectedTagClass = (questionTagId :string) => {
        let className = "nav-link";
        if(form.selectedFirstTagId == questionTagId){
            className += " active";
            
        }
        if(form.options != null && form.options.length >0){
            for(let i=0; i<form.options.length; i++){
                let selectedTag = form.options[i];
                if(selectedTag.value == questionTagId){
                    className += " selected";
                }
            }
            
        }
        return className;
    }
	//选中二级标签样式
    const selectedChildTagClass = (questionTagId :string) => {
        if(form.options != null && form.options.length >0){
            for(let i=0; i<form.options.length; i++){
                let selectedTag = form.options[i];
                if(selectedTag.value == questionTagId){
                    return "child-tag selected";
                }
            }
            
        }
        return "child-tag";
    }


    //查询提问题页
    const queryAddQuestion = () => {
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        //重置表单
        formMobileRef.value?.resetFields();

        proxy?.$axios({
            url: '/user/queryAddQuestion',
            method: 'get',
            params:  {},
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;

                form.allowQuestion = data.allowQuestion;//是否允许提问题

                if(data.allowQuestion){
                    if(data.maxDeposit){
                        form.maxDeposit = data.maxDeposit;
                    }
                    if(data.maxPoint){
                        form.maxPoint = data.maxPoint;
                    }
                    form.questionRewardPointMin = data.questionRewardPointMin;
                    form.questionRewardPointMax = data.questionRewardPointMax;
                    form.questionRewardAmountMin = data.questionRewardAmountMin;
                    form.questionRewardAmountMax = data.questionRewardAmountMax;
                    form.maxQuestionTagQuantity = data.maxQuestionTagQuantity;
                    


                    if(data.userGradeList != null && data.userGradeList != ''){
                        form.userGradeList = JSON.parse(data.userGradeList);//JSON转为对象
                    }
                    if(data.availableTag != null && data.availableTag != ''){
                        let availableTagObject = JSON.parse(data.availableTag);//JSON转为对象

                        let flag = false;
                        if(availableTagObject != null && availableTagObject.length >0){
                            for(let i=0; i< availableTagObject.length; i++){
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
                        form.availableTag = availableTagObject;//问题编辑器允许使用标签
                    }
                    
                    form.fileSystem = data.fileSystem;//文件存储系统
                    form.supportEditor = data.supportEditor;//支持编辑器 10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                
                    if(form.supportEditor == 20 || form.supportEditor == 40){
                        form.isMarkdown = true;
                    }

                    if(form.addQuestionEditorPlugin != null && form.addQuestionEditorPlugin.length ==0){
                        //添加插件
                        form.addQuestionEditorPlugin.push(...markdownPlugins);

                        form.addQuestionEditorPlugin.push(emoji());
                        if(form.supportEditor == 30 || form.supportEditor == 40){//10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                            form.addQuestionEditorPlugin.push(
                                toggleEditor((editorId: string)=>{handleToggleRichtextEditor(editorId)})
                            );
                        }
                        form.addQuestionEditorPlugin.push(
                            help(form.availableTag,form.userGradeList)
                        );

                        if(form.availableTag?.indexOf('image') != -1){
                            form.addQuestionEditorPlugin.push(
                                imageUpload("user/control/question/upload?method=upload",'file',form.fileSystem)
                            );
                            form.addQuestionEditorPlugin.push(
                                pasteImageUpload("user/control/question/upload?method=upload",'file',form.fileSystem)
                            );
                        }  
                    }


                    if (data.captchaKey != undefined && data.captchaKey != '') {
                        form.showCaptcha = true;
                        form.captchaKey = data.captchaKey;
                        replaceCaptcha();//刷新验证码
                    }

                    if (Object.keys(form.addQuestionEditorCreateParameObject).length === 0) {//等于空
                        let uploadPath = "user/control/question/upload?method=upload";
                        if(!form.isMarkdown){
                            //创建富文本编辑器
                            form.addQuestionEditor = createEditor(contentRef.value, form.availableTag, uploadPath, form.userGradeList,form.fileSystem,(editorId: string)=>{
                                handleToggleMarkdownEditor(editorId);
                            });
                        }
                        form.addQuestionEditorCreateParameObject = {
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

     
    
    //校验标签组
    const checkTagIdGroup = (rule: any, value: any, callback: any) => {
        if(form.tagIdGroup.length == 0){
            callback(new Error('请选择标签'))
        }else{
            callback()
        }
        callback()
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

   

    //校验规则
    const rules = reactive({
        
        title: [{ required: true, message: '标题不能为空', trigger: 'blur'},{ min: 1, max: 90, message: '账号在 1 至 90个字符之间', trigger: 'blur'}],
        
        tagIdGroup: [{required: true, validator: checkTagIdGroup, trigger: 'blur' }],
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
                if(form.tagIdGroup != null && form.tagIdGroup.length >0){
                    for(let i = 0; i <form.tagIdGroup.length; i++){
                        let tagId = form.tagIdGroup[i];
                        formData.append('tagId', tagId); 
                    }
                }

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

                
                
                if(form.amount != null && form.amount != ''){
                    formData.append('amount', form.amount);
                }
                if(form.point != null && form.point != ''){
                    formData.append('point', form.point);
                }

                //验证码Key
                formData.append('captchaKey', form.captchaKey);
                //验证码值
                if(form.captchaValue != ''){
                    formData.append('captchaValue', form.captchaValue.trim());
                }

                proxy?.$axios({
                    url: '/user/control/question/add',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                        if(JSON.parse(result.success)){//登录成功
                            
                            ElMessage({
                                showClose: true,
                                message: '提交成功，3秒后自动跳转到问答页',
                                type: 'success',
                                onClose: ()=>{
                                        router.push({
                                        path : '/askList'
                                    });
                                }
                            })


                        }else{
                           
                            //修改返回属性
                            for (const [key, value] of Object.entries(result.error as Map<string,string>) as [string, string][]){
                                if(key == "tagId"){
                                    result.error.tagIdGroup = value;
                                }
                            }

                            //处理错误信息
                            processErrorInfo(result.error as Map<string,string>, error,()=>{});
                            

                            

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
        if(to.name == 'addQuestion'){
            queryAddQuestion();
        }
        
        next();
    });

    onMounted(() => {
        queryAddQuestion();
    }) 

    //卸载组件实例后调用
    onUnmounted (()=>{
        if (Object.keys(form.addQuestionEditor).length != 0) {//不等于空
            form.addQuestionEditor.remove();
            form.addQuestionEditor = {};
        }
    })
</script>



<style scoped lang="scss">
.addQuestionModule{
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
    

    .selectCount{
        width: 200px;
        height: 40px;
        background: $color-black-10;
        border-radius:3px;
        margin-left: 10px;
        .count{
            position: relative; top: 14px;
            display: flex;
            justify-content: center;
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
        :deep(.el-select .el-select__tags .el-tag--info) {
            background-color: $color-black-30;
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

/** 选择问题标签 **/
.selectQuestionTagModule {
    background: #fff;
    .questionTagNavigation{
        font-size: 14px;
        margin-top: -20px;
        .nav {
            background: #f6f6f6;
            padding-left: 8px;
            padding-top: 8px;
            padding-right: 8px;
            .nav-item{
                margin-right: 8px!important;
                margin-bottom: 8px!important;
                display: inline-block;
                cursor:pointer;
                .nav-link {
                    border-radius: 3px;
                    border: 1px solid #42a5f5;
                    color: #42a5f5;
                    background-color: #fff;
                    height:28px;
                    line-height:28px;
                    padding-left:8px;
                    padding-right:8px;
                    display: inline-block;
                }
                .active{
                    color: #42a5f5;
                    background-color: $color-blue-10;
                }
                .selected{
                    position: relative;
                    transition: all 0.5s ease;
                    &:after {
                        content: '✔';
                        height: 0px;
                        width: 0px;
                        position: absolute;
                        bottom: -4px;
                        right: -4px;
                        color:#fff;
                        line-height: 6px;
                        border: 10px solid;
                        border-color: transparent #42a5f5 #42a5f5 transparent;
                        /**对号大小,设置小于12px的文字*/
                        display: inline-block;
                        font-size: 12px;
                        text-size-adjust:none;
                        transform : scale(0.6,0.6);/*缩放指定dom，但必须是block级*/
                        
                    }
                }
            }
            a {
                color: #6c757d;
            }
        }
        .tab-content{
            margin: 8px;
            cursor:pointer;
        }
        .child-tag {
            display: inline-block;
            font-size: 14px;
            padding: 0px 8px;
            height: 30px;
            line-height: 30px;
            border-radius: 3px;
            background-color: $color-blue-10;
            color:#359ff5;
            margin-right: 8px;
            margin-bottom: 8px;
        }
        .selected{
            position: relative;
            transition: all 0.5s ease;
            &:after {
                content: '✔';
                height: 0px;
                width: 0px;
                position: absolute;
                bottom: -3px;
                right: -3px;
                color: #42a5f5;
                line-height: 6px;
                border: 10px solid;
                border-color: transparent transparent transparent transparent;
                /**对号大小,设置小于12px的文字*/
                display: inline-block;
                font-size: 12px;
                text-size-adjust:none;
                transform : scale(0.6,0.6);/*缩放指定dom，但必须是block级*/
                
            }
        }
    }
}



</style>