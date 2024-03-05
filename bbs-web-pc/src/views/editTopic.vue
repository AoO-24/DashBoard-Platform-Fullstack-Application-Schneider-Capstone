<!-- 修改话题页 -->
<template>
    <!-- 页头 :sticky="false"关闭浮动置顶功能 -->
    <Header :sticky="false"/>

    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="editTopicModule" >
                <el-form label-position="right" :rules="rules" ref="formMobileRef" :model="form" class="iconForm-container" size="large" v-if="form.allowTopic">
                    
                    <el-form-item :error="error.title" >
                        <el-input v-model.trim="form.title" placeholder="标题" maxlength="90" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item :error="error.content">
                        <div v-show="!form.isMarkdown" style="width: 100%;">
                            <textarea ref="contentRef" style="width:100%;height:400px;visibility:hidden;"></textarea>
                        </div>
                        <div v-if="form.isMarkdown" style="width: 100%;">
                            <Editor  :editorId="'editTopic'" :value="form.markdownContent" :plugins="form.editTopicEditorPlugin" :locale="zhHans" :editorConfig="markdownEditorConfig" :sanitize="editTopicSanitize" placeholder="请输入内容..." @change="handleMarkdownChange"/>
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
                        <el-button type="primary" size="large" style="width: 130px;" @mousedown.native="cancelEditTopic" plain>取消</el-button>
                    
                    </el-form-item>
                </el-form>


                <el-result v-if="!form.allowTopic" icon="warning" title="不允许修改话题">
                    <template #extra>
                        <el-button type="primary" @click="router.push({path:'/thread',query: {topicId: router.currentRoute.value.query.topicId}})">返回</el-button>
                    </template>
                </el-result>
            </div>
        </div>

    </div>
    <!-- 页脚 -->
    <Footer/>
</template>

