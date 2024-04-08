import { UserGrade } from "@/types";
import store from "@/store";

import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import gemoji from '@bytemd/plugin-gemoji'
import gfm from '@bytemd/plugin-gfm'
import math from '@bytemd/plugin-math'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import { Editor, Viewer} from '@bytemd/vue-next'
import zhHans from 'bytemd/locales/zh_Hans.json'

import zhHansGfm from '@bytemd/plugin-gfm/locales/zh_Hans.json'
import zhHansMath from '@bytemd/plugin-math/locales/zh_Hans.json'
import 'juejin-markdown-themes/dist/juejin.min.css';
//import 'github-markdown-css/github-markdown.css';
import 'katex/dist/katex.css' //公式
import highlightCode from "./markdownPlugin/plugin-highlight-code";
import linkTarget from "./markdownPlugin/plugin-link-target";
import filterIframe from "./markdownPlugin/plugin-iframe";
import floatToolbar from "./markdownPlugin/plugin-float-toolbar";
import { toggleEditor } from "./markdownPlugin/plugin-toggle-editor";
import axiosInstance from "./http";
import { AxiosResponse } from "axios";
import { ElMessage, ElNotification } from "element-plus";
import { SHA256} from 'crypto-js';
import { h } from "vue";
import { getProcessor } from 'bytemd';
import type { BytemdPlugin } from 'bytemd'
import filterFont from "./markdownPlugin/plugin-font";

//ByteMD插件
export const markdownPlugins = [
    breaks(),
    frontmatter(),
    gemoji(),
    gfm({
        locale: zhHansGfm
    }),
    //highlight(),
    highlightCode(),//带行号
    
    math({
        locale: zhHansMath,
		katexOptions: { 
			output: 'html' //仅以 HTML 形式输出 KaTeX。默认会以HTML和MathML形式输出 KaTeX，会破坏布局，导致右边出现滚动条
		},
    }),
    mediumZoom(),

    linkTarget(),
	filterIframe(),
	filterFont(),
	floatToolbar(),
]

export const markdownEditorConfig = {
    //lineNumbers: true, //是否在编辑器左侧显示行号
}

/**
 * 白名单
 * @param schema 
 * https://github.com/syntax-tree/hast-util-sanitize/blob/main/lib/schema.js#L21
 * @returns 
 */
export const sanitize = (schema: any) => {
	
	schema.tagNames.push('video');//允许video标签
	schema.tagNames.push('hide');//允许hide标签
	schema.tagNames.push('font');//允许font标签
	//schema.tagNames.push('iframe');
	//schema.protocols.src.push('blob')
	//schema.protocols.src.push('data')


	//schema.attributes['*'].push('title');

	schema.attributes['iframe']= ['src','frameBorder','scrolling','border','framespacing','allow','allowFullScreen'];//允许iframe标签中的属性
	schema.attributes['hide']= ['hide-type','input-value','description'];//允许hide标签中的属性

	//schema.protocols.src.push('http')

	return schema;
}


/**
 * Markdown转Html
 * markdownToHtml(addTopicSanitize,addTopicEditorPlugin.value,'# markdown text');
 * @param sanitize 白名单
 * @param plugin 插件
 * @param markdownText markdown文本
 */
export const markdownToHtml = (sanitize: any,plugin: any,markdownText: string) => {
	let vFile = getProcessor({
		sanitize:sanitize,
		plugins: plugin //插件
	}).processSync(markdownText);
	return vFile.value;
}



/**
 * 文件上传
 * @param files 文件集合
 * @param insert 回调
 * @param uploadServer 上传服务器地址
 * @param uploadFieldName 上传字段名称
 * @param dir 文件类型 image、file、media
 * @param fileStorageSystem 文件存储系统
 */
