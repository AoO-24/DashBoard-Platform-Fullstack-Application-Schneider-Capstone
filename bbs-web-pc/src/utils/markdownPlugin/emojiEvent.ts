

//emoji表情事件
export const handleClick = (event: any) => {
    // 阻止默认行为
    event.stopPropagation();
    event.preventDefault();
    const el:any = document.querySelector(".emoji-container");
    if(el){
      if(!event.target.closest('.emoji-container')){    
        document.removeEventListener("click", handleClick);
        el.remove();
      
      } 
    }
}

//删除全部选取器(只在点击当前功能的工具栏按钮有效)
//删除emoji表情事件
export const deleteEmojiEvent = () => {
    document.querySelectorAll('.emoji-container')
        .forEach((el) => {
        if(el){
            document.removeEventListener("click", handleClick);
            el.remove();
        }
    });
}