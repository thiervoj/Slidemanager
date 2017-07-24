'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SlideManager = exports.SlideManager = function () {
	function SlideManager(el) {
		var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, SlideManager);

		if (!el) {
			console.error('You must pass an element');
			return;
		}
		if (!opt.callback) {
			console.error('You must give a callback');
			return;
		}

		this.el = el;
		this.changing = false;
		this.index = 0;
		this.max = opt.length || this.el.children.length;
		this.threshold = opt.threshold || 60;

		this.options = {
			loop: opt.loop || false,
			random: opt.random || false,
			vertical: opt.vertical || false,
			callback: opt.callback,
			auto: opt.auto || false,
			interval: opt.interval || 5,
			init: opt.init === false ? false : true,
			swipe: opt.swipe === false ? false : true
		};

		if (opt.startAt != this.index && opt.startAt > 0) {
			if (opt.startAt > this.max) this.index = this.max;else this.index = opt.startAt;
		}

		this.onSwipe = this.onSwipe.bind(this);
		this.counter = 0;
		this.raf = null;

		this.touch = {
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0
		};

		if (this.options.swipe) this.events();

		if (this.options.init) this.init();
	}

	// Public functions


	_createClass(SlideManager, [{
		key: 'init',
		value: function init() {
			if (this.max === 0) return;

			if (this.options.auto) this.startAuto();

			return this;
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			if (this.max === 0) return;

			this.changing = false;

			if (this.options.swipe) {
				this.el.removeEventListener('mousedown', this.touchStart, false);
				this.el.removeEventListener('mouseup', this.touchEnd, false);

				this.el.removeEventListener('touchstart', this.touchStart, false);
				this.el.removeEventListener('touchend', this.touchEnd, false);
			}

			cancelAnimationFrame(this.raf);
			this.raf = null;
			this.counter = 0;

			return this;
		}
	}, {
		key: 'getIndex',
		value: function getIndex() {
			return this.index;
		}
	}, {
		key: 'goTo',
		value: function goTo(index) {
			if (index == this.index || this.isChanging()) return;

			var checkedIndex = this.checkLoop(index),
			    event = this.createEvent(checkedIndex);

			if (checkedIndex == this.index) {
				this.changing = false;
				return;
			}

			this.index = checkedIndex;
			this.options.callback(event);
		}
	}, {
		key: 'done',
		value: function done() {
			this.changing = false;
		}

		// Private functions

	}, {
		key: 'events',
		value: function events() {
			this.el.addEventListener('mousedown', this.touchStart.bind(this), false);
			this.el.addEventListener('mouseup', this.touchEnd.bind(this), false);

			this.el.addEventListener('touchstart', this.touchStart.bind(this), false);
			this.el.addEventListener('touchend', this.touchEnd.bind(this), false);
		}
	}, {
		key: 'touchStart',
		value: function touchStart(event) {
			this.touch.startX = event.screenX;
			this.touch.startY = event.screenY;
		}
	}, {
		key: 'touchEnd',
		value: function touchEnd(event) {
			this.touch.endX = event.screenX;
			this.touch.endY = event.screenY;

			this.handleSwipe();
		}
	}, {
		key: 'handleSwipe',
		value: function handleSwipe() {
			if (this.options.vertical) {
				if (this.touch.endY < this.touch.startY && this.touch.startY - this.touch.endY >= this.threshold) {
					if (this.touch.endX < this.touch.startX && this.touch.startX - this.touch.endX <= 100 || this.touch.endX > this.touch.startX && this.touch.endX - this.touch.startX <= 100) {
						this.callback(1);
					}
				}
				if (this.touch.endY > this.touch.startY && this.touch.endY - this.touch.startY >= this.threshold) {
					if (this.touch.endX < this.touch.startX && this.touch.startX - this.touch.endX <= 100 || this.touch.endX > this.touch.startX && this.touch.endX - this.touch.startX <= 100) {
						this.callback(-1);
					}
				}
			} else {
				if (this.touch.endX < this.touch.startX && this.touch.startX - this.touch.endX >= this.threshold) {
					if (this.touch.endY < this.touch.startY && this.touch.startY - this.touch.endY <= 100 || this.touch.endY > this.touch.startY && this.touch.endY - this.touch.startY <= 100) {
						this.callback(-1);
					}
				}
				if (this.touch.endX > this.touch.startX && this.touch.endX - this.touch.startX >= this.threshold) {
					if (this.touch.endY < this.touch.startY && this.touch.startY - this.touch.endY <= 100 || this.touch.endY > this.touch.startY && this.touch.endY - this.touch.startY <= 100) {
						this.callback(1);
					}
				}
			}
		}
	}, {
		key: 'startAuto',
		value: function startAuto() {
			this.counter++;

			if (this.counter >= this.options.interval * 60) {
				this.callback(-1);
				this.counter = 0;
			}

			this.raf = requestAnimationFrame(this.startAuto.bind(this));
		}
	}, {
		key: 'isChanging',
		value: function isChanging() {
			if (this.changing) return true;

			this.changing = true;
			return false;
		}
	}, {
		key: 'onSwipe',
		value: function onSwipe(event) {
			this.callback(this.options.vertical ? event.deltaY : event.deltaX);
		}
	}, {
		key: 'newIndex',
		value: function newIndex(delta) {
			return this.checkLoop(delta > 0 ? this.index - 1 : this.index + 1);
		}
	}, {
		key: 'newRandomIndex',
		value: function newRandomIndex() {
			var randIndex = void 0;

			do {
				randIndex = Math.floor(Math.random() * this.max);
			} while (randIndex == this.index);

			return randIndex;
		}
	}, {
		key: 'checkLoop',
		value: function checkLoop(index) {
			return index < 0 ? this.options.loop ? this.max - 1 : 0 : index > this.max - 1 ? this.options.loop ? 0 : this.max - 1 : index;
		}
	}, {
		key: 'createEvent',
		value: function createEvent(newIndex) {
			var direction = newIndex > this.index ? 1 : -1;

			if (this.index == 0 && newIndex == this.max) direction = -1;else if (this.index == this.max && newIndex == 0) direction = 1;

			return {
				current: newIndex,
				previous: this.index,
				direction: direction
			};
		}
	}, {
		key: 'callback',
		value: function callback(delta) {
			if (this.isChanging()) return;

			var index = this.options.random ? this.newRandomIndex() : this.newIndex(delta),
			    event = this.createEvent(index);

			if (index == this.index) {
				this.changing = false;
				return;
			}

			this.index = index;
			this.options.callback(event);
		}
	}]);

	return SlideManager;
}();
