//

var dgram = require('dgram');
global.acDgram = function() {
	var self = this;
	self.server = null;
	self.eventEnable = false;
	self.clients = [];	//{name : '',ip : '',port : 0,},
	self.events = {};	// self.events['/sample'] = function(jsonObj, rinfo)
						// protocol ; {pt:'/sample',other:'sample string'}
	self.setEvent = function(_pt, _func) {
		if (_pt && _func) {
			self.events[_pt] = _func;
			self.eventEnable = true;
		}
	}
	self.create = function(_name, _port) {
		if (self.server != null) return false;
		var server = dgram.createSocket("udp4");
		self.server = server;
		server.on("message", function (msg, rinfo) {
			if (!self.eventEnable) {
				console.log(" from " + rinfo.address + ":" + rinfo.port);
				console.log(" msg: " + msg);
				return;
			}
			try {
				var jsonObj = JSON.parse(msg.toString());
				if (jsonObj['pt'] && self.events[jsonObj['pt']]) self.events[jsonObj['pt']](jsonObj, rinfo);
				else {
					console.log(" from " + rinfo.address + ":" + rinfo.port);
					console.log('error protocol :',jsonObj);
				}
			}
			catch(e) {
				console.log('error JSON.parse :',e);
			}
		});
		server.on("listening", function () {
		  var address = server.address();
		  console.log("acDgram listening " + address.address + ":" + address.port);
		});
		server.bind(_port);
	}
	self.send = function(_msg, _ip, _port) {
		if (typeof _msg === 'object') {
			try {
				_msg = JSON.stringify(_msg);
			}
			catch(e) {
				return console.log('error acDgram.send::JSON.stringify :',e);
			}
		}
		var msgBuf = new Buffer(_msg);
		self.server.send(msgBuf, 0, msgBuf.length, _port, _ip, function(err, bytes) {
			if (err) console.log(err, bytes);
		});
	}
	self.close = function() {
		self.server.close();
	}
	self.sampleEvent = function() {
		self.setEvent('/sample', function(json, rinfo) {
			console.log(">> from " + rinfo.address + ":" + rinfo.port);
			console.log(">> msg: ", json);
		});
	}
}