/**
 * 生成字符头像
 * @param name 字符
 * @param size 大小
 * @param color 颜色
 * @returns 
 */
export function letterAvatar (name:string, size:number, color?:string) {
	name  = name || '';
	size  = size || 60;
	var colours = [
			"#eccc68", "#ff7f50", "#ff6b81", "#ffa502", "#747d8c", "#ff4757", "#7bed9f", "#70a1ff", "#8e44ad", "#2ed573", 
			"#1e90ff", "#a4b0be", "#ff6348", "#ff9ff3", "#f368e0", "#48dbfb", "#badc58", "#6ab04c", "#0fbcf9", "#f9ca24"
		],
		nameSplit = String(name).split(' '),
		initials, charIndex, colourIndex, canvas:any, context:any, dataURI;
	if (nameSplit.length == 1) {
		initials = nameSplit[0] ? nameSplit[0].charAt(0):'?';
	} else {
		initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
	}
	if (window.devicePixelRatio) {
		size = (size * window.devicePixelRatio);
	}
	
	
	charIndex     = (initials == '?' ? 72 : initials.charCodeAt(0)) - 64;
	colourIndex   = charIndex % 20;
	canvas        = document.createElement('canvas');
	canvas.width  = size;
	canvas.height = size;
	context       = canvas.getContext("2d");
	 
	//偏移
	var offset = 0;
	if(/^[\u4E00-\u9FA5]+$/.test(initials)){ //如果是中文
		offset = 1;
	}
	context.fillStyle = color ? color : colours[colourIndex - 1];
	context.fillRect (0, 0, canvas.width, canvas.height);
	context.font = Math.round(canvas.width/2)+"px Arial";
	context.textAlign = "center";
	context.fillStyle = "#FFF";
	context.fillText(initials, (size / 2)+offset, (size / 1.5)+offset);
	dataURI = canvas.toDataURL();
	canvas  = null;
	return dataURI;
}