//http://stackoverflow.com/questions/15471555/nodejs-process-info

var exec = require('child_process').exec;
var yourPID = process.pid; //'1444';

exec('tasklist /FI "IMAGENAME eq node.exe"', function(err, stdout, stderr) {
    var lines = stdout.toString().split('\n');
    //var results = new Array();
    lines.forEach(function(line) {
		if (line.toString().indexOf(yourPID) > -1)
		{
			//console.log(line);
		}
		if (line.toString().indexOf('node.exe') > -1)
		{
			console.log(line);
		}

		//console.log(line);
//        var parts = line.split('=');
//		console.log(parts);
//        parts.forEach(function(items){
//			if(items.toString().indexOf(yourPID) > -1){
//				console.log(items.toString().substring(0, items.toString().indexOf(yourPID)));
//			 }
//        })
    });
});

// linux
//var spawn = require('child_process').spawn,
//    cmdd = spawn('man ps'); //something like: 'man ps'
//
//cmdd.stdout.on('data', function (data) {
//  console.log('' + data);
//});
//cmdd.stderr.setEncoding('utf8');
//cmdd.stderr.on('data', function (data) {
//  if (/^execvp\(\)/.test(data)) {
//    console.log('Failed to start child process.');
//  }
//});