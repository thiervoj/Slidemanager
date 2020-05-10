import { setRafInterval, clearRafInterval } from './raf-interval'

export default class Slidemanager {
  constructor(opt = {}) {
    if (!opt.callback) {
      console.warn('Slidemanager: Missing `callback` property in constructor.')

      return
    }

    if (this.max === -1) {
      console.warn('Slidemanager: Missing `el` or `length` property in constructor.')

      return
    }

    this.bindMethods()

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

    this.intervalID = null

    this.touch = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    }

    this.diagonalMax = 125

    if (this.options.init) this.init()
  }

  bindMethods() {
    this.intervalFn = this.intervalFn.bind(this)
    this.startAuto = this.startAuto.bind(this)
    this.stopAuto = this.stopAuto.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
    this.done = this.done.bind(this)
  }

  // Public functions
  init() {
    if (this.max === 0) return null

    if (this.options.auto) this.startAuto()

    if (this.options.swipe) this.events()

    return this
  }

  destroy() {
    if (this.max === 0) return null

    this.changing = false

    if (this.options.swipe && this.el) {
      if (this.options.mouseSwipe) {
        this.el.removeEventListener('mousedown', this.touchStart)
        this.el.removeEventListener('mouseup', this.touchEnd)
      }

      this.el.removeEventListener('touchstart', this.touchStart)
      this.el.removeEventListener('touchend', this.touchEnd)
    }

    if (this.options.auto) this.stopAuto()

    return this
  }

  getIndex() {
    return this.index
  }

  prev() {
    this.goTo(this.index - 1)
  }

  next() {
    this.goTo(this.index + 1)
  }

  goTo(index, data) {
    if (index === this.index || this.isChanging()) return

    const checkedIndex = this.checkLoop(index)
    const event = this.createEvent(checkedIndex, data)

    if (checkedIndex === this.index) {
      this.changing = false

      return
    }

    this.index = checkedIndex
    this.options.callback(event)
  }

  done() {
    this.changing = false

    if (this.options.auto) this.startAuto()
  }

  // Private functions
  events() {
    if (!this.el) return

    if (this.options.mouseSwipe) {
      this.el.addEventListener('mousedown', this.touchStart)
      this.el.addEventListener('mouseup', this.touchEnd)
    }

    this.el.addEventListener('touchstart', this.touchStart)
    this.el.addEventListener('touchend', this.touchEnd)
  }

  touchStart(event) {
    this.touch.startX = event.type === 'touchstart' ? event.touches[0].screenX : event.screenX
    this.touch.startY = event.type === 'touchstart' ? event.touches[0].screenY : event.screenY
  }

  touchEnd(event) {
    this.touch.endX = event.type === 'touchend' ? event.changedTouches[0].screenX : event.screenX
    this.touch.endY = event.type === 'touchend' ? event.changedTouches[0].screenY : event.screenY

    this.handleSwipe()
  }

  isGoingToX() {
    return this.touch.endX < this.touch.startX && this.touch.startX - this.touch.endX <= this.diagonalMax || this.touch.endX > this.touch.startX && this.touch.endX - this.touch.startX <= this.diagonalMax
  }

  isGoingToY() {
    return this.touch.endY < this.touch.startY && this.touch.startY - this.touch.endY <= this.diagonalMax || this.touch.endY > this.touch.startY && this.touch.endY - this.touch.startY <= this.diagonalMax
  }

  handleSwipe() {
    if (this.changing) return

    if (this.options.vertical) {
      if (this.touch.endY < this.touch.startY && this.touch.startY - this.touch.endY >= this.options.threshold) {
        if (this.isGoingToX()) this.callback(-1)
      }
      if (this.touch.endY > this.touch.startY && this.touch.endY - this.touch.startY >= this.options.threshold) {
        if (this.isGoingToX()) this.callback(1)
      }
    } else {
      if (this.touch.endX < this.touch.startX && this.touch.startX - this.touch.endX >= this.options.threshold) {
        if (this.isGoingToY()) this.callback(-1)
      }
      if (this.touch.endX > this.touch.startX && this.touch.endX - this.touch.startX >= this.options.threshold) {
        if (this.isGoingToY()) this.callback(1)
      }
    }
  }

  startAuto() {
    if (this.intervalID) this.stopAuto()

    this.intervalID = setRafInterval(this.intervalFn, this.options.interval * 1000)
  }

  intervalFn() {
    if (this.changing) return

    this.callback(-1)
  }

  stopAuto() {
    clearRafInterval(this.intervalID)

    this.intervalID = null
  }

  isChanging() {
    if (this.changing) return true

    this.changing = true

    return false
  }

  newIndex(delta) {
    return this.checkLoop(delta > 0 ? this.index - 1 : this.index + 1)
  }

  newRandomIndex() {
    let randIndex

    do {
      randIndex = Math.floor(Math.random() * this.max)
    } while (randIndex === this.index)

    return randIndex
  }

  checkLoop(index) {
    return index < 0 ? this.options.loop ? this.max - 1 : 0 : index > this.max - 1 ? this.options.loop ? 0 : this.max - 1 : index
  }

  createEvent(newIndex, data) {
    let direction = newIndex > this.index ? 1 : -1

    if (this.max > 2) {
      if (this.index === 0 && newIndex === this.max - 1) direction = -1
      else if (this.index === this.max - 1 && newIndex === 0) direction = 1
    }

    return {
      current: newIndex,
      previous: this.index,
      direction,
      data,
      done: this.done
    }
  }

  callback(delta) {
    if (this.isChanging()) return

    const index = this.options.random ? this.newRandomIndex() : this.newIndex(delta)
    const event = this.createEvent(index)

    if (index === this.index) {
      this.changing = false

      return
    }

    if (this.options.auto) this.stopAuto()

    this.index = index
    this.options.callback(event)
  }
}