<script setup lang="ts">
    import { onMounted, ref , getCurrentInstance, ComponentInternalInstance, reactive, onUnmounted, computed, watch, nextTick,} from 'vue'
    import { ElMessage, FormInstance} from 'element-plus'
    import { useRouter } from 'vue-router'
    import { useMeta} from 'vue-meta';
    import { appStore } from "@/store";
    import { AxiosResponse } from 'axios';
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
    const contentRef = ref()


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '修改话题 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '修改话题 - ' + store.state.title
                },{
                    name: "description",
                    content: '修改话题 - ' + store.state.title
                }
            ]
        }))
    )

    const form = reactive({
        allowTopic:true,//是否允许提交话题
        userGradeList:[],//用户等级
        availableTag:[] as Array<string>,//话题编辑器允许使用标签
        fileSystem:0,//文件存储系统
        supportEditor:10,//支持编辑器

        title:'',//标题
        content:'',//内容
        markdownContent:'',//markdown内容
        isMarkdown:false,//是否使用markdown编辑器

        showCaptcha:false,//是否显示验证码
        captchaKey: '',//验证码key
        captchaValue: '',//验证码值
        imgUrl: '',//验证码图片
        allowSubmit:false,//提交按钮disabled状态

        editTopicEditor :{} as any,//修改话题编辑器
		editTopicEditorCreateParameObject :{} as any,//修改话题编辑器的创建参数

        editTopicEditorPlugin:[] as BytemdPlugin[],//添加话题Markdown编辑器插件
    });

    //错误
    const error = reactive({
        title:'',//标题
        content:'',//内容
        captchaValue:'',//验证码
    })

    //处理Markdown
    const handleMarkdownChange = (value: string) => {
        form.markdownContent = value;
    }

    //白名单
    const editTopicSanitize = (schema: any) => {
        schema = sanitize(schema);
        
        if(form.availableTag?.indexOf('embedVideo') != -1){//嵌入视频
            schema.tagNames.push('iframe');
        }

        return schema;
    }

    //处理切换到富文本编辑器
    const handleToggleRichtextEditor = (editorId: string) => {
        form.isMarkdown = false;
        nextTick(()=>{
            if (Object.keys(form.editTopicEditorCreateParameObject).length != 0) {//不等于空
                //创建富文本编辑器
                form.editTopicEditor = createEditor(
                    form.editTopicEditorCreateParameObject.ref, 
                    form.editTopicEditorCreateParameObject.availableTag, 
                    form.editTopicEditorCreateParameObject.uploadPath, 
                    form.editTopicEditorCreateParameObject.userGradeList,
                    form.fileSystem,
                    (editorId: string)=>{
                        handleToggleMarkdownEditor(editorId);
                    }
                );
            }
        })
        
        
    }

    //处理切换到Markdown编辑器
    const handleToggleMarkdownEditor = (editorId: string) => {
        
        if (Object.keys(form.editTopicEditor).length != 0) {//不等于空
			form.editTopicEditor.remove();
            form.editTopicEditor = {};
		}
        form.isMarkdown = true;
    }


    //查询修改话题页
    const queryEditTopic = (topicId:string) => {
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        //重置表单
        formMobileRef.value?.resetFields();

        proxy?.$axios({
            url: '/user/editTopic',
            method: 'get',
            params:  {
                topicId:topicId
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                let topic = data.topic;
                if(topic){
                    form.title = topic.title;
                    contentRef.value.value = topic.content;

                    if(topic.isMarkdown != null && topic.isMarkdown == true){
                        form.isMarkdown = true;
                        form.markdownContent = topic.markdownContent;
                    }
                }

                form.allowTopic = data.allowTopic;//是否允许提交话题
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

                    form.availableTag = availableTagObject;//话题编辑器允许使用标签
                }
                
                form.fileSystem = data.fileSystem;//文件存储系统

                

                if(form.editTopicEditorPlugin != null && form.editTopicEditorPlugin.length ==0){
                    //添加插件
                    form.editTopicEditorPlugin.push(...markdownPlugins);

                    form.editTopicEditorPlugin.push(emoji());
                    if(form.supportEditor == 30 || form.supportEditor == 40){//10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                        form.editTopicEditorPlugin.push(
                            toggleEditor((editorId: string)=>{handleToggleRichtextEditor(editorId)})
                        );
                    }
                    form.editTopicEditorPlugin.push(
                        help(form.availableTag,form.userGradeList)
                    );

                    if(form.availableTag?.indexOf('insertfile') != -1){
                        form.editTopicEditorPlugin.push(
                            fileUpload("user/control/topic/upload?method=upload",'file',form.fileSystem)
                        );
                    }
                    if(form.availableTag?.indexOf('image') != -1){
                        form.editTopicEditorPlugin.push(
                            imageUpload("user/control/topic/upload?method=upload",'file',form.fileSystem)
                        );
                        form.editTopicEditorPlugin.push(
                            pasteImageUpload("user/control/topic/upload?method=upload",'file',form.fileSystem)
                        );
                    }  

                    if(form.availableTag?.indexOf('uploadVideo') != -1){
                        form.editTopicEditorPlugin.push(
                            videoUpload("user/control/topic/upload?method=upload","file",form.fileSystem)
                        );
                    }
                    if(form.availableTag?.indexOf('hidePassword') != -1 
                        || form.availableTag?.indexOf('hideComment') != -1
                        || form.availableTag?.indexOf('hideGrade') != -1 
                        || form.availableTag?.indexOf('hidePoint') != -1 
                        || form.availableTag?.indexOf('hideAmount') != -1
                        ){
                        form.editTopicEditorPlugin.push(
                            hideContent(form.availableTag,form.userGradeList)
                        );
                    }
                }

                if (data.captchaKey != undefined && data.captchaKey != '') {
                    form.showCaptcha = true;
                    form.captchaKey = data.captchaKey;
                    replaceCaptcha();//刷新验证码
                }

                if(data.allowTopic && Object.keys(form.editTopicEditorCreateParameObject).length === 0) {//等于空){
                    let uploadPath = "user/control/topic/upload?method=upload";
                    if(!form.isMarkdown){
                        //创建富文本编辑器
                        form.editTopicEditor = createEditor(contentRef.value, form.availableTag, uploadPath, form.userGradeList,form.fileSystem,(editorId: string)=>{
                            handleToggleMarkdownEditor(editorId);
                        });
                    }
                    form.editTopicEditorCreateParameObject = {
                        ref:contentRef.value,
                        availableTag:form.availableTag,
                        uploadPath:uploadPath,
                        userGradeList:form.userGradeList
                    }
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });

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

                let topicId:string = router.currentRoute.value.query.topicId != undefined ?router.currentRoute.value.query.topicId as string :'';
                formData.append('topicId', topicId);

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

                
                
                //验证码Key
                formData.append('captchaKey', form.captchaKey);
                //验证码值
                if(form.captchaValue != ''){
                    formData.append('captchaValue', form.captchaValue.trim());
                }

                proxy?.$axios({
                    url: '/user/control/topic/edit',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                    
                        if(JSON.parse(result.success)){//登录成功
                      
                            ElMessage({
                                showClose: true,
                                message: '提交成功，3秒后自动跳转到话题内容页',
                                type: 'success',
                                onClose: ()=>{
                                    router.push({
                                        path : '/thread',
                                        query: {topicId: topicId}
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

    //取消修改话题
    const cancelEditTopic = () => {
        let topicId:string = router.currentRoute.value.query.topicId != undefined ?router.currentRoute.value.query.topicId as string :'';
        
        router.push({
            path : '/thread',
            query: {topicId: topicId}
        });
    }
   


    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'editTopic'){
            let topicId:string = '';
            if(to.query.topicId != undefined){
                topicId = to.query.topicId as string
            }
            queryEditTopic(topicId);
        }
        
        next();
    });
    

    onMounted(() => {
        let topicId:string = router.currentRoute.value.query.topicId != undefined ?router.currentRoute.value.query.topicId as string :'';
           
        queryEditTopic(topicId);
    }) 

    //卸载组件实例后调用
    onUnmounted (()=>{
        if (Object.keys(form.editTopicEditor).length != 0) {//不等于空
            form.editTopicEditor.remove();
            form.editTopicEditor = {};
        }
    })
</script>



<style scoped lang="scss">
.editTopicModule{
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