import type { BytemdPlugin } from 'bytemd'


/**
 * 浮动工具栏插件（未实现）
 * @returns 
 */
export default function floatToolbar(): BytemdPlugin {
  return {
    editorEffect({root}) {
       
    },
    /** 
    viewerEffect(ctx) {
      //展示生成的HTML内容
      console.log(ctx.markdownBody.outerHTML)
    }*/
  }
}

