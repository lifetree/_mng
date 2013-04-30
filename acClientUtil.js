global.acClientUtil = {
	help : {
		cmdList : [],
		push : function(_cmd) {
			if (!_cmd) return;
			acClientUtil.help.cmdList.push(_cmd);
		},
		print : function() {
			console.log(acClientUtil.help.cmdList);
		},
		init : function() {
			acClientUtil.help('convertString');
			acClientUtil.help('removeZero');
		},
	},
	//	스페이스(' ')로 구분하여 만들어진 배열에 대해서,
	//	' 또는 " 으로 문자열로써 지정한 구분을 찾아서,
	//	하나의 문자열로 구성하는 함수
	convertString : function (lines, delimit) {
		var si = -1;
		var ei = -1;
		if (!delimit) delimit = '"\'';
		for (n in lines) {
			var len = lines[n].length;
			var checki = 0;
			if (si > -1) checki = len - 1;
			var check = delimit.match(lines[n][checki]);
			//console.log(check);
			if (!check) continue;
			//if (si==-1 && (lines[n][0] == '\'' || lines[n][0] == '"')) {
			if (si==-1 && (check.length > 0)) {
				//console.log(lines[n]);
				si = n;
				continue;
			}
			//else if (si>-1 && (lines[n][len-1] == '\'' || lines[n][len-1] == '"')) {
			else if (si>-1 && (check.length > 0)) {
				//console.log(lines[n]);
				ei = n;
				var str = '';
				for (i = si; i < ei; ++i) {
					str += (lines[i] + ' ');
				}
				str += lines[ei];
				lines.splice(si, ei-si+1, str);
				//console.log(str);
				//console.log(lines);
			}
		}
	},
	removeZero : function (lines) {
		for (n in lines) {
			var len = lines[n].length;
			if (len == 0) {
				lines.splice(n, 1);
				//n = 0;
				removeZero(lines);
			}
		}
	}
};