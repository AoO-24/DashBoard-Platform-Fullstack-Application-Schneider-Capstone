import { UserGrade } from "@/types";
import store from "@/store";
import $ from 'jquery'

declare var window : any;
window.$ = window.jQuery = $;


import "../../public/common/default/pc/js/kindeditor/kindeditor-min.js";// 富文本编辑器

/**
 * 创建富文本编辑器(本编辑器需要jquery)
 * @param ref 文本框对象
 * @param availableTag 允许使用的标签 ['source', '|']
 * @param uploadPath 上传文件路径  例如control/topic/manage?method=upload
 * @param userGradeList 会员等级
 * @param fileStorageSystem 使用的文件存储系统
 * @param callback 回调
 */
 export function createEditor(ref:any, availableTag:Array<string>, uploadPath:string, userGradeList:Array<UserGrade> | null,fileStorageSystem:number,callback:(id: string) => void) {
	let baseURL = store.state.apiUrl;//后端地址

	if(baseURL == null || baseURL == ''){
		return {};
	}

	KindEditor.lang({
        hide : '隐藏'
    });
   
	// 指定编辑器iframe document的CSS数据，用于设置可视化区域的样式。 单冒号(:)用于CSS3伪类，双冒号(::)用于CSS3伪元素。伪元素由双冒号和伪元素名称组成。双冒号是在当前规范中引入的，用于区分伪类和伪元素。但是伪类兼容现存样式，浏览器需要同时支持旧的伪类，比如:first-line、:first-letter、:before、:after等
    KindEditor.options.cssData = ".ke-content hide {"+
		"border: 0;"+
		"border-left: 3px solid #06b5ff;"+
		"margin-left: 10px;"+
		"padding: 0.5em;"+
		"min-height:26px;"+
		"display: block;"+
		"margin: 30px 0px 0px 0px;"+
	"}"+
	".ke-content .inputValue_10:before {"+
		"content: '密码: ' attr(input-value) '';"+
		" color: #06b5ff;"+
		"font-size:14px;"+
		"position: absolute;"+
		"margin-top: -30px;"+
		"line-height: 30px;"+
	"}"+
	".ke-content .inputValue_20:before {"+
		"content: '回复话题可见';"+
		" color: #06b5ff;"+
		"font-size:14px;"+
		"position: absolute;"+
		"margin-top: -30px;"+
		"line-height: 30px;"+
	"}"+
	".ke-content .inputValue_30:before {"+
		"content: '达到等级 ' attr(description) ' 可见';"+
		" color: #06b5ff;"+
		"font-size:14px;"+
		"position: absolute;"+
		"margin-top: -30px;"+
		"line-height: 30px;"+
	"}"+
	".ke-content .inputValue_40:before {"+
		"content: '需要支付 ' attr(input-value) ' 积分可见';"+
		" color: #06b5ff;"+
		"font-size:14px;"+
		"position: absolute;"+
		"margin-top: -30px;"+
		"line-height: 30px;"+
	"}"+
	".ke-content .inputValue_50:before {"+
		"content: '需要支付 ' attr(input-value) ' 元费用可见';"+
		" color: #06b5ff;"+
		"font-size:14px;"+
		"position: absolute;"+
		"margin-top: -30px;"+
		"line-height: 30px;"+
	"}"+//突出编辑框的代码
	".ke-content .prettyprint {"+
		"min-height:20px;"+
		"background:#f8f8f8;"+
		"border:1px solid #ddd;"+
		"padding:5px;"+
	"}"+//默认字体大小
	"body {"+
		"font-size: 14px;"+
	"}";


    //指定要保留的HTML标记和属性。Object的key为HTML标签名，value为HTML属性数组，”.”开始的属性表示style属性。 注意属性要全部小写
    KindEditor.options.htmlTags['hide'] = ['hide-type','input-value','class','description'];
    
    let editor = KindEditor.create(ref, {
    	//basePath : 'kindeditor/',//指定编辑器的根目录路径
    	themeType : 'style :minimalist customization',//极简主题 加冒号的是主题样式文件名称同时也是主题目录
		autoHeightMode : true,//值为true，并引入autoheight.js插件时自动调整高度
		formatUploadUrl :false,//false时不会自动格式化上传后的URL
		resizeType : 1,//2或1或0，2时可以拖动改变宽度和高度，1时只能改变高度，0时不能拖动。默认值: 2 
		allowPreviewEmoticons : true,//true或false，true时鼠标放在表情上可以预览表情
		allowImageUpload : true,//true时显示图片上传按钮
		allowFlashUpload :true,
		uploadModule : fileStorageSystem,//上传模块 0.本地 10.SeaweedFS 20.MinIO 30.阿里云OSS
		baseURL : baseURL,//后端地址
		uploadJson :baseURL+uploadPath,//指定浏览远程图片的服务器端程序
		filePostName:'file',//文件上传字段 默认imgFile  第三方文件服务器不受本参数影响
		items : availableTag,
     	userGradeList:userGradeList,
     	fixToolBar : true,//浮动工具栏
		afterChange : function() {
            this.sync();
		},
		afterBlur:function(){
           this.sync();
		},
		afterToggleEditor:function(){
			callback(ref.getAttribute('editorId'));
		},

	});
    //自动展开内容
    editor.autoExpandContent();
    return editor;
}