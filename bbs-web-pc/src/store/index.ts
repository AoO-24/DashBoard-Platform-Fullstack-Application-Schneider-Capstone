import {App, InjectionKey } from 'vue';
import { createStore, useStore, Store  } from 'vuex';
import { TypeRootState,SystemUser } from "@/store/interface";

// 创建一个新的 store 实例
const store = createStore<TypeRootState>({
    state() {
        return {
            apiUrl: import.meta.env.VITE_API_URL,//后端地址
            baseURL :'',//系统路径
            commonPath:'',//后端资源路径
            contextPath:'',//后端系统虚拟目录
            templateDir:'',//后端模板目录名称
            title: '',//站点名称
            keywords:'',//站点关键词
            description:'',//站点描述
            systemUser:  {} as SystemUser,//登录用户
            baseURI:'',//系统资源标识符
            fileStorageSystem: 0,//文件存储系统 0.本地系统 10.SeaweedFS 20.MinIO 30.阿里云OSS
            supportAccessDevice: 1,//支持访问设备 1.自动识别终端 2.电脑端 3.移动端
            weixin_oa_appid:'',//微信公众号appid

            transparentImage:'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',//透明1像素图片
            
            userInfoVersion: 0 //用户信息信息版本  App.vue监听本参数，当数值变化时执行刷新登录用户信息
        };
    },
    //修改状态数据的同步方法
    mutations: {
        //设置后端地址
        setApiUrl(state: TypeRootState,value:string) {
            state.apiUrl = value;
        },
        setBaseURL(state: TypeRootState, value:string) {
            state.baseURL = value;
        },
        setCommonPath(state: TypeRootState, value:string) {
            state.commonPath = value;
        },
        setContextPath(state: TypeRootState, value:string) {
            state.contextPath = value;
        },
        setTemplateDir(state: TypeRootState, value:string) {
            state.templateDir = value;
        },
        setTitle(state: TypeRootState, value:string) {
            state.title = value;
        },
        setKeywords(state: TypeRootState, value:string) {
            state.keywords = value;
        },
        setDescription(state: TypeRootState, value:string) {
            state.description = value;
        },
        setSystemUser(state: TypeRootState, value:SystemUser) {
            state.systemUser = value;
        },
        setBaseURI(state: TypeRootState, value:string) {
            state.baseURI = value;
        },
        setFileStorageSystem(state: TypeRootState, value:number ) {
            state.fileStorageSystem = value;
        },
        setSupportAccessDevice(state: TypeRootState, value:number ) {
            state.supportAccessDevice = value;
        },
        setWeixin_oa_appid(state: TypeRootState, value:string) {
            state.weixin_oa_appid = value;
        },
        setUserInfoVersion(state: TypeRootState, value:number) {
            state.userInfoVersion = value;
        },
    },
    //修改状态数据的异步方法
    actions: {},
});
  
export default store;
  
// 定义 injection key
const key: InjectionKey<Store<TypeRootState>> = Symbol();
// 定义自己的 `useStore` 组合式函数
export function appStore() {
    return useStore(key);
}
  
export const setupStore = (app: App) => {
    app.use(store, key);
};

