<!-- 注册页 -->
<template>
    <!-- 页头 -->
    <Header/>

    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="registerModule" >
                <div class="container">
                    <el-tabs v-model="form.type"  @tab-change="handleTabClick">
                        <el-tab-pane label="账号密码注册" :name="10" v-if="form.allowRegisterAccount.local == true">
                            <el-form :rules="rules_10" label-position="right" ref="formAccountRef" :model="form" class="textForm-container" size="large">
                                <el-form-item :error="error.account" prop="account" >
                                    <div class="view-field">
                                        <div class="input-name isRequired">账号</div>
                                        <div class="formInput-content">
                                            <el-input v-model="form.account" placeholder="请输入账号" maxlength="25" clearable></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item :error="error.password" prop="password">
                                    <div class="view-field">
                                        <div class="input-name isRequired">密码</div>
                                        <div class="formInput-content">
                                            <el-input v-model="form.password" placeholder="请输入密码" maxlength="20" type="password" clearable></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item :error="error.confirmPassword" prop="confirmPassword">
                                    <div class="view-field">
                                        <div class="input-name isRequired">确认密码</div>
                                        <div class="formInput-content">
                                            <el-input v-model="form.confirmPassword" placeholder="请输入密码" maxlength="20" type="password" clearable></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item :error="error.issue" prop="issue" >
                                    <div class="view-field">
                                        <div class="input-name isRequired">密码提示问题</div>
                                        <div class="formInput-content">
                                             <el-input v-model="form.issue" placeholder="请输入密码提示问题" maxlength="25" clearable></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item :error="error.answer" prop="answer" >
                                    <div class="view-field">
                                        <div class="input-name isRequired">密码提示答案</div>
                                        <div class="formInput-content">
                                             <el-input v-model="form.answer" placeholder="请输入密码提示答案" maxlength="25" clearable></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item :error="error.email" prop="email" >
                                    <div class="view-field">
                                        <div class="input-name">邮箱</div>
                                        <div class="formInput-content">
                                             <el-input v-model="form.email" maxlength="60" clearable></el-input>
                                        </div>
                                        <div class="help">
                                            <span class="help-icon">
                                                <el-icon :size="18"><InfoFilled /></el-icon>
                                            </span>
                                            <span class="help-text">没有可以不填写</span>
                                        </div>
                                    </div>
                                </el-form-item>
                                <div v-for="(userCustom,index) in form.userCustomList">
                                    <el-form-item :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==1">
                                        <div class="view-field">
                                            <div class="input-name" :class="userCustom.required ? 'isRequired' : ''" >{{userCustom.name}}</div>
                                            <div class="formInput-content">
                                                <el-input v-model="form.userBoundField[index]" :maxlength="userCustom.maxlength" clearable></el-input>
                                            </div>
                                            <div class="help" v-if="userCustom.tip != null && userCustom.tip != ''">
                                                <span class="help-icon">
                                                    <el-icon :size="18"><InfoFilled /></el-icon>
                                                </span>
                                                <span class="help-text">{{userCustom.tip}}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==2">
                                        <div class="view-field">
                                            <div class="input-name" :class="userCustom.required ? 'isRequired' : ''" >{{userCustom.name}}</div>
                                            <div class="formInput-content">
                                                <el-radio-group v-model="form.userBoundField[index]">
                                                    <el-radio :label="key" size="large" v-for="(value, key) in userCustom.itemValue" :key="key">{{value}}</el-radio>
                                                </el-radio-group>
                                            </div>
                                            <div class="help" v-if="userCustom.tip != null && userCustom.tip != ''">
                                                <span class="help-icon">
                                                    <el-icon :size="18"><InfoFilled /></el-icon>
                                                </span>
                                                <span class="help-text">{{userCustom.tip}}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==3">
                                        <div class="view-field">
                                            <div class="input-name" :class="userCustom.required ? 'isRequired' : ''" >{{userCustom.name}}</div>
                                            <div class="formInput-content">
                                                <el-checkbox-group v-model="form.userBoundField[index]">
                                                    <el-checkbox :label="key" size="large" v-for="(value, key) in userCustom.itemValue" :key="key">{{value}}</el-checkbox>
                                                </el-checkbox-group>
                                            </div>
                                            <div class="help" v-if="userCustom.tip != null && userCustom.tip != ''">
                                                <span class="help-icon">
                                                    <el-icon :size="18"><InfoFilled /></el-icon>
                                                </span>
                                                <span class="help-text">{{userCustom.tip}}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==4">
                                        <div class="view-field">
                                            <div class="input-name" :class="userCustom.required ? 'isRequired' : ''" >{{userCustom.name}}</div>
                                            <div class="formInput-content">
                                                <el-select v-model="form.userBoundField[index]" :multiple="userCustom.multiple" placeholder="请选择" size="large">
                                                    <el-option v-for="(value, key) in userCustom.itemValue" :key="key" :label="value" :value="key"></el-option>
                                                </el-select>
                                            </div>
                                            <div class="help" v-if="userCustom.tip != null && userCustom.tip != ''">
                                                <span class="help-icon">
                                                    <el-icon :size="18"><InfoFilled /></el-icon>
                                                </span>
                                                <span class="help-text">{{userCustom.tip}}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==5">
                                        <div class="view-field">
                                            <div class="input-name" :class="userCustom.required ? 'isRequired' : ''" >{{userCustom.name}}</div>
                                            <div class="formInput-content">
                                                <el-input type="textarea" v-model="form.userBoundField[index]" :rows="userCustom.rows" :maxlength="userCustom.maxlength"></el-input>
                                            </div>
                                            <div class="help" v-if="userCustom.tip != null && userCustom.tip != ''">
                                                <span class="help-icon">
                                                    <el-icon :size="18"><InfoFilled /></el-icon>
                                                </span>
                                                <span class="help-text">{{userCustom.tip}}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </div>
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
                                <el-form-item :error="error.agreement" prop="agreement">
                                    <div class="view-field">
                                        <div class="input-name">服务条款</div>
                                        <div class="formInput-content">
                                            <el-row>
                                                <el-col :span="2" >
                                                    <el-switch v-model="form.agreement" inline-prompt active-text="是" inactive-text="否"/>
                                                </el-col>
                                                <el-col :span="21" :offset="1">
                                                    <div style="line-height: 42px;">我已阅读 《<el-link type="primary" :underline="false" href="/termsService" target="_blank">用户服务协议</el-link>》并接受其中条款</div>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="手机号注册" :name="20" v-if="form.allowRegisterAccount.mobile == true">
                            <el-form :rules="rules_20" label-position="right" ref="formMobileRef" :model="form" class="textForm-container" size="large">
                                <el-form-item :error="error.mobile" prop="mobile">
                                    <div class="view-field">
                                        <div class="input-name isRequired">手机号</div>
                                        <div class="formInput-content">
                                            <el-input v-model="form.mobile" placeholder="请输入手机号" maxlength="11" @input="mobileInputChange" clearable></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                 <el-form-item :error="error.password" prop="password">
                                    <div class="view-field">
                                        <div class="input-name isRequired">密码</div>
                                        <div class="formInput-content">
                                            <el-input v-model="form.password" placeholder="请输入密码" maxlength="20" type="password" clearable></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item :error="error.confirmPassword" prop="confirmPassword">
                                    <div class="view-field">
                                        <div class="input-name isRequired">确认密码</div>
                                        <div class="formInput-content">
                                            <el-input v-model="form.confirmPassword" placeholder="请输入密码" maxlength="20" type="password" clearable></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                <div v-for="(userCustom,index) in form.userCustomList">
                                    <el-form-item :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==1">
                                        <div class="view-field">
                                            <div class="input-name" :class="userCustom.required ? 'isRequired' : ''" >{{userCustom.name}}</div>
                                            <div class="formInput-content">
                                                <el-input v-model="form.userBoundField[index]" :maxlength="userCustom.maxlength" clearable></el-input>
                                            </div>
                                            <div class="help" v-if="userCustom.tip != null && userCustom.tip != ''">
                                                <span class="help-icon">
                                                    <el-icon :size="18"><InfoFilled /></el-icon>
                                                </span>
                                                <span class="help-text">{{userCustom.tip}}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==2">
                                        <div class="view-field">
                                            <div class="input-name" :class="userCustom.required ? 'isRequired' : ''" >{{userCustom.name}}</div>
                                            <div class="formInput-content">
                                                <el-radio-group v-model="form.userBoundField[index]">
                                                    <el-radio :label="key" size="large" v-for="(value, key) in userCustom.itemValue" :key="key">{{value}}</el-radio>
                                                </el-radio-group>
                                            </div>
                                            <div class="help" v-if="userCustom.tip != null && userCustom.tip != ''">
                                                <span class="help-icon">
                                                    <el-icon :size="18"><InfoFilled /></el-icon>
                                                </span>
                                                <span class="help-text">{{userCustom.tip}}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==3">
                                        <div class="view-field">
                                            <div class="input-name" :class="userCustom.required ? 'isRequired' : ''" >{{userCustom.name}}</div>
                                            <div class="formInput-content">
                                                <el-checkbox-group v-model="form.userBoundField[index]">
                                                    <el-checkbox :label="key" size="large" v-for="(value, key) in userCustom.itemValue" :key="key">{{value}}</el-checkbox>
                                                </el-checkbox-group>
                                            </div>
                                            <div class="help" v-if="userCustom.tip != null && userCustom.tip != ''">
                                                <span class="help-icon">
                                                    <el-icon :size="18"><InfoFilled /></el-icon>
                                                </span>
                                                <span class="help-text">{{userCustom.tip}}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==4">
                                        <div class="view-field">
                                            <div class="input-name" :class="userCustom.required ? 'isRequired' : ''" >{{userCustom.name}}</div>
                                            <div class="formInput-content">
                                                <el-select v-model="form.userBoundField[index]" :multiple="userCustom.multiple" placeholder="请选择" size="large">
                                                    <el-option v-for="(value, key) in userCustom.itemValue" :key="key" :label="value" :value="key"></el-option>
                                                </el-select>
                                            </div>
                                            <div class="help" v-if="userCustom.tip != null && userCustom.tip != ''">
                                                <span class="help-icon">
                                                    <el-icon :size="18"><InfoFilled /></el-icon>
                                                </span>
                                                <span class="help-text">{{userCustom.tip}}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==5">
                                        <div class="view-field">
                                            <div class="input-name" :class="userCustom.required ? 'isRequired' : ''" >{{userCustom.name}}</div>
                                            <div class="formInput-content">
                                                <el-input type="textarea" v-model="form.userBoundField[index]" :rows="userCustom.rows" :maxlength="userCustom.maxlength"></el-input>
                                            </div>
                                            <div class="help" v-if="userCustom.tip != null && userCustom.tip != ''">
                                                <span class="help-icon">
                                                    <el-icon :size="18"><InfoFilled /></el-icon>
                                                </span>
                                                <span class="help-text">{{userCustom.tip}}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </div>
                                <el-form-item :error="error.smsCode" prop="smsCode"  class="smsCode-item">
                                    <el-input v-model="form.smsCode" maxlength="6" placeholder="短信验证码" clearable >
                                        <template #prefix>
                                            <span class="isRequired"></span>
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
                                                    <span class="isRequired"></span>
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
                                <el-form-item :error="error.agreement" prop="agreement">
                                    <div class="view-field">
                                        <div class="input-name">服务条款</div>
                                        <div class="formInput-content">
                                            <el-row>
                                                <el-col :span="2" >
                                                    <el-switch v-model="form.agreement" inline-prompt active-text="是" inactive-text="否"/>
                                                </el-col>
                                                <el-col :span="21" :offset="1">
                                                    <div style="line-height: 42px;">我已阅读 《<el-link type="primary" :underline="false" href="/termsService" target="_blank">用户服务协议</el-link>》并接受其中条款</div>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                    <el-button type="primary" size="large" v-if="form.allowRegisterAccount.local == true || form.allowRegisterAccount.mobile == true" style="width: 100%;" @mousedown.native="onSubmit"  :disabled="form.allowSubmit">提交</el-button>
                
                    <div v-if="form.allowRegisterAccount.local == false &&  form.allowRegisterAccount.mobile == false">
                        <el-result icon="warning" title="已关闭注册">
                            <template #extra>
                                
                            </template>
                        </el-result>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- 页脚 -->
    <Footer/>
