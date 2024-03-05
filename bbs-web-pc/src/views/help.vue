<!--帮助中心-->
<template>
    <!-- 页头 -->
    <Header/>

    <div class="main">
        <div class="main-container wrap backgroundModule main-fullScreen">
            <!-- 本样式只支持两层分类显示-->
            <div class="helpTypeModule" >
                
                <!-- 图文横排 -->
                <template v-if="state.helpTypeList != null && state.helpTypeList.length >0">
                    <div class="nav-row" v-for="helpType in state.helpTypeList">
                        <p class="horizontal-row-title">
                            <i class="row-title-line"></i>
                            <span>{{helpType.name}}</span></p>
                        <div class="horizontal-container clearfix">
                            <div class="item" v-for="childHelpType in helpType.childHelpType">
                                <router-link tag="a" class="link" :to="{path:'/helpDetail',query: {helpTypeId: childHelpType.id}}" >
                                    <div class="block" >  
                                        <div class="img" v-if="childHelpType.image != null &&  childHelpType.image != ''" :style="'background-image: url('+$store.state.baseURL+childHelpType.image+');'"></div>
                                    
                                        <Icon v-else name="help-alt" size="80px" class="icon" />
                                        
                                        <div class="title">{{childHelpType.name}}</div>
                                        <div class="description">
                                            <div>{{childHelpType.description}}</div>
                                        </div>
                                    </div>
                                </router-link>
                            </div> 
                        </div>
                    </div>
                </template>
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
    import { onMounted, ref, getCurrentInstance, ComponentInternalInstance, reactive, computed,} from 'vue'
    import { appStore } from "@/store";
    import { useMeta} from 'vue-meta'
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import { HelpType } from "@/types/index";
    import { AxiosResponse } from 'axios';
    import Icon from "@/components/icon/Icon.vue";

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();

    //const formAddCommentRef = ref<FormInstance>();
    const formAddCommentContentRef = ref()

    
    //html页元信息
    const { meta } = useMeta(
        computed(() => ({ 
            title:  '帮助中心 - ' + store.state.title,
            meta: [
                {
                    name: 'keywords',
                    content: '帮助中心 - ' + store.state.title
                },{
                    name: "description",
                    content: '帮助中心 - ' + store.state.title
                }
            ]
        }))
    )
 
    const state = reactive({
        helpTypeList: [] as Array<HelpType>,//帮助分类
        loading:true,//是否显示骨架屏
    });

    //查询帮助分类
    const queryHelpTypeList = () => {
        proxy?.$axios({
            url: '/queryHelpTypeList',
            method: 'get',
            params:  {},
            //showLoading: false,//是否显示加载图标
            //loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: Array<HelpType>) => {
            state.loading = false;//关闭骨架屏
            if(data && data.length > 0){
                state.helpTypeList = data;
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'help'){
            queryHelpTypeList()
        }
        
        next();
    });

    onMounted(() => {
        queryHelpTypeList()
    }) 
</script>
<style scoped lang="scss">
/* 帮助分类 */
.helpTypeModule{
	background: #fff;
	padding:0px 40px 40px 40px; margin:0px auto;
	.nav-row {
        /* 图文横排 */
        .horizontal-row-title {
            font-size: 23px;
            color: $color-black-90;
            padding-left: 12px;
            padding-top: 50px;
            margin-bottom: 40px;
            text-align: center;
            position: relative;
        }
        .horizontal-container{
            overflow: hidden;
            position: relative;
            .item{
                padding: 15px;
                box-sizing: border-box;
                float: left;
                width: 25%;
                position: relative;
                &:hover {
                    background: $color-black-10;
                }
                .link {
                    margin: 5px 5px;
                    height: 100%;
                    .block{
                        text-align: center;
                        .img {
                            display: inline-block;
                            margin-top:5px;
                            width: 110px;
                            height: 110px;
                            border-radius: 4px;
                            background-size: cover;
                            background-repeat: no-repeat;
                        }
                        .icon{
                            display: inline-block;
                            margin-top:5px;
                            font-size: 80px;
                            width: 110px;
                            height: 110px;
                            line-height: 110px;
                            color:$color-black-30;
                            text-align: center;
                            vertical-align: middle;
                            background: $color-black-10;
                            border-radius: 4px;
                        }
                        .title {
                            font-size: 16px;
                            font-weight: bold;
                            margin-top:15px;
                            color:  $color-black-80;
                        }
                        .description {
                            margin-top:3px;
                            font-size: 14px;
                            line-height:22px;
                            color: $color-black-50;
                        }
                    }
                }
            }
        }
    }
}


</style>