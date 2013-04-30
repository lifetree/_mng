

var queueTest = {
	datas : new Array(),
	push : function(_node) {
		queueTest.datas.push(_node);
	},
	pop : function() {
		return queueTest.datas.shift();
	},
	count : function() {
		return queueTest.datas.length;
	},
}


queueTest.push('test1');
queueTest.push('test2');
console.log(queueTest.count());
console.log(queueTest.pop());
console.log(typeof queueTest.pop() === 'undefined');
console.log(typeof queueTest.pop() === 'undefined');
console.log(queueTest.count());

