<!-- 手机绑定 -->
<template>
    <!-- 页头 -->
    <Header/>
    <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="phoneBindingModule" >
                <div class="container">
                    <div class="title">手机绑定</div>
                    <el-form :model="form" ref="formRef" :rules="rules" class="iconForm-container" size="large" >
                        <el-form-item :error="error.mobile" prop="mobile" >
                            <el-input v-model="form.mobile" placeholder="请填写手机号" maxlength="11" @input="mobileInputChange" clearable>
                                <template #prefix>
                                    <Icon name="smartphone-line" size="16px"/>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item :error="error.smsCode" prop="smsCode" class="smsCode-item">
                            <el-input v-model="form.smsCode" maxlength="6" placeholder="短信验证码" clearable >
                                <template #prefix>
                                    <Icon name="email" size="16px"/>
                                </template>
                                <template #append>
                                    <div class="smsCode">
                                        <div v-if="form.counter <=0" class="button">
                                            <el-button link @mousedown.native="getSmsCode">获取验证码</el-button>
                                        </div>
                                        <div v-if="form.counter >0" class="text">{{form.countdownText}}</div>
                                    </div>
                                </template>
                            </el-input>
                        </el-form-item>
                        <div class="successInfo">{{form.successInfo}}</div>
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
                            <el-button type="primary" style="width: 100%;" @mousedown.native="onSubmit"  :disabled="form.allowSubmit">提交</el-button>
                        </el-form-item>
                    </el-form>
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
    import { processErrorInfo} from '@/utils/tool';
    import { ElMessage, FormInstance } from 'element-plus';

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();
    const formRef = ref<FormInstance>();

   
    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '手机绑定 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '手机绑定 - ' + store.state.title
                },{
                    name: "description",
                    content: '手机绑定 - ' + store.state.title
                }
            ]
        }))
    )



    const form = reactive({
        mobile:'',//手机号
        smsCode:'',//短信验证码
        showCaptcha:true,//是否显示验证码
        captchaKey: '',//验证码key
        captchaValue: '',//验证码值
        imgUrl: '',//验证码图片
        allowSubmit:false,//提交按钮disabled状态
        allowSmsCodeSubmit:false,//提交按钮disabled状态
        successInfo: '',

        timer: '' as any,//计时器对象
        countdownText: '',//倒计时文本
        counter: 0,//计数器

        lastMobile:'',//上次获取验证码提交的手机号
    });
    

    //错误
    const error = reactive({
        mobile:'',//手机号
        smsCode:'',//短信验证码
        captchaValue:'',//验证码
    })

    //查询手机绑定
    const queryPhoneBinding = () => {
        proxy?.$axios({
            url: '/user/control/phoneBinding',
            method: 'get',
            params:  { 
               
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
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
    


    //获取短信验证码
    const getSmsCode = () => {
        form.allowSmsCodeSubmit = true;//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            formRef.value?.validateField('mobile', (valid: boolean) => {
                if (valid) {
                    resolve();
                } else {
                    form.allowSmsCodeSubmit = false;//提交按钮disabled状态
                }
            });
           formRef.value?.validateField('captchaValue', (valid: boolean) => {
                if (valid) {
                    resolve();
                } else {
                    form.allowSmsCodeSubmit = false;//提交按钮disabled状态
                }
            });
        });

        Promise.all([p1])
            .then(() => {
                //清空error的属性值
                Object.keys(error).map(key => {
                    Object.assign(error, {[key] : ''});
                })
                form.successInfo = "";
                //设置按钮禁用状态
                form.allowSmsCodeSubmit = true;//提交按钮disabled状态

                let formData = new FormData();
                if(form.mobile != null && form.mobile.trim() != ''){
                    formData.append('mobile', form.mobile);
                }

                formData.append('module', '1');

                //验证码Key
                formData.append('captchaKey', form.captchaKey);
                //验证码值
                if(form.captchaValue != ''){
                    formData.append('captchaValue', form.captchaValue.trim());
                }

                proxy?.$axios({
                    url: '/user/control/getSmsCode',
                    method: 'post',
                    data: formData,
                    //showLoading: false,//是否显示加载图标
                    //loadingMask:false,// 是否显示遮罩层
                })
                .then((response: AxiosResponse) => {
                    if(response){
                        const result: any = response.data;
                        let data = JSON.parse(result);
                        if(JSON.parse(data.success)){
                            form.successInfo = "短信验证码已发送";
                            countdown();

                            form.lastMobile = form.mobile.trim();
                        }else{
                            //处理错误信息
                            processErrorInfo(data.error as Map<string,string> , error,()=>{});
                            
                            

                            if(data.captchaKey != null){
                                form.captchaKey = data.captchaKey;
                                replaceCaptcha();
                            }

                        }
                        form.allowSmsCodeSubmit = false;//提交按钮disabled状态
                        form.showCaptcha = true;
                    }
                    
                })
                .catch((error: any) =>{
                    console.log(error);
                });
            })
    }

    //倒计时
    const countdown = () => {
        form.counter = 60;//60秒
        form.countdownText = form.counter+"秒没收到后可重新获取";

        form.timer = setInterval(() => {
          //替换文本
          form.countdownText = form.counter+"秒没收到后可重新获取";
          form.counter--;
          if (form.counter < 0) {
            // 当计时小于零时，取消该计时器
            clearInterval(form.timer)
          }
        }, 1000)
    }

    //重置倒计时
    const resetCountdown = () => {
        form.successInfo = "";
        // 重置按钮可用
        form.allowSmsCodeSubmit = false,//提交按钮disabled状态
        // 重置文本内容
        form.countdownText = ''
        if (form.timer) {
            // 存在计时器对象，则清除
            clearInterval(form.timer)
            // 重置秒数
            form.counter = 0;
            // 计时器对象重置为空
            form.timer = null
        }
    }


    //刷新验证码
    const replaceCaptcha = () => {
        form.imgUrl = store.state.apiUrl+"captcha/" + form.captchaKey + ".jpg?" + Math.random();

    }
    //手机号输入限制
    const mobileInputChange = (val:any) => {
         form.mobile = form.mobile.replace(/[^0-9.]/g, '');

         if(form.mobile.length == 11 && form.mobile != form.lastMobile){
            //重置倒计时
            resetCountdown();
            //刷新验证码
            replaceCaptcha();
         }
         
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


    //校验规则
    const rules = reactive({
         mobile: [{required: true, message: '手机号不能为空', trigger: 'blur'},{ min: 11, max: 11, message: '手机号为11个数字', trigger: 'blur'}],
         smsCode: [{ validator: checkSmsCode, trigger: 'blur' }],
         captchaValue: [{ validator: checkCaptchaValue, trigger: 'blur' }],
    })


    //提交数据
    const onSubmit = () => {
        form.allowSubmit = true;//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            formRef.value?.validateField('mobile', (valid: boolean) => {
                if (valid) {
                    resolve();
                } else {
                    form.allowSubmit = false;//提交按钮disabled状态
                }
            });
           formRef.value?.validateField('smsCode', (valid: boolean) => {
                if (valid) {
                    resolve();
                } else {
                    form.allowSubmit = false;//提交按钮disabled状态
                }
            });
        });

        Promise.all([p1])
            .then(() => {
                //清空error的属性值
                Object.keys(error).map(key => {
                    Object.assign(error, {[key] : ''});
                })
            

                 let formData = new FormData();
                if(form.mobile != null && form.mobile.trim() != ''){
                    formData.append('mobile', form.mobile);
                }

                formData.append('smsCode', form.smsCode);

                proxy?.$axios({
                    url: '/user/control/phoneBinding',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                    
                        if(JSON.parse(result.success)){
                            ElMessage({
                                showClose: true,
                                message: '提交成功，3秒后自动跳转到实名认证页',
                                type: 'success',
                                onClose: ()=>{
                                     router.push({
                                        path : '/user/control/realNameAuthentication'
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
        if(to.name == 'phoneBinding'){
            queryPhoneBinding();
        }
        
        next();
    });
    onMounted(() => {
        init();
        
    }) 

    //初始化
    const init = () => {
		queryPhoneBinding();
        
	}
    

</script>

<style scoped lang="scss">
    .phoneBindingModule{
        background: #fff;
        padding-right:8px;
        padding-left:8px;
        padding-top:8px;
        padding-bottom: 30px;
        .container {
            width: 360px;
            padding-top: 10px;
            overflow: hidden;
            margin: 0 auto;
            .title{
                margin-top: 25px;
                font-size: 16px;
            }
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
            .smsCode-item{
                .smsCode{
                    width: 170px;
                    text-align: right;
                    .button{
                        color: $color-blue-60;
                        margin-right: 16px;
                        &:hover{
                            color: $color-blue-50;
                        }
                    }
                    .countdown{
                        color: $color-blue-60;
                    }
                }
            }
            .successInfo{
                margin-bottom: 18px;
                font-size: 14px;
                color: green;
                line-height: 20px
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
