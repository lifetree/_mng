global.db_pocketwars = {
	host : '14.63.224.251',
	dbname : 'kickass',
	colnames : ['kickass_login',
				'kickass_inventory',
				'kickass_rank',
				'kickass_rank_weektop10'],
	init : function() {
		acClientCmd.add('db_pocketwars_connect', function() {
			dbSetHost(db_pocketwars.host);
			dbSetDatabase(db_pocketwars.dbname);
			dbSetCollection(db_pocketwars.colnames);
			dbConnect();
		});
	},
};

db_pocketwars.init();
