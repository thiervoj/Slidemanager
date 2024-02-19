const queue = []
let id = -1
let ticking = false
let tickId = null

export const setRafInterval = (fn, interval) => {
  id++

  queue.push({
    id,
    fn,
    interval,
    lastTime: performance.now()
  })

  if (!ticking) {
    const tick = () => {
      tickId = requestAnimationFrame(tick)

      queue.forEach((item) => {
        if (item.interval < 17 || performance.now() - item.lastTime >= item.interval) {
          item.fn()
          item.lastTime = performance.now()
        }
      })
    }

    ticking = true

    tick()
  }

  return id
}

export const clearRafInterval = (rafID) => {
  for (let i = 0; i < queue.length; i++) {
    if (rafID === queue[i].id) {
      queue.splice(i, 1)

      break
    }
  }

  if (queue.length === 0) {
    cancelAnimationFrame(tickId)

    ticking = false
  }
}
