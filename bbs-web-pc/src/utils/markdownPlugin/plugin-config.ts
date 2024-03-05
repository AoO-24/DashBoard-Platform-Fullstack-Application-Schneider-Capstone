import { BytemdPlugin,BytemdEditorContext } from 'bytemd';
import { nextTick } from 'vue';

/**
 * 配置（未实现）
 * @param scroll 获得焦点时是否滚动
 */
export default function config(scroll: boolean=true): BytemdPlugin {
 
  return {
    editorEffect(ctx: BytemdEditorContext) {
        
        
    }
  };
}

