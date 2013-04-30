

// *주의 : requrie 의 순서가 중요하다!
require('../_ac/acConfigCommon.js');

require('./acClientJSS.js');
require('./acClientCmd.js');
require('./acClientUtil.js');
require('./acClientHttp.js');
require('./acClientMongodb.js');

require('./db_pocketwars.js');
require('./db_mobidig.js');
require('./db_rage.js');

//require('./http_cmd.js');

//console.log(__filename);
acUtil.pidSave(__filename);
console.log(process.pid);

global.restartJSS = function () {
	setTimeout(function() {
		acUtil.startProgram(__filename, 'timer=1000');
		//acUtil.exitProgram();
		acRL.close();
	}, 1000);
}
