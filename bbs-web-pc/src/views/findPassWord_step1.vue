<!-- 找回密码 第一步 -->
<template>
    <!-- 页头 -->
    <Header/>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="findPassWordModule" >
                <div class="container">
                    <el-tabs v-model="form.type" >
                        <el-tab-pane label="账号密码找回" :name="10">
                            <el-form :rules="rules_10" label-position="right" ref="formAccountRef" :model="form" class="iconForm-container" size="large">
                                <el-form-item :error="error.account" prop="account" >
                                    <el-input v-model="form.account" placeholder="账号" maxlength="25" clearable>
                                        <template #prefix>
                                            <Icon name="user" size="16px"/>
                                        </template>
                                    </el-input>
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
                            </el-form>
                        </el-tab-pane>
                            <el-tab-pane label="手机号找回" :name="20">
                            <el-form :rules="rules_20" label-position="right" ref="formMobileRef" :model="form" class="iconForm-container" size="large">
                                <el-form-item :error="error.mobile" prop="mobile">
                                    <el-input v-model="form.mobile" placeholder="手机号" maxlength="11" @input="mobileInputChange" clearable>
                                        <template #prefix>
                                            <Icon name="smartphone-line" size="16px"/>
                                        </template>
                                    </el-input>
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
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                    <el-button type="primary" size="large" style="width: 100%;" @mousedown.native="onSubmit"  :disabled="form.allowSubmit">提交</el-button>
                </div>
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
    import { getUri, getUrlParam, processErrorInfo} from '@/utils/tool';
    import { FormInstance } from 'element-plus';

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();
    const formAccountRef = ref<FormInstance>();
    const formMobileRef = ref<FormInstance>();


    
    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '找回密码 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '找回密码 - ' + store.state.title
                },{
                    name: "description",
                    content: '找回密码 - ' + store.state.title
                }
            ]
        }))
    )



    const form = reactive({
        type:10,//类型 10.账号密码找回 20.手机号找回
        account:'',//账号
        mobile:'',//手机号
        showCaptcha:true,//是否显示验证码
        captchaKey: '',//验证码key
        captchaValue: '',//验证码值
        imgUrl: '',//验证码图片
        allowSubmit:false,//提交按钮disabled状态
    });
    

    //错误
    const error = reactive({
        account:'',//账号
        mobile:'',//手机号
        captchaValue:'',//验证码
    })

    //查询找回密码第一步
    const queryFindPassWord_step1 = () => {
        proxy?.$axios({
            url: '/findPassWord/step1',
            method: 'get',
            params:  { 
               
            },
            //showLoading: false,//是否显示加载图标
            //loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                form.captchaKey = result.captchaKey;
                replaceCaptcha();
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
    //手机号输入限制
    const mobileInputChange = (val:any) => {
         form.mobile = form.mobile.replace(/[^0-9.]/g, '')
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

    //校验短信验证码
    const checkSmsCode = (rule: any, value: any, callback: any) => {
        if (value === '') {
            return callback(new Error('短信验证码不能为空'));
        }else{
            if (value.trim().length < 6) {
                callback(new Error('验证码长度为6个字符'))
            } else {   
                callback();
            }

        }
    }



    //用户类型--账号密码用户 校验规则
    const rules_10 = reactive({
        account: [{ required: true, message: '账号不能为空', trigger: 'blur'},{ min: 3, max: 25, message: '账号在 3 至 25个字符之间', trigger: 'blur'}],
        captchaValue: [{ validator: checkCaptchaValue, trigger: 'blur' }],

    })

    //用户类型--手机号用户 校验规则
    const rules_20 = reactive({
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur'},{ min: 11, max: 11, message: '手机号为11个数字', trigger: 'blur'}],
        captchaValue: [{ validator: checkCaptchaValue, trigger: 'blur' }],
    })


    //提交数据
    const onSubmit = () => {
        form.allowSubmit = true;//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            if(form.type == 10){//账号密码用户
                formAccountRef.value?.validate((valid: boolean) => {
                    if (valid) {
                        resolve();
                    }else{
                        form.allowSubmit = false;//提交按钮disabled状态
                    }
                })
            }else{
                resolve();
            }
            
        });

        const p2 = new Promise<void>((resolve, reject) => {
            if(form.type == 20){//手机号用户
                formMobileRef.value?.validate((valid: boolean) => {
                    if (valid) {
                        resolve();
                    }else{
                        form.allowSubmit = false;//提交按钮disabled状态
                    }
                })
            }else{
                resolve();
            }
        });
        Promise.all([p1,p2])
            .then(() => {
                //清空error的属性值
                Object.keys(error).map(key => {
                    Object.assign(error, {[key] : ''});
                })
            

                let formData = new FormData();
                if(form.type == 10){//10:本地账号密码用户
                    formData.append('type', String(form.type));
                    //账号
                    if(form.account != ''){
                        formData.append('account', form.account);
                    }
                }else if(form.type == 20){//20: 手机用户
                    formData.append('type', String(form.type));
                    //手机号
                    if(form.mobile != ''){
                        formData.append('mobile', form.mobile);
                    }
                }
                //验证码Key
                formData.append('captchaKey', form.captchaKey);
                //验证码值
                if(form.captchaValue != ''){
                    formData.append('captchaValue', form.captchaValue.trim());
                }

                proxy?.$axios({
                    url: '/findPassWord/step1',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                        let jumpUrl = result.jumpUrl;
                        if(JSON.parse(result.success)){

                            let uri = getUri(jumpUrl);
                            let userName = getUrlParam(jumpUrl,'userName');
                            let mobile = getUrlParam(jumpUrl,'mobile');

                            router.push({
                                path : '/'+uri,
                                query:{
                                    userName: userName,
                                    mobile:mobile
                                }
                            });
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
        if(to.name == 'findPassWord_step1'){
            queryFindPassWord_step1();
        }
        
        next();
    });
    onMounted(() => {
        init();
        
    }) 

    //初始化
    const init = () => {
		queryFindPassWord_step1();
        
	}
    

</script>

<style scoped lang="scss">
    .findPassWordModule{
        background: #fff;
        padding-right:8px;
        padding-left:8px;
        padding-top:8px;
        padding-bottom: 30px;
        .container {
            width: 360px;
            padding-top: 20px;
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
         //图标表单
        .iconForm-container{
            margin-top: 20px;
            :deep(.el-form-item__content) {
                line-height: normal;
            }
            :deep(.el-form-item__error) {
                width: 100%;
            }
            :deep(.el-form-item__content) {
                line-height: normal;
            }
            .replaceCaptchaText{
                position: relative;
                top: 10px;
                user-select:none;
            }
            
            .captcha-item{
                .captchaInput{
                    width: 130px;
                }
                :deep(.el-form-item__error){
                    width: 100%;
                }
            }
            
        }
         
    }

</style>
