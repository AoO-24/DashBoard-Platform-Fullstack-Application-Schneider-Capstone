import { UserGrade } from '@/types';
import type { BytemdPlugin } from 'bytemd'
import Long from "long";



/**
 * 帮助信息
 * @param availableTag 编辑器允许使用标签
 * @param userGradeList 用户等级
 * @returns 
 */
export function help(availableTag: Array<string>, userGradeList: Array<UserGrade>): BytemdPlugin {
  
  return {
    editorEffect({root}) {
        const help_element = root.querySelector('.bytemd-help');
        if(help_element){
          let h2 = document.createElement("h2");
          h2.innerText = '扩展标签';
          help_element.appendChild(h2);

          let ul = document.createElement("ul");
          


          if(availableTag != null && availableTag.length >0){
            for(let i=0; i< availableTag.length; i++){
                let tag = availableTag[i];
                if(tag == "hidePassword"){
                  let li = document.createElement("li");
                  let div1 = document.createElement("div");
                  div1.setAttribute("class","bytemd-help-icon");
                  div1.innerHTML = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="22" width="36" height="22" rx="2" fill="none" stroke="#959da5" stroke-width="4" stroke-linejoin="round"/><path d="M14 22V14C14 8.47715 18.4772 4 24 4C29.5228 4 34 8.47715 34 14V22" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 30V36" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                  let div2 = document.createElement("div");
                  div2.setAttribute("class","bytemd-help-title");
                  div2.innerText = '隐藏内容 -- 输入密码可见';
                  let div3 = document.createElement("div");
                  let div3_code = document.createElement("code");
                  div3_code.innerText = '<hide hide-type="10" input-value="密码"></hide>';
                  div3.appendChild(div3_code);
                  li.appendChild(div1);
                  li.appendChild(div2);
                  li.appendChild(div3);
                  ul.appendChild(li);
                }
                if(tag == "hideComment"){
                  let li = document.createElement("li");
                  let div1 = document.createElement("div");
                  div1.setAttribute("class","bytemd-help-icon");
                  div1.innerHTML = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="22" width="36" height="22" rx="2" fill="none" stroke="#959da5" stroke-width="4" stroke-linejoin="round"/><path d="M14 22V14C14 8.47715 18.4772 4 24 4C29.5228 4 34 8.47715 34 14V22" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 30V36" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                  let div2 = document.createElement("div");
                  div2.setAttribute("class","bytemd-help-title");
                  div2.innerText = '隐藏内容 -- 回复话题可见';
                  let div3 = document.createElement("div");
                  let div3_code = document.createElement("code");
                  div3_code.innerText = '<hide hide-type="20"></hide>';
                  div3.appendChild(div3_code);
                  li.appendChild(div1);
                  li.appendChild(div2);
                  li.appendChild(div3);
                  ul.appendChild(li);
                }
                if(tag == "hideGrade"){
                  let li = document.createElement("li");
                  let div1 = document.createElement("div");
                  div1.setAttribute("class","bytemd-help-icon");
                  div1.innerHTML = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="22" width="36" height="22" rx="2" fill="none" stroke="#959da5" stroke-width="4" stroke-linejoin="round"/><path d="M14 22V14C14 8.47715 18.4772 4 24 4C29.5228 4 34 8.47715 34 14V22" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 30V36" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                  let div2 = document.createElement("div");
                  div2.setAttribute("class","bytemd-help-title");
                  div2.innerText = '隐藏内容 -- 达到等级可见';
                  let div3 = document.createElement("div");
                  let div3_code = document.createElement("code");
                  div3_code.innerText = '<hide hide-type="30" input-value="等级积分" description="等级名称"></hide>';
                  div3.appendChild(div3_code);


                  let div4 = document.createElement("div");
                  div4.setAttribute("class","bytemd-help-selectGrade");
                  div4.innerText = '可选等级：';

                  li.appendChild(div1);
                  li.appendChild(div2);
                  li.appendChild(div3);
                  li.appendChild(div4);
                 
                  if(userGradeList != null && userGradeList.length >0){
                    for(let i=0; i< userGradeList.length; i++){
                        let userGrade:UserGrade = userGradeList[i];
                        if(Long.fromString(userGrade.needPoint).gt(0)){
                          let div5 = document.createElement("div");
                          div5.setAttribute("class","bytemd-help-gradeItem");
                          let span1 = document.createElement("span");
                          span1.setAttribute("class","bytemd-help-userGrade-needPoint");
                          span1.innerText = userGrade.name;

                          let span2 = document.createElement("span");
                          span2.innerText = userGrade.needPoint;
                          div5.appendChild(span1);
                          div5.appendChild(span2);
                          li.appendChild(div5);
                        }
                    }
                  }
                  ul.appendChild(li);
                }
                if(tag == "hidePoint"){
                  let li = document.createElement("li");
                  let div1 = document.createElement("div");
                  div1.setAttribute("class","bytemd-help-icon");
                  div1.innerHTML = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="22" width="36" height="22" rx="2" fill="none" stroke="#959da5" stroke-width="4" stroke-linejoin="round"/><path d="M14 22V14C14 8.47715 18.4772 4 24 4C29.5228 4 34 8.47715 34 14V22" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 30V36" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                  let div2 = document.createElement("div");
                  div2.setAttribute("class","bytemd-help-title");
                  div2.innerText = '隐藏内容 -- 积分购买可见';
                  let div3 = document.createElement("div");
                  let div3_code = document.createElement("code");
                  div3_code.innerText = '<hide hide-type="40" input-value="积分"></hide>';
                  div3.appendChild(div3_code);
                  li.appendChild(div1);
                  li.appendChild(div2);
                  li.appendChild(div3);
                  ul.appendChild(li);
                }
                if(tag == "hideAmount"){
                  let li = document.createElement("li");
                  let div1 = document.createElement("div");
                  div1.setAttribute("class","bytemd-help-icon");
                  div1.innerHTML = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="22" width="36" height="22" rx="2" fill="none" stroke="#959da5" stroke-width="4" stroke-linejoin="round"/><path d="M14 22V14C14 8.47715 18.4772 4 24 4C29.5228 4 34 8.47715 34 14V22" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 30V36" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                  let div2 = document.createElement("div");
                  div2.setAttribute("class","bytemd-help-title");
                  div2.innerText = '隐藏内容 -- 余额购买可见';
                  let div3 = document.createElement("div");
                  let div3_code = document.createElement("code");
                  div3_code.innerText = '<hide hide-type="50" input-value="价格"></hide>';
                  div3.appendChild(div3_code);
                  li.appendChild(div1);
                  li.appendChild(div2);
                  li.appendChild(div3);
                  ul.appendChild(li);
                  
                }

                if(tag == "uploadVideo"){
                  let li = document.createElement("li");
                  let div1 = document.createElement("div");
                  div1.setAttribute("class","bytemd-help-icon");
                  div1.innerHTML = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10C4 8.89543 4.89543 8 6 8H42C43.1046 8 44 8.89543 44 10V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V10Z" fill="none" stroke="#959da5" stroke-width="4" stroke-linejoin="round"/><path d="M36 8V40" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8V40" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 18H44" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 30H44" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 18H10" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16V20" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 8H15" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 40H15" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 8H39" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 40H39" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 30H10" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 28V32" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 28V32" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 16V20" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 19L29 24L21 29V19Z" fill="none" stroke="#959da5" stroke-width="4" stroke-linejoin="round"/></svg>';
                  let div2 = document.createElement("div");
                  div2.setAttribute("class","bytemd-help-title");
                  div2.innerText = '视频上传';
                  let div3 = document.createElement("div");
                  div3.setAttribute("class","bytemd-help-content");
                  let div3_code = document.createElement("code");
                  div3_code.innerText = '!video[alt](url)';
                  div3.appendChild(div3_code);
                  li.appendChild(div1);
                  li.appendChild(div2);
                  li.appendChild(div3);
                  ul.appendChild(li);
                }

                if(tag == "embedVideo"){
                  let li = document.createElement("li");
                  let div1 = document.createElement("div");
                  div1.setAttribute("class","bytemd-help-icon");
                  div1.innerHTML = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10C4 8.89543 4.89543 8 6 8H42C43.1046 8 44 8.89543 44 10V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V10Z" fill="none" stroke="#959da5" stroke-width="4" stroke-linejoin="round"/><path d="M36 8V40" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8V40" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 18H44" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 30H44" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 18H10" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16V20" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 8H15" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 40H15" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 8H39" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 40H39" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 30H10" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 28V32" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 28V32" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 16V20" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 19L29 24L21 29V19Z" fill="none" stroke="#959da5" stroke-width="4" stroke-linejoin="round"/></svg>';
                  let div2 = document.createElement("div");
                  div2.setAttribute("class","bytemd-help-title");
                  div2.innerText = '嵌入视频';
                  let div3 = document.createElement("div");
                  let div3_code = document.createElement("code");
                  div3_code.innerText = '<iframe src="视频地址"></iframe>';
                  div3.appendChild(div3_code);
                  li.appendChild(div1);
                  li.appendChild(div2);
                  li.appendChild(div3);
                  ul.appendChild(li);
                }

                if(tag == "insertfile"){
                  let li = document.createElement("li");
                  let div1 = document.createElement("div");
                  div1.setAttribute("class","bytemd-help-icon");
                  div1.innerHTML = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 23V14L31 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H22" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 29V43" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 36H33H40" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 4V14H40" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                  let div2 = document.createElement("div");
                  div2.setAttribute("class","bytemd-help-title");
                  div2.innerText = '文件上传';
                  let div3 = document.createElement("div");
                  div3.setAttribute("class","bytemd-help-content");
                  let div3_code = document.createElement("code");
                  div3_code.innerText = '!file[alt](url)';
                  div3.appendChild(div3_code);
                  li.appendChild(div1);
                  li.appendChild(div2);
                  li.appendChild(div3);
                  ul.appendChild(li);
                }

                
                


            }
          }


          let liTextColor = document.createElement("li");
          let divTextColor1 = document.createElement("div");
          divTextColor1.setAttribute("class","bytemd-help-icon");
          divTextColor1.innerHTML = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="36" height="36" rx="3" fill="none" stroke="#959da5" stroke-width="4" stroke-linejoin="round"/><path d="M16 19V16H32V19" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 34H26" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 18L24 34" stroke="#959da5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          let divTextColor2 = document.createElement("div");
          divTextColor2.setAttribute("class","bytemd-help-title");
          divTextColor2.innerText = '文字颜色';
          let divTextColor3 = document.createElement("div");
          let divTextColor3_code = document.createElement("code");
          divTextColor3_code.innerText = '<font color=#008000>绿色</font>';
          divTextColor3.appendChild(divTextColor3_code);
          liTextColor.appendChild(divTextColor1);
          liTextColor.appendChild(divTextColor2);
          liTextColor.appendChild(divTextColor3);
          ul.appendChild(liTextColor);


          let liBr = document.createElement("li");
          let divBr1 = document.createElement("div");
          divBr1.setAttribute("class","bytemd-help-icon");
          divBr1.innerHTML = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8V40" stroke="#959da5" stroke-width="4" stroke-linecap="round"/><path d="M40 8V40" stroke="#959da5" stroke-width="4" stroke-linecap="round"/><path d="M20.0522 24.0083H40.0002" stroke="#959da5" stroke-width="4" stroke-linecap="round"/></svg>';
          let divBr2 = document.createElement("div");
          divBr2.setAttribute("class","bytemd-help-title");
          divBr2.innerText = '换行';
          let divBr3 = document.createElement("div");
          divBr3.setAttribute("class","bytemd-help-content");
          let divBr3_code = document.createElement("code");
          divBr3_code.innerText = '<br>';
          divBr3.appendChild(divBr3_code);
          liBr.appendChild(divBr1);
          liBr.appendChild(divBr2);
          liBr.appendChild(divBr3);
          ul.appendChild(liBr);




          help_element.appendChild(ul);

         
        }
    }
  }
}

