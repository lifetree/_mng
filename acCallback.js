// 2013-04-29 15:20
//	acCallback ; 콜백 호출에 대한 랩퍼 오브젝트
//	1. acCallback 을 통해서 콜백이 지정되면, 현재 콜백 이벤트의 카운트를 확인할 수 있다.
//	2. acCallback 을 통해서, 함수/오브젝트/문자열을 지정하여 콜백을 활용할 수 있다.
//	3. acCallback.wrapper 오브젝트는, 하나의 전체 카운트를 사용한다.
//	4. acCallback.groupWrapper 오브젝트는, 카운트를 그룹화하여 개별 카운트를 사용할 수 있다.
//	5. acCallback.groupWrapper.enableFIFO 를 통해서, 먼저 등록한 콜백을 먼저 호출하도록 구조화할 수 있다.
//	6. acCallback.setStopper 를 통해 콜백 호출을 중간에 중단시킬 수 있다.
//	7. acCallback.groupWrapper.lastCaller 를 통해 그룹 안에서 마지막 콜백 호출을 지정할 수 있다.
//		단지 FIFO 에서는 현재 제대로 실행하지 않는다. 즉 FIFO 에서는 순서가 정해져 있으니, 순서를 지키면 된다.
//		lastCaller 의 의미는 stopper 가 작동하면, 그 시점에서 최종 콜백을 호출하도록 하는 것이다.

global.acCallback = {
	stopper : false,
	count : 0,
	setStopper : function(_enable) {
		acCallback.stopper = _enable;
	},
	caller : function(_callback) {
		return new acCallback.wrapper(_callback).cb;
	},
	wrapper : function(_callback) {
		var selfWrapper = this;
		if (_callback) {
			selfWrapper.callback = _callback;
			acCallback.count++;
			//console.log(acCallback.count);
		}
		selfWrapper.cb = function() {
			acCallback.count--;
			if (acCallback.stopper) return console.log('acCallback.stopper: ', acCallback.count);
			//console.log(acCallback.count);
			if (!selfWrapper.callback) console.log('not callback: ', acCallback.count+1);
			else if (typeof selfWrapper.callback === 'function') selfWrapper.callback();
			else if (typeof selfWrapper.callback === 'object') {
				if (selfWrapper.callback.callback) selfWrapper.callback.callback();
			}
			else {
				console.log(acCallback.count+1, selfWrapper.callback);
			}
		}
	},
	groupWrapper : function(_enableFIFO) {
		var selfEach = this;
		selfEach.count = 0;
		selfEach.enableFIFO = _enableFIFO;
		selfEach.countFIFO = _enableFIFO?1:0;
		selfEach.fifo = {}
		selfEach.lastCaller = null;

		selfEach.resetFIFO = function() {
			selfEach.countFIFO = _enableFIFO?1:0;
			selfEach.fifo = {}
		}

		selfEach.caller = function(_callback, _lastCaller) {
			var newWrapper = new selfEach.wrapper(_callback, _lastCaller);
			if (_lastCaller) selfEach.lastCaller = newWrapper;
			return newWrapper.cb;
		}

		selfEach.wrapper = function(_callback, _lastCaller) {
			var selfWrapper = this;
			selfWrapper.lastCaller = _lastCaller;

			if (_callback) {
				selfWrapper.callback = _callback;
				selfEach.count++;
				acCallback.count++;
				selfWrapper.order = selfEach.count;
			}
			selfWrapper.cb = function(_last) {

				if (!_last && selfWrapper.lastCaller) return;

				if (selfEach.enableFIFO) {
					if (selfWrapper.order != selfEach.countFIFO) {
						//console.log('FI:', selfWrapper.order);
						return selfEach.fifo[selfWrapper.order] = selfWrapper.cb;
					}
				}

				selfEach.count--;
				acCallback.count--;
				//console.log('selfWrapper.lastCaller: ', selfWrapper.lastCaller);
				//if (selfEach.lastCaller && selfEach.count==0)

				if (!_last && acCallback.stopper) {
					if (selfEach.enableFIFO && selfEach.lastCaller) {
						console.log('selfWrapper.cb: ', acCallback.count, selfEach.count);
						selfEach.enableFIFO = false;
						return selfEach.lastCaller.cb(true);
						//return console.log('acCallback.stopper: ', acCallback.count, selfEach.count);
					}
					else if (selfEach.count == 1 && selfEach.lastCaller) {
						console.log('selfWrapper.cb: ', acCallback.count, selfEach.count);
						return selfEach.lastCaller.cb(true);
					}
					return console.log('acCallback.stopper: ', acCallback.count, selfEach.count);
				}

				if (!selfWrapper.callback) console.log('not callback: ', selfEach.count+1);
				else if (typeof selfWrapper.callback === 'function') selfWrapper.callback();
				else if (typeof selfWrapper.callback === 'object') {
					if (selfWrapper.callback.callback) selfWrapper.callback.callback();
				}
				else {
					console.log(selfEach.count+1, selfWrapper.callback);
				}

				if (selfEach.count == 1 && selfEach.lastCaller) {
					console.log('selfWrapper.cb: ', acCallback.count, selfEach.count);
					selfEach.lastCaller.cb(true);
				}


				if (selfEach.enableFIFO) {
					//console.log('FO:', selfWrapper.order);
					selfEach.countFIFO++;
					if (selfEach.fifo[selfEach.countFIFO]) {
						//console.log('lated FO:', selfEach.countFIFO);
						return selfEach.fifo[selfEach.countFIFO]();
					}
//					else {
//						for(var i=1; i<=selfEach.count; ++i) {
//							if (selfEach.fifo[selfEach.countFIFO + i]) {
//								selfEach.countFIFO += i;
//								return selfEach.fifo[selfEach.countFIFO]();
//							}
//						}
//					}
				}
			}
		}
	},
}
