import { BytemdPlugin } from 'bytemd';

/**
 * 过滤iframe标签（未实现）
 * @returns 
 */
export default function filterIframe(): BytemdPlugin {
  return {
    viewerEffect({ markdownBody }) {
      
    }
  };
}