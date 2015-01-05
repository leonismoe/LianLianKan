// 连连看核心代码
var LLK = (function() {

	var columns      = 12;     // 每行方块数
	var rows         = 6;      // 行数
	var rowwidth     = 850;    // 一行宽度 单位像素
	var rowwidthunit = "px";   // 宽度单位

	var countdown    = 300;    // 倒计时 单位秒
	var timenotify   = 10;     // 剩余几秒时播放时间将结束声效
	var score        = 0;      // 游戏得分
	var allowedge    = true;   // 默认是否允许越过边界连线 地图自身的设置优先

	var musicvolumn  = 50;     // 音乐音量
	var soundvolumn  = 50;     // 声效音量

	var imagepath    = "assets/image/icons/"; // 图像所在目录
	var imageext     = ".png"; // 图像后缀
	var imagebegin   = 1;  // 起始编号
	var imageend     = 27; // 终止编号
	var imagelength  = 1;  // 编号长度
	var blocktpl     = '<div class="column"><span class="waves-effect waves-float"><img src="{path}" class="ui fluid bordered image"></span></div>'; // 普通方块HTML模板
	var blanktpl     = '<div class="column"><span></span></div>'; // 空白方块HTML模板

	// 地图模板
	var maptpls = [
		{
			name: "测试地图",
			width: 12,
			height: 8,
			allowedge: true,
			data: "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
		}, {
			name: "ILOYEYOU",
			width: 19,
			height: 11,
			data: "11101000110010101110100100100101010100010010010010101011101001001001001001001110110011000100111000000000000000000010001001100100100000101001001010010000001000100101001000000100010010100100000010000110001100010"
		}, {
			name: "QQ2004",
			width: 19,
			height: 11,
			data: "01110001110001000111000101000100100110100010100010010110010011010011001110000111100111100111111000000000000000000001100011000110000101001010010100100110001001001010010101001000100101001011111111001100011000010"
		}, {
			name: "TM",
			width: 19,
			height: 11,
			data: "11111111101100000111111111110111000111000111000011110111100011100001111111110001110000110111011000111000011001001100011100001100000110001110000110000011000111000011000001100011100001100000110001110000110000011"
		}, {
			name: "翅膀",
			width: 19,
			height: 11,
			data: "11111111111111000000111110000011110000000111111100001100000000011111111111100000000000111111110000000000000000111100000000001111111100000001111111111110000111111110001100001111100000011100001111111111111100000"
		}, {
			name: "格调",
			width: 19,
			height: 11,
			data: "00000000000000000000000111110111110000000111111011111100000111111000111111000111111000001111110000000000000000000001111110000011111100011111100011111100000111111011111100000001111101111100000000000000000000000"
		}, {
			name: "火炬",
			width: 19,
			height: 11,
			data: "11111000000000111111111110000000111111011111100000111111000111110000011111000000000000000000000000000000000000000001110101010101011100001010101010101000000110101010101100000001111111111100000000000001000000000"
		}, {
			name: "三角",
			width: 19,
			height: 11,
			data: "00001000000001000000001110000001110000001111100001111100001111111001111111000000000000000000000000000000000000000001111111001111111000011111000011111000000111000000111000000001000000001000000000000000000000000"
		}, {
			name: "天池",
			width: 19,
			height: 11,
			data: "00000000110010000000011111101101111100010110001110101011001110000000100111100101100000000100110011010000000111001001010000000000010100111001010001000110011011101001011011000111110111100001000000000101000000000"
		}, {
			name: "小象",
			width: 19,
			height: 11,
			data: "00000000000000000000010011111011001000011100001111101010000110001101011001000001101000000111010011010100101001101001100000000000011100110000000010000110010110001001100011000111111011111110000000000000000000000"
		}, {
			name: "友谊",
			width: 19,
			height: 11,
			data: "00011111111111111100011111111111111111001100000000000000000110011111111110000011001111111111100001100000000000110000111111111110011000001111111111001100000000000000000110011111111111111111000111111111111111000"
		}, {
			name: "007",
			width: 19,
			height: 11,
			data: "00100000100000100010111000111000111001111110111110111110111111011111011111010111000111000111001001000001000001000100000000000000000010110001100111101111100101001000010011110010100100010000110110001100010000001"
		}, {
			name: "QQ",
			width: 19,
			height: 11,
			data: "00111110000011111000111111100011111110111000111011100011111000001101100000111100000110110000011110000011011000001111000001101100000111100010110110001011111000111011100011101111111000111111100011111010001111101"
		}, {
			name: "QQGAME",
			width: 19,
			height: 11,
			data: "01100011001111000001001010010000000000100101001011111110010110101100000000000111001110111111111000000000000000000001100010010001011111000001001101101000101101010111110111110010111010101010000111010101000101111"
		}, {
			name: "YERYGOOD",
			width: 19,
			height: 11,
			data: "10001011101111010011000101000100101001110110111011100011001110010001001001100010001110100100110000000000000000000001110011000110011101000010010100101001101101001010010100110010100101001010010111001100011001110"
		}, {
			name: "窗外",
			width: 19,
			height: 11,
			data: "11110000011000011111110000011110000111110000011111100001110000011100111000010000011100001110000111000000000000011100000111000011100001000001110011100001110000011111100001111100000111100001111111000001100001111"
		}, {
			name: "飞船",
			width: 19,
			height: 11,
			data: "01100000011111000111100111111000010011100111100000000000000111111000111011000111001110110000010111000011111000001101110011101100000100011111100011101100100111100000000000011001111110000100110110000001111100011"
		}, {
			name: "飞翔",
			width: 19,
			height: 11,
			data: "01000011101110000100110001110111000110001100011111000110000011000111000110001000110001000110001110001100000110001110001100010001100010001100011100011000001100011111000110001100011101110001100100001110111000010"
		}, {
			name: "黑洞",
			width: 19,
			height: 11,
			data: "00111111101111111000111111100011111110111111100000111111111111100000001111111111100000000011111000000000000000000011111000000000111111111110000000111111111111100000111111101111111000111111100011111110111111100"
		}, {
			name: "蝴蝶",
			width: 19,
			height: 11,
			data: "11111100000001111111110001000001000111011100110001100111000111011101110111000001111100011111000000011100000111000000011111000111110000011101110111011100011100110001100111011100010000010001111111110000000111111"
		}, {
			name: "花蕾",
			width: 19,
			height: 11,
			data: "10000000111000000010101111110111111010001110111011101110000110011101110011000011011100011101100000000000000000000000110111000111011000011001110111001100001110111011101110001011111101111110101000000011100000001"
		}, {
			name: "混乱",
			width: 19,
			height: 11,
			data: "01000001000000110001110011111001001010010011101101110100000011100010010011111111100100100011000100010111011011001000100001001111001110111010001000110010001001111001001100010001111001110111111101111000010001001"
		}, {
			name: "甲虫",
			width: 19,
			height: 11,
			data: "00011111111111111110101100001000100101100110000100010010110111000010001001011111100001000100101011111111111111111111111000010001001011011100001000100101100110000100010010101011000010001001010001111111111111111"
		}, {
			name: "举重",
			width: 19,
			height: 11,
			data: "01111011111110111100111001111111001110011000000000000011001000000000000000100110000000000000110011100111111100111001111011101110111100111111100011111110011111100000111111001110000000000011100111110111110111110"
		}, {
			name: "迷宫",
			width: 19,
			height: 11,
			data: "00000000000000000000001111111101111110011100001000011001001000011000011000100100011001000110010000001101111010000001000010010000001100110001100001100110011100001110011001000110011101001111100000000000000000000"
		}, {
			name: "男女",
			width: 19,
			height: 11,
			data: "00011000000011110000011110000011111100011111100011111111011011011000111111000001100000001111000000110000000011000000111100001111111100111111000111111110111111110000011000001111110000001100000011110000000110000"
		}, {
			name: "数字",
			width: 19,
			height: 11,
			data: "00101110111010101110010001000101010100001011101110111011100101000001000100010010111011100010111000000000000000000011101110111011101111000101010101010101111000101110111010110100010101000101011110001011101110111"
		}, {
			name: "水管",
			width: 19,
			height: 11,
			data: "11111111111111111110000000001100000000111111111111111111100000000000000000001111111011110111111000000000110000000011111110111101111110000000000000000000111111111111111111100000000011000000001111111111111111111"
		}, {
			name: "四方",
			width: 19,
			height: 11,
			data: "00000000000000000000110110110110110110011011011011011011000000000000000000000110110110110110110011011011011011011000000000000000000000110110110110110110011011011011011011000000000000000000000000000110110000000"
		}, {
			name: "腾讯",
			width: 19,
			height: 11,
			data: "10111011101001011111001001000110101111100100111011110111110010010001011011111001001110100101111100000000000000000010011011101001011101010001000110100100101000111011110010010100010001011001001001101110100100100"
		}, {
			name: "万相",
			width: 19,
			height: 11,
			data: "01111111111111111111101110111011101110100010001000100010011011101110111011100111011101110111011001000100010001000101110111011101110111101110111011101110100010001000100010011011101110111011101111111111111111111"
		}, {
			name: "乡路",
			width: 19,
			height: 11,
			data: "01000000001100000000111111110110011111011110001010001110001100001110001110010110000000000110011011001111110110011001100000001011011110010001000100001010000011100011100111100111111100111000011110000010011000001"
		}, {
			name: "小屋",
			width: 19,
			height: 11,
			data: "00000000000000000000011000000000100000001100000000111000001111000000111110000111100000111011100111111000111010111011111100111111111110011000000101010100001100000010101010000110001111111111111111111111111111111"
		}, {
			name: "星光",
			width: 19,
			height: 11,
			data: "00010000010000010000011100011100011100011111011111011111000111000111000111000001000001000001000000000000000000000001101101101101101100100010100010100010000100000100000100001000101000101000100110110110110110110"
		}, {
			name: "耀眼",
			width: 19,
			height: 11,
			data: "00010000010000010000011100011100011100011111011111011111011111111111111111110111110111110111110001110001110001110000010000010000010000000000000000000000000100000100000100000111000111000111000111110111110111110"
		}, {
			name: "子弹",
			width: 19,
			height: 11,
			data: "00000000000000000000001001111111001000001101111011110110001110111000111011100111011000001101110010101100000110101001110110000011011100111011100011101110001101111011110110000010011111110010000000000000000000000"
		}, {
			name: "走廊",
			width: 19,
			height: 11,
			data: "11111111111111111101100111001110011100100001000010000100010000100001000010001100111001110011100111111111111111111100111001110011100110001000010000100001000100001000010000100111001110011100111111111111111111111"
		}, {
			name: "都市",
			width: 19,
			height: 11,
			data: "00100000000000000000010000000001100110011100000011110011101110010001111101111111101100111110111101010111011011010111111010101111101111101101110101110111111110111011101110111111011101111111111111111110111111111"
		}, {
			name: "方阵",
			width: 19,
			height: 11,
			data: "00000000000000000000110111101110110110011011110111011011000010000100010000000110111101110110110011011110111011011001101111011101101100001000010000000000011011110111011011001101111011101101100000000000000000000"
		}, {
			name: "海浪",
			width: 19,
			height: 11,
			data: "10011001100110011000011001100110011001011001100110011001111001100110011001101001100110011001100001100110011001100101100110011001100111100110011001100110100110011001100110000110011001100110010110011001100110011"
		}, {
			name: "花蝶",
			width: 19,
			height: 11,
			data: "11111100000001111111111111001001111111011111110001111111000111111101111111000001111110111111000000000000100000000000011111101111110000011111110111111100011111110001111111011111110000011111111111110000000111111"
		}, {
			name: "花样",
			width: 19,
			height: 11,
			data: "11110111101100001111111111110111001111011000110001111110100110110010011110010001110011100110001000000011111000000100011100111001100010011111001001111001011000110001111110111111111101110011111111111110110000111"
		}, {
			name: "坚固",
			width: 19,
			height: 11,
			data: "10000000010000000010111111110111111110011111111011111111001111111101111111100111111110111111110100000000000000000101111111101111111100111111110111111110011111111011111111001111111101111111101000000001000000001"
		}, {
			name: "绝望",
			width: 19,
			height: 11,
			data: "00000000000000000000111111111111111110011111111111111111001111111111111111100111111111111111110011111111011111111001111111111111111100111111111111111110011111111111111111001111111111111111100000000000000000000"
		}, {
			name: "迷宫",
			width: 19,
			height: 11,
			data: "11111111111111111111000011000100010001101101101010101010100110000101010101011111111110101010101100000000010101010110111111111010101011000000100001010101111111010111101010110000000010000000011111111111111111111"
		}, {
			name: "棋盘",
			width: 19,
			height: 11,
			data: "10101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010001010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101"
		}, {
			name: "圣洁",
			width: 19,
			height: 11,
			data: "11111111111111111110111111100011111110001111100100111110010011110111011110011100111001001110011111001110001110011111110011111110011111111100111110011111111111000000011111111111110000011111111111111100011111111"
		}, {
			name: "路口",
			width: 19,
			height: 11,
			data: "00000000000000000000011111110111111100011111111011111111001111111101111111100111111100011111110000000000000000000001111111000111111100111111110111111110011111111011111111000111111101111111000000000000000000000"
		}, {
			name: "围墙",
			width: 19,
			height: 11,
			data: "11111111111111111111000000000000000001101111111111111110110100000000000001011010111111111100101101010000000000010110101111111111111011010000000000000001101111111111111111110000000000000000001111111111111111111"
		}, {
			name: "心连",
			width: 19,
			height: 11,
			data: "11000000000000000111000010000000100001000011100000111000000011111000111110000011111110111111100011111111111111111000111111101111111000001111100011111000000011100000111000010000100000001000011100000001000000011"
		}, {
			name: "旋涡",
			width: 19,
			height: 11,
			data: "11001001111100100111001001000001001001101001001110010010110101001000100101011010101001001010101101010101010101010110101010010010101011010100100010010101101001001110010010110010010000010010011100100111110010011"
		}
	];

	var bgmusic;
	var selectsound;
	var matchsound;
	var startsound;
	var endsound;
	var exp1sound;
	var exp2sound;
	var timenotifysound;

	var curmap;
	var mapname;
	var path;
	var totalblocks;
	var blocksidelen;
	var halfsidelen;
	var gameplaying  = false;
	var prevselected = -1;
	var blockcache   = [];
	var pathContainer;
	var pathFilter;
	var pathGradient;

	var _allowedge;
	var _countdown;
	var _countdowninterval;

	// 初始化
	function init() {
		initSounds();
		initCountdown();
		initMisc();
	}

	// 加载背景音乐与声效
	function initSounds() {
		soundManager.setup({
			url: 'assets/thirdparty/',
			onready: function() {
				bgmusic = soundManager.createSound({
					id: 'bgmusic',
					url: 'assets/music/bg.mp3',
					autoLoad: true,
					autoPlay: window.localStorage && window.localStorage.nobgmusic==="1" ? false : true,
					onload: function() {},
					volume: musicvolumn,
					loops: 999999
				});
				selectsound = soundManager.createSound({
					id: 'selectsound',
					url: 'assets/sound/sel.wav',
					autoLoad: true,
					autoPlay: false,
					volume: soundvolumn
				});
				matchsound = soundManager.createSound({
					id: 'matchsound',
					url: 'assets/sound/elec.wav',
					autoLoad: true,
					autoPlay: false,
					volume: soundvolumn
				});
				startsound = soundManager.createSound({
					id: 'startsound',
					url: 'assets/sound/start.wav',
					autoLoad: true,
					autoPlay: false,
					volume: soundvolumn
				});
				endsound = soundManager.createSound({
					id: 'endsound',
					url: 'assets/sound/end.wav',
					autoLoad: true,
					autoPlay: false,
					volume: soundvolumn
				});
				exp1sound = soundManager.createSound({
					id: 'exp1sound',
					url: 'assets/sound/exp1.wav',
					autoLoad: true,
					autoPlay: false,
					volume: soundvolumn
				});
				exp2sound = soundManager.createSound({
					id: 'exp2sound',
					url: 'assets/sound/exp2.wav',
					autoLoad: true,
					autoPlay: false,
					volume: soundvolumn
				});
				timenotifysound = soundManager.createSound({
					id: 'timenotifysound',
					url: 'assets/sound/timenotify.wav',
					autoLoad: true,
					autoPlay: false,
					volume: soundvolumn,
					loops: 999
				});
			}
		});
	}

	// 初始化游戏方块
	function initBlocks() {
		$(".game-container .ui.grid > .column > span").mousedown(function() {
			if(!gameplaying) return;
			selectsound.play();
		}).click(selectHandler);

		Waves.displayEffect({ duration: 250 });
		$("#mapname").text(mapname);
	}

	// 初始化倒计时
	function initCountdown() {
		$("#countdown").progress({
			percent: 100,
			label: false
		});
	}

	// 初始化 SVG 元素布局
	function initPathContainer() {
		$(".game-wrapper").css("margin", blocksidelen + rowwidthunit);
		$("#path-container").css({
			width  : (rowwidth + 2 * blocksidelen) + rowwidthunit,
			height : $(".game-container .ui.grid").height() + 2 * blocksidelen,
			left   : $(".game-wrapper").offset().left - blocksidelen
		});
	}

	// 其他杂项初始化
	function initMisc() {
		$("[data-content]").popup();

		$("#fullscreen").click(function() {
			toggleFullscreen();
		});
		$("#toggle-music").click(function() {
			try {
				window.localStorage.nobgmusic = window.localStorage.nobgmusic==="1" ? "0" : "1";
				return window.localStorage.nobgmusic==="0" ? bgmusic.play() : bgmusic.pause();
			} catch(e) {
				return bgmusic.paused ? bgmusic.play() : bgmusic.pause();
			}
		});

		$("#play-game, #new-game").click(function() {
			playGame();
		});

		$("#refresh-game").click(function() {
			refreshGame();
		});

		$("#sidebar").sidebar({
			transition       : 'uncover',
			mobileTransition : 'uncover'
		});
		$('.launch.button, .launch.item').on('click', function(event) {
			$("#sidebar").sidebar('show');
			event.preventDefault();
		});

		pathContainer = Snap("#path-container");
		pathFilter = pathContainer.filter(Snap.filter.shadow(0, 0, 6));
		pathGradient = pathContainer.gradient("L(0, 0, 999, 999)#000-#f00-#fff");
	}

	// 点击方块时的事件处理
	function selectHandler() {
		var index = $(".game-container .ui.grid > .column > span").index($(this));

		if(prevselected == -1) { // 之前没有已选择的方块
			prevselected = index;
			return $(this).addClass("selected");
		}

		if(prevselected == index) { // 所选方块与上次相同
			prevselected = -1;
			return $(this).removeClass("selected");
		}

		if(canEliminate(prevselected, index)) {
			increaseScore();
			updateBlocksRemainingCount(prevselected, index);
			$(".game-container .ui.grid > .column > span").removeClass("selected").filter(":eq("+prevselected+"), :eq("+index+")").off().transition("horizontal flip out");
			drawPath();
			exp1sound.play();
			exp2sound.play();
			matchsound.play();
			prevselected = -1;
		} else {
			//$(".game-container .ui.grid > .column > span").removeClass("selected").filter(":eq("+prevselected+"), :eq("+index+")").filter(index>prevselected ? ":eq(1)" : ":eq(0)").addClass("selected").prevObject.transition("tada");
			//prevselected = index;
			$(".game-container .ui.grid > .column > span").removeClass("selected").filter(":eq("+prevselected+"), :eq("+index+")").transition("tada");
			prevselected = -1;
		}
	}

	// 根据模板生成游戏地图
	// int  tpl     模板索引
	// bool refresh 是否重排
	function generateMap(tpl, refresh) {
		if(refresh) {
			fisherYates(blockcache);
			fisherYates(blockcache);
			return blockcache;
		}

		curmap     = tpl;
		mapname    = maptpls[tpl].name;
		columns    = maptpls[tpl].width;
		rows       = maptpls[tpl].height;
		_allowedge = maptpls[tpl].hasOwnProperty("allowedge") ? maptpls[tpl].allowedge : allowedge;

		var mapdata  = maptpls[tpl].data;
		var size     = columns * rows;
		var mapsize  = mapdata.match(/1/g).length;
		var halfsize = mapsize / 2;
		var imgrange = imageend - imagebegin + 1;
		var tmpblock = [];
		var tmpstr   = "";
		totalblocks  = mapsize;

		var i = 0;
		for(i=0; i<halfsize; ++i) tmpstr += "," + Math.ceil(imgrange * Math.random());
		tmpstr = (tmpstr + tmpstr).substr(1);
		tmpblock = tmpstr.split(",");

		fisherYates(tmpblock);
		fisherYates(tmpblock);

		blockcache = [];
		for(i=0; i<size; ++i) {
			blockcache.push(mapdata.charAt(i)=="1" ? parseInt(tmpblock.shift()) : 0);
		}
		return blockcache;
	}

	// 判断指定的两个方块是否可消除
	function canEliminate(a, b) {
		var ca, cb;

		if(a.constructor === Object) {
			ca = $.extend({}, a);
			cb = $.extend({}, b);
			a = coordinate2index(a);
			b = coordinate2index(b);
		} else {
			ca = index2coordinate(a);
			cb = index2coordinate(b);
			path = [];
			path.push(a);
		}
		if(blockcache[a] && blockcache[b] && blockcache[a] !== blockcache[b]) return false;

		if(ca.x === cb.x || ca.y === cb.y) // 两方块位于同一直线上
			if(canEliminate.singleline(a, b, ca, cb)) return true;

		// 一个拐角
		if(canEliminate.doubleline(a, b, ca, cb)) return true;
		// 两个拐角
		if(canEliminate.tripleline(a, b, ca, cb)) return true;
		return false;
	}
	canEliminate.singleline = function(a, b, ca, cb) {
		if(a.constructor === Object) {
			ca = $.extend({}, a);
			cb = $.extend({}, b);
			a = coordinate2index(a);
			b = coordinate2index(b);
		} else if (!ca || !cb) {
			ca = index2coordinate(a);
			cb = index2coordinate(b);
		}

		var delta = ca.x === cb.x ? columns : 1, i;
		if(a > b) {
			for(i=a-delta; i>b; i-=delta) {
				path.push(i);
				if(blockcache[i]) return false;
			}
		} else {
			for(i=a+delta; i<b; i+=delta) {
				path.push(i);
				if(blockcache[i]) return false;
			}
		}
		path.push(b);
		return true;
	};
	canEliminate.doubleline = function(a, b, ca, cb) {
		var	cc = $.extend({}, ca), cd = $.extend({}, ca);
		cc.x = cb.x;
		cd.y = cb.y;
		if(!blockcache[coordinate2index(cc)] && canEliminate.singleline(ca, cc) && canEliminate.singleline(cc, cb)) {
			return true;
		} else {
			path = [];
			path.push(a);
			if(!blockcache[coordinate2index(cd)] && canEliminate.singleline(ca, cd) && canEliminate.singleline(cd, cb)) return true;
		}
		return false;
	};
	canEliminate.tripleline = function(a, b, ca, cb, y) {
		var ha = {}, hb = {}, ha_tmp = [], hb_tmp = [], mid, i, t, s;

		if(!y && ca.y !== cb.y) {
			mid = (ca.x + cb.x) / 2;
			s = ca.y * columns;
			t = s + columns;
			for(i=s; i<t; ++i) {
				if(blockcache[i]) continue;
				ha[i - s] = i;
				ha_tmp.push(i - s);
			}

			s = cb.y * columns;
			t = s + columns;
			for(i=s; i<t; ++i) {
				if(blockcache[i]) continue;
				hb[i - s] = i;
				hb_tmp.push(i - s);
			}
		} else {
			y = 1;
			mid = (ca.y + cb.y) / 2;
			var row = 0;
			s = ca.x;
			t = (rows - 1) * columns + s;
			for(i=s; i<=t; i+=columns) {
				if(blockcache[i]) {
					++row;
					continue;
				}
				ha[row] = i;
				ha_tmp.push(row);
				++row;
			}

			row = 0;
			s = cb.x;
			t = (rows - 1) * columns + s;
			for(i=s; i<=t; i+=columns) {
				if(blockcache[i]) {
					++row;
					continue;
				}
				hb[row] = i;
				hb_tmp.push(row);
				++row;
			}
		}

		var intersection = ha_tmp.filter(function(n) {
			return hb_tmp.indexOf(n) > -1;
		});
		intersection = intersection.sort(function(_a, _b) {
			return Math.abs(_a - mid) - Math.abs(_b - mid);
		});
		var _path = [];
		_path.push(a);

		for(i in intersection) {
			t = intersection[i];
			path = _path.slice();
			if(canEliminate.singleline(a, ha[t]))
				if(canEliminate.singleline(ha[t], hb[t]))
					if(canEliminate.singleline(hb[t], b))
						return true;
		}

		if(_allowedge) {
			path = _path.slice();
			if(!y) { // 在纵轴上尝试边缘连线
				if($.inArray(0, intersection) > -1 || ca.x===0 || cb.x===0) {
					t = coordinate2index({x:0, y:ca.y});
					s = coordinate2index({x:0, y:cb.y});
					if((!blockcache[t] || a==t) && canEliminate.singleline(a, t, ca, {x:0})) {
						path.push({x:-1, y:ca.y});
						path.push({x:-1, y:cb.y});
						if((!blockcache[s] || b==s) && canEliminate.singleline(s, b, {x:0}, cb)) return true;
					}
				} else if($.inArray(rows-1, intersection) > -1 || ca.x===columns-1 || cb.x===columns-1) {
					t = coordinate2index({x:columns-1, y:ca.y});
					s = coordinate2index({x:columns-1, y:cb.y});
					if((!blockcache[t] || a==t) && canEliminate.singleline(a, t, ca, {x:columns-1})) {
						path.push({x:columns, y:ca.y});
						path.push({x:columns, y:cb.y});
						if((!blockcache[s] || b==s) && canEliminate.singleline(s, b, {x:columns-1}, cb)) return true;
					}
				}
			} else { // 在横轴上尝试边缘连线
				if($.inArray(0, intersection) > -1 || ca.y===0 || cb.y===0) {
					t = coordinate2index({x:ca.x, y:0});
					s = coordinate2index({x:cb.x, y:0});
					if((!blockcache[t] || a==t) && canEliminate.singleline(a, t, ca, {x:ca.x})) {
						path.push({x:ca.x, y:-1});
						path.push({x:cb.x, y:-1});
						if((!blockcache[s] || b==s) && canEliminate.singleline(s, b, {x:cb.x}, cb)) return true;
					}
				} else if($.inArray(columns-1, intersection) > -1 || ca.y===rows-1 || cb.y===rows-1) {
					t = coordinate2index({x:ca.x, y:rows-1});
					s = coordinate2index({x:cb.x, y:rows-1});
					if((!blockcache[t] || a==t) && canEliminate.singleline(a, t, ca, {x:ca.x})) {
						path.push({x:ca.x, y:rows});
						path.push({x:cb.x, y:rows});
						if((!blockcache[s] || b==s) && canEliminate.singleline(s, b, {x:cb.x}, cb)) return true;
					}
				}
			}
		}

		return y ? false : canEliminate.tripleline(a, b, ca, cb, 1);
	};

	// 索引值换算坐标
	function index2coordinate(index) {
		var x = index % columns, y = parseInt(index / columns);
		return {
			"x": x,
			"y": y
		};
	}

	// 索引值换算坐标
	function coordinate2index(c) {
		return c.x + c.y*columns;
	}

	// 根据已生成的地图数据加载方块
	function loadBlocks(refresh) {
		blocksidelen = rowwidth / columns;
		halfsidelen = blocksidelen / 2;
		var e = $(".game-wrapper").css("width", rowwidth+rowwidthunit).find(".ui.grid"), sidelen = blocksidelen + rowwidthunit;
		e.fadeOut(0).find("> .column").remove();

		for(var i=0; i<blockcache.length; ++i) {
			$(blockcache[i] ? blocktpl.replace("{path}", imagepath+blockcache[i]+imageext) : blanktpl).css("height", sidelen).css("width", sidelen).appendTo(e);
		}

		initBlocks();

		e.fadeIn();

		if(!refresh) {
			initPathContainer();
			updateBlocksRemainingCount();
		}
	}

	// 随机打乱数组
	function fisherYates( array ){
		var count = array.length, randomnumber, temp;
		while( count ) {
			randomnumber = Math.random() * count-- | 0;
			temp = array[count];
			array[count] = array[randomnumber];
			array[randomnumber] = temp;
		}
	}

	// 全屏
	function enterFullscreen() {
		var el = document.documentElement, rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
		rfs.call(el);
	}
	// 退出全屏
	function exitFullscreen() {
		var el = document, cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.msCancelFullscreen;
		cfs.call(el);
	}
	// 判断是否处于全屏状态
	function isFullscreen() {
		return document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitIsFullScreen;
	}
	// 切换全屏状态
	function toggleFullscreen() {
		return isFullscreen() ? exitFullscreen() : enterFullscreen();
	}

	// 开始倒计时
	// bool noreset 是否不用重置倒计时
	function startCountdown(noreset) {
		clearInterval(_countdowninterval);
		if(!noreset) {
			$("#countdown").progress("set percent", 100.0).find(".bar > .progress").text(countdown+"s");
			_countdown = countdown;
			startsound.play();
		}
		_countdowninterval = setInterval(function() {
			_countdown--;
			$("#countdown").progress("set percent", 1.0*_countdown/countdown).find(".bar > .progress").text(_countdown+"s");

			if(_countdown == timenotify) {
				timenotifysound.play();
			} else if(_countdown === 0) {
				gameOver();
			}
		}, 1000);
	}

	// 增加得分
	// int delta 增加的分数 如未指定则自动确定
	function increaseScore(delta) {
		delta = typeof delta=="number" ? delta : getScoreDelta();
		score += delta;
		$("#score").text(score).animation("numchange");
		//$("#score").transition('flash');
	}

	// 获取增加的积分数
	function getScoreDelta() {
		return 10;
	}

	// 更新剩余方块数
	function updateBlocksRemainingCount(prev, curr) {
		if(prev!==undefined && curr!==undefined && prev>-1 && curr>-1) {
			blockcache[prev] = 0;
			blockcache[curr] = 0;
		}
		var count = 0;
		$.each(blockcache, function(i, v) {
			if(v > 0) ++count;
		});
		if($("#remaining-blocks").text() != ""+count) $("#remaining-blocks").text(count).animation("numchange");

		if(count === 0 && prev !== undefined && curr !== undefined) stopGame();
		return count;
	}

	// 连线动画
	function drawPath() {
		var start = path.shift(), pointstr, position, i;
		position = getPositionByIndex(start, true);
		pointstr = "M" + position.x + "," + position.y;
		for(i=0; i<path.length; ++i) {
			if(path[i].constructor === Number) {
				position = getPositionByIndex(path[i], true);
				pointstr += " L" + position.x + "," + position.y;
			} else {
				pointstr += " l";
				pointstr += path[i-1].constructor===Object ? (path[i].x-path[i-1].x)*blocksidelen : (path[i].x===-1 || path[i].x===columns ? (path[i].x>0 ? blocksidelen : -blocksidelen) : 0);
				pointstr += ",";
				pointstr += path[i-1].constructor===Object ? (path[i].y-path[i-1].y)*blocksidelen : (path[i].y===-1 || path[i].y===rows ? (path[i].y>0 ? blocksidelen : -blocksidelen) : 0);
			}
		}
		var p = pathContainer.path(pointstr);
		var l = p.getTotalLength();
		p.attr({
			"fill"   : "none",
			//"stroke" : pathGradient,
			"filter" : pathFilter,
			"stroke-width": 4,
			"stroke-dasharray" : l,
			"stroke-dashoffset": l
		});
		$(p.node).transit({
			"stroke-dashoffset": 0
		}, 330).transit({
			"stroke-dashoffset": -l
		}, 330, function() {
			$(this).remove();
		});
	}

	function getPositionByIndex(i, svg) {
		var delta = svg ? halfsidelen + blocksidelen : halfsidelen;
		var t = $(".game-container .ui.grid > .column:eq(" + i + ")").offset(), w = $(".game-wrapper").offset();

		return {
			x: t.left - w.left + delta,
			y: t.top - w.top + delta
		};
	}

	// 开始游戏
	// int tpl 地图模板索引 如未指定则随机选择
	function playGame(tpl) {
		tpl = tpl===undefined ? Math.floor(maptpls.length * Math.random()) : tpl;
		gameplaying = true;
		generateMap(tpl);
		loadBlocks();
		score = 0;
		increaseScore(0);
		startCountdown();

		$("#play-game").off("click").click(function() {
			pauseGame();
		}).data("content", "暂停游戏").find("i").removeClass("play").addClass("pause");

		$(".game-wrapper").fadeIn();
		$("#vector-container").dimmer('hide');
	}

	// 方块重排
	function refreshGame() {
		if(!gameplaying) return;

		generateMap(curmap, true);
		loadBlocks(true);
	}

	// 暂停游戏
	function pauseGame() {
		if(!gameplaying) return;
		gameplaying = false;

		$("#play-game").off("click").click(function() {
			resumeGame();
		}).data("content", "继续游戏").find("i").removeClass("pause").addClass("play");

		$(".game-wrapper").fadeOut();
		$("#vector-container").dimmer({
			closable: false
		}).dimmer('show');

		timenotifysound.stop();
		clearInterval(_countdowninterval);
	}

	// 继续游戏
	function resumeGame() {
		if(gameplaying) return;
		gameplaying = true;

		$("#play-game").off("click").click(function() {
			pauseGame();
		}).data("content", "暂停游戏").find("i").removeClass("play").addClass("pause");

		$(".game-wrapper").fadeIn();
		$("#vector-container").dimmer('hide');

		if(_countdown <= timenotify) timenotifysound.play();
		startCountdown(true);
	}

	// 停止游戏 方块已全部消除
	function stopGame() {
		gameplaying = false;
		clearInterval(_countdowninterval);
		timenotifysound.stop();
		endsound.play();
		$("#gamepass .content > p").text("游戏结束  您当前已成功消除 " + totalblocks + " 个方块  用时 " + (countdown - _countdown) + "秒  " + "得分 " + score);
		$("#gamepass").modal('show');
		$("#play-game").off("click").click(function() {
			playGame();
		}).data("content", "开始游戏").find("i").removeClass("pause").addClass("play");
	}

	// 时间耗尽 游戏结束
	function gameOver() {
		clearInterval(_countdowninterval);
		gameplaying = false;
		timenotifysound.stop();
		endsound.play();
		$("#gameover .content > p").text("时间耗尽  您当前已成功消除 " + totalblocks + " 中的 " + (totalblocks - updateBlocksRemainingCount()) + " 个方块  用时 " + (countdown - _countdown) + "秒  " + "得分 " + score);
		$("#gameover").modal('show');
		$(".game-container .ui.grid > .column > span").off().removeClass("selected");

		$("#play-game").off("click").click(function() {
			playGame();
		}).data("content", "开始游戏").find("i").removeClass("pause").addClass("play");
	}

	// 自定义动画方法
	$.fn.animation = function(className) {
		return $(this).addClass(className).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			$(this).removeClass(className);
		});
	};

	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	// 纠正 SVG 位置
	$(window).resize(function() {
		initPathContainer();
	});

	// 对外暴露的方法
	return {
		"init"  : init,
		"play"  : playGame,
		"pause" : pauseGame,
		"resume": resumeGame
	};

})();
