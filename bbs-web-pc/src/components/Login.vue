<!-- 登录 -->
<template>
    <div class="login-container" >
        <el-tabs v-model="loginForm.type" >
            <el-tab-pane label="账号密码登录" :name="10">
                <el-form :rules="rules_10" label-position="right" ref="loginFormAccountRef" :model="loginForm" class="iconForm-container" size="large" @keyup.enter.native="onSubmit">
                    <el-form-item :error="error.account" prop="account" >
                        <el-input v-model="loginForm.account" placeholder="账号" maxlength="25" clearable>
                            <template #prefix>
                                <Icon name="user" size="16px"/>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :error="error.password" prop="password">
                        <el-input v-model="loginForm.password" placeholder="密码" maxlength="20" type="password" clearable>
                            <template #prefix>
                                <Icon name="lock-2" size="16px"/>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :error="error.captchaValue" prop="captchaValue" v-if="loginForm.showCaptcha" class="captcha-item">
                        <el-row>
                            <el-col :span="10" >
                                <el-input v-model="loginForm.captchaValue" class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                    <template #prefix>
                                        <Icon name="shield-check-line" size="16px"/>
                                    </template>
                                </el-input>
                            </el-col>
                            <el-col :span="8" :offset="1">
                                <el-image :src="loginForm.imgUrl" @click="replaceCaptcha"/>
                            </el-col>
                            <el-col :span="4" :offset="1">
                                <el-link type="primary" @click="replaceCaptcha" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>


            </el-tab-pane>
            <el-tab-pane label="手机号登录" :name="20">
                <el-form :rules="rules_20" label-position="right" ref="loginFormMobileRef" :model="loginForm" class="iconForm-container" size="large" @keyup.enter.native="onSubmit">
                    <el-form-item :error="error.mobile" prop="mobile">
                        <el-input v-model="loginForm.mobile" placeholder="手机号" maxlength="11" @input="mobileInputChange" clearable>
                            <template #prefix>
                                <Icon name="smartphone-line" size="16px"/>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :error="error.password" prop="password">
                        <el-input v-model="loginForm.password" placeholder="密码" maxlength="20" type="password" clearable>
                            <template #prefix>
                                <Icon name="lock-2" size="16px"/>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :error="error.captchaValue" prop="captchaValue" v-if="loginForm.showCaptcha" class="captcha-item">
                        <el-row>
                            <el-col :span="10" >
                                <el-input v-model="loginForm.captchaValue" class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                    <template #prefix>
                                        <Icon name="shield-check-line" size="16px"/>
                                    </template>
                                </el-input>
                            </el-col>
                            <el-col :span="8" :offset="1">
                                <el-image :src="loginForm.imgUrl" @click="replaceCaptcha"/>
                            </el-col>
                            <el-col :span="4" :offset="1">
                                <el-link type="primary" @click="replaceCaptcha" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>

        <div class="otherInfo">
	        <a href="findPassWord/step1">找回密码？</a>
	    </div>
        <el-button type="primary" size="large" style="width: 100%;" @mousedown.native="onSubmit"  :disabled="loginForm.allowSubmit">登录</el-button>
    
        <div class="otherLogin" v-if="loginForm.supportLoginInterfaceList != null && loginForm.supportLoginInterfaceList.length >0">
            <h4 class="title">其他登录方式</h4>
            <p class="link">
                <span v-for="supportLoginInterface in loginForm.supportLoginInterfaceList">
                    <a @click="jumpLogin(supportLoginInterface.interfaceProduct)" :class="'icon-'+supportLoginInterface.interfaceProduct" :title="supportLoginInterface.name"></a>             
                </span>
            </p>



        </div>
        
    </div>
</template>

