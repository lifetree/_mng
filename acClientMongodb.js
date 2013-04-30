// acUtil.mongoshell 에 대한 클라이언트용 알리아스를 관리하는 오브젝트
var mongoshell = acUtil.mongoshell;
global.acClientMongodb = {
	dbInfo : {
		name : 'mongodb',
		host : 'localhost',
		port : 27017,
		dbname : '',
		colnames : [],
		user : 'groove',
		password : 'groove1236',
	},
	dbSetHost : function(_ip, _port) {
		if (_ip) acClientMongodb.dbInfo.host = _ip;
		if (_port) acClientMongodb.dbInfo.port = _port;
	},
	dbSetDatabase : function(_dbname) {
		if (_dbname) acClientMongodb.dbInfo.dbname = _dbname;
	},
	dbClearCollection : function() {
		acClientMongodb.dbInfo.colnames = [];
	},
	dbSetCollection : function(_colname) {
		if (typeof _colname === 'object') {
			acClientMongodb.dbInfo.colnames = _colname;
		}
		else if (typeof _colname === 'string') {
			acClientMongodb.dbInfo.colnames.push(_colname);
		}
	},
	dbConnect : function(_callback) {
		mongoshell.addHost(acClientMongodb.dbInfo.name, acClientMongodb.dbInfo.host, acClientMongodb.dbInfo.port);
		mongoshell.openDB(acClientMongodb.dbInfo.name,
			acClientMongodb.dbInfo.dbname,
			acClientMongodb.dbInfo.user,
			acClientMongodb.dbInfo.password,
			function(db_name) {
				if (typeof acClientMongodb.dbInfo.colnames === 'object') {
					for (var n in acClientMongodb.dbInfo.colnames) {
						mongoshell.openCollection(db_name, acClientMongodb.dbInfo.colnames[n]);
					}
				}
				else if (typeof acClientMongodb.dbInfo.colnames === 'string') {
					mongoshell.openCollection(db_name, acClientMongodb.dbInfo.colnames);
				}
				if (_callback) _callback();
		});
	},
//	insert : function(_colname, _doc, _callback) {
//		if (!_colname || !_doc) return;
//		var mongoshell = acUtil.mongoshell;
//		mongoshell.insert(_colname, _doc, function(ret) {
//			if (_callback) _callback(ret);
//			else console.log(ret);
//		});
//	},
//	ensureIndex : function(_colname, _fields, _callback) {
//		if (!_colname || !_fields) return;
//		var mongoshell = acUtil.mongoshell;
//		mongoshell.ensureIndex(_colname, _fields, function(ret) {
//			if (_callback) _callback(ret);
//			else console.log(ret);
//		});
//	},
//	update : function(_colname, _selector, _doc, _callback) {
//		if (!_colname || !_selector || !_doc) return;
//		var mongoshell = acUtil.mongoshell;
//		mongoshell.update(_colname, _selector, _doc, function(ret) {
//			if (_callback) _callback(ret);
//			else console.log(ret);
//		});
//	},
//	find : function(_colname, _selector, _fields, _callback) {
//		if (!_colname || !_selector || !_fields) return;
//		var mongoshell = acUtil.mongoshell;
//		mongoshell.find(_colname, _selector, _fields, function(docs) {
//			if (_callback) _callback(docs);
//			else console.log(docs);
//		});
//	},
//	remove : function(_colname, _selector, _callback) {
//		if (!_colname || !_selector) return;
//		var mongoshell = acUtil.mongoshell;
//		mongoshell.remove(_colname, _selector, function(ret) {
//			if (_callback) _callback(ret);
//			else console.log(ret);
//		});
//	},
//	count : function(_colname, _selector, _callback) {
//		if (!_colname || !_selector) return;
//		var mongoshell = acUtil.mongoshell;
//		mongoshell.count(_colname, _selector, function(count) {
//			if (_callback) _callback(count);
//			else console.log(count);
//		});
//	},
	init : function() {
		acClientCmd.add('dbSetHost', acClientMongodb.dbSetHost);
		acClientCmd.add('dbSetDatabase', acClientMongodb.dbSetDatabase);
		acClientCmd.add('dbClearCollection', acClientMongodb.dbClearCollection);
		acClientCmd.add('dbSetCollection', acClientMongodb.dbSetCollection);
		acClientCmd.add('dbConnect', acClientMongodb.dbConnect);
		acClientCmd.add('dbClose', mongoshell.close);
		acClientCmd.add('insert', mongoshell.insert);
		acClientCmd.add('ensureIndex', mongoshell.ensureIndex);
		acClientCmd.add('update', mongoshell.update);
		acClientCmd.add('remove', mongoshell.remove);
		acClientCmd.add('count', function(_colname, _selector) {
			mongoshell.count(_colname, _selector, function(count) {
				console.log(count);
				acRL.prompt();
			});
		});
		acClientCmd.add('findDocs', mongoshell.findDocs);
		acClientCmd.add('findAndModify', mongoshell.findAndModify);
		acClientCmd.add('find', function(_colname, _selector, _fields) {
			mongoshell.find(_colname, _selector, _fields, function(docs) {
				console.log(docs);
				acRL.prompt();
			});
		});
	},
};


// mongodb shell
acClientMongodb.init();