</template>

<script setup lang="ts">
    import { getCurrentInstance, ComponentInternalInstance, reactive, onMounted, ref, computed, onUnmounted} from 'vue'
    import { useMeta} from 'vue-meta'
    import { appStore } from "@/store";
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import Header from '@/components/Header.vue'
    import { AxiosResponse } from 'axios'
    import { processErrorInfo} from '@/utils/tool';
    import { FormInstance, TabsPaneContext } from 'element-plus';
    import { AllowRegisterAccount, UserCustom } from '@/types';
    import { SHA256} from 'crypto-js';
    import { jumpDataFormat } from '@/utils/jumpProcess';
    import { generateUUID } from '@/utils/uuid';


    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();
    const formAccountRef = ref<FormInstance>();
    const formMobileRef = ref<FormInstance>();

 
    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '注册 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '注册 - ' + store.state.title
                },{
                    name: "description",
                    content: '注册 - ' + store.state.title
                }
            ]
        }))
    )

    const form = reactive({
        type:10,//类型 10.账号密码注册 20.手机号注册
        userCustomList: {} as Array<UserCustom>,//用户自定义注册功能项
        userBoundField : [] as any, //用户自定义注册功能项绑定
        allowRegisterAccount: {} as AllowRegisterAccount,//允许注册账号类型

        account:'',//账号
        mobile:'',//手机号
        password:'',//密码
        confirmPassword:'',//确认密码
        issue:'',//密码提示问题
        answer:'',//密码提示答案
        email:'',//邮箱
        showCaptcha:true,//是否显示验证码
        captchaKey: '',//验证码key
        captchaValue: '',//验证码值
        imgUrl: '',//验证码图片
        agreement : true, //是否同意服务协议
        allowSubmit:false,//提交按钮disabled状态

        isRegisterCaptcha:false,//如果注册需要验证码(仅账号密码注册类型有效)
        allowSmsCodeSubmit:false,//提交按钮disabled状态
        successInfo: '',
        smsCode:'',//短信验证码
        timer: '' as any,//计时器对象
        countdownText: '',//倒计时文本
        counter: 0,//计数器

        
    });

    //错误
    const error = reactive({
        account:'',//账号
        mobile:'',//手机号
        password:'',//密码
        confirmPassword:'',//确认密码
        issue:'',//密码提示问题
        answer:'',//密码提示答案
        email:'',//邮箱
        captchaValue:'',//验证码
        smsCode:'',//短信验证码
        agreement : '', //是否同意服务协议
        userCustom:new Map(),
    })

    //处理改变Tabs 标签页时触发
    const handleTabClick = (tab: TabsPaneContext, event: Event) => {
        if(form.type == 10){
            if(form.isRegisterCaptcha){
                form.showCaptcha = true;
                replaceCaptcha();
            }else{
                form.showCaptcha = false;
            }
        }else if(form.type == 20){
            if(form.captchaKey == null || form.captchaKey == ''){
                form.captchaKey = generateUUID();
            }
            form.showCaptcha = true;
            replaceCaptcha();
        }
    }
    //查询注册页
    const queryRegister = () => {
        proxy?.$axios({
            url: '/register',
            method: 'get',
            params:  { 
               
            },
            //showLoading: false,//是否显示加载图标
            //loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                form.userCustomList = result.userCustomList;//用户自定义注册功能项
                form.allowRegisterAccount = result.allowRegisterAccount;//允许注册账号类型
                form.captchaKey = result.captchaKey;
                if(form.captchaKey != null && form.captchaKey != ''){
                    form.isRegisterCaptcha = true;
                }else{
                    form.isRegisterCaptcha = false;
                }
            
                //绑定字段
                if(form.userCustomList != null && form.userCustomList.length >0){
                    for (let i = 0; i < form.userCustomList.length; i++) {
                        let userCustom = form.userCustomList[i];
                        boundField(userCustom);
                    }
                }

                if(form.allowRegisterAccount.local == false || form.allowRegisterAccount.mobile == false){
                    if(form.allowRegisterAccount.local == true){
                        form.type = 10;
                    }
                    if(form.allowRegisterAccount.mobile == true){
                        form.type = 20;
                    }
                }
                if(form.type == 10){
                    if(form.isRegisterCaptcha){
                        form.showCaptcha = true;
                        replaceCaptcha();
                    }else{
                        form.showCaptcha = false;
                    }
                }else if(form.type == 20){
                    if(form.captchaKey == null || form.captchaKey == ''){
                        form.captchaKey = generateUUID();
                    }

                    form.showCaptcha = true;
                    replaceCaptcha();
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //绑定字段
    const boundField = (userCustom:UserCustom) => {
        if (userCustom.chooseType == 1) { //文本框
            let content = "";
            for (let i = 0; i < userCustom.userInputValueList.length; i++) {
                content = userCustom.userInputValueList[i].content;
            }
            form.userBoundField.push(content);
        }else if (userCustom.chooseType == 2) { //单选框
            let checked = "";

            for (let i = 0; i < userCustom.userInputValueList.length; i++) {
                let userInputValue = userCustom.userInputValueList[i];
                checked = userInputValue.options;

            }
            //默认选第一项 
            if (checked == "") {
                for (let itemValue in userCustom.itemValue) {
                    checked = itemValue;
                    break;
                }
            }
            form.userBoundField.push(checked);
        } else if (userCustom.chooseType == 3) { //多选框
            let checked = new Array();

            for (let i = 0; i < userCustom.userInputValueList.length; i++) {
                let userInputValue = userCustom.userInputValueList[i];
                checked.push(userInputValue.options);
            }
            form.userBoundField.push(checked);
        }else if (userCustom.chooseType == 4) { //下拉列表
            if (userCustom.multiple == true) { //允许多选
                let checked = new Array();

                A:for (let itemValue in userCustom.itemValue) {
                    for (let i = 0; i < userCustom.userInputValueList.length; i++) {
                        let userInputValue = userCustom.userInputValueList[i];
                        if (itemValue == userInputValue.options) {
                            checked.push(itemValue);
                            continue A;
                        }
                    }
                }
                form.userBoundField.push(checked);

            } else {
                
                let checked = "";

                A:for (let itemValue in userCustom.itemValue) {
                    for (let i = 0; i < userCustom.userInputValueList.length; i++) {
                        let userInputValue = userCustom.userInputValueList[i];
                        if (itemValue == userInputValue.options) {
                            checked = itemValue;
                            break A;
                        }
                    }
                }
                form.userBoundField.push(checked);
            }


        } else if (userCustom.chooseType == 5) { //文本域
            let content = "";
            for (let i = 0; i < userCustom.userInputValueList.length; i++) {
                content = userCustom.userInputValueList[i].content;
            }
            form.userBoundField.push(content);
        }

    }
   
    
     //获取短信验证码
    const getSmsCode = () => {
        form.allowSmsCodeSubmit = true;//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            formMobileRef.value?.validateField('mobile', (valid: boolean) => {
                if (valid) {
                    resolve();
                } else {
                    form.allowSmsCodeSubmit = false;//提交按钮disabled状态
                }
            });
           
           formMobileRef.value?.validateField('captchaValue', (valid: boolean) => {
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
                for (const [key, value] of Object.entries(error) as [string, string|Map<string,string>][]){
                    if(value instanceof Map){
                        value.clear();
                    }else{
                        Object.assign(error, {[key] : ''});
                    }
                }
                form.successInfo = "";
                //设置按钮禁用状态
                form.allowSmsCodeSubmit = true;//提交按钮disabled状态

                let formData = new FormData();
                if(form.mobile != null && form.mobile.trim() != ''){
                    formData.append('mobile', form.mobile);
                }

                formData.append('module', '100');

                //验证码Key
                formData.append('captchaKey', form.captchaKey);
                //验证码值
                if(form.captchaValue != ''){
                    formData.append('captchaValue', form.captchaValue.trim());
                }
                proxy?.$axios({
                    url: '/smsCode',
                    method: 'post',
                    data: formData,
                    //showLoading: false,//是否显示加载图标
                    //loadingMask:false,// 是否显示遮罩层
                })
                .then((response: AxiosResponse) => {
                    const result: any = response.data;
      
                    if(JSON.parse(result.success)){
                        form.successInfo = "短信验证码已发送";
                        countdown();
                    }else{
                        //处理错误信息
                        processErrorInfo(result.error as Map<string,string> , error,()=>{});
                        
                        if(result.captchaKey != null){
                            form.captchaKey = result.captchaKey;
                            replaceCaptcha();
                        }

                    }
                    form.allowSmsCodeSubmit = false;//提交按钮disabled状态
                    form.showCaptcha = true;
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
        if(form.type == 10){
            if(!form.isRegisterCaptcha){
                callback();
                return;
            }
        }
   
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
    //校验确认密码
    const checkConfirmPassword = (rule: any, value: any, callback: any) => {
        if (value === '') {
            return callback(new Error('密码不能为空'));
        }else{
            if (value.trim().length < 7) {
                callback(new Error('密码长度不能小于7个字符'))
            } else {   
                if(form.password != form.confirmPassword){
                    callback(new Error('两次输入密码不相等'))
                }else{
                    callback();
                }
            }
        }
    }

    //校验服务条款
    const checkAgreement = (rule: any, value: any, callback: any) => {
        if (value == false) {
            return callback(new Error('同意服务条款才能注册'));
        }else{
            callback();
        }
    }


    //用户类型--账号密码用户 校验规则
    const rules_10 = reactive({
        account: [{ required: true, message: '账号不能为空', trigger: 'blur'},{ min: 3, max: 25, message: '账号在 3 至 25个字符之间', trigger: 'blur'}],
        issue: [{ required: true, message: '密码提示问题不能为空', trigger: 'blur'},{ min: 7, message: '密码提示问题不能小于7个字符', trigger: 'blur'}],
        answer: [{ required: true, message: '密码提示答案不能为空', trigger: 'blur'},{ min: 7, message: '密码提示答案不能小于7个字符', trigger: 'blur'}],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur'},{ min: 7, message: '密码长度不能小于7个字符', trigger: 'blur'}],
        confirmPassword:[{ validator: checkConfirmPassword, trigger: 'blur' }],
        captchaValue: [{ validator: checkCaptchaValue, trigger: 'blur' }],
        agreement: [{ validator: checkAgreement, trigger: 'blur'}],
    })

    //用户类型--手机号用户 校验规则
    const rules_20 = reactive({
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur'},{ min: 11, max: 11, message: '手机号为11个数字', trigger: 'blur'}],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur'},{ min: 7, message: '密码长度不能小于7个字符', trigger: 'blur'}],
        confirmPassword:[{ validator: checkConfirmPassword, trigger: 'blur' }],
        captchaValue: [{ validator: checkCaptchaValue, trigger: 'blur' }],
        agreement: [{ validator: checkAgreement, trigger: 'blur'}],
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
                formMobileRef.value?.validateField('mobile', (valid: boolean) => {
                    if (valid) {
                        resolve();
                    } else {
                        form.allowSubmit = false;//提交按钮disabled状态
                    }
                });
                formMobileRef.value?.validateField('password', (valid: boolean) => {
                    if (valid) {
                        resolve();
                    } else {
                        form.allowSubmit = false;//提交按钮disabled状态
                    }
                });
                formMobileRef.value?.validateField('confirmPassword', (valid: boolean) => {
                    if (valid) {
                        resolve();
                    } else {
                        form.allowSubmit = false;//提交按钮disabled状态
                    }
                });
                formMobileRef.value?.validateField('smsCode', (valid: boolean) => {
                    if (valid) {
                        resolve();
                    } else {
                        form.allowSubmit = false;//提交按钮disabled状态
                    }
                });
                formMobileRef.value?.validateField('agreement', (valid: boolean) => {
                    if (valid) {
                        resolve();
                    } else {
                        form.allowSubmit = false;//提交按钮disabled状态
                    }
                });
            }else{
                resolve();
            }
        });
        Promise.all([p1,p2])
            .then(() => {
                //清空error的属性值
                for (const [key, value] of Object.entries(error) as [string, string|Map<string,string>][]){
                    if(value instanceof Map){
                        value.clear();
                    }else{
                        Object.assign(error, {[key] : ''});
                    }
                }
                /**
                Object.entries(error).forEach(entry => {
                    const [key, value] = entry as [string, string | Map<string, string>];
                    if(value instanceof Map){
                        value.clear();
                    }else{
                        Object.assign(error, {[key] : ''});
                    }
                }); */


                let formData = new FormData();
                if(form.type == 10){//10:本地账号密码用户
                    formData.append('type', String(form.type));
                    //账号
                    if(form.account != ''){
                        formData.append('account', form.account);
                    }
                    //密码提示问题
                    if(form.issue != null && form.issue.trim() != ''){
                        formData.append('issue', form.issue);
                    }
                    
                    //密码提示答案
                    if(form.answer != null && form.answer.trim() != ''){
                        formData.append('answer', SHA256(form.answer.trim()).toString());
                    }

                    //邮箱
                    if(form.email != null && form.email.trim() != ''){
                        formData.append('email', form.email);
                    }

                }else if(form.type == 20){//20: 手机用户
                    formData.append('type', String(form.type));
                    //手机号
                    if(form.mobile != ''){
                        formData.append('mobile', form.mobile);
                    }


                    formData.append('smsCode', form.smsCode);

                }


                //密码需SHA256加密
                 if(form.password != null && form.password.trim() != ''){
                    let SHA256Value = SHA256(form.password.trim()).toString();
                    formData.append('password', SHA256Value);
                }


                if (form.userCustomList != null && form.userCustomList.length > 0) {
                    for (let i = 0; i < form.userCustomList.length; i++) {
                        let userCustom = form.userCustomList[i];
                        
                        var fieldValue = form.userBoundField[i];

                        if (userCustom.chooseType == 1) { //文本框
                            formData.append('userCustom_'+ userCustom.id, fieldValue);
                        } else if (userCustom.chooseType == 2) { //单选框
                            formData.append('userCustom_'+ userCustom.id, fieldValue);
                        } else if (userCustom.chooseType == 3) { //多选框
                            for (var value in fieldValue) {
                                formData.append('userCustom_'+ userCustom.id, fieldValue[value]);
                            }
                        } else if (userCustom.chooseType == 4) { //下拉列表
                            if (userCustom.multiple == true) { //允许多选
                                for (var value in fieldValue) {
                                    formData.append('userCustom_'+ userCustom.id, fieldValue[value]);
                                }
                            }else{
                                formData.append('userCustom_'+ userCustom.id, fieldValue);
                                
                            }
                        } else if (userCustom.chooseType == 5) { //文本域
                            formData.append('userCustom_'+ userCustom.id, fieldValue);
                        }
                        
                        
                    }
                }


                //url跳转参数
                let jumpUrl:string = router.currentRoute.value.query.jumpUrl != undefined ? router.currentRoute.value.query.jumpUrl as string : '';
                if (jumpUrl != null && jumpUrl != '') {
                    formData.append('jumpUrl', jumpUrl);
                }

                //验证码Key
                formData.append('captchaKey', form.captchaKey);
                //验证码值
                if(form.captchaValue != ''){
                    formData.append('captchaValue', form.captchaValue.trim());
                }

                proxy?.$axios({
                    url: '/register',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                        if(JSON.parse(result.success)){
                            let jumpUrl = result.jumpUrl;
                            let systemUser = result.systemUser;
                            let accessToken = result.accessToken;
                            let refreshToken = result.refreshToken;

                            //访问令牌和刷新令牌存储到localStorage
                            window.localStorage.setItem("bbsToken", JSON.stringify({accessToken : accessToken, refreshToken : refreshToken}));

                            store.commit('setSystemUser', systemUser);

                            
                            if (jumpUrl != null && jumpUrl != '' && jumpUrl != 'index') {

                                let decryptObject = jumpDataFormat(jumpUrl);
                                if(decryptObject.path == "/register"){
                                    router.push("/index");
                                }else{
                                    router.push({
                                        path : decryptObject.path,
                                        query: decryptObject.query
                                    });
                                }
                                

                            } else {
                                router.push("/index");
                            }
                            
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
        if(to.name == 'register'){
            queryRegister();
        }
        
        next();
    });
    onMounted(() => {
        init();
        
    }) 

    //初始化
    const init = () => {
		queryRegister();
        
	}
	//卸载组件实例后调用
    onUnmounted (()=>{
        if(form.timer != null){
            clearInterval(form.timer); //销毁
            form.timer = null
        }
    })
</script>
<style scoped lang="scss">
.registerModule{
    background: #fff;
    padding:40px 40px 40px 40px;
    width:580px;
    margin:0px auto;

    .container {
        width: 560px;
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