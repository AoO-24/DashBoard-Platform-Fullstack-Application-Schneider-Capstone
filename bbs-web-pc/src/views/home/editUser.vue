<!-- 修改个人资料 -->
<template>
    <!-- 页头 -->
    <Header @updateAvatar="receive_updateAvatar"/>
    <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="editUserModule" >
                <div class="updateAvatar" >
		            <div class="change" @click="updateAvatarVisible = true"><span>更换头像</span></div>
		             
                    <img v-if="form.user.avatarName != null" :src="form.user.avatarPath+''+form.user.avatarName">
                               
                    <img v-if="form.user.avatarName == null" :src="form.avatar" width="100" height="100">

		        </div>
                <!--更换头像弹出窗口-->
                <el-dialog v-model="updateAvatarVisible" width="612px" draggable :close-on-click-modal="false">
                    <UpdateAvatar @updateAvatar="receive_updateAvatar"/>
                </el-dialog>

                <div class="container">
                    <el-form :rules="rules" label-position="right" ref="formRef" :model="form" class="textForm-container" size="large">
                        <el-form-item>
                            <div class="view-field">
                                <div class="input-name">账号</div>
                                <div class="textInput-content">{{form.user.account}}</div>
                            </div>
                        </el-form-item>
                        <el-form-item :error="error.nickname" prop="nickname" v-if="form.user.nickname == null || form.user.nickname == ''">
                            <div class="view-field">
                                <div class="input-name">呢称</div>
                                <div class="formInput-content">
                                    <el-input v-model="form.nickname" maxlength="15" clearable></el-input>
                                </div>
                                <div class="help">
                                    <span class="help-icon">
                                        <el-icon :size="18"><InfoFilled /></el-icon>
                                    </span>
                                    <span class="help-text">不设置请留空</span>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item :error="error.nickname" prop="nickname" v-if="form.user.nickname != null && form.user.nickname != ''">
                            <div class="view-field">
                                <div class="input-name">呢称</div>
                                <div class="textInput-content">{{form.user.nickname}}</div>
                            </div>
                        </el-form-item>
                        <el-form-item v-if="form.userRoleList != null && form.userRoleList.length >0">
                            <div class="view-field">
                                <div class="input-name">角色</div>
                                <div class="textInput-content">
                                    <table cellSpacing="0" cellPadding="0" width="100%" border="0">
                                        <tr v-for="userRole in form.userRoleList">
                                            <td style="text-align:left;width: 200px;line-height: 28px;">
                                                {{userRole.name}}
                                            </td>
                                            <td style="text-align:left;">
                                                {{userRole.validPeriodEnd}} 到期
                                            </td>
                                        </tr>
                                    </table>

                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item :error="error.oldPassword" prop="oldPassword">
                            <div class="view-field">
                                <div class="input-name">旧密码</div>
                                <div class="formInput-content">
                                    <el-input v-model="form.oldPassword" placeholder="请输入旧密码" maxlength="20" type="password" clearable></el-input>
                                </div>
                                <div class="help">
                                    <span class="help-icon">
                                        <el-icon :size="18"><InfoFilled /></el-icon>
                                    </span>
                                    <span class="help-text">不修改请留空</span>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item :error="error.password" prop="password">
                            <div class="view-field">
                                <div class="input-name">新密码</div>
                                <div class="formInput-content">
                                    <el-input v-model="form.password" placeholder="请输入新密码" maxlength="20" type="password" clearable></el-input>
                                </div>
                                <div class="help">
                                    <span class="help-icon">
                                        <el-icon :size="18"><InfoFilled /></el-icon>
                                    </span>
                                    <span class="help-text">不修改请留空</span>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item :error="error.confirmPassword" prop="confirmPassword">
                            <div class="view-field">
                                <div class="input-name">确认新密码</div>
                                <div class="formInput-content">
                                    <el-input v-model="form.confirmPassword" placeholder="请输入新密码" maxlength="20" type="password" clearable></el-input>
                                </div>
                            </div>
                        </el-form-item>
                         <el-form-item :error="error.allowUserDynamic" >
                                <div class="view-field">
                                    <div class="input-name">允许显示用户动态</div>
                                    <div class="formInput-content">
                                        <el-switch v-model="form.allowUserDynamic" :width="60" size="large" inline-prompt active-text="显示" inactive-text="关闭"/>
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
                    </el-form>
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
    import { User, UserCustom,UserRole } from "@/types/index";
    import { ElMessage, FormInstance } from 'element-plus';
    import { SHA256} from 'crypto-js';
    import { generateRandom, processErrorInfo } from '@/utils/tool';
    import { letterAvatar } from '@/utils/letterAvatar';

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();
    const formRef = ref<FormInstance>();
    //更换头像窗口
    const updateAvatarVisible = ref(false)

    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '修改个人资料 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '修改个人资料 - ' + store.state.title
                },{
                    name: "description",
                    content: '修改个人资料 - ' + store.state.title
                }
            ]
        }))
    )

    const form = reactive({
        user: {} as User,
        userCustomList: [] as Array<UserCustom>,
        userRoleList: [] as Array<UserRole>,
        userBoundField : [] as any, //用户自定义注册功能项绑定
        avatar:'',//字符头像

        nickname:'',//呢称
        oldPassword:'',//旧密码
        password:'',//密码
        confirmPassword:'',//确认密码
        allowUserDynamic:false,//允许显示用户动态
        allowSubmit:false,//提交按钮disabled状态
       
    });

    //错误
    const error = reactive({
        nickname:'',//呢称
        oldPassword:'',//旧密码
        password:'',//密码
        confirmPassword:'',//确认密码
        allowUserDynamic:'',//允许显示用户动态
        userCustom:new Map(),
    })

    //接收子组件消息
    const receive_updateAvatar = (updateAvatar:boolean) => {
        if(updateAvatar){//如果头像上传成功
            updateAvatarVisible.value = false;
            
            //改变‘用户信息版本’,让App.vue监听到变化后执行刷新登录用户信息
            store.commit('setUserInfoVersion', generateRandom());
            init();
        }
    }
   

    //查询个人资料
    const queryEditUser = () => {
        proxy?.$axios({
            url: '/user/control/editUser',
            method: 'get',
            params:  { 
               
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                form.user = result.user;
                form.userCustomList = result.userCustomList;
                form.userRoleList = result.userRoleList;

                if(form.user.allowUserDynamic){
                    form.allowUserDynamic = true;//允许显示用户动态
                }
                //绑定字段
                if(form.userCustomList != null && form.userCustomList.length >0){
                    for (let i = 0; i < form.userCustomList.length; i++) {
                        let userCustom = form.userCustomList[i];
                        boundField(userCustom);
                    }
                }
                if(form.user.avatarName == null){
                    if(form.user.nickname != null && form.user.nickname !=''){
                        form.avatar = letterAvatar(form.user.nickname, 100);
                    }else{
                        form.avatar = letterAvatar(form.user.account, 100);
                    }
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

    //校验旧密码
    const checkOldPassword = (rule: any, value: any, callback: any) => {
        if(form.oldPassword != null && form.oldPassword !=''){
            if (value === '') {
                return callback(new Error('密码不能为空'));
            }else{
                if (value.trim().length < 7) {
                    callback(new Error('密码长度不能小于7个字符'))
                } else {   
                    callback();
                }
            }
        }else{
            if(form.password != null && form.password !=''){
                if (value === '') {
                    return callback(new Error('密码不能为空'));
                }else{
                    if (value.trim().length < 7) {
                        callback(new Error('密码长度不能小于7个字符'))
                    } else {   
                        callback();
                    }
                }
            }else{
                callback();
            }
        }
    }
    //校验密码
    const checkPassword = (rule: any, value: any, callback: any) => {
        if(form.password != null && form.password !=''){
            if(form.oldPassword == null || form.oldPassword ==''){
                error.oldPassword = "旧密码不能为空";
            }
            if (value === '') {
                return callback(new Error('密码不能为空'));
            }else{
                if (value.trim().length < 7) {
                    callback(new Error('密码长度不能小于7个字符'))
                } else {   
                    callback();
                }
            }
        }else{
            callback();
        }
    }
    //校验确认密码
    const checkConfirmPassword = (rule: any, value: any, callback: any) => {
        if(form.password != null && form.password !=''){
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
        }else{
            callback();
        }
    }

     //校验规则
    const rules = reactive({
        oldPassword: [{ validator: checkOldPassword, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }],
        confirmPassword:[{ validator: checkConfirmPassword, trigger: 'blur' }],

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
                //呢称
                if(form.nickname != null && form.nickname != ''){
                    formData.append('nickname', form.nickname);
                }
                
                formData.append('allowUserDynamic', form.allowUserDynamic.toString());


                //密码需SHA256加密
                if(form.password != null && form.password.trim() != ''){
                    let SHA256Value = SHA256(form.password.trim()).toString();
                    formData.append('password', SHA256Value);

                    if(form.oldPassword != null && form.oldPassword.trim() != ''){
                        let oldPassword_SHA256Value = SHA256(form.oldPassword.trim()).toString();
                        formData.append('oldPassword', oldPassword_SHA256Value);
                    }
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


                proxy?.$axios({
                    url: '/user/control/editUser',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                        if(JSON.parse(result.success)){
                            let systemUser = result.systemUser;
                            let accessToken = result.accessToken;
                            let refreshToken = result.refreshToken;
                            ElMessage({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose: ()=>{}
                            })
                           
                            if(systemUser != null){
                                 //访问令牌和刷新令牌存储到localStorage
                                window.localStorage.setItem("bbsToken", JSON.stringify({accessToken : accessToken, refreshToken : refreshToken}));
                                store.commit('setSystemUser', systemUser);
                            }
                            init();
                            
                        }else{
                            //处理错误信息
                            processErrorInfo(result.error as Map<string,string> , error,()=>{});
                            

                            form.allowSubmit = false;//提交按钮disabled状态

                        }
                    }
                })
                .catch((error: any) =>{
                    console.log(error);
                });
            }).catch(() => {
                console.log("提交数据错误");
            });

    }
    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'editUser'){
            queryEditUser();
        }
        
        next();
    });
    onMounted(() => {
        init();

    }) 

    //初始化
    const init = () => {
		queryEditUser();
	}
    

</script>

<style scoped lang="scss">
    .editUserModule{
        background: #fff;
        padding:40px 40px 40px 40px;
        width:580px;
        margin:0px auto;
        position: relative;
        .container {
            width: 560px;
            overflow: hidden;
            margin: 0 auto  0 -100px;
            /** 标签分隔线 */
            :deep(.el-tabs__nav-wrap::after){
                background-color: #fff;
            }
            :deep(.el-tabs__item){
                font-size: 16px;
            }
        }
        .updateAvatar {
            position: absolute;
            
            margin-left: 600px;
            margin-top: 20px;
            width: 100px;
            height: 100px;
            border-radius: 100%;
            background-color: $color-black-10;
            overflow: hidden;
            text-align: center;
            line-height: 100px;
            img {
                max-width: 100%;
                //vertical-align: middle;
                width: 100px;
                height: auto;
            }
            .change {
                position: absolute;
                width: 100px;
                height: 100px;
                border-radius: 100%;
                background-color: rgba(0,0,0,0.6);
                display: none;
                span {
                    color: #fff;
                }
            }
            &:hover .change{
                display:block;
                cursor: pointer; 
            }
        }
    }

</style>
