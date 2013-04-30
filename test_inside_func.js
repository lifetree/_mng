


var a = function(_p1) {

	this.f = 1;

	var ret = {ret:_p1}

	var b = function() {
		return ret;
	}

	if (_p1) return b();

	this.b1 = b;
}

a.prototype.f1 = 1;

console.log(a(101));

var a1 = new a();

console.log(a1.b1());