import { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
    }
}

//配置自定义属性
declare module 'axios' {
    export interface AxiosRequestConfig {
        loadingTarget?: string,
        showLoading?: boolean,//是否显示加载图标
        loadingMask?: boolean,//是否显示遮罩层
        isCorsDefaultHeaders?:boolean,// 是否仅提交CORS默认允许的响应头 例如Cache-Control Content-Language Content-Type Expires Last-Modified Pragma
        timestamp?: boolean,//get请求是否增加时间戳
    }
}