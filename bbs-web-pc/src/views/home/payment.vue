<!-- 付款 -->
<template>
    <!-- 页头 -->
    <Header/>
     <!-- 服务导航 -->
    <ServiceNav/>
    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <div class="paymentModule" >
                <div class="banks">
                    <div class="head">
                        <ul>
                            <li class="item1">&nbsp;</li>
                            <li class="item2 on">全部支付方式</li>
                            <li class="item3">&nbsp;</li>
                        </ul>
                    </div>
        
                    <div class="bankSelect">
                        <el-form :model="form" ref="formRef" :rules="rules" class="form-container" size="large" label-position="top">
                            <el-form-item label="充值" :error="error.rechargeAmount" prop="rechargeAmount">
                                <el-input v-model="form.rechargeAmount" placeholder="请填写要充值的金额" maxlength="12" style="width: 200px"/>
                            </el-form-item>
                        </el-form>
                    </div>
                  
                    <div class="bankSelect">
                        <el-radio-group v-model="form.paymentBank">
                            <div class="box" v-for="(onlinePaymentInterface,index) in state.onlinePaymentInterfaceList">
                                <div class="title">{{onlinePaymentInterface.name}}</div>
                                
                                    <label v-for="bank in onlinePaymentInterface.bankList">
                                        <dl>
                                            <dt>
                                                <el-radio :label="onlinePaymentInterface.interfaceProduct+'_'+bank.code" :key="bank.code" class="radio"><span></span></el-radio>
                                            </dt>
                                            <dd>
                                                <img :src="bank.icon" width="120" height="32" :alt="bank.name" :title="bank.name"/>
                                            </dd>
                                        </dl>
                                    </label>
                                
                                <el-skeleton :loading="state.loading"></el-skeleton>
                            </div>
                        </el-radio-group>
                    </div>
                    <div class="payNow">
                        <el-button type="primary" @mousedown.native="onSubmit" :disabled="form.allowSubmit" size="large" style="width:130px">提交</el-button>
                    </div>
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
    import { OnlinePaymentInterface } from "@/types/index";
    import ALIPAY from '@/assets/images/bank/ALIPAY.gif'
    import {FormInstance } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    
    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '付款 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '付款 - ' + store.state.title
                },{
                    name: "description",
                    content: '付款 - ' + store.state.title
                }
            ]
        }))
    )


    const state = reactive({
        onlinePaymentInterfaceList: {} as Array<OnlinePaymentInterface>,
        icon:{
            'ALIPAY.gif' : ALIPAY
        },
        loading:true,//是否显示骨架屏
    });

    const form = reactive({
        rechargeAmount:'',//充值金额
        paymentBank:'',
        allowSubmit:false,//提交按钮disabled状态
    });

    //错误
    const error = reactive({
        rechargeAmount: '',//充值金额
    })


    //查询付款
    const queryPayment = (paymentModule: number) => {
        proxy?.$axios({
            url: '/user/control/payment',
            method: 'get',
            params:  { 
                paymentModule: paymentModule
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                state.onlinePaymentInterfaceList = result.onlinePaymentInterfaceList;

                for(let i = 0; i<state.onlinePaymentInterfaceList.length; i++){
                    let onlinePaymentInterface = state.onlinePaymentInterfaceList[i];
                    if(onlinePaymentInterface.bankList != null && onlinePaymentInterface.bankList.length >0){
                        for(let j = 0; j<onlinePaymentInterface.bankList.length; j++){
                            let bank = onlinePaymentInterface.bankList[j];
                            if(bank.selected){
                                form.paymentBank = onlinePaymentInterface.interfaceProduct+'_'+bank.code;
                            }

                            bank.icon = state.icon[bank.icon as keyof typeof state.icon];



                        }

                        if(form.paymentBank.length != (i+1)){//如果未选中，则默认选第一项
                            form.paymentBank = onlinePaymentInterface.interfaceProduct+'_'+onlinePaymentInterface.bankList[0].code;
                        }

                    }
                }
            }
            state.loading = false;//关闭骨架屏
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    

    //校验充值金额
    const checkRechargeAmount = (rule: any, value: any, callback: any) => {
        if (value === '') {
            return callback(new Error('充值金额不能为空'));
        }else{
            if (value.trim().length > 12) {
                callback(new Error('不能超过12位数字'))
            } else {   
                proxy?.$axios({
                    url: '/user/control/paymentVerification',
                    method: 'get',
                    params:  {
                        rechargeAmount:form.rechargeAmount
                    }
                })
                .then((response: AxiosResponse) => {
                    if(response){
                        const result: any = response.data;
                        let data = JSON.parse(result);
                        if(!JSON.parse(data.success)){
                            let rechargeAmountInfo = data.error.rechargeAmount;
                            let messageInfo = data.error.message;
                            if(rechargeAmountInfo != undefined){
                                callback(new Error(rechargeAmountInfo))
                            }
                             if(messageInfo != undefined){
                                callback(new Error(messageInfo))
                            }
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
    //校验规则
    const rules = reactive({
        rechargeAmount: [{ validator: checkRechargeAmount, trigger: 'blur' }],
    })


    const formRef = ref<FormInstance>();

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
                if(form.rechargeAmount != null && form.rechargeAmount.trim() != ''){
                    formData.append('rechargeAmount', form.rechargeAmount);
                }

                formData.append('paymentBank', form.paymentBank);
               
                
                let paymentModule:string = router.currentRoute.value.query.paymentModule != undefined ? router.currentRoute.value.query.paymentModule as string :'';
                formData.append('paymentModule', paymentModule);

                proxy?.$axios({
                    url: '/user/control/payment',
                    method: 'post',
                    data: formData,
                    showLoading: false,//是否显示加载图标
                    loadingMask:false,// 是否显示遮罩层
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                        if(JSON.parse(result.success)){
                            
                            //清空表单
                            formRef.value?.resetFields();
                            let callbackData = result.callbackData;

                            if (callbackData != null && callbackData != "") {
								//根据第三方支付返回的回调数据跳转到第三方支付
								var div = document.createElement('div');
								div.innerHTML = callbackData;
								document.body.appendChild(div);
								(document as any).forms['punchout_form'].submit();
							}

                        }else{
                            //处理错误信息
                            processErrorInfo(result.error as Map<string,string> , error,()=>{});
                            
                        }
                        form.allowSubmit = false;//提交按钮disabled状态
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
        if(to.name == 'payment'){
            let paymentModule:number = 1;
            if(to.query.page != undefined){
                paymentModule = parseInt(to.query.paymentModule as string);
            }
            queryPayment(paymentModule);
        }
        
        next();
    });
    
    onMounted(() => {
        let paymentModule:number = router.currentRoute.value.query.paymentModule != undefined ? parseInt(router.currentRoute.value.query.paymentModule as string) :1;
        queryPayment(paymentModule);

    }) 
    

</script>

<style scoped lang="scss">
    .paymentModule{
        background: #fff;
        padding-right:8px;
        padding-left:8px;
        padding-top:8px;
        padding-bottom: 30px;
        .banks{
            widows: 100%;
            margin: 0 auto;
            font-size: 14px;
            .head {
                widows: 100%;
                margin: 0 auto;
                font-size: 14px;
                ul {
                    list-style: none;
                    margin: 0;
                    overflow: hidden
                }
                li {
                    float: left;
                    height: 37px;
                    line-height: 37px;
                    text-align: center;
                    font-size: 15px;
                    font-weight: 700;
                    color: $color-black-70;
                    display: block;
                }
                .item1 {
                    width: 10%;
                    border-bottom: solid 1px $color-black-20;
                    height: 38px
                }
                .item2{
                    width: 15%;
                    border-left: solid 1px $color-black-20;
                    border-right: solid 1px $color-black-20;
                    border-top: solid 1px $color-black-20;
                    border-bottom: solid 1px $color-black-20;
                    cursor: pointer;
                    border-radius:3px 3px 0px 0px;
                }.item3{
                    width: 74%;
                    border-bottom: solid 1px $color-black-20;
                    height: 38px
                }
                .on {
                    background: #fff;
                    border-bottom: solid 1px #fff
                }
            }
        }

        .form-container{
            margin-top: 25px;
            :deep(.el-form-item__content) {
                line-height: normal;
            }
            :deep(.el-form-item__error) {
                width: 100%;
            }
            :deep(.el-form-item__label){
                font-weight:bold;
            }
        }
        .bankSelect {
            width: 866px;
            padding-top: 10px;
            overflow: hidden;
            margin: 0 auto;
            .box{
                width: 960px; 
                float: left;
                .title {
                    width: 100%;
                    height: 34px;
                    line-height: 34px;
                    font-size: 14px;
                    font-weight: 700;
                    color: $color-black-80;
                    float: left;
                }
                dl {
                    width: 162px;
                    height: 42px;
                    border: 1px solid $color-black-20;
                    margin-right: 30px;
                    margin-bottom: 10px;
                    float: left;
                    display: block
                }
                dt {
                    width: 22px;
                    height: 32px;
                    float: left;
                    .radio{
                        position: relative;
                        top: 5px;
                        margin-left: 9px;
                    }
                }
                dd {
                    width: 120px;
                    height: 32px;
                    float: left;
                    margin-left: 10px;
                    margin-top: 5px;
                    img {
                        width: 120px;
                        height: 32px
                    }
                }
            }
        }
        .payNow {
            width: 866px;
            padding-top: 30px;
            position: relative;
            margin: 0 auto;
            padding-bottom: 10px
        }
    }

</style>
