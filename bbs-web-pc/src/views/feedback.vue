<!-- 在线留言 -->
<template>
    <!-- 页头 -->
    <Header/>

    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="addFeedbackModule" >
                <div class="container" v-if="form.allowFeedback">
                    <el-tabs>
                        <el-tab-pane label="在线留言" >
                            <el-form label-position="right" :rules="rules" ref="formRef" :model="form" class="textForm-container" size="large" >
                                <el-form-item :error="error.name" prop="name" >
                                    <div class="view-field">
                                        <div class="input-name isRequired">称呼</div>
                                        <div class="formInput-content">
                                            <el-input v-model.trim="form.name" placeholder="请输入称呼" maxlength="30" clearable></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item :error="error.contact" prop="contact" >
                                    <div class="view-field">
                                        <div class="input-name isRequired">联系方式</div>
                                        <div class="formInput-content">
                                            <el-input v-model.trim="form.contact" placeholder="请输入联系方式" maxlength="30" clearable></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item :error="error.content" prop="content" >
                                    <div class="view-field">
                                        <div class="input-name isRequired">内容</div>
                                        <div class="formInput-content">
                                            <el-input type="textarea" v-model.trim="form.content" :rows="5" :maxlength="1000"></el-input>
                                        </div>
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
                        </el-tab-pane>
                    </el-tabs>
                </div>
                


                <el-result v-if="!form.allowFeedback" icon="warning" title="在线留言功能已关闭"></el-result>
            </div>
        </div>
    </div>


    <!-- 页脚 -->
    <Footer/>
</template>


<script lang="ts" setup>
    import { getCurrentInstance, ComponentInternalInstance, reactive, onMounted, ref, computed} from 'vue'
    import { useMeta} from 'vue-meta'
    import { appStore } from "@/store";
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import Header from '@/components/Header.vue'
    import { AxiosResponse } from 'axios'
    import { processErrorInfo} from '@/utils/tool';
    import { ElMessage, FormInstance } from 'element-plus';

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();
    const formRef = ref<FormInstance>();



    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '在线留言 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '在线留言 - ' + store.state.title
                },{
                    name: "description",
                    content: '在线留言 - ' + store.state.title
                }
            ]
        }))
    )



    const form = reactive({
        allowFeedback:true,//是否允许提交在线留言
        name:'',//称呼
        contact:'',//联系方式
        content:'',//内容
        showCaptcha:true,//是否显示验证码
        captchaKey: '',//验证码key
        captchaValue: '',//验证码值
        imgUrl: '',//验证码图片
        allowSubmit:false,//提交按钮disabled状态
    });
    

    //错误
    const error = reactive({
        name:'',//称呼
        contact:'',//联系方式
        content:'',//内容
        captchaValue:'',//验证码
    })

    //查询添加在线留言表单
    const queryAddFeedback = () => {
         //清空error的属性值
         Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        //重置表单
        formRef.value?.resetFields();

        proxy?.$axios({
            url: '/queryAddFeedback',
            method: 'get',
            params:  {},
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                form.allowFeedback = data.allowFeedback;//是否允许提交在线留言
                if(data.allowFeedback){
                    if (data.captchaKey != undefined && data.captchaKey != '') {
                        form.showCaptcha = true;
                        form.captchaKey = data.captchaKey;
                        replaceCaptcha();//刷新验证码
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
        name: [{ required: true, message: '称呼不能为空', trigger: 'blur'},{ min: 1, max: 30, message: '称呼在 1 至 30个字符之间', trigger: 'blur'}],
        contact: [{ required: true, message: '联系方式不能为空', trigger: 'blur'},{ min: 1, max: 30, message: '称呼在 1 至 30个字符之间', trigger: 'blur'}],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur'},{ min: 3, max: 1000, message: '称呼在 1 至 1000个字符之间', trigger: 'blur'}],
        captchaValue: [{ validator: checkCaptchaValue, trigger: 'blur' }],

    })


    //提交数据
    const onSubmit = () => {
        form.allowSubmit = true;//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            formRef.value?.validate((valid: boolean) => {
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
                
                if(form.name != ''){
                    formData.append('name', form.name);
                }
                if(form.contact != ''){
                    formData.append('contact', form.contact);
                }
                if(form.content != ''){
                    formData.append('content', form.content);
                }

                //验证码Key
                formData.append('captchaKey', form.captchaKey);
                //验证码值
                if(form.captchaValue != ''){
                    formData.append('captchaValue', form.captchaValue.trim());
                }

                proxy?.$axios({
                    url: '/feedback/control/add',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){
                        const result: any = response.data;
                        if(JSON.parse(result.success)){
                            ElMessage({
                                showClose: true,
                                message: '留言成功，3秒后自动跳转到首页',
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
                            

                            form.allowSubmit = false;//提交按钮disabled状态

                            if(result.captchaKey != null){
                                form.showCaptcha = true;
                                form.captchaKey = result.captchaKey;
                                replaceCaptcha();
                            }

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
        if(to.name == 'feedback'){
            queryAddFeedback();
        }
        
        next();
    });
    onMounted(() => {
        init();
        
    }) 

    //初始化
    const init = () => {
		queryAddFeedback();
        
	}
    

</script>

<style scoped lang="scss">
.addFeedbackModule{
    background: #fff;
    padding:40px 40px 40px 40px;
    width:680px;
    margin:0px auto;

    .container {
        width: 660px;
        overflow: hidden;
        margin: 0 auto;
        /** 标签分隔线 */
        :deep(.el-tabs__nav-wrap::after){
            background-color: #fff;
        }
        :deep(.el-tabs__item){
            font-size: 16px;
        }
    }
}
</style>
