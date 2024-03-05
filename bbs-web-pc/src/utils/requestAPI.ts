import { AxiosResponse } from "axios";
import axiosInstance from "./http";
import store from "@/store";

/**
 * 查询基本信息
 */
 export function queryBaseInfo (){
    axiosInstance({
        url: '/baseInfo',
        method: 'get',
        params:  {
        },
        showLoading: false,//是否显示加载图标
        loadingMask:false,// 是否显示遮罩层
    })
    .then((response: AxiosResponse) => {
        const result: any = response.data;
        if(result != ""){
            let resultData = JSON.parse(result);
            store.commit('setBaseURL', resultData.baseURL);
            store.commit('setCommonPath', resultData.commonPath);
            store.commit('setContextPath', resultData.contextPath);
            store.commit('setTemplateDir', resultData.templateDir);
            store.commit('setTitle', resultData.title);
            store.commit('setKeywords', resultData.keywords);
            store.commit('setDescription', resultData.description);
            if(resultData.systemUser != null){
                store.commit('setSystemUser', resultData.systemUser);
            }
            store.commit('setBaseURI', resultData.baseURI);
            store.commit('setFileStorageSystem', resultData.fileStorageSystem);
            store.commit('setSupportAccessDevice', resultData.supportAccessDevice);
            store.commit('setWeixin_oa_appid', resultData.weixin_oa_appid);
        }

    }).catch((error: any) =>{
        console.log(error);
    });

}