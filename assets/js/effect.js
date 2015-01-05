var Effect = {};
Effect.coloranimatebuff = {};
Effect.color = function(element, _start, _end, speed, callback){
	var speed=speed||10;
	var start = [], end = [];
	if(Effect.coloranimatebuff[element]) clearInterval(Effect.coloranimatebuff[element]);
	if(typeof _start[0] == "object") {
		coloropt = _start.slice();
		for(var i=0; i<_start.length; ++i) {
			start.push(coloropt[i][0]);
			end.push(Effect.hex2RGB(coloropt[i][1]));
		}
		callback = speed;
		speed = _end;
	} else {
		for(var i=0; i<_start.length; ++i) {
			start = _start.slice();
			end.push(Effect.hex2RGB(_end[i]));
		}
	}

	Effect.coloranimatebuff[element] = setInterval(function() {
		var i = 0;
		for(i=0; i<start.length; ++i) {
			var	index = 3, color = Effect.hex2RGB(start[i]);
			while(index--)
				color[index] = getEnd(color[index], end[i][index], speed);
			start[i] = Effect.RGB2hex(color);
		}
		if(callback) callback(start);
		if(start.toString() == end.toString()) clearInterval(Effect.coloranimatebuff[element]);
	}, 10);
};

Effect.RGB2hex = function(color){//例Effect.RGB2hex([255, 0, 0])  返回 #FF0000
	function tmp(index){
		var	tmp = color[index].toString(16);
		return tmp.length == 1 ? "0" + tmp : tmp;
	}
	if(typeof color[0] == "string") return color;
	return "#" + tmp(0) + tmp(1) + tmp(2);
};
Effect.hex2RGB = function(color){//例Effect.RGB2hex("#FF0000")  返回 [255, 0, 0]
	function tmp(index){
		return color.charAt(index);
	}
	if(typeof color == "object") return color;
	color = color.substring(1);
	if(color.length == 3)
		color = tmp(0) + tmp(0) + tmp(1) + tmp(1) + tmp(2) + tmp(2);
	return [parseInt(tmp(0) + tmp(1), 16), parseInt(tmp(2) + tmp(3), 16), parseInt(tmp(4) + tmp(5), 16)];
};

function getEnd(x, y, speed){
	return x < y ? Math.min(x + speed, y) : Math.max(x - speed, y);
}
