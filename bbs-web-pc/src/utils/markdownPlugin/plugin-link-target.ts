import { BytemdPlugin } from 'bytemd';

/**
 * 将链接的a标签的target，改为_blank（未实现）
 * @returns 
 */
export default function linkTarget(): BytemdPlugin {
  return {
    viewerEffect({ markdownBody }) {
      
    },
  };
}