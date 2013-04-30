

global.acArrayQueue = {
	create : function() {
		var selfCreate = this;
		selfCreate.queue = new Array();
		selfCreate.push = function(_node) {
			selfCreate.queue.push(_node);
		}
		selfCreate.pop = function() {
			return selfCreate.queue.shift();
		}
		selfCreate.count = function() {
			return selfCreate.queue.length;
		}
	},
	datas : new Array(),
	push : function(_node) {
		acArrayQueue.datas.push(_node);
	},
	pop : function() {
		return acArrayQueue.datas.shift();
	},
	count : function() {
		return acArrayQueue.datas.length;
	},
}
