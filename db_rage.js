global.db_rage = {
	host : '14.63.224.251',
	dbname : 'rage',
	colnames : ['rage_login',
				'rage_user_activity',
				],
	init : function() {
		acClientCmd.add('db_rage_connect', function() {
			dbSetHost(db_rage.host);
			dbSetDatabase(db_rage.dbname);
			dbSetCollection(db_rage.colnames);
			dbConnect();
		});
	},
};

db_rage.init();
