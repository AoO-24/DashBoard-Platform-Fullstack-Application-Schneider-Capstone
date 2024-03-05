import type { BytemdPlugin } from 'bytemd'
import Prism from "prismjs";

export interface BytemdPluginHighlightOptions {
  init?(): void | Promise<void>
}

/**
 * 高亮代码（未实现）
 * @returns 
 */
export default function highlightCode({
  init,
}: BytemdPluginHighlightOptions = {}): BytemdPlugin {

  return {
  }
}