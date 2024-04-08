import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import legacy from '@vitejs/plugin-legacy'
import prismjs from "vite-plugin-prismjs";

//import viteCompression from 'vite-plugin-compression';

//把原先 @import 方式引入的变量，通过 readFile 读成字符串传递给 additionalData。解决scss @use 时，把$--color-primary这种变量作为private处理 additionalData: '@use \"./src/style/variables.scss\" as *; $-- color-primary: #19D4AE;'
//import fs from 'fs'
//const scssVariables = fs.readFileSync(path.join(__dirname, '../', 'assets/css/global.scss'), 'utf8')

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
       
        //别名 以根目录的方式定义相对路径
        alias: {
            "@": path.resolve(__dirname, "src"),
          //"@components": path.resolve(__dirname, "src/components")
            vue: 'vue/dist/vue.esm-bundler.js',//编译器版本支持运行时编译
        },
    },
    //plugins: [vue()]
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => ['player','hide'].includes(tag),//预编译时支持原生自定义元素   player为引入的播放器使用标签
                }
            }
        }),
        //Prism代码高亮插件
        prismjs({
            languages: ["xml", "css", "html", "javascript", "java", "perl", "python", "ruby", "go", "cpp", "cs", "bash"],
            //  languages: 'all',
            plugins: ["line-numbers","toolbar","copy-to-clipboard"], //配置显示行号插件 copy-to-clipboard
            theme: "default", //主题名称 default solarizedlight
            css: true,
        }),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver({
                importStyle: "sass",
                directives: true,//自动导入指令
            })],
        }),
        /**
        viteCompression({
            //生成压缩包gz
            verbose: true,//是否在控制台输出压缩结果
            disable: false,//是否禁用
            threshold: 10240,//体积大于 threshold 才会被压缩,单位 b
            algorithm: 'gzip',//压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
            ext: '.gz',//生成的压缩包后缀
            deleteOriginFile: false//压缩后是否删除源文件
        }),**/
        legacy({
            targets: ['defaults', 'ie >= 11', 'chrome 52','Firefox ESR',],  //需要兼容的目标列表，可以设置多个
        }),
    ],
    
    css: {
        preprocessorOptions: {
           scss: {
                /*
                引入var.scss全局预定义变量，
                如果引入多个文件，
                可以使用
                '@import "@/assets/scss/globalVariable1.scss";@import "@/assets/scss/globalVariable2.scss";'
                这种格式
                additionalData 引入的文件最好只写scss变量，不要写css变量。
                @use引入文件时 Sass定义私有成员是使用-或开头,定义$--color-black-10这种是私有变量
                */
               additionalData: `@use "@/assets/css/custom-elementPlus.scss" as *;@use "@/assets/css/global.scss" as *;`//加载各模块样式
            //   additionalData:scssVariables
              //  additionalData: `@use "@/assets/css/custom-elementPlus.scss" as *;@import "@/assets/css/global.scss";`//加载各模块样式
            },
        }
    },
    //assets目录新增支持的静态资源文件  (和assets.d.ts配合使用)  https://cn.vitejs.dev/config/shared-options.html#assetsinclude
    assetsInclude: ['**/*.cur'],
    build: {
        target: 'es2015',
        outDir: './dist/',
        cssCodeSplit: true
    }
})
