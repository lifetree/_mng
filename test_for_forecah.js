// 2013-04-19 14:33
// 배열를 처리하는 구문에서, for 문과 forEach 문에 대한 차이점:
//	1. 배열의 무조건 모든 요소를 다 조사할 필요가 있다. --> forEach
//	2. 배열의 특정 영역만 조건에 맞춰서 조사를 하고 싶다. --> for
//	즉, forEach 문은 무조건 배열 전체를 조사하게 된다.
//	반면에, for 문은 [인덱스 문자열]를 통해서 필요한 만큼만 조사할 수 있다.


var a = [];

for (var i=0; i<100; ++i) {
	a.push(i);
}

a.forEach(function(index,item,array) {
	if (item == 50) return;
	console.log(item, index);
});

for (var i in a) {
	if (a[i] == 50) break;
	console.log(i, a[i]);
}


var o = {
	a : 1,
	b : 2,
}


//o.forEach(function(index, item, array) {
//	console.log(index, item);
//});

for (n in o) {
	console.log(n, o[n]);
}