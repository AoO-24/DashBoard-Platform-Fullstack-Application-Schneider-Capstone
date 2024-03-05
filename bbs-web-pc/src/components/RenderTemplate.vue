<script lang="ts" >
import { compile, defineComponent, h, VNode } from 'vue'

//渲染模板
//setup语法糖不可以使用render
export default defineComponent({
    props: {
        html: { 
            type: String, 
            default: ''
        },
        modelValue: {
            type: String,
            default: ''
        },
    }, 

    
    data () {
        return {
            hide_passwordList :[],//话题隐藏密码
        }
    },
    computed: {
        template(): string {
            return this.html
        }
    },
    render(): VNode {
        //return h(compile(this.template), { ...this.$attrs })
        return h(compile(this.template,{
            isCustomElement: (tag) => ['player','hide'].includes(tag),//运行时支持原生自定义元素   player为引入的播放器使用标签
        }), { 
            //话题解锁
            onTopicUnhide_renderTemplate: (hideType: number,hidePasswordIndex: number,topicId:string) => {
                let hidePassword = '';
                if(hideType == 10){
                    hidePassword = this.hide_passwordList[hidePasswordIndex];
                }
                this.$emit("click-onTopicUnhide", hideType,hidePassword,topicId);
            },
            //图片加载完成
            imageLoad_renderTemplate: (src:string) => {
                this.$emit("load-onImageLoad", '');
            },
            //文件下载
            onDownload_renderTemplate: (href:string) => {
                this.$emit("click-onDownload", href);
            },


            hide_passwordList: this.hide_passwordList,
            onInput: ($event:any) => {
                this.$emit('update:modelValue', $event.target.value)
            },
            ...this.$attrs 
        })
    }
})
</script>