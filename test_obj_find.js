


var a = {};

function find(_o) {
	for (p in _o) {
		console.log(p);
	}
	console.log('>>end');
}


find(a);