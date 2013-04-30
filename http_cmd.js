global.http_cmd = {
	host : 'localhost', //'14.63.224.251',
	port : 111,
	batch : {
		hosts : [],
		files : [],
		filesStart : [],
		indexHost : 0,
		indexFile : 0,
		resetHosts : function() {
			http_cmd.batch.hosts = [];
		},
		addHost : function(_ip, _port) {
			var node = {
				ip : _ip,
				port : _port,
			};
			http_cmd.batch.hosts.push(node);
		},
		resetFiles : function() {
			http_cmd.batch.files = [];
		},
		addFile : function(_srcPath, _srcFile, _desPath, _desFile) {
			var node = {
				spath : _srcPath,
				sfile : _srcFile,
				dpath : _desPath,
				dfile : _desFile,
			};
			http_cmd.batch.files.push(node);
		},
		addFileStart : function(_path, _file, _port) {
			var node = {
				path : _path,
				file : _file,
				port : _port,
			};
			http_cmd.batch.filesStart.push(node);
		},
	},
	init : function() {
		acClientCmd.add('http_cmd_server_start', http_cmd.start);
		acClientCmd.add('http_cmd_server_restart', http_cmd.restart);
		acClientCmd.add('http_cmd_server_update', http_cmd.update);
	},
	start : function(_path, _file, _port, _callback) {
		/*
		http://localhost:111/start
		post : [
			{ path:'../rage_rage',	script:'config_rage_login_httpserver.js' },
			{ path:'../rage_rage',	script:'config_rage_channels_httpserver.js' },
			{ path:'../rage_rage',	script:'config_rage_gamedata_httpserver.js' },
			{ path:'../rage_rage',	script:'config_rage_lobby_socket.js' },
		]
		*/
		var post = {
			path : _path,
			file : _file,
			port : _port,
		};
		var data2 = JSON.stringify(post);
		acClientHttp.request(http_cmd.host, http_cmd.port, '/start', data2, function(chunck) {
			console.log(chunck);
			//acRL.prompt();
			if (_callback) _callback();
		});
	},
	batchStart : function() {
		var hosts = http_cmd.batch.hosts;
		var files = http_cmd.batch.filesStart;
		var ihost = http_cmd.batch.indexHost;
		var ifile = http_cmd.batch.indexFile;
		if (hosts.length == 0) {
			return console.log('no hosts');
		}
		if (files.length == 0) {
			return console.log('no files');
		}

		http_cmd.host = hosts[ihost].ip;
		http_cmd.port = hosts[ihost].port;

		http_cmd.start(files[ifile].path,
						files[ifile].file,
						files[ifile].port,
						function(){
			//http_cmd.batch.indexFile++;
			console.log('>> start:', files[ifile].file);
			ifile++;
			if (files.length == ifile) {
				//return console.log('end files');
				ifile = 0;
				http_cmd.batch.indexFile = ifile;
				ihost++;
				if (hosts.length == ihost) {
					ihost = 0;
					http_cmd.batch.indexHost = ihost;
					return console.log('>> end batchStart');
				}
			}
			http_cmd.batch.indexFile = ifile;
			http_cmd.batch.indexHost = ihost;
			http_cmd.batchStart();
		});
	},
	batchStartStartFromTest : function() {
		http_cmd.batch.resetHosts();
		http_cmd.batch.resetFiles();
		http_cmd.batch.addHost('localhost', 111);
		http_cmd.batch.addFileStart('../rage_rage/', 'config_rage_room_socket.js', 1001);
		http_cmd.batch.addFileStart('../rage_rage/', 'config_rage_room_socket.js', 1002);
		http_cmd.batch.addFileStart('../rage_rage/', 'config_rage_room_socket.js', 1003);
		http_cmd.batch.indexHost = 0;
		http_cmd.batch.indexFile = 0;
		http_cmd.batchStart();
	},
	batchStartStartFromFile : function() {
		http_cmd.batch.resetHosts();
		http_cmd.batch.resetFiles();
		http_cmd.batch.indexHost = 0;
		http_cmd.batch.indexFile = 0;
		var listfile = './start_host_list.json';
		acUtil.fs.readFile(listfile,'utf8',function(err, data) {
			if (err) return console.log('>> error : ', listfile);
			console.log('>> loaded : ', listfile);
			//var list = JSON.parse(data.toString());
			var list = eval('(' + data.toString() + ')');
			http_cmd.batch.hosts = list.hosts;
			http_cmd.batch.filesStart = list.files;
			http_cmd.batchStart();
		});
	},
	restart : function(_callback) {
		acClientHttp.request(http_cmd.host, http_cmd.port, '/restart', '', function(chunck) {
			console.log(chunck);
			//acRL.prompt();
			if (_callback) _callback();
		});
	},
	batchRestart : function() {
		var hosts = http_cmd.batch.hosts;
		var ihost = http_cmd.batch.indexHost;
		if (hosts.length == 0) {
			return console.log('no hosts');
		}

		http_cmd.host = hosts[ihost].ip;
		http_cmd.port = hosts[ihost].port;

		http_cmd.restart(function(){
			//http_cmd.batch.indexFile++;
			console.log('>> restart:', http_cmd.host, http_cmd.port);
			ihost++;
			if (hosts.length == ihost) {
				ihost = 0;
				http_cmd.batch.indexHost = ihost;
				return console.log('>> end batchRestart');
			}
			http_cmd.batch.indexHost = ihost;
			http_cmd.batchRestart();
		});
	},
	batchRestartStartFromTest : function() {
		http_cmd.batch.resetHosts();
		http_cmd.batch.resetFiles();
		http_cmd.batch.addHost('localhost', 111);
		http_cmd.batch.indexHost = 0;
		http_cmd.batchRestart();
	},
	batchRestartStartFromFile : function() {
		http_cmd.batch.resetHosts();
		http_cmd.batch.indexHost = 0;
		var listfile = './restart_host_list.json';
		acUtil.fs.readFile(listfile,'utf8',function(err, data) {
			if (err) return console.log('>> error : ', listfile);
			console.log('>> loaded : ', listfile);
			//var list = JSON.parse(data.toString());
			var list = eval('(' + data.toString() + ')');
			http_cmd.batch.hosts = list.hosts;
			http_cmd.batchRestart();
		});
	},
	update : function(_srcPath, _srcFile, _desPath, _desFile, _callback) {
		if (!_srcPath || !_srcFile || !_desPath || !_desFile) {
			console.log('need : file and path!');
			return;
		}
		var post = {
			path:_desPath,
			file:_desFile,
			size:0,
			data:null,
		};
		// 01 파일 내용을 읽기
		var file = _srcPath + _srcFile; //'http_cmd.js';
		acUtil.fs.readFile(file, 'binary', function(err, data) {
			// 02 파일 내용을 오브젝트 변수에 대입하기
			//post.path = '../_starter_update/';
			//post.file = file;
			post.size = data.length;
			post.data = data;
			// 03 오브젝트를 JSON 문자열로 변환하기
			var data2 = JSON.stringify(post);
			// 04 JSON 문자열을 오브젝트로 환원하기
//			post2 = JSON.parse(data2);
//
			console.log('size : ', post.size);
//			console.log('size : ', post2.data.length);
			// 05 오브젝트 변수(data)의 내용을 파일로 작성하기
			acClientHttp.request(http_cmd.host, http_cmd.port, '/update', data2, function(chunck) {
				console.log(chunck);
				//acRL.prompt();
				if (_callback) _callback();
			});
		});

	},
	batchUpdate : function() {
		var hosts = http_cmd.batch.hosts;
		var files = http_cmd.batch.files;
		var ihost = http_cmd.batch.indexHost;
		var ifile = http_cmd.batch.indexFile;
		if (hosts.length == 0) {
			return console.log('no hosts');
		}
		if (files.length == 0) {
			return console.log('no files');
		}

		http_cmd.host = hosts[ihost].ip;
		http_cmd.port = hosts[ihost].port;

		http_cmd.update(files[ifile].spath,
						files[ifile].sfile,
						files[ifile].dpath,
						files[ifile].dfile, function(){
			//http_cmd.batch.indexFile++;
			console.log('>> update:', files[ifile].sfile);
			ifile++;
			if (files.length == ifile) {
				//return console.log('end files');
				ifile = 0;
				http_cmd.batch.indexFile = ifile;
				ihost++;
				if (hosts.length == ihost) {
					ihost = 0;
					http_cmd.batch.indexHost = ihost;
					return console.log('>> end batchUpdate');
				}
			}
			http_cmd.batch.indexFile = ifile;
			http_cmd.batch.indexHost = ihost;
			http_cmd.batchUpdate();
		});
	},
	batchUpdateStartFromTest : function() {
		http_cmd.batch.resetHosts();
		http_cmd.batch.resetFiles();
		http_cmd.batch.addHost('localhost', 111);
		http_cmd.batch.addFile('./', 'http_cmd.js', '../_starter_update/', '1.js');
		http_cmd.batch.addFile('./', 'http_cmd.js', '../_starter_update/', '2.js');
		http_cmd.batch.addFile('./', 'http_cmd.js', '../_starter_update/', '3.js');
		http_cmd.batch.addFile('./', 'http_cmd.js', '../_starter_update/', '4.js');
		http_cmd.batch.indexHost = 0;
		http_cmd.batch.indexFile = 0;
		http_cmd.batchUpdate();
	},
	batchUpdateStartFromFile : function() {
		http_cmd.batch.resetHosts();
		http_cmd.batch.resetFiles();
		http_cmd.batch.indexHost = 0;
		http_cmd.batch.indexFile = 0;
		var listfile = './update_host_list.json';
		acUtil.fs.readFile(listfile,'utf8',function(err, data) {
			if (err) return console.log('>> error : ', listfile);
			console.log('>> loaded : ', listfile);
			//var list = JSON.parse(data.toString());
			var list = eval('(' + data.toString() + ')');
			http_cmd.batch.hosts = list.hosts;
			http_cmd.batch.files = list.files;
			http_cmd.batchUpdate();
		});
	},
	test : function() {
		// update 에서 파일 내용을 전송하고, 저장하는 방법에 대한 테스트
		// JSON 구조 내에 파일의 내용을 구성하고,
		// 다시 JSON.stringify 를 통해서, 전송하고,
		// 전송받은 데이터를 JSON.parse 를 통해서 다시 오브젝트로 환원하고,
		// 환원된 내용을 파일로 작성하여 내용을 확인한다.
		var post = {
			path:'',
			file:'',
			size:0,
			data:null,
		};
		var fs = acUtil.fs;
		// 01 파일 내용을 읽기
		var file = 'http_cmd.js';
		fs.readFile(file, 'binary', function(err, data) {
			// 02 파일 내용을 오브젝트 변수에 대입하기
			post.path = './';
			post.file = file;
			post.size = data.length;
			post.data = data;
			// 03 오브젝트를 JSON 문자열로 변환하기
			var data2 = JSON.stringify(post);
			// 04 JSON 문자열을 오브젝트로 환원하기
			post2 = JSON.parse(data2);

			console.log('size : ', post.size);
			console.log('size : ', post2.data.length);
			// 05 오브젝트 변수(data)의 내용을 파일로 작성하기
			fs.writeFile('test.dat', post2.data, 'binary', function(err) {
				console.log(err);
			});
		});
	},
};

http_cmd.init();
