// javascript shell for client
// 2013-04-11 16:39
//	1) 명령어 라인 입력에 대해서 javascript 로 처리한다.
//	2) 명령어 라인 입력에 대해서 log 를 파일에 기록한다.

global.acRL = require('../_ac/acReadLine').acReadLine;

var log_file = 'manager_client.log';

// acUtil.logFile 을 사용하기 위해, 서브모듈 로딩처리
acUtil.loadSubModule(function() {
	acUtil.logFile('start log :' + new Date(), log_file);
	acRL.prompt();
});


// 04	콘솔 명령어라인 구조 실행
acRL.startCMD('JSS> ', function(line) {
	if (line.length < 1) return;

	acUtil.logFile(line, log_file);
	// javascript shell 을 위한 평가루틴
	//var obj = eval('(' + line + ')');
	var obj = eval(line);
	//if (typeof obj === 'function') return obj();
	// 함수명만 입력한 경우에, 함수 소스를 출력
	if (typeof obj === 'function') return console.log(line + ' =', obj.toString());
	else if (obj) return console.log(obj);
	//else if (obj != 'undefined') return console.log(obj);
});
