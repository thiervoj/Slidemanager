'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SlideManager = function () {
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

		this.options = {
			loop: opt.loop || false,
			vertical: opt.vertical || false,
			callback: opt.callback,
			auto: opt.auto || false,
			interval: opt.interval || 5
		};

		this.hammer = null;
		this.onSwipe = this.onSwipe.bind(this);
		this.counter = 0;
		this.raf = null;
	}

	// Public functions

	_createClass(SlideManager, [{
		key: 'init',
		value: function init() {
			if (this.max === 0) return;

			this.hammer = new Hammer.Manager(this.el);
			this.hammer.add(new Hammer.Swipe({
				direction: this.options.vertical ? Hammer.DIRECTION_VERTICAL : Hammer.DIRECTION_HORIZONTAL
			}));
			this.hammer.on('swipe', this.onSwipe);

			if (this.options.auto) this.startAuto();

			return this;
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			if (this.max === 0) return;

			this.hammer.off('swipe', this.onSwipe);
			this.hammer.destroy();
			this.hammer = null;

			this.changing = false;

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
			if (index == this.index) return;
			if (this.isChanging()) return;

			var checkedIndex = this.checkLoop(index);
			var event = this.createEvent(checkedIndex);

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
		key: 'startAuto',
		value: function startAuto() {
			this.raf = requestAnimationFrame(this.startAuto.bind(this));

			this.counter++;

			if (this.counter > this.options.interval * 60) {
				this.callback(-1);
				this.counter = 0;
			}
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
		key: 'checkLoop',
		value: function checkLoop(index) {
			return index < 0 ? this.options.loop ? this.max - 1 : 0 : index > this.max - 1 ? this.options.loop ? 0 : this.max - 1 : index;
		}
	}, {
		key: 'createEvent',
		value: function createEvent(newIndex) {
			return {
				current: newIndex,
				previous: this.index,
				direction: newIndex > this.index ? 1 : -1
			};
		}
	}, {
		key: 'callback',
		value: function callback(delta) {
			if (this.isChanging()) return;

			var index = this.newIndex(delta);
			var event = this.createEvent(index);

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
