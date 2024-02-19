import { setRafInterval, clearRafInterval } from './raf-interval'

/**
 * Creates a slidemanager instance.
 *
 * @class
 */
export default class Slidemanager {

  #touchStartFn;
  #touchEndFn;
  #intervalID;
  #touch;

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
  constructor(opt = {}) {
    if (!opt.callback) {
      console.warn('Slidemanager: Missing `callback` property in constructor.')

      return
    }

    if (this.max === -1) {
      console.warn('Slidemanager: Missing `el` or `length` property in constructor.')

      return
    }

    this.#bindMethods()

    const defaults = {
      el: null,
      loop: false,
      random: false,
      vertical: false,
      callback: this.done,
      auto: false,
      interval: 5,
      init: true,
      swipe: true,
      mouseSwipe: false,
      startAt: 0,
      threshold: 60
    }

    this.options = Object.assign(defaults, opt)

    this.el = opt.el
    this.changing = false
    this.max = opt.length > 0 ? opt.length : opt.el && opt.el.children ? opt.el.children.length : -1
    this.index = !isNaN(opt.startAt) && opt.startAt !== defaults.startAt ? Math.max(0, Math.min(opt.startAt, this.max)) : 0

    this.#intervalID = null

    this.#touch = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    }

    this.diagonalMax = 125

    if (this.options.init) this.init()
  }

  /**
   * Binds the methods to this instance.
   *
   * @private
   * @returns {void}
   */
  #bindMethods() {
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.#touchStartFn = this.#touchStart.bind(this)
    this.#touchEndFn = this.#touchEnd.bind(this)
    this.done = this.done.bind(this)
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
    if (this.max === 0) return null

    if (this.options.auto) this.start()
    if (this.options.swipe) this.#events()

