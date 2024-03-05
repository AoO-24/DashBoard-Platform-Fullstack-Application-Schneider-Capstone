import { AxiosResponse } from "axios";
import axiosInstance from "./http";

/**
 * 访问量统计
 */
 export function statistic(url:string,referrer:string): void{

    let linkUrl= window.location.href;
    let linkGroup = linkUrl.split('/'); //以'/'进行分割
    let domain ='';
    if (linkGroup[2]) {
        domain = linkGroup[0] + '//' + linkGroup[2];  // https://test.com
    }

    let params = {} as any
    params.url = domain + url
    if(referrer != '' && referrer != '/'){
        params.referrer= domain + referrer
       
	}else{
        params.referrer = document.referrer
    }
    axiosInstance({
        url: '/statistic/add',
        method: 'get',
        params:  params,
        showLoading: false,//是否显示加载图标
        loadingMask:false,// 是否显示遮罩层
    })
    .then((response: AxiosResponse) => {
        const result: any = response.data;
    }).catch((error: any) =>{
        console.log(error);
    });
}