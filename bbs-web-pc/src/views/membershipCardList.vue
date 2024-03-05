<!-- 会员卡列表 -->
<template>
    <!-- 页头 -->
    <Header/>
    
    <div class="main-container wrap backgroundModule">
        <div class="module-head">
	        <div class="info">
	            <h3>会员套餐任你选</h3>
	        </div>
	    </div>
    </div>	
    <div class="main">
        <div class="main-container wrap">
            <div class="membershipCardListModule" v-if="state.membershipCardList != null && state.membershipCardList.length >0">
                <ul class="clearfix">
                    <li v-for="membershipCard in state.membershipCardList">
                        <h5>{{membershipCard.name}}</h5>
                        <div class="descriptionTag-box" >
                            <p class="descriptionTag" v-for="descriptionTag in membershipCard.descriptionTagList">{{descriptionTag}}</p>
                        </div>
                        
                        <div class="buyInfo">
                            <div class="price" v-if="membershipCard.lowestPrice != null && parseFloat(membershipCard.lowestPrice) >0">
                                <p><b>￥</b><span>{{membershipCard.lowestPrice}}</span> 元起</p>
                            </div>
                            <div class="price" v-if="membershipCard.lowestPoint != null && Long.fromString(membershipCard.lowestPoint).gt(0)">
                                <p><span>{{membershipCard.lowestPoint}}</span> 积分起</p>
                            </div>
                            <i class="subtitle">{{membershipCard.subtitle}}</i>
                            <router-link tag="a" class="buyButton" :to="{path:'/membershipCard',query: {membershipCardId: membershipCard.id}}" >
                                查看详情
                            </router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>


    <!-- 回到顶部 -->
    <el-backtop :bottom="100" :visibility-height="100">
        <div>
            <Icon name="back-to-top" size="16px" />
        </div>
    </el-backtop>

    <!-- 页脚 -->
    <Footer/>
</template>

<script lang="ts" setup>
    import { onMounted, getCurrentInstance, ComponentInternalInstance, reactive, computed,} from 'vue'
    import { appStore } from "@/store";
    import { useMeta} from 'vue-meta'
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import { MembershipCard} from "@/types/index";
    import { AxiosResponse } from 'axios';

    import Long from "long";

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();


    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '会员卡列表 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '会员卡列表 - ' + store.state.title
                },{
                    name: "description",
                    content: '会员卡列表 - ' + store.state.title
                }
            ]
        }))
    )

    
    const state = reactive({
        membershipCardList:[] as Array<MembershipCard>,//会员卡列表
        loading:true,//是否显示骨架屏
    });

    //查询会员卡列表
    const queryMembershipCardList = () => {
        proxy?.$axios({
            url: '/queryMembershipCardList',
            method: 'get',
            params:  {},
            //showLoading: false,//是否显示加载图标
            //loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: Array<MembershipCard>) => {
            state.loading = false;//关闭骨架屏
            if(data != null && data.length > 0){
                state.membershipCardList = data;
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'membershipCardList'){
            queryMembershipCardList()
        }
        
        next();
    });

    onMounted(() => {
        queryMembershipCardList()
    }) 

</script>
<style scoped lang="scss">
.module-head{
	background: #fff;
	padding: 2px 20px 2px 20px;
	box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
	position: relative;
	height: 48px;
    .info {
        padding: 10px 0;
        display: block;
        text-align: center;
        &:after {
            content: ".";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden
        }
        h3 {
            color: $color-black-90;
            font-size: 20px;
            line-height: 28px;
            font-weight:normal;
        }
        .extra {
            float: right;
            text-align: right;
            margin-top: 10px;
        }
    }
}

/* 会员卡列表 */
.membershipCardListModule{
	display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: -moz-box;
    display: -moz-flex;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -moz-box-pack: center;
    -moz-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    ul{
        margin-left: -10px;
    }
    li{
        -moz-box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
        -webkit-box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
        box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
        float: left; width: 255px; background-color: #fff; padding: 25px 20px; font-size: 12px; margin-left: 10px;margin-top:10px; position: relative;
    }
    h5{ 
        text-align: center; 
        color: $color-black-90;
        font-size: 24px; 
        line-height: 24px; 
        font-weight: normal;
    }
    .descriptionTag-box {
        margin: 0 auto;
        padding-top: 25px; margin-top: 25px; 
        border-top: 1px solid $color-black-20;
        width: 100%;
        overflow: hidden;
        .descriptionTag {
            margin-bottom: 18px;
            line-height: 14px;
            font-size: 15px;
            color: $color-black-80;
            text-align: center;
        }
    }
    .buyInfo{
        padding-top: 15px; 
        .price{ 
            text-align: center;
            margin-top: 10px;
            p{ 
                line-height: 30px;
                font-size: 14px;
            }
            span{ 
                color: #f75d51; 
                font-size: 36px; 
                font-weight: bolder;
                position: relative;
                top: 2px;
            }
            b{ 
                font-size: 13px;
                color: #f75d51; 
                font-size: 24px; 
                font-weight: normal;
            }
        }
        .subtitle{ 
            display: block; 
            color: #ff6800; 
            line-height: 22px;
            font-size: 14px;
            text-align: center;
        }
        .buyButton{ 
            color: #fff;
            border-radius:3px; 
            font-size: 16px; 
            display: block; 
            width: 220px; 
            line-height: 44px; 
            text-align: center; 
            background-color: #20a0ff; 
            margin: 10px auto auto auto;
            &:hover{ 
                background-color: #58b7ff;
            }
        }
    }
}
</style>