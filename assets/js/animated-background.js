// 动画背景
$(document).ready(function() {

	var interval = 10000; // 背景改变周期 单位毫秒
	var index = 0;        // 主题索引
	var bgcolors = ["#00c1ff", "#49dd84", "#ff5a3d", "#ffac3f", "#2b7cd3", "#ff8864", "#45ada8"];
	var theme = [
		["#002c4a", "#005584"],
		["#35ac03", "#3f4303"],
		["#ac0908", "#cd5726"],
		["#18bbff", "#00486b"]
	];
	var bgObj;

	// FSS
	/*bgObj = new FSS("vector-container", "vector-output");
	bgObj.setMesh("#525252", "#ffffff");
	bgObj.setLight(theme[0][0], theme[0][1]);
	setInterval(function() {
		//$("body").css("background", bgcolors[index]);
		//index = (index + 1) % bgcolors.length;
		var start = theme[index];
		index = (index + 1) % theme.length;
		var end = theme[index];
		Effect.color("vector", start, end, 1, function(color) {
			bgObj.setLight(color[0], color[1]);
		});
	}, interval);*/

	// Victor
	bgObj = new Victor("vector-container", "vector-output");
	setInterval(function() {
		var start = theme[index];
		index = (index + 1) % theme.length;
		var end = theme[index];
		Effect.color("vector", start, end, 1, function(color) {
			bgObj(color).set();
		});
	}, interval);

	// 自动适应窗口
	/*$(window).off("resize").resize(function() {
		$("#output > canvas").css({
			width: $(window).width(),
			height: $(window).height()
		});
		bgObj.setMesh("#525252", "#ffffff");
	});*/

});
