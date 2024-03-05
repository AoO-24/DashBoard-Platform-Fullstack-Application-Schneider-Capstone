<!-- 更新头像 -->
<template>
    <div class="updateAvatar-container" >
        <div class="original-box">
            <img ref="originalImage" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="原图"/>
        </div>
        <div class="preview-pane-square">
            <div ref="previewSquare" class="preview-square"></div> 
        </div>
        <div class="preview-pane-round">
            <div ref="previewRound" class="preview-round"></div> 
        </div>
        <div class="bottomInfo">
            <div class="update-containe">
                <i id="progressBar" class="progressBar"></i>
                <div class="button-container">               
                    <div class="progress">
                        <el-progress :text-inside="true" :stroke-width="20" :percentage="form.progressPercent" />
                    </div>
                    <div>
                        <el-upload ref="selectImage" v-model:file-list="fileList" action="#" :auto-upload="false" :show-file-list="false" :on-change="handleChange" :accept="'image/*'">
                            <el-button type="primary" size="large" class="selectImage" plain >选择图片</el-button>
                        </el-upload>
                    </div>
                    <div>
                        <el-button type="primary" size="large" class="uploadImage" @click="uploadAvatar" :disabled="form.allowSubmit">上传</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { getCurrentInstance, ComponentInternalInstance,nextTick, onUnmounted, reactive, ref, onMounted } from 'vue';
    import Cropper from "cropperjs";
    import "cropperjs/dist/cropper.css";
    import { AxiosResponse } from 'axios';
    import { ElMessage, UploadInstance, UploadUserFile } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
   

    const originalImage = ref<HTMLImageElement>()//原图
    const previewSquare = ref<HTMLElement>()//预览方框
    const previewRound = ref<HTMLElement>()//预览圆框
    const selectImage = ref<UploadInstance>()//选择图片
    const fileList = ref<UploadUserFile[]>()//图片列表

    //传递消息给父组件
    const emit = defineEmits(['updateAvatar'])

    //表单
    const form = reactive({ 
        avatarCropper:null as any,//头像Cropper
		progressPercent: 0, // 进度条默认为0
        allowSubmit:false,//提交按钮disabled状态
    })

    //错误
    const error = reactive({
    })


    //创建Cropper
    const createCropper = () => {
        if(originalImage.value && previewSquare.value && previewRound.value){
            form.avatarCropper = new Cropper(originalImage.value, {	
                viewMode: 1,//视图模式
                dragMode: 'crop',//拖拽模式
                initialAspectRatio: 1,//定义裁切框的初始宽高比。默认情况下，它与画布（图像包装器）的纵横比相同。这个值只有在aspectRatio值不进行设置的时候生效
                aspectRatio: 1,//裁剪框的宽高比
                preview:[ previewSquare.value, previewRound.value],//添加额外的元素(容器)以供预览
                background: true,//显示容器的网格背景
                autoCropArea: 0.6,//定义自动裁剪面积大小(百分比)和图片进行对比。 就是裁剪框显示的大小
                zoomOnWheel: false,//是否可以通过移动鼠标来放大图像
                minContainerWidth:400,
                minContainerHeight:400,
            });
        }
        
    }
    
    

    //处理上传图片
    const handleChange = (file:any, fileList:any) => {
        if (fileList.length > 1) {
            fileList.splice(0, 1);
        }
        
        var reader = new FileReader();
        //readAsDataURL方法可以将File对象转化为data:URL格式的字符串（base64编码）
        reader.readAsDataURL(file.raw);
        reader.onload = (e)=>{
            let dataURL:any = reader.result;
            if(dataURL){
                //将img的src改为刚上传的文件的转换格式
                originalImage.value?.setAttribute("src",dataURL);
            }
            // form.avatarCropper.reset();
            if(form.avatarCropper != null){
                form.avatarCropper.destroy();//销毁裁剪器并从图像中删除实例。
                form.avatarCropper = null;
            }
            
            nextTick(()=>{
                createCropper();
            })
        }
        
	}

    //上传头像
    const uploadAvatar = () => {
        let formData = new FormData();
        form.allowSubmit = true;

        if(form.avatarCropper == null || originalImage.value?.getAttribute("src") == "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
           ElMessage({
                showClose: true,
                message: '请选择图片',
                type: 'error',
                onClose: ()=>{}
            })
            form.allowSubmit = false;
            return;
        }

        if(fileList.value != null && fileList.value.length >0){
            formData.append('imgFile', fileList.value[0].raw!);
        }

        // - x裁切框距离左边的距离 
        // - y裁切框距离顶部的距离 
        // - width裁切框的宽度 
        // - height裁切框的高度 
        // - rotate裁切框的旋转的角度 
        // - scaleX缩放图像的横坐标 
        // - scaleY缩放图像的纵坐标 
        let dataObject = form.avatarCropper.getData(true);//返回裁剪区域基于原图片!原尺寸!的位置和尺寸 rounded默认为false 表示是否显示四舍五入后的数据
        formData.append('width', dataObject.width);
        formData.append('height', dataObject.height);
        formData.append('x', dataObject.x); 
        formData.append('y', dataObject.y);


        
        proxy?.$axios({
            url: '/user/control/updateAvatar',
            method: 'post',
            data: formData,
            timeout: 0,// 定义请求超时时间
            onUploadProgress: (progressEvent:any) => {
                if (progressEvent.lengthComputable) {
                    
                    let rate = progressEvent.loaded / progressEvent.total;  //已上传的比例
                    if (rate < 1) {
                        //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                        //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                        //等响应回来时，再将进度设为100%
                        // progressEvent.loaded:已上传文件大小
                        // progressEvent.total:被上传文件的总大小
                        form.progressPercent = parseFloat((progressEvent.loaded / progressEvent.total * 100).toFixed(2));
                    }
                }
            }
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                const data = JSON.parse(result)
                if(JSON.parse(data.success)){
                    form.progressPercent = 100;
                    //传递消息给父组件
                    emit('updateAvatar',true);
                    ElMessage({
                        showClose: true,
                        message: '上传头像成功',
                        type: 'success',
                        onClose: ()=>{}
                    })
                    
                    init();
                    
                }else{
                    //处理错误信息
                    processErrorInfo(data.error as Map<string,string> , error,()=>{});
                    
                }
                form.allowSubmit = false;
            }
        })
        .catch((error: any) =>{
            console.log(error);
            form.allowSubmit = false;
        });
    }






    //卸载组件实例后调用
    onUnmounted (()=>{
       if(form.avatarCropper != null){
            form.avatarCropper.destroy();//销毁裁剪器并从图像中删除实例。
            form.avatarCropper = null;
        }
    })
    
    onMounted(() => {
        init();

    }) 

    //初始化
    const init = () => {
		form.progressPercent= 0; // 进度条默认为0
	   
        if(form.avatarCropper != null){
            form.avatarCropper.destroy();//销毁裁剪器并从图像中删除实例。
            form.avatarCropper = null;
        
            selectImage.value!.clearFiles()	//清理上传列表
           // fileList.value!.length = 0;
        }
        originalImage.value?.setAttribute("src","data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");//空白1像素图片

	}
    

