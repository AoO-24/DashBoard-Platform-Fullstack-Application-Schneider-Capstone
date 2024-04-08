import createRouter from '@/router'
import cloneDeep from "lodash/cloneDeep";
import { enc} from 'crypto-js';

/**
 * 创建跳转属性
 * @returns base64url编码格式
 */
export let createJumpAttribute = () =>{
    let query = cloneDeep(createRouter.currentRoute.value.query as any);
 
    for(let q in query){
        let queryVaue = query[q];
        if(queryVaue instanceof Array){
            for(let child in queryVaue){
                let childQueryVaue = queryVaue[child];
                queryVaue[child] = encodeURIComponent(childQueryVaue as string);
                
            }
        }else{
            query[q] = encodeURIComponent(queryVaue as string); 
        }
    }

    let parameterObj = {
        path : createRouter.currentRoute.value.path,
        query: query
    };
   
    let rawStr = JSON.stringify(parameterObj);
    let wordArray = enc.Utf8.parse(rawStr);
    let base64 = enc.Base64url.stringify(wordArray);

    return base64;
};

/**
 * 处理跳转属性
 * @param jumpUrl 跳转路径（base64url编码格式）
 * @returns
 */
export let processJumpAttribute = (jumpUrl:string) =>{
    let parsedWordArray = enc.Base64url.parse(jumpUrl);
    let parsedStr = parsedWordArray.toString(enc.Utf8);
    return jumpDataFormat(parsedStr);
};  

/**
 * 跳转数据格式化
 * @param jumpData 跳转数据
 * @returns 
 */
export let jumpDataFormat = (jumpData:string) =>{
    let decryptObject = JSON.parse(jumpData);
                        
    let query = decryptObject.query;
    
    for(let q in query){
        let queryVaue = query[q];
        if(queryVaue instanceof Array){
            for(let child in queryVaue){
                let childQueryVaue = queryVaue[child];
                queryVaue[child] = decodeURIComponent(childQueryVaue as string);
            }
        }else{
            query[q] = decodeURIComponent(queryVaue as string);
        }
    }
    return decryptObject;
};