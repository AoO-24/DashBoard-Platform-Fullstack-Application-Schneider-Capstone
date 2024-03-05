import type { BytemdPlugin } from 'bytemd'
import { render, h, } from 'vue';
import { EmojiPicker } from '@/components';
import { deleteEmojiEvent, handleClick } from './emojiEvent';


/**
 * 表情插件（未实现）
 * @returns 
 */
export function emoji(): BytemdPlugin {
  return {
  }
}