export function editorUpload(files:File[], callback: (url: string, title: string,errorMessage: string) => void,uploadServer:string,uploadFieldName:string,dir:string,fileStorageSystem:number) {
	
    
    if(fileStorageSystem == 10){//10.SeaweedFS
		
		let fileServer = uploadServer;
		
		if (fileServer.indexOf('?') > 0) {
			fileServer += '&';
        } else {
        	fileServer += '?';
        }
		fileServer +=  'dir='+dir;
        
        
        Array.prototype.forEach.call(files, function(file) {
       // files.forEach(function(file) {
        	fileServer +=  '&fileName='+encodeURIComponent(file.name);
        	
			axiosInstance({
				url: fileServer,
				method: 'post',
				showLoading: false,//是否显示加载图标
				loadingMask:false,// 是否显示遮罩层
			})
			.then((response: AxiosResponse) => {
				const result: any = response.data;
				if(result != ""){
					let resultData = JSON.parse(result);
					if(resultData.error ==0){

						
						let signingUrl = resultData.url;
    				        
    				        
						let beforeUrl = signingUrl.substring(0,signingUrl.indexOf("?"));
						//URL参数部分
						let urlParam = signingUrl.substring(signingUrl.indexOf("?")+1,signingUrl.length);

						let newFileName = "";
						//获取提交的参数
						let data = new FormData();
						let urlParamArr = urlParam.split("&");
						for(let i=0;i<urlParamArr.length;i++){
							let paramArr = urlParamArr[i].split("=");
							data.append(paramArr[0], decodeURIComponent(paramArr[1]));
							if(paramArr[0] == "key"){
								newFileName = decodeURIComponent(paramArr[1]);
							}
						}
						data.append("file", file);
						axiosInstance({
							url: beforeUrl,
							method: 'post',
							data: data,
							showLoading: false,//是否显示加载图标
							loadingMask:false,// 是否显示遮罩层
							isCorsDefaultHeaders:true,//仅提交CORS默认允许的响应头
							timeout: 0,// 定义请求超时时间
							onUploadProgress: (progressEvent:any) => {
								let rate = progressEvent.loaded / progressEvent.total;  //已上传的比例
								if (rate < 1) {
									//这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
									//因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
									//等响应回来时，再将进度设为100%
									// progressEvent.loaded:已上传文件大小
									// progressEvent.total:被上传文件的总大小
									let progressPercent = parseFloat((progressEvent.loaded / progressEvent.total * 100).toFixed(2));
									
									//由showNotifications()方法设置id
									let uploadMessage = document.getElementById('uploadMessage_'+SHA256(file.name));
									if(uploadMessage){
										uploadMessage.innerText = String(progressPercent)+'%';
									}
								}
								
							}
						})
						.then((response: AxiosResponse) => {
							if(response){
								if(response.status == 200){
									const result: any = response.data;
									let url = beforeUrl+newFileName;
									
									let title = file.name;
									
									// 上传代码返回结果之后，将文件插入到编辑器中
									callback(url,title,'');
								}
							}
						}).catch((error: any) =>{
							console.log(error);
						});
						
					}else{
						//弹出提示内容
                        ElMessage({
                            showClose: true,
                            message: resultData.message,
                            type: 'error',
                        })
						callback('',file.name,resultData.message);
					} 
				}
		
			}).catch((error: any) =>{
				console.log(error);
			});
    	});
	}else if(fileStorageSystem == 20){//20.MinIO
		let fileServer = uploadServer;
		
		if (fileServer.indexOf('?') > 0) {
			fileServer += '&';
        } else {
        	fileServer += '?';
        }
		fileServer +=  'dir='+dir;
        
        
        Array.prototype.forEach.call(files, function(file) {
       // files.forEach(function(file) {
        	fileServer +=  '&fileName='+encodeURIComponent(file.name);
        	

			axiosInstance({
				url : fileServer,
				method: 'post',
				showLoading: false,//是否显示加载图标
				loadingMask:false,// 是否显示遮罩层
			})
			.then((response: AxiosResponse) => {
				const result: any = response.data;
				if(result != ""){
					let resultData = JSON.parse(result);
					if(resultData.error ==0){
						
						let signingUrl = resultData.url;
    				        
    				        
						let beforeUrl = signingUrl.substring(0,signingUrl.indexOf("?"));
						//URL参数部分
						let urlParam = signingUrl.substring(signingUrl.indexOf("?")+1,signingUrl.length);

						let newFileName = "";
						//获取提交的参数
						let data = new FormData();
						let urlParamArr = urlParam.split("&");
						for(let i=0;i<urlParamArr.length;i++){
							let paramArr = urlParamArr[i].split("=");
							data.append(paramArr[0], decodeURIComponent(paramArr[1]));
							if(paramArr[0] == "key"){
								newFileName = decodeURIComponent(paramArr[1]);
							}
						}
						data.append("file", file);
						
						axiosInstance({
							url: beforeUrl,
							method: 'post',
							data: data,
							showLoading: false,//是否显示加载图标
							loadingMask:false,// 是否显示遮罩层
							isCorsDefaultHeaders:true,//仅提交CORS默认允许的响应头
							timeout: 0,// 定义请求超时时间
							onUploadProgress: (progressEvent:any) => {
								let rate = progressEvent.loaded / progressEvent.total;  //已上传的比例
								if (rate < 1) {
									//这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
									//因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
									//等响应回来时，再将进度设为100%
									// progressEvent.loaded:已上传文件大小
									// progressEvent.total:被上传文件的总大小
									let progressPercent = parseFloat((progressEvent.loaded / progressEvent.total * 100).toFixed(2));
									//由showNotifications()方法设置id
									let uploadMessage = document.getElementById('uploadMessage_'+SHA256(file.name));
									if(uploadMessage){
										uploadMessage.innerText = String(progressPercent)+'%';
									}
								}
								
							}
						})
						.then((response: AxiosResponse) => {
							if(response){
								if(response.status == 200){
									const result: any = response.data;
									let url = beforeUrl+newFileName;
    			    				
    			    				let title = file.name;
    			    				
    							    // 上传代码返回结果之后，将文件插入到编辑器中
    							    callback(url,title,'');
								}
							}
						}).catch((error: any) =>{
							console.log(error);
						});
					}else{
						//弹出提示内容
                        ElMessage({
                            showClose: true,
                            message: resultData.message,
                            type: 'error',
                        })
						callback('',file.name,resultData.message);
					} 
				}
		
			}).catch((error: any) =>{
				console.log(error);
			});
    	});
	}else if(fileStorageSystem == 30){//30.阿里云OSS
		let fileServer = uploadServer;
		
		if (fileServer.indexOf('?') > 0) {
			fileServer += '&';
        } else {
        	fileServer += '?';
        }
		fileServer +=  'dir='+dir;
        
        
        Array.prototype.forEach.call(files, function(file) {
       // files.forEach(function(file) {
        	fileServer +=  '&fileName='+encodeURIComponent(file.name);
        	


			axiosInstance({
				url : fileServer,
				method: 'post',
				showLoading: false,//是否显示加载图标
				loadingMask:false,// 是否显示遮罩层
			})
			.then((response: AxiosResponse) => {
				const result: any = response.data;
				if(result != ""){
					let resultData = JSON.parse(result);
					if(resultData.error ==0){

						let signingUrl = resultData.url;
    				        
    				        
						let beforeUrl = signingUrl.substring(0,signingUrl.indexOf("?"));
						//URL参数部分
						let urlParam = signingUrl.substring(signingUrl.indexOf("?")+1,signingUrl.length);

						let newFileName = "";
						//获取提交的参数
						let data = new FormData();
						let urlParamArr = urlParam.split("&");
						for(let i=0;i<urlParamArr.length;i++){
							let paramArr = urlParamArr[i].split("=");
							data.append(paramArr[0], decodeURIComponent(paramArr[1]));
							if(paramArr[0] == "key"){
								newFileName = decodeURIComponent(paramArr[1]);
							}
						}
						data.append("file", file);
						

						axiosInstance({
							url: beforeUrl,
							method: 'post',
							data: data,
							showLoading: false,//是否显示加载图标
							loadingMask:false,// 是否显示遮罩层
							isCorsDefaultHeaders:true,//仅提交CORS默认允许的响应头
							timeout: 0,// 定义请求超时时间
							onUploadProgress: (progressEvent:any) => {
								let rate = progressEvent.loaded / progressEvent.total;  //已上传的比例
								if (rate < 1) {
									//这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
									//因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
									//等响应回来时，再将进度设为100%
									// progressEvent.loaded:已上传文件大小
									// progressEvent.total:被上传文件的总大小
									let progressPercent = parseFloat((progressEvent.loaded / progressEvent.total * 100).toFixed(2));
									//由showNotifications()方法设置id
									let uploadMessage = document.getElementById('uploadMessage_'+SHA256(file.name));
									if(uploadMessage){
										uploadMessage.innerText = String(progressPercent)+'%';
									}
								}
								
							}
						})
						.then((response: AxiosResponse) => {
							if(response){
								if(response.status == 200){
									let url = beforeUrl+newFileName;
								
									let title = file.name;
									
									// 上传代码返回结果之后，将文件插入到编辑器中
									callback(url,title,'');
								}
							}
						}).catch((error: any) =>{
							console.log(error);
						});
					}else{
						//弹出提示内容
						ElMessage({
                            showClose: true,
                            message: resultData.message,
                            type: 'error',
                        })
						callback('',file.name,resultData.message);
					} 
				}
		
			}).catch((error: any) =>{
				console.log(error);
			});

    	});
	}else{//本地
		Array.prototype.forEach.call(files, function(file) {
    	//files.forEach(function(file) {
    		let formData = new FormData();
    		formData.append(uploadFieldName, file);
    		//令牌
    		//	formData.append("token", store.state.token);
    	    
    		let fileServer = uploadServer;
    		
	    	if (fileServer.indexOf('?') > 0) {
	    		fileServer += '&';
	        } else {
	        	fileServer += '?';
	        }
	    	fileServer +=  'dir='+dir;
	    	
			

			axiosInstance({
				url: fileServer,
				method: 'post',
                data: formData,
				showLoading: false,//是否显示加载图标
				loadingMask:false,// 是否显示遮罩层
				timeout: 0,// 定义请求超时时间
                onUploadProgress: (progressEvent:any) => {
					let rate = progressEvent.loaded / progressEvent.total;  //已上传的比例
					if (rate < 1) {
						//这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
						//因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
						//等响应回来时，再将进度设为100%
						// progressEvent.loaded:已上传文件大小
						// progressEvent.total:被上传文件的总大小
						let progressPercent = parseFloat((progressEvent.loaded / progressEvent.total * 100).toFixed(2));
						//由showNotifications()方法设置id
						let uploadMessage = document.getElementById('uploadMessage_'+SHA256(file.name));
						if(uploadMessage){
							uploadMessage.innerText = String(progressPercent)+'%';
						}
					}
                    
                }
			})
			.then((response: AxiosResponse) => {
				const result: any = response.data;
				if(result != ""){
					let resultData = JSON.parse(result);
					if(resultData.error ==0){
						// 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
						let url = resultData.url;
						// 上传代码返回结果之后，将图片插入到编辑器中
						let title = file.name;
						
						// 上传代码返回结果之后，将文件插入到编辑器中
						callback(url,title,'');
						// result 必须是一个 JSON 格式字符串！！！否则报错
					}else{
						//弹出提示内容
						ElMessage({
                            showClose: true,
                            message: resultData.message,
                            type: 'error',
                        })
						callback('',file.name,resultData.message);
					} 
				}
			}).catch((error: any) =>{
				console.log(error);
			});
    		
    	});
    	
		
	}
	
}

/**
 * 显示Notification 通知
 * @param files 
 */
export async function showNotifications(files: File[]) {
	let map = new Map<string,any>();
	
	for(let i = 0; i < files.length; i++) {
	  let file = files[i];
	  let notification = await ElNotification({
		title: '通知',
		message: h('p', null, [
		  h('span', null, file.name+' 上传中 '),
		  h('span', { style: 'color: #67C23A', id:'uploadMessage_'+SHA256(file.name) }, ''),
		]),//VNode
		duration:0
	  })
	  map.set(file.name,notification)
	}
	return map;
}