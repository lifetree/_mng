global.testNode = {
	a : 1,
	b : 2,
	c : 3,
}

// 참조 리턴
global.getTestNode = function() {
	return testNode;
}

// 참조 리턴
global.newTestNode = function() {
	//var ret = testNode; // 참조 대입

	// 새로운 오브젝트 정의
	var ret = {};
	for (n in testNode) {
		ret[n] = testNode[n];
	}
	return ret; // 새로운 오브젝트 리턴
}

// http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
// * 주의 : the object of javascript
//	typeof ==> object {
//					Date
//					Array
//					Object
//				}
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}