import type { BytemdPlugin } from 'bytemd'
import { editorUpload, showNotifications } from '../markdownEditor';
/**
 * 图片上传插件（未实现）
 * @param uploadPath 上传服务器地址
 * @param uploadFieldName 上传字段名称
 * @param fileStorageSystem 文件存储系统
 * @returns 
 */
export function imageUpload(uploadPath:string,uploadFieldName:string, fileStorageSystem:number): BytemdPlugin {
  return {
    
  }
}

