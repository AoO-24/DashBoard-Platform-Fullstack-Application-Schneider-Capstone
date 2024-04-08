import escape from "lodash/escape";
import unescape from "lodash/unescape";
/**
 * 转义html
 * @param html
 * @returns 
 */
 export let escapeHtml = (html:string) =>{
    return escape(html);//引入lodash.js
};  

/**
 * 还原html
 * @param html
 * @returns 
 */
export let unescapeHtml = (html:string) =>{
    return unescape(html);//引入lodash.js
};  


/**
 * vue文本转义
 * @param html
 * @returns 
 */
export let escapeVueHtml = (html:string) =>{
	return html.replace(/{{/g, "&#123;&#123;").replace(/}}/g, "&#125;&#125;");//{{}}大括号转义
}
