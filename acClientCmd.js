// 01	명령어 관리자 오브젝트
//	2013-04-11 16:58
//	1) 명령어를 global 에 등록하고, 명령어에 해당하는 함수 연결한다.
//	2) help() 를 통해서, 등록된 명령어를 확인한다.
//
global.acClientCmd = {
	events : {},
	helpStr : [],
	add : function(strfunc, callback) {
		if (typeof callback === 'function') {
			global[strfunc] = callback;
			this.events['cmd_'+strfunc] = callback;
			this.helpStr.push(strfunc);
			return;
		}
		if (typeof this['cmd_'+strfunc] !== 'function') {
			return console.log('> not function : ', 'cmd_'+strfunc);
		}
		this.events['cmd_'+strfunc] = this['cmd_'+strfunc];
		this.helpStr.push(strfunc);
	},
	call : function(strfunc, params) {
		if (this.events['cmd_'+strfunc]) this.events['cmd_'+strfunc](params);
	},
	init : function() {
		acClientCmd.add('help', function (params) {
			var newline = ',';
			var tab = '\t';
			var strHelp = '> command list:\n';
				//strHelp += acClientCmd.helpStr.join(', ');
			var count = 0;
			for (n in acClientCmd.helpStr) {
				count += (acClientCmd.helpStr[n].length + 2);
				if (count < 80) {
					strHelp += acClientCmd.helpStr[n] + ', ';
				}
				else {
					strHelp += '\n' + acClientCmd.helpStr[n] + ', ';
					count = (acClientCmd.helpStr[n].length + 2);
				}
			}
			console.log(strHelp);
			//return 1;
		});

		acClientCmd.add('close', function (params) {
			acRL.close();
		});

		acClientCmd.add('exit', function (params) {
			acRL.close();
		});

		acClientCmd.add('echo', function(params) {
			//convertString(params);
			//convertString(params, '{}');
			console.log('echo:', params, params.length);
		});

		acClientCmd.add('print', function(params) {
			console.log(params);
		});
	},
};

// 03	명령어 처리 함수 등록
acClientCmd.init();