</script>

<style scoped lang="scss">
.updateAvatar-container{
    padding-left: 8px;
    padding-right: 8px;
	padding-top: 8px;
	padding-bottom: 12px;
	background: $color-black-10;
    .original-box{
        width: 400px;
        height: 400px;
        background-color: $color-black-20;
        img{
            display: block;
            max-width: 100%;
        }
    }
    .preview-pane-square {
        display: block;
        position: absolute;
        left:450px;
        top: 84px;
        z-index: 2100;	
        //截图预览 -- 正方型
        .preview-square {
            width: 120px;
            height: 120px;
            overflow: hidden;
        }
    }
    /* 截图预览 -- 圆型 */
    .preview-pane-round {
        display: block;
        position: absolute;
        left:450px;
        top: 250px;
        z-index: 2100;	
        .preview-round {
            width: 120px;
            height: 120px;
            border-radius:100%;
            overflow: hidden;
        }
    }
    .bottomInfo{
        margin-top: 8px;
        border-top: 1px solid $color-black-30; 
        line-height:34px; 
        position: relative;
        padding-top: 6px;
        .progressBar{
            position: absolute;
            left: -220px;
            font-style:normal;
        }
        .update-containe{
            margin-top:15px;
            width:100%;
            text-align:right;
            .button-container {
                display: flex;
                justify-content: flex-end;
                .progress{
                    width: 300px;
                    position: relative;
                    top: 10px;
                }
                .selectImage{
                    font-size: 15px;
                    padding: 8px 20px;
                    margin-left: 12px;
                }
                .uploadImage{
                   // font-size: 15px;
                    //padding: 8px 20px;
                    margin-left: 12px;
                }
            }
        }
    }
}


</style>