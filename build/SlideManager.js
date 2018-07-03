'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SlideManager = function () {
	function SlideManager() {
		var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, SlideManager);

		if (!opt.callback) {
			console.error('You must give a callback');

			return;
		}

		this.el = opt.el;
		this.changing = false;
		this.index = 0;
		this.max = -1;

		if (opt.length > 0) this.max = opt.length;else if (this.el.children) this.max = this.el.children.length;

		if (this.max === -1) {
			console.error('You must give an element or a length');

			return;
		}

		var defaults = {
			el: null,
			loop: false,
			random: false,
			vertical: false,
			callback: function callback() {},
			auto: false,
			interval: 5,
			init: true,
			swipe: true,
			mouseSwipe: false,
			threshold: 60
		};

		this.options = _extends(defaults, opt);

		if (opt.startAt !== this.index && opt.startAt > 0) {
			if (opt.startAt > this.max) this.index = this.max;else this.index = opt.startAt;
		}

		this.intervalID = null;
		this.paused = false;

		this.touch = {
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0
		};

		this.diagonalMax = 125;

		this.options.callback = this.options.callback.bind(this);
		this.touchStart = this.touchStart.bind(this);
		this.touchEnd = this.touchEnd.bind(this);

		if (this.options.init) this.init();
	}

	// Public functions


	_createClass(SlideManager, [{
		key: 'init',
		value: function init() {
			if (this.max === 0) return null;

			if (this.options.auto) this.startAuto();
			if (this.options.swipe) this.events();

			return this;
		}
	}, {
		key: 'pause',
		value: function pause() {
			this.paused = true;
		}
	}, {
		key: 'resume',
		value: function resume() {
			this.paused = false;
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			if (this.max === 0) return null;

			this.changing = false;
			this.paused = false;

			if (this.options.swipe && this.el) {
				if (this.options.mouseSwipe) {
					this.el.removeEventListener('mousedown', this.touchStart, false);
					this.el.removeEventListener('mouseup', this.touchEnd, false);
				}

				this.el.removeEventListener('touchstart', this.touchStart, false);
				this.el.removeEventListener('touchend', this.touchEnd, false);
			}

			clearInterval(this.intervalID);
			this.intervalID = null;

			return this;
		}
	}, {
		key: 'getIndex',
		value: function getIndex() {
			return this.index;
		}
	}, {
		key: 'prev',
		value: function prev() {
			this.goTo(this.index - 1);
		}
	}, {
		key: 'next',
		value: function next() {
			this.goTo(this.index + 1);
		}
	}, {
		key: 'goTo',
		value: function goTo(index, skipAnims) {
			if (index === this.index || this.isChanging()) return;

			var checkedIndex = this.checkLoop(index);
			var event = this.createEvent(checkedIndex, skipAnims);

			if (checkedIndex === this.index) {
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

			if (this.options.auto) this.resume();
		}

		// Private functions

	}, {
		key: 'events',
		value: function events() {
			if (!this.el) return;

			if (this.options.mouseSwipe) {
				this.el.addEventListener('mousedown', this.touchStart, false);
				this.el.addEventListener('mouseup', this.touchEnd, false);
			}

			this.el.addEventListener('touchstart', this.touchStart, false);
			this.el.addEventListener('touchend', this.touchEnd, false);
		}
	}, {
		key: 'touchStart',
		value: function touchStart(event) {
			this.touch.startX = event.type === 'touchstart' ? event.touches[0].screenX : event.screenX;
			this.touch.startY = event.type === 'touchstart' ? event.touches[0].screenY : event.screenY;
		}
	}, {
		key: 'touchEnd',
		value: function touchEnd(event) {
			this.touch.endX = event.type === 'touchend' ? event.changedTouches[0].screenX : event.screenX;
			this.touch.endY = event.type === 'touchend' ? event.changedTouches[0].screenY : event.screenY;

			this.handleSwipe();
		}
	}, {
		key: 'isGoingToX',
		value: function isGoingToX() {
			return this.touch.endX < this.touch.startX && this.touch.startX - this.touch.endX <= this.diagonalMax || this.touch.endX > this.touch.startX && this.touch.endX - this.touch.startX <= this.diagonalMax;
		}
	}, {
		key: 'isGoingToY',
		value: function isGoingToY() {
			return this.touch.endY < this.touch.startY && this.touch.startY - this.touch.endY <= this.diagonalMax || this.touch.endY > this.touch.startY && this.touch.endY - this.touch.startY <= this.diagonalMax;
		}
	}, {
		key: 'handleSwipe',
		value: function handleSwipe() {
			if (this.changing) return;

			if (this.options.vertical) {
				if (this.touch.endY < this.touch.startY && this.touch.startY - this.touch.endY >= this.options.threshold) {
					if (this.isGoingToX()) this.callback(-1);
				}
				if (this.touch.endY > this.touch.startY && this.touch.endY - this.touch.startY >= this.options.threshold) {
					if (this.isGoingToX()) this.callback(1);
				}
			} else {
				if (this.touch.endX < this.touch.startX && this.touch.startX - this.touch.endX >= this.options.threshold) {
					if (this.isGoingToY()) this.callback(-1);
				}
				if (this.touch.endX > this.touch.startX && this.touch.endX - this.touch.startX >= this.options.threshold) {
					if (this.isGoingToY()) this.callback(1);
				}
			}
		}
	}, {
		key: 'startAuto',
		value: function startAuto() {
			var _this = this;

			this.intervalID = setInterval(function () {
				if (_this.paused || _this.changing) return;

				_this.callback(-1);
			}, this.options.interval * 1000);
		}
	}, {
		key: 'isChanging',
		value: function isChanging() {
			if (this.changing) return true;

			this.changing = true;

			return false;
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
			} while (randIndex === this.index);

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
			var skipAnims = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var direction = newIndex > this.index ? 1 : -1;

			if (this.index === 0 && newIndex === this.max - 1) direction = -1;else if (this.index === this.max - 1 && newIndex === 0) direction = 1;

			return {
				new: newIndex,
				previous: this.index,
				direction: direction,
				skipAnims: skipAnims
			};
		}
	}, {
		key: 'callback',
		value: function callback(delta) {
			if (this.isChanging()) return;

			var index = this.options.random ? this.newRandomIndex() : this.newIndex(delta);
			var event = this.createEvent(index);

			if (index === this.index) {
				this.changing = false;

				return;
			}

			if (this.options.auto) this.pause();

			this.index = index;
			this.options.callback(event);
		}
	}]);

	return SlideManager;
}();

exports.default = SlideManager;
