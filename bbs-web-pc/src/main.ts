import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
//import store from './store/index'
import { setupStore } from "@/store/index";
// 导入请求拦截器
import axiosInstance from '@/utils/http'//导入请求拦截器request


//import VueAxios from 'vue-axios'
import 'element-plus/theme-chalk/el-message.css'//全局 Message 消息提示(js文件中使用不支持自动导入的样式)
import "element-plus/theme-chalk/el-message-box.css";// messageBox的样式
import "element-plus/theme-chalk/el-overlay.css";// 遮罩层样式
import "element-plus/theme-chalk/el-loading.css";// loading的样式
import "element-plus/theme-chalk/el-notification.css";//Notification的样式

//import 'element-plus/dist/index.css'//全部引入
import 'element-plus/es/components/form/style/css'//script setup中使用组件时不支持自动导入的样式
import 'element-plus/theme-chalk/el-affix.css'//全局 固钉

import 'bytemd/dist/index.css'//Markdown编辑器样式

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { ElImage} from 'element-plus'
import Icon from "@/components/icon/Icon.vue";

import { createMetaManager} from 'vue-meta'
import '@/assets/css/base.css'
import { statistic } from '@/utils/trackPageview';
import { queryBaseInfo } from '@/utils/requestAPI';
//import '@/assets/css/module.less'



const app = createApp(App);
app.use(router);
//app.use(store);
router.beforeEach(function(to, from, next) {
    if (to.path) {
      //访问统计
      statistic(to.fullPath,from.fullPath);
    }
    next(true);
});

setupStore(app); // 安装store

//axios
app.config.globalProperties.$axios=axiosInstance;
//app.use(VueAxios, Request.init())

//查询基本信息
//queryBaseInfo();


app.use(createMetaManager(false, {
    meta: { tag: 'meta', nameless: true }
}))

app.component('Icon', Icon)//富文本渲染展示需要全局注册
app.component('el-image', ElImage);//富文本渲染展示需要全局注册


//ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//运行时支持原生自定义元素   player为引入的播放器使用标签
app.config.compilerOptions.isCustomElement = (tag) => ['player','hide'].includes(tag)

app.mount('#app');





