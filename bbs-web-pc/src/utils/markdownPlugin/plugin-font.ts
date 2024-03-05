import { BytemdPlugin } from 'bytemd';

/**
 * 过滤font标签（未实现）
 * @returns 
 */
export default function filterFont(): BytemdPlugin {
  return {
    viewerEffect({ markdownBody }) {
      
    },
  };
}