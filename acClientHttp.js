global.acClientHttp = {
	reqInfo : {
		name : 'http',
		host : 'localhost',
		port : 80,
		path : '/',
		method : 'GET',
	},
	reqPT : null,
//	{
//		pt : '/test',
//		ps : '0',
//	},
	setHost : function (_ip, _port) {
		acClientHttp.reqInfo.host = _ip;
		acClientHttp.reqInfo.port = _port;
	},
	setPath : function (_path) {
		acClientHttp.reqInfo.path += _path;
	},
	setPT : function (_pt) {
		acClientHttp.reqPT = _pt;
	},
	request : function (_ip, _port, _path, _postData, _callback) {
		var info = acClientHttp.reqInfo;
		var path = info.path;
		if (acClientHttp.reqPT) {
			path = JSON.stringify(acClientHttp.reqPT);
		}
		if (_path) path = _path;
		if (_ip) info.host = _ip;
		if (_port) info.port = _port;
		if (_postData) info.method = 'POST';
		else _postData = '';
		var httpClient = new acUtil.acHttpClient();
		httpClient.start(info.name,	info.host, info.port, path,
							info.method, _postData,
			function(chunk) {
				if (_callback) _callback(chunk);
				else console.log(chunk);
		});
	},
	init : function() {
		acClientCmd.add('setHost', acClientHttp.setHost);
		acClientCmd.add('setPath', acClientHttp.setPath);
		acClientCmd.add('setPT', acClientHttp.setPT);
		acClientCmd.add('request', function(_ip, _port, _path, _postData) {
			//console.log(params);
			acClientHttp.request(_ip, _port, _path, _postData, function(_chunck) {
				console.log(_chunck);
				acRL.prompt();
			});
		});
	},
};

// http client
acClientHttp.init();
