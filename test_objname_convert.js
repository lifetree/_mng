function testObjNameConvert() {
	var pt = {
		name : 'test',
		list : [1,2,3, { name : '1234', obj1 : '5667' }, 456 ],
		obj : {
			obj1 : 1,
			obj2 : 'test',
		},
	};

	var nameList1 = {
		a : 'name',
		b : 'list',
		c : 'obj',
		d : 'obj1',
		e : 'obj2',
	};

	var nameList2 = {
		name : 'a',
		list : 'b',
		obj : 'c',
		obj1 : 'd',
		obj2 : 'e',
	};

	//console.log('nameList.a :', nameList.a);

	var objName = function(object) {
		for (var property in object) {
			var value = object[property];
			if (value) {
				console.log(property.toString(), value);
			}
		}
	}

	objName(nameList1);
	objName(pt);

	var convertObj = function (object, names, bArray) {
		var results = [];
		for (var property in object) {
			var value = object[property];
			if (value) {
				if (typeof value === 'function' || typeof value === 'number') {
					results.push(bArray?value:'"' + names[property.toString()] + '"' + ': ' + value );
				}
				else if (value instanceof Array) {
					results.push(bArray?convertObj(value, names, true):'"' + names[property.toString()] + '"' + ': ' + convertObj(value, names, true));
				}
				else if (typeof value === 'object') {
					results.push(bArray?convertObj(value, names):'"' + names[property.toString()] + '"' + ': ' + convertObj(value, names));
				}
				else {
					results.push(bArray?'"' + value + '"':'"' + names[property.toString()] + '"' + ': "' + value + '"');
				}
			}
		}

		return (bArray?'[':'{') + results.join(',') + (bArray?']':'}');
	}

	setTimeout(function() {
	var a = acUtil.convertObjToJSONFromNames(pt, nameList2);
	console.log(a);
	var b = JSON.parse(a);
	console.log(b);
	var c = acUtil.convertObjToJSONFromNames(b, nameList1);
	console.log(c);
	var d = JSON.parse(c);
	console.log(d);
	}, 2000);


	var inverseNames = function(names) {
		var retNames = {};
		for (var property in names) {
			var value = names[property];
			retNames[value] = property;
		}
		return retNames;
	}

	console.log(nameList2);
	ilist2 = inverseNames(nameList2);
	console.log(ilist2);

	var defClassList = {
		_className : 'cName',
		_parentClassName : 'pName',
		_classBegin : '{',
		attrName : 'type',
		a : 'int',
		b : 'string',
		c : 'cls1[]',
		_classEnd : '}',
	};

	var createClassCSFromDef = function(_def) {
		var ret = '';
		for (var property in _def) {
			var value = _def[property];
			if (property == '_className') {
				ret += 'public class ' + value;
			}
			else if (property == '_parentClassName') {
				ret += ' : ' + value;
			}
			else if (property == '_classBegin' || property == '_classEnd') {
				ret += '\n' + value;
			}
			else {
				ret += '\n\tpublic ' + value + ' ' + property + ';';
			}
		}
		return ret;
	}

	var cls = createClassCSFromDef(defClassList);
	console.log(cls);

//	public class cName : pName
//	{
//		public type list;
//	}

	var sample = {
		a : 1,
		b : '1234',
		c : [1,2,3],
	};
	var typeList = {
		a : 'int',
		b : 'string',
		c : 'int[]',
	};

	setTimeout(function() {
		console.log(acUtil.createClassCS('sample', 'base', sample, typeList));
		console.log(acUtil.createClassCS('sample', null, sample, typeList));
	}, 1000);

	var createFunctionCS = function(_retType, _funcName, _paramList) {
		var ret = '';
		ret += 'public static ' + _retType + ' ' + _funcName + '(';
		var params = [];
		for (var property in _paramList) {
			params.push(_paramList[property] + ' ' + property);
		}
		ret += params.join(', ');
		ret += ')';
		ret += '\n{';
		if (_retType) ret += '\treturn ' + 'ret_' + _retType + ';';
		ret += '\n}';
		return ret;
	}

	var params = {
		a : 'int',
		b : 'string',
	}

	var f = createFunctionCS('int', 'test', params);
	console.log(f);


	var createCSProcotolConstant = function(_ptName) {
		var ret = '';
		var csStr = '\tpublic const string cs_#1 = "/cs_#1"\n';
		var scStr = '\tpublic const string sc_#1 = "/sc_#1"\n';
		ret += csStr.replace(/#1/g, _ptName);
		ret += scStr.replace(/#1/g, _ptName);
		return ret;
	}

	var c1 = createCSProcotolConstant('login');
	console.log(c1);

}


