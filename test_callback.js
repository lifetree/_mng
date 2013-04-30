
var cb_count = 0;
var cb_t;
global.cb_w = function(_callback) {
	var self = this;
	if (_callback) {
		self.cb_c = _callback;
		cb_count++;
		console.log(cb_count);
	}
	self.cb_call = function() {
		cb_count--;
		console.log(cb_count);
		if (self.cb_c) self.cb_c();
	}
}


function test_a(_callback) {
	setTimeout(_callback, Math.random() * 1000 + 100);
}

test_a(new cb_w(function() {
	console.log('testing1');
}).cb_call);

test_a(new cb_w(function() {
	console.log('testing2');
}).cb_call);


// acCallback 테스트
require('./acCallback.js');

// 전역 랩퍼 오브젝트 테스트
test_a(acCallback.caller(function() {
	console.log('caller 1 : testing1');
	console.log(acCallback.count);
}));

test_a(new acCallback.wrapper(function() {
	console.log('testing2');
	console.log(acCallback.count);
}).cb);

//console.log(acCallback.count);

// 그룹화 랩퍼 오브젝트 테스트
var a = new acCallback.groupWrapper(true);
a.resetFIFO();

for(var i=0; i<10; ++i) {
	(function(_i) {
		test_a(a.caller(function() {
			console.log('caller - testing' + _i);
			console.log(a.countFIFO);
			console.log(a.count);
			console.log(acCallback.count);
			//if (_i == 5) acCallback.setStopper(true);
		//}, _i==9));
		}));
	})(i);
}

console.log(a.count);


for(var i=0; i<10; ++i) {
	test_a(a.caller(function() {
		console.log('testing2');
		console.log(a.count);
		console.log(acCallback.count);
		//if (a.count == 5) acCallback.setStopper(true);
	}));
}


// 동적인 오브젝트 콜백
var obj = function () {
	var self = this;
	self.callback = function() {
		console.log('obj::callback');
		console.log(acCallback.count);
	}
}

test_a(a.caller(new obj()));

// 정적인 오브젝트 콜백
var objStatic =  {
	callback : function() {
		console.log('objStatic::callback');
		console.log(acCallback.count);
	}
}

test_a(a.caller(objStatic));


console.log(a.count);

// 문자열 콜백
test_a(a.caller('test string'));

console.log(a.count);
console.log(acCallback.count);

delete a;
