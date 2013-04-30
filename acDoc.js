// 2013-04-24 17:46
//	acDoc ; 문서화 관련 루틴들
//	1. 기본적으로 텍스트 기반 편집기 기능을 구현한다.

global.acDoc = {
	documents : {
		version : '0.1.0',
		update : [
			{	date : '2013-04-30',
				version : '0.1.0',
				programmer : 'lifetree98@9groove.co.kr',
				issue : [
					'1) 소스 자체를 간소화게 유지하면서, 필요로 하는 문서 구조를 구성할 수 있는가?',
					'2) 자바스크립트 소스를 문서버전/개발버전/빌드버전/최소버전으로 일관성있게 관리할 수 있는가?',
					'3) 개발 과정 전체를 로그/히스토리/트랙으로 통괄할 수 있는가?',
				],
			},
		],
		object : {
			name : 'acDoc',
			type : 'static object',
			aim : '자바스크립트 소스를 개발하면서, 동시에 문서화를 진행하기 위한 도구이다',
		},
		members : [
			{	name : 'option',
				type : 'static object',
				help : '최근에 불러온 문서의 타입을 기록하고 있음',
				example : '{text:1} || {json:1}',
			},
			{	name : 'load',
				type : 'function',
				help : '파일에서 문서를 읽어서 콜백에 전달함',
			},
		],
	},
	option : {},
	load : function(_file, _option, _callback) {
		if (!_callback || (typeof _callback !== 'function' )) return console.log('>> needed callback!');
		option = _option;
		acUtil.fs.readFile(_file, 'utf8', function(err, data) {
			if (err) return console.log(err);
			if (!_option) _option = {text:1};

			var retDoc;
			if (_option['text']) {
				retDoc = data.toString().split('\n');
			}
			else if (_option['json']) {
				retDoc = eval('(' + data.toString() + ')');
			}
			else {
				retDoc = data.toString();
			}
			console.log('>> loaded : ', _file);
			_callback(retDoc);
		});
	},
	save : function(_file, _doc) {
		var j2s = acUtil.JSONtoString;
		var data = j2s(_doc);
		acUtil.fs.writeFile(_file, data, 'utf8', function(err) {
			if (err) return console.log(err);
			return console.log('>> saved : ', _file);
		});
	},
	addNode : function(_doc) {

	},
	find : function(_doc, _query) {
		for(p in _query) {
			var value = _doc[p];
			//if (_query[p] == value)
			if (value) return _doc[p];
		}
	},
}