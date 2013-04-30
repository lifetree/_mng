// 2013-04-22 16:23
// protocol 관리자
// version : major.minor.build_num

global.acProtocolManager = global.acPTMNG = {
	list : {},	// list['/pt_name'] = {	protocol:{}
				//						, retPT:{}
				//						, seqName:''
				//						, seqType:'' //http, socket
				//						, path:''
				//						, file:''
				//						, text:''
				//						, version:''
				//						, project:''
				//						, service:''}
	newList : function(_list) {
		var seqName = _list.protocol.pt.substring(1);
		var retName = '/sc' + _list.protocol.pt.substring(3);
		var newlist = { protocol: _list.protocol };
		newlist.retPT = (_list['retPT']) || {pt:retName, ret:1};
		newlist.seqName = (_list['seqName']) || seqName;
		newlist.seqType = (_list['seqType']) || 'http';
		newlist.path = (_list['path']) || './';
		newlist.text = (_list['text']) || 'text';
		newlist.version = (_list['version']) || '0.1.0';
		newlist.project = (_list['project']) || 'project';
		newlist.service = (_list['service']) || 'service';
		newlist.file = (_list['file']) || ('seq_'+ newlist.service +'_'+ seqName+'.json');
		return newlist;
	},
	addList : function(_list) {
		if (!_list.protocol['pt']) return console.log('undefined pt!');
		acPTMNG.list[_list.protocol.pt] = acPTMNG.newList(_list);
	},
	construct_pt : function(_ptCommonName, _seqType, _service) {

		_seqType = _seqType || 'http';
		_service = _service || 'service';

		acPTMNG.addList({ protocol: {pt:'/cs_' + _ptCommonName},
			seqType:_seqType,
			service:_service
			});
		//acPTMNG.addList({ protocol: {pt:'/sc_' + _ptCommonName}, seqType:_seqType });
	},
	findList : function(_ptName) {
		var name = _ptName;
		if (typeof _ptName === 'string' && _ptName[0] != '/') {
			name = '/' + _ptName;
		}
		if (acPTMNG.list[name])
			return acPTMNG.list[name];
		console.log('not found: ', name);
		return null;
	},
	setAttr : function(_ptName, _attr, _upset) {
		var pt = acPTMNG.findList(_ptName);
		if (!pt) return console.log('not found: ', _ptName);
		for (n in _attr) {
			if (!_upset && !pt[n]) continue;
			pt[n] = _attr[n];
		}
	},
	saveProtocolList : function(_path, _file) {
		var path = _path || './';
		var file = path + (_file || 'protocol_list.json');
		var j2s = acUtil.JSONtoString;

		var data = j2s(acPTMNG.list);
		acUtil.fs.writeFile(file, data, 'utf8', function(err) {
			if (err) return console.log('saveProtocolList error: ', err);
			return console.log('saveProtocolList: ', file);
		});
	},
	loadProtocolList : function(_path, _file) {
		var path = _path || './';
		var file = path + (_file || 'protocol_list.json');
		var j2s = acUtil.JSONtoString;
		acUtil.fs.readFile(file, 'utf8', function(err, data) {
			if (err) return console.log('loadProtocolList error: ', err);
			acPTMNG.list = eval('(' + data + ')');
			return console.log('loadProtocolList: ', file, Object.keys(acPTMNG.list));
		});
	},
	saveAllSeq : function() {
		for (n in acPTMNG.list) {
			acPTMNG.saveSeq(n);
		}
	},
	saveSeq : function(_ptName) {
		//var j2s = acUtil.JSONtoString;
		var seqDef = acPTMNG.findList(_ptName);
		if (!seqDef) return console.log('not found: ',_ptName);
		var file = seqDef.path + seqDef.file;
		var seqStr = '';
		if (seqDef.seqType == 'http') {
			seqStr = acPTMNG.sequence.createForHttp(seqDef.seqName, seqDef.retPT);
		}
		else if (seqDef.seqType == 'socket') {
			seqStr = acPTMNG.sequence.createForSocket(seqDef.seqName);
		}
		//data = j2s(seqStr);
		//retStr = j2s(seqDef.retPT);
		//data = seqStr.replace('///{0}', 'var retPT = ' + retStr);
		acUtil.fs.writeFile(file, seqStr, 'utf8', function(err) {
			if (err) return console.log('saveSeq error: ', err);
			return console.log('saveSeq: ', file);
		});
	},
	sequence : {
		createForHttp : function(_nameSeq, _retPT) {
			var j2s = acUtil.JSONtoString;
			var newNode = {
				name : _nameSeq,
				req : {
					format: {
						get: {
							path: '/' + _nameSeq,
						}
					},
					handle_update: null,
					handle : null,
				}
			}
			newNode.req.handle_update = function(response, request, json) {
				///{0}
			}
			newNode.req.handle = function(response, request) {
				var json = {};
				var body = '';
				var retPT = _retPT; // || {ret:1};
				var errorRet = function() {
					retPT.ret = -1;
					body = JSON.stringify(retPT);
					return acUtil.response_text(response, body);
				}
				var handleCall = function() {
					return acUtil.sequence[_nameSeq].req.handle_update(response, request, json);
				}
				// 01 GET
				if (request.method != 'POST') {
					json = acUtil.urlParse(request.url, "data");
					if (!json) return errorRet();
					return handleCall();
				}

				// 02 POST
				request.on('data', function (data) {
					body += data;
				});
				request.on('end', function () {
					try {
						json = JSON.parse(body);
						if (!json) return errorRet();
						return handleCall();
					}
					catch(err) {
						return errorRet();
					}
				});
			}
			// file : sequence_gamedata_save.json
			//{
			//	"name": "save",
			//	"req": {
			//		"handle_update": function (response, request, json, acUtil) {
			//		},
			//		"handle": function (response, request) {
			//		},
			//	},
			//}
			//return newNode;
			var node = j2s(newNode);
			node = node.replace(/_nameSeq/g, '\'' + _nameSeq + '\'');
			var retStr = j2s(_retPT).replace(/\n/g, '');
			node = node.replace(/_retPT/g, retStr);
			return node;
		},
		createForSocket : function(_nameSeq) {
			var j2s = acUtil.JSONtoString;
			var newNode = {
				name : '/' + _nameSeq,
				handle : null,
			}
			newNode.handle = function(socket, jsonObj) {
				///{0}
			}
			// file : sequence_lobby_csAddUser.json
			//{
			//	"name": "/cs_request_adduser",
			//	"handle": function (socket, jsonObj) {
			//	},
			//}
			//return newNode;
			var node = j2s(newNode);
			node = node.replace(/_nameSeq/g, '\'' + _nameSeq + '\'');
			return node;
		},
		createForCS : function() {
			//	file : TCPProtocol.cs
			// 1 상수
			// 2 클래스
			// 3 함수
		},
	},
	module : {
		loadModule : function() {
		},
		saveModule : function() {
		},
	},
	build : {
		release : function() {
		},
	},
	doc : {
		load : function() {
		},
		save : function() {
		},
	},
}