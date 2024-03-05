<!-- emoji表情选择器 -->
<template>
    <div ref="emojiPickerRef" ></div>
</template>

<script setup lang="ts">
    import { ref, watchEffect} from 'vue'
    import { Picker } from 'emoji-mart'
    import i18n from "@emoji-mart/data/i18n/zh.json";



    // Emoji picker
    const emojiPickerRef = ref<HTMLElement | null>(null);

   
    //接收父组件消息
    const props = defineProps({
        theme: {//主题
            type: String,
            default: 'auto'
        },
        onEmojiSelect: {//表情符号选择
            type: Function,
            default: null
        },
      //  onClickOutside: {//在选取器外部发生单击时回调
      //      type: Function,
      //      default: null
      //  },
    })  
    

    const handleCreateEmojiPicker = () => {
        const emojiPicker = new Picker({
            data: async () => {
                const data = await import("@emoji-mart/data");
                return Object.assign({}, data);
            },
            
            autoFocus: false,//自动焦点
            skinTonePosition:'none',//肤色选择器的位置
            i18n: i18n,//用于选取器的本地化数据
           // onEmojiSelect: onEmojiSelect,//表情符号选择
           // onClickOutside: onClickOutside,//在选取器外部发生单击时回调
            ...props,
        });
        emojiPickerRef.value?.appendChild(emojiPicker as unknown as Node);
    };

    //表情符号选择
    const onEmojiSelect = (emoji: { native: string }) => {
        console.log("选中",emoji.native)
       
    };

    //在选取器外部发生单击时回调
    const onClickOutside = (e:Event) => {
       
       
    };



    watchEffect(() => {
        if (emojiPickerRef.value) {
            handleCreateEmojiPicker();
        }
    });
   
</script>

<style scoped lang="scss">
//参考https://github.com/missive/emoji-mart/blob/main/packages/emoji-mart-website/example-custom-styles.html
//源代码https://github.com/missive/emoji-mart/blob/d29728f7b4e295e46f9b64aa80335aa4a3c15b8e/packages/emoji-mart/src/components/Picker/PickerStyles.scss#L4
:deep(em-emoji-picker) {
    --rgb-accent: 64,158,255;//图标、输入框边框颜色
   // --rgb-background: 262, 240, 283;//面板背景颜色
    --rgb-color: 39,46,59;//字体颜色
    --rgb-input: 255,255,255;//输入框焦点背景颜色

    --color-border:rgb(247,248,250);//输入框背景颜色
}
</style>
