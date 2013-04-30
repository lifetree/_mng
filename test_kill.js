process.on('SIGHUP', function() {
  console.log('Got SIGHUP signal.');
});

setTimeout(function() {
  console.log('Exiting.');
  //process.exit(0);
  process.kill(process.pid, 'SIGHUP');
}, 2000);



function testProcessKillSig() {
	//Example of sending a signal to yourself:
	process.on('SIGHUP', function() {
	  console.log('Got SIGHUP signal.');
	});

	process.on('SIGHUSR2', function() {
	  console.log('Got SIGHUSR2 signal.');
	});

	console.log('SIGHUSR1' || 'SIGTERM');

	//setTimeout(function() {
	//  console.log('Exiting.');
	//  process.exit(0);
	//}, 3000);
	//
	//process.kill(process.pid, 'SIGHUP');
	// 위 코드는 공식 문서의 내용이지만, 실제 테스트에서는 에러가 난다.
}
