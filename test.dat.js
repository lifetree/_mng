//"한글과 더블따옴표 테스트"
global.http_rage = {
	host : '14.63.224.251',
	port : 80,
	init : function() {
		acClientCmd.add('http_rage_server_start', http_rage.start);
		acClientCmd.add('http_rage_server_restart', http_rage.restart);
		acClientCmd.add('http_rage_server_update', http_rage.update);
	},
	start : function() {
		/*
		http://localhost:111/start
		post : [
			{ path:'../rage_rage',	script:'config_rage_login_httpserver.js' },
			{ path:'../rage_rage',	script:'config_rage_channels_httpserver.js' },
			{ path:'../rage_rage',	script:'config_rage_gamedata_httpserver.js' },
			{ path:'../rage_rage',	script:'config_rage_lobby_socket.js' },
		]
		*/
	},
	restart : function() {
	},
	update : function() {
		/*
		post : {
			path:'',
			file:'',
			size:0,
			data:buffers,
		}
		*/
	},
	test : function() {
		var post = {
			path:'',
			file:'',
			size:0,
			data:null,
		};
		var fs = acUtil.fs;
		var file = 'http_rage.js';
		fs.readFile(file, 'binary', function(err, data) {
			post.path = './';
			post.file = file;
			post.size = data.length;
			post.data = data;
			var data2 = JSON.stringify(post);

			post2 = JSON.parse(data2);

			fs.writeFile('test.dat', post2.data, 'binary', function(err) {
				console.log(err);
			});
		});
	},
};

http_rage.init();