    return this
  }

  /**
   * Goes to the previous element in the slider.
   *
   * @public
   * @returns {void}
   */
  prev() {
    this.goTo(this.index - 1)
  }

  /**
   * Goes to the next element in the slider.
   *
   * @public
   * @returns {void}
   */
  next() {
    this.goTo(this.index + 1)
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
  goTo(index, data) {
    if (index === this.index || this.#isChanging()) return

    const checkedIndex = this.#checkLoop(index)

    if (checkedIndex === this.index) {
      this.changing = false

      return
    }

    const event = this.#createEvent(checkedIndex, data)

    if (this.options.auto) this.stop()

    this.index = checkedIndex
    this.options.callback(event)
  }

  /**
   * Starts the `auto` timer.
   *
   * @public
   * @returns {void}
   */
  start() {
    if (!this.options.auto || this.#isChanging()) return

    if (this.#intervalID) this.stop()

    this.#intervalID = setRafInterval(this.#intervalFn.bind(this), this.options.interval * 1000)
  }

  /**
   * Stops the `auto` timer.
   *
   * @public
   * @returns {void}
   */
  stop() {
    if (!this.options.auto || this.#isChanging()) return

    clearRafInterval(this.#intervalID)

    this.#intervalID = null
  }

  /**
   * Call this method when your animation between slides is over.
   *
   * @public
   * @returns {void}
   */
  done() {
    this.changing = false

    if (this.options.auto) this.start()
  }

  // Private functions

  /**
   * Initiates the events (touch swipe and mouse swipe).
   *
   * @private
   * @returns {void}
   */
  #events() {
    if (!this.el) return

    if (this.options.mouseSwipe) {
      this.el.addEventListener('mousedown', this.#touchStartFn)
      this.el.addEventListener('mouseup', this.#touchEndFn)
    }

    this.el.addEventListener('touchstart', this.#touchStartFn)
    this.el.addEventListener('touchend', this.#touchEndFn)
  }

  /**
   * The touchstart event callback.
   *
   * @private
   * @param {TouchEvent} event - The TouchEvent.
   */
  #touchStart(event) {
    this.#touch.startX = event.type === 'touchstart' ? event.touches[0].screenX : event.screenX
    this.#touch.startY = event.type === 'touchstart' ? event.touches[0].screenY : event.screenY
  }

  /**
   * The touchend event callback.
   *
   * @private
   * @param {TouchEvent} event - The TouchEvent.
   */
  #touchEnd(event) {
    this.#touch.endX = event.type === 'touchend' ? event.changedTouches[0].screenX : event.screenX
    this.#touch.endY = event.type === 'touchend' ? event.changedTouches[0].screenY : event.screenY

    this.#handleSwipe()
  }

  /**
   * Checks if the touch gesture is going to X axis or not.
   *
   * @private
   * @returns {Boolean} - `true` if the gesture is going to X axis, `false` if not going to X axis.
   */
  #isGoingToX() {
    return this.#touch.endX < this.#touch.startX && this.#touch.startX - this.#touch.endX <= this.diagonalMax || this.#touch.endX > this.#touch.startX && this.#touch.endX - this.#touch.startX <= this.diagonalMax
  }

  /**
   * Checks if the touch gesture is going to Y axis or not.
   *
   * @private
   * @returns {Boolean} - `true` if the gesture is going to Y axis, `false` if not going to Y axis.
   */
  #isGoingToY() {
    return this.#touch.endY < this.#touch.startY && this.#touch.startY - this.#touch.endY <= this.diagonalMax || this.#touch.endY > this.#touch.startY && this.#touch.endY - this.#touch.startY <= this.diagonalMax
  }

  /**
   * Manages the touchend event calculation to define if a slide needs to be made or not.
   *
   * @private
   * @returns {void}
   */
  #handleSwipe() {
    if (this.changing) return

    if (this.options.vertical) {
      if (this.#touch.endY < this.#touch.startY && this.#touch.startY - this.#touch.endY >= this.options.threshold) {
        if (this.#isGoingToX()) this.#callback(-1)
      }
      if (this.#touch.endY > this.#touch.startY && this.#touch.endY - this.#touch.startY >= this.options.threshold) {
        if (this.#isGoingToX()) this.#callback(1)
      }
    } else {
      if (this.#touch.endX < this.#touch.startX && this.#touch.startX - this.#touch.endX >= this.options.threshold) {
        if (this.#isGoingToY()) this.#callback(-1)
      }
      if (this.#touch.endX > this.#touch.startX && this.#touch.endX - this.#touch.startX >= this.options.threshold) {
        if (this.#isGoingToY()) this.#callback(1)
      }
    }
  }

  /**
   * The internal interval function called when the `auto` timer is over.
   *
   * @private
   * @returns {void}
   */
  #intervalFn() {
    if (this.changing) return

    this.#callback(-1)
  }

  /**
   * Checks if the slider is animating.
   *
   * @private
   * @returns {Boolean} - `true` if the slider is currently waiting for an animation to be other, `false` otherwise.
   */
  #isChanging() {
    if (this.changing) return true

    this.changing = true

    return false
  }

  /**
   * Returns a new index from a given direction.
   *
   * @param {Number} delta - The direction of the index change.
   *
   * @private
   * @returns {Number} - The new index.
   */
  #newIndex(delta) {
    return this.#checkLoop(delta > 0 ? this.index - 1 : this.index + 1)
  }

  /**
   * Returrns a new random index that is not the current one.
   *
   * @private
   * @returns {Number} - The new index.
   */
  #newRandomIndex() {
    let randIndex

    do {
      randIndex = Math.floor(Math.random() * this.max)
    } while (randIndex === this.index)

    return randIndex
  }

  /**
   * Gives a new index by checking if it needs to loop or not.
   *
   * @param {Number} index - The target index.
   *
   * @private
   * @returns {Number} - The new index.
   */
  #checkLoop(index) {
    return index < 0 ? this.options.loop ? this.max - 1 : 0 : index > this.max - 1 ? this.options.loop ? 0 : this.max - 1 : index
  }

  /**
   * Creates an object with data that will be given to user in their `callback` method.
   *
   * @param {Number} newIndex - The new index.
   * @param {*} data - The custom data given by user in the `goTo` method.
   *
   * @private
   * @returns {Object} - An object ready to be sent to user's `callback`.
   */
  #createEvent(newIndex, data) {
    let direction = newIndex > this.index ? 1 : -1

    if (this.index === 0 && newIndex === this.max - 1) direction = -1
    else if (this.index === this.max - 1 && newIndex === 0) direction = 1

    return {
      current: newIndex,
      previous: this.index,
      direction,
      data,
      done: this.done
    }
  }

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
  #callback(delta) {
    if (this.#isChanging()) return

    const index = this.options.random ? this.#newRandomIndex() : this.#newIndex(delta)

    if (index === this.index) {
      this.changing = false

      return
    }

    const event = this.#createEvent(index)

    if (this.options.auto) this.stop()

    this.index = index
    this.options.callback(event)
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
    if (this.max === 0) return null

    this.changing = false

    if (this.options.swipe && this.el) {
      if (this.options.mouseSwipe) {
        this.el.removeEventListener('mousedown', this.#touchStartFn)
        this.el.removeEventListener('mouseup', this.#touchEndFn)
      }

      this.el.removeEventListener('touchstart', this.#touchStartFn)
      this.el.removeEventListener('touchend', this.#touchEndFn)
    }

    if (this.options.auto) this.stop()

    return this
  }
}
