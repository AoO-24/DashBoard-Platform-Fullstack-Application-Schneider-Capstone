<!-- 页脚 -->
<template>
    <div class="footer">
        <div class="message">

        </div>
        <div class="copyright">版权所有<em>&copy;diyhi.com</em>
            <router-link tag="a" :to="'/feedback'" target="_blank">联系我们</router-link>
        </div>	
    </div>
</template>

<style scoped lang="scss">
/* 页脚 border-top: 1px solid #e1e1e1; */
.footer { 
    flex-shrink: 0;
	background: #fff;
	height: 90px;
	margin-top: 10px;
    box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
    .message { 
        width: 990px; margin: 0 auto; height: 18px; font-size: 0; line-height: 0; 
        text-align: center;
        a, em {  
            font-size: 12px; line-height: 18px; 
            display: inline-block;
            color: $color-black-60;
            margin-top: 10px; 
            font-style:normal;
        }
        a:hover {
            color:#1890ff; text-decoration:none;
        }
    }
    .copyright { 
        width: 990px; margin: 0 auto;  color: $color-black-60; text-align: center; 
        margin-top: 18px; 
        font-size: 14px;
        em { font-family: Tahoma; margin-left: 3px; font-style:normal;}
        a { font-family: Tahoma; margin-left: 19px; color: $color-black-60; }
        a:hover { text-decoration:none;color:#1890ff;}
        span { margin-left: 17px; }
    }
}
</style>