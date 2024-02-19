var y = (n, t, e) => {
  if (!t.has(n))
    throw TypeError("Cannot " + e);
};
var i = (n, t, e) => (y(n, t, "read from private field"), e ? e.call(n) : t.get(n)), r = (n, t, e) => {
  if (t.has(n))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(n) : t.set(n, e);
}, u = (n, t, e, a) => (y(n, t, "write to private field"), a ? a.call(n, e) : t.set(n, e), e);
var h = (n, t, e) => (y(n, t, "access private method"), e);
const g = [];
let A = -1, F = !1, N = null;
const P = (n, t) => {
  if (A++, g.push({
    id: A,
    fn: n,
    interval: t,
    lastTime: performance.now()
  }), !F) {
    const e = () => {
      N = requestAnimationFrame(e), g.forEach((a) => {
        (a.interval < 17 || performance.now() - a.lastTime >= a.interval) && (a.fn(), a.lastTime = performance.now());
      });
    };
    F = !0, e();
  }
  return A;
}, Q = (n) => {
  for (let t = 0; t < g.length; t++)
    if (n === g[t].id) {
      g.splice(t, 1);
      break;
    }
  g.length === 0 && (cancelAnimationFrame(N), F = !1);
};
var o, l, d, s, b, j, w, C, k, D, E, O, x, I, X, R, M, z, T, B, f, m, L, H, S, J, Y, q, v, G, c, p;
class V {
  /**
   * Creates a slidemanager instance.
   *
   * @param {Object} opt - An object with the desired parameters.
   * @param {Element} opt.el - A DOM element. If given, the number of elements will depends on its children count.
   * @param {Number} opt.length - The number of elements to slide through (if not given, it will be the `el` children count).
   * @param {Function} opt.callback - The callback method in which you will be able to animate to a new slide.
   * @param {Boolean} [opt.loop=false] - Whether the slider should loop or not.
   * @param {Boolean} [opt.random=false] - Whether the slider should go to a random index instead of previous and next.
   * @param {Boolean} [opt.vertical=false] - If enabled, the swipe and mouseSwipe gestures will check for a vertical movement (`swipe` or `mouseSwipe` must be set to true for this parameter to take effect).
   * @param {Boolean} [opt.auto=false] - If enabled, the slider will automatically go to a new slide after a while.
   * @param {Number} [opt.interval=5] - The number of seconds to wait between two slides (only works if `auto` is set to `true`).
   * @param {Boolean} [opt.init=true] - If set to `false`, the slidemanager will not initiate its events right away. You will have to call `.init()` to start listening for events and/or launching set timer if `auto` is enabled.
   * @param {Boolean} [opt.swipe=true] - By default, the touch swipe movement is enabled.
   * @param {Boolean} [opt.mouseSwipe=false] - By default, the mouse swipe movement is disabled.
   * @param {Number} [opt.startAt=0] - The starting index of the slider.
   * @param {Number} [opt.threshold=60] - The amount of pixel to swipe before starting a navigation to a new slide (applies to both touch swipe and mouse swipe).
   *
   * @returns {void}
   * @constructor
   */
  constructor(t = {}) {
    /**
     * Binds the methods to this instance.
     *
     * @private
     * @returns {void}
     */
    r(this, b);
    // Private functions
    /**
     * Initiates the events (touch swipe and mouse swipe).
     *
     * @private
     * @returns {void}
     */
    r(this, w);
    /**
     * The touchstart event callback.
     *
     * @private
     * @param {TouchEvent} event - The TouchEvent.
     */
    r(this, k);
    /**
     * The touchend event callback.
     *
     * @private
     * @param {TouchEvent} event - The TouchEvent.
     */
    r(this, E);
    /**
     * Checks if the touch gesture is going to X axis or not.
     *
     * @private
     * @returns {Boolean} - `true` if the gesture is going to X axis, `false` if not going to X axis.
     */
    r(this, x);
    /**
     * Checks if the touch gesture is going to Y axis or not.
     *
     * @private
     * @returns {Boolean} - `true` if the gesture is going to Y axis, `false` if not going to Y axis.
     */
    r(this, X);
    /**
     * Manages the touchend event calculation to define if a slide needs to be made or not.
     *
     * @private
     * @returns {void}
     */
    r(this, M);
    /**
     * The internal interval function called when the `auto` timer is over.
     *
     * @private
     * @returns {void}
     */
    r(this, T);
    /**
     * Checks if the slider is animating.
     *
     * @private
     * @returns {Boolean} - `true` if the slider is currently waiting for an animation to be other, `false` otherwise.
     */
    r(this, f);
    /**
     * Returns a new index from a given direction.
     *
     * @param {Number} delta - The direction of the index change.
     *
     * @private
     * @returns {Number} - The new index.
     */
    r(this, L);
    /**
     * Returrns a new random index that is not the current one.
     *
     * @private
     * @returns {Number} - The new index.
     */
    r(this, S);
    /**
     * Gives a new index by checking if it needs to loop or not.
     *
     * @param {Number} index - The target index.
     *
     * @private
     * @returns {Number} - The new index.
     */
    r(this, Y);
    /**
     * Creates an object with data that will be given to user in their `callback` method.
     *
     * @param {Number} newIndex - The new index.
     * @param {*} data - The custom data given by user in the `goTo` method.
     *
     * @private
     * @returns {Object} - An object ready to be sent to user's `callback`.
     */
    r(this, v);
    /**
     * Gets a new index based on a targetted one.
     *
     * Calls user's `callback` with the correct data in its parameter.
     *
     * @param {Number} delta - The targetted index.
     *
     * @private
     * @returns {void}
     */
    r(this, c);
    r(this, o, void 0);
    r(this, l, void 0);
    r(this, d, void 0);
    r(this, s, void 0);
    if (!t.callback) {
      console.warn("Slidemanager: Missing `callback` property in constructor.");
      return;
    }
    if (this.max === -1) {
      console.warn("Slidemanager: Missing `el` or `length` property in constructor.");
      return;
    }
    h(this, b, j).call(this);
    const e = {
      el: null,
      loop: !1,
      random: !1,
      vertical: !1,
      callback: this.done,
      auto: !1,
      interval: 5,
      init: !0,
      swipe: !0,
      mouseSwipe: !1,
      startAt: 0,
      threshold: 60
    };
    this.options = Object.assign(e, t), this.el = t.el, this.changing = !1, this.max = t.length > 0 ? t.length : t.el && t.el.children ? t.el.children.length : -1, this.index = !isNaN(t.startAt) && t.startAt !== e.startAt ? Math.max(0, Math.min(t.startAt, this.max)) : 0, u(this, d, null), u(this, s, {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    }), this.diagonalMax = 125, this.options.init && this.init();
  }
  // Public functions
  /**
   * Initiates the swipe events if enabled.
   * Also starts the auto timer if enabled.
   *
   * This method is automatically called by constructor by default.
   *
   * @public
   * @returns {Slidemanager} - This instance.
   */
  init() {
    return this.max === 0 ? null : (this.options.auto && this.start(), this.options.swipe && h(this, w, C).call(this), this);
  }
  /**
   * Goes to the previous element in the slider.
   *
   * @public
   * @returns {void}
   */
  prev() {
    this.goTo(this.index - 1);
  }
  /**
   * Goes to the next element in the slider.
   *
   * @public
   * @returns {void}
   */
  next() {
    this.goTo(this.index + 1);
  }
  /**
   * Goes to a given element in the slider.
   *
   * @param {Number} index - The target index you want to move to.
   * @param {*} data - Any data you want to retreive when the `callback` will be called.
   *
   * @public
   * @returns {void}
   */
  goTo(t, e) {
    if (t === this.index || h(this, f, m).call(this))
      return;
    const a = h(this, Y, q).call(this, t);
    if (a === this.index) {
      this.changing = !1;
      return;
    }
    const K = h(this, v, G).call(this, a, e);
    this.options.auto && this.stop(), this.index = a, this.options.callback(K);
  }
  /**
   * Starts the `auto` timer.
   *
   * @public
   * @returns {void}
   */
  start() {
    !this.options.auto || h(this, f, m).call(this) || (i(this, d) && this.stop(), u(this, d, P(h(this, T, B).bind(this), this.options.interval * 1e3)));
  }
  /**
   * Stops the `auto` timer.
   *
   * @public
   * @returns {void}
   */
  stop() {
    !this.options.auto || h(this, f, m).call(this) || (Q(i(this, d)), u(this, d, null));
  }
  /**
   * Call this method when your animation between slides is over.
   *
   * @public
   * @returns {void}
   */
  done() {
    this.changing = !1, this.options.auto && this.start();
  }
  /**
   * Destroys the slidemanager.
   *
   * Removes the eventlisteners and kills the auto timer.
   *
   * @public
   * @returns {Slidemanager} - This instance.
   */
  destroy() {
    return this.max === 0 ? null : (this.changing = !1, this.options.swipe && this.el && (this.options.mouseSwipe && (this.el.removeEventListener("mousedown", i(this, o)), this.el.removeEventListener("mouseup", i(this, l))), this.el.removeEventListener("touchstart", i(this, o)), this.el.removeEventListener("touchend", i(this, l))), this.options.auto && this.stop(), this);
  }
}
o = new WeakMap(), l = new WeakMap(), d = new WeakMap(), s = new WeakMap(), b = new WeakSet(), j = function() {
  this.start = this.start.bind(this), this.stop = this.stop.bind(this), u(this, o, h(this, k, D).bind(this)), u(this, l, h(this, E, O).bind(this)), this.done = this.done.bind(this);
}, w = new WeakSet(), C = function() {
  this.el && (this.options.mouseSwipe && (this.el.addEventListener("mousedown", i(this, o)), this.el.addEventListener("mouseup", i(this, l))), this.el.addEventListener("touchstart", i(this, o)), this.el.addEventListener("touchend", i(this, l)));
}, k = new WeakSet(), D = function(t) {
  i(this, s).startX = t.type === "touchstart" ? t.touches[0].screenX : t.screenX, i(this, s).startY = t.type === "touchstart" ? t.touches[0].screenY : t.screenY;
}, E = new WeakSet(), O = function(t) {
  i(this, s).endX = t.type === "touchend" ? t.changedTouches[0].screenX : t.screenX, i(this, s).endY = t.type === "touchend" ? t.changedTouches[0].screenY : t.screenY, h(this, M, z).call(this);
}, x = new WeakSet(), I = function() {
  return i(this, s).endX < i(this, s).startX && i(this, s).startX - i(this, s).endX <= this.diagonalMax || i(this, s).endX > i(this, s).startX && i(this, s).endX - i(this, s).startX <= this.diagonalMax;
}, X = new WeakSet(), R = function() {
  return i(this, s).endY < i(this, s).startY && i(this, s).startY - i(this, s).endY <= this.diagonalMax || i(this, s).endY > i(this, s).startY && i(this, s).endY - i(this, s).startY <= this.diagonalMax;
}, M = new WeakSet(), z = function() {
  this.changing || (this.options.vertical ? (i(this, s).endY < i(this, s).startY && i(this, s).startY - i(this, s).endY >= this.options.threshold && h(this, x, I).call(this) && h(this, c, p).call(this, -1), i(this, s).endY > i(this, s).startY && i(this, s).endY - i(this, s).startY >= this.options.threshold && h(this, x, I).call(this) && h(this, c, p).call(this, 1)) : (i(this, s).endX < i(this, s).startX && i(this, s).startX - i(this, s).endX >= this.options.threshold && h(this, X, R).call(this) && h(this, c, p).call(this, -1), i(this, s).endX > i(this, s).startX && i(this, s).endX - i(this, s).startX >= this.options.threshold && h(this, X, R).call(this) && h(this, c, p).call(this, 1)));
}, T = new WeakSet(), B = function() {
  this.changing || h(this, c, p).call(this, -1);
}, f = new WeakSet(), m = function() {
  return this.changing ? !0 : (this.changing = !0, !1);
}, L = new WeakSet(), H = function(t) {
  return h(this, Y, q).call(this, t > 0 ? this.index - 1 : this.index + 1);
}, S = new WeakSet(), J = function() {
  let t;
  do
    t = Math.floor(Math.random() * this.max);
  while (t === this.index);
  return t;
}, Y = new WeakSet(), q = function(t) {
  return t < 0 ? this.options.loop ? this.max - 1 : 0 : t > this.max - 1 ? this.options.loop ? 0 : this.max - 1 : t;
}, v = new WeakSet(), G = function(t, e) {
  let a = t > this.index ? 1 : -1;
  return this.index === 0 && t === this.max - 1 ? a = -1 : this.index === this.max - 1 && t === 0 && (a = 1), {
    current: t,
    previous: this.index,
    direction: a,
    data: e,
    done: this.done
  };
}, c = new WeakSet(), p = function(t) {
  if (h(this, f, m).call(this))
    return;
  const e = this.options.random ? h(this, S, J).call(this) : h(this, L, H).call(this, t);
  if (e === this.index) {
    this.changing = !1;
    return;
  }
  const a = h(this, v, G).call(this, e);
  this.options.auto && this.stop(), this.index = e, this.options.callback(a);
};
export {
  V as default
};
