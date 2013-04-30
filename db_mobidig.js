global.db_mobidig = {
	host : '14.63.224.251',
	dbname : 'mobidig',
	colnames : ['mobidig_login',
				'mobidig_StarMakerClientData',
				],
	init : function() {
		acClientCmd.add('db_mobidig_connect', function() {
			dbSetHost(db_mobidig.host);
			dbSetDatabase(db_mobidig.dbname);
			dbSetCollection(db_mobidig.colnames);
			dbConnect();
		});
		acClientCmd.add('db_mobidig_find_login', function(_id) {
			var doc = {};
			if (_id) doc.id = _id;
			find('mobidig_login',doc,{});
		});
	},
};

db_mobidig.init();