<script setup lang="ts">
    import { ref,getCurrentInstance, ComponentInternalInstance,reactive, onMounted} from 'vue'
    import { appStore } from "@/store";
    import { useRouter } from 'vue-router'
    import { FormInstance, ElForm } from 'element-plus'
    import { AxiosResponse } from 'axios'
    import { SHA256} from 'crypto-js';
    import { processErrorInfo} from '@/utils/tool';
    import { jumpDataFormat} from '@/utils/jumpProcess';
    import { SupportLoginInterface } from "@/types/index";




    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();

    //传递消息给父组件
    const emit_closeDialog = defineEmits(['closeDialog'])
   
    //接收父组件消息
    const props = defineProps({
        pop_up_window: {//是否为弹出窗口登录
            type: Boolean,
            default: false
        }
    })  
    

    //登录表单
    const loginForm = reactive({
        type:10,//用户类型
        account: '',//账号
        mobile: '',//手机号
        password: '',//密码
        showCaptcha:false,//是否显示验证码
        captchaKey: '',//验证码key
        captchaValue: '',//验证码值
        imgUrl: '',//验证码图片
        allowSubmit:false,//提交按钮disabled状态

        supportLoginInterfaceList: [] as SupportLoginInterface[],//支持登录接口集合
    })

    //登录错误
    const error = reactive({
        account: '',//账号
        mobile: '',//手机号
        password: '',//密码
        captchaValue: '',//验证码
    })

    //加载登录页
    const queryLogin = () => {
        proxy?.$axios({
            url: '/login',
            method: 'get',
            params:  {
            }
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if (result.showCaptcha == true) {
                    loginForm.showCaptcha = true;
                    loginForm.captchaKey = result.captchaKey;
                    replaceCaptcha();//刷新验证码
				}
            }
        }).catch((error: any) =>{
            console.log(error);
        });

    }

	//加载第三方登录页
    const queryThirdPartyLogin = () => {
        proxy?.$axios({
            url: '/queryThirdPartyLogin',
            method: 'get',
            params:  {  
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result != null){
                    loginForm.supportLoginInterfaceList = result;
                }
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }	
    //跳转登录
    const jumpLogin = (interfaceProduct:number) => {
        proxy?.$axios({
            url: '/thirdParty/loginLink',
            method: 'get',
            params:  {  
                interfaceProduct:interfaceProduct,
                jumpUrl:(router.currentRoute.value.query.jumpUrl != undefined ? router.currentRoute.value.query.jumpUrl :'')
            },
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result.redirectUrl != undefined){
                    window.location.href = result.redirectUrl;

                }
            }
        }).catch((error: any) =>{
            console.log(error);
        });

    }
    
	
    
    //刷新验证码
    const replaceCaptcha = () => {
        loginForm.imgUrl = store.state.baseURL+"captcha/" + loginForm.captchaKey + ".jpg?" + Math.random();

    }

    //手机号输入限制
    const mobileInputChange = (val:any) => {
         loginForm.mobile = loginForm.mobile.replace(/[^0-9.]/g, '')
    }



    
    //校验验证码
    const checkCaptchaValue = (rule: any, value: any, callback: any) => {
        if(loginForm.captchaKey != null && loginForm.captchaKey != ''){
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
                            captchaKey:loginForm.captchaKey,
                            captchaValue:loginForm.captchaValue
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


    //用户类型--账号密码用户 校验规则
    const rules_10 = reactive({
        account: [{ required: true, message: '账号不能为空', trigger: 'blur'},{ min: 3, max: 25, message: '账号在 3 至 25个字符之间', trigger: 'blur'}],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur'},{ min: 7, message: '密码长度不能小于7个字符', trigger: 'blur'}],
        captchaValue: [{ validator: checkCaptchaValue, trigger: 'blur' }],

    })

    //用户类型--手机号用户 校验规则
    const rules_20 = reactive({
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur'},{ min: 11, max: 11, message: '手机号为11个数字', trigger: 'blur'}],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur'},{ min: 7, message: '密码长度不能小于7个字符', trigger: 'blur'}],
        captchaValue: [{ validator: checkCaptchaValue, trigger: 'blur' }],

    })

    const loginFormAccountRef = ref<FormInstance>();
    const loginFormMobileRef = ref<FormInstance>();

    //提交数据
    const onSubmit = () => {
        loginForm.allowSubmit = true;//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            if(loginForm.type == 10){//账号密码用户
                loginFormAccountRef.value?.validate((valid: boolean) => {
                    if (valid) {
                        resolve();
                    }else{
                        loginForm.allowSubmit = false;//提交按钮disabled状态
                    }
                })
            }else{
                resolve();
            }
            
        });

        const p2 = new Promise<void>((resolve, reject) => {
            if(loginForm.type == 20){//手机号用户
                loginFormMobileRef.value?.validate((valid: boolean) => {
                    if (valid) {
                        resolve();
                    }else{
                        loginForm.allowSubmit = false;//提交按钮disabled状态
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
                if(loginForm.type == 10){//10:本地账号密码用户
                    formData.append('type', String(loginForm.type));
                    //账号
                    if(loginForm.account != ''){
                        formData.append('account', loginForm.account);
                    }
                }else if(loginForm.type == 20){//20: 手机用户
                    formData.append('type', String(loginForm.type));
                    
                    //手机号
                    if(loginForm.mobile != ''){
                        formData.append('mobile', loginForm.mobile);
                    }
                }
                
                //密码需SHA256加密
                if(loginForm.password){
                    let SHA256Value = SHA256(loginForm.password).toString();
                    formData.append('password', SHA256Value);
                }


                //url跳转参数
                let jumpUrl:string = router.currentRoute.value.query.jumpUrl != undefined ? router.currentRoute.value.query.jumpUrl as string : '';
                if (jumpUrl != null && jumpUrl != '') {
                    formData.append('jumpUrl', jumpUrl);
                }


                //验证码Key
                formData.append('captchaKey', loginForm.captchaKey);
                //验证码值
                if(loginForm.captchaValue != ''){
                    formData.append('captchaValue', loginForm.captchaValue.trim());
                }

                proxy?.$axios({
                    url: '/login',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                    
                        if(JSON.parse(result.success)){//登录成功
                            let jumpUrl = result.jumpUrl;
                            let systemUser = result.systemUser;
                            let accessToken = result.accessToken;
                            let refreshToken = result.refreshToken;

                            //访问令牌和刷新令牌存储到localStorage
                            window.localStorage.setItem("bbsToken", JSON.stringify({accessToken : accessToken, refreshToken : refreshToken}));

                            store.commit('setSystemUser', systemUser);

                            if (jumpUrl != null && jumpUrl != '' && jumpUrl != 'index') {

                                let decryptObject = jumpDataFormat(jumpUrl);
                                if(decryptObject.path == "/login"){
                                    router.push("index");
                                }else{
                                    router.push({
                                        path : decryptObject.path,
                                        query: decryptObject.query
                                    });
                                }
                                

                            } else {
                                if(props.pop_up_window){//如果为弹出窗口登录
                                    router.go(0)//刷新当前页

                                }else{
                                    router.push("index");
                                }
                            }

                            
                            //传递消息给父组件
                            emit_closeDialog('closeDialog',false);


                        }else{
                            //处理错误信息
                            processErrorInfo(result.error as Map<string,string> , error,()=>{});
                            

                            loginForm.allowSubmit = false;//提交按钮disabled状态

                            if(result.captchaKey != null){
                                loginForm.showCaptcha = true;
                                loginForm.captchaKey = result.captchaKey;
                                replaceCaptcha();
                            }else{
                                loginForm.showCaptcha = false;
                            }


                        }
                    }
                })
                .catch((error: any) =>{
                    console.log(error);
                    loginForm.allowSubmit = false;//提交按钮disabled状态
                });
            }).catch(() => {
                console.log("提交数据错误");
            });

    }
    
    
   


    onMounted(() => {

        //加载登录页
        queryLogin();

        //加载第三方登录页
        queryThirdPartyLogin();

    }) 
</script>

<style scoped lang="scss">


.login-container{
    
    /** 标签分隔线 */
    :deep(.el-tabs__nav-wrap::after){
        background-color: #fff;
    }
    :deep(.el-tabs__item){
        font-size: 16px;
    }

    //图标表单
    .iconForm-container{
        margin-top: 25px;
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
        :deep(.el-form-item__content) {
            line-height: normal;
        }
    }

    
    .otherInfo{
        height:40px;
        line-height:40px;
        overflow:hidden;
        font-size: 14px;
        a{
            float:right; 
            color: #1890ff;
        }
    }

    .otherLogin {
        width:380px;
        margin:0 auto;
        margin-top: 30px;
        border-top: 1px solid $color-black-30;
        font-size: 14px;
        .title{
            color: $color-black-40;
            width: 100px;
            margin: -11px auto 0;
            background: #fff;
            text-align: center;
            font-weight:normal;
        }
        .link{
            text-align: center;
            margin: 10px 0 0px;
            a{
                display: inline-block;
                width: 48px;
                color: $color-black-30;
                margin: 0 10px;
                background-size: 100% auto;
                background-repeat: no-repeat;
            }
            .icon-10{
               // background-image:url('../images/weixin.svg');
                background-image:url('@/assets/images/weixin.svg');
                width: 30px;
                height: 30px;
            }
            .icon-50{
                background-image:url('@/assets/images/other-login.svg');
                width: 30px;
                height: 30px;
            }
        }

    }
}
</style>
