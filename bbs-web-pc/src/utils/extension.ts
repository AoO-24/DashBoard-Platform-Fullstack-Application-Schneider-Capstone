// 原型扩展 不要对原型方法使用箭头函数   引入方法import * as extension from "@/utils/extension";const extensionFunction = extension;
export {}
declare global {
    interface Array<T>  {
        contains(item:string): boolean;
    }
}

/**
 * 数组是否含有指定元素
 */
if (!Array.prototype.contains) {
    
    //使用Object.defineProperty以确保该属性不可枚举
    Object.defineProperty(Array.prototype, 'contains', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function contains(this: any, item:string): boolean {
            return RegExp("\\b"+item+"\\b").test(this);
        }
    });

    
    //Array.prototype.contains = function(item:string):boolean{
    //    return RegExp("\\b"+item+"\\b").test(this as any);
    //}
}
