import './style.css'

import { gsap } from 'gsap'
import Slidemanager from './lib/slidemanager.js'

const sliders = document.querySelectorAll('.slider')
const previousBtn = document.querySelector('.previous')
const nextBtn = document.querySelector('.next')
const elems = [...document.querySelectorAll('.slider-ghost div')]
const xMargin = sliders[0].children[1].offsetLeft - sliders[0].children[1].offsetWidth
const xWidth = sliders[0].children[1].offsetWidth
const xOffset = xMargin + xWidth

const callback = ({ current, done }) => {
  gsap.to(sliders, {
    duration: 0.5,
    x: -xOffset * current,
    ease: 'circ.inOut',
    onComplete: done
  })

  if (current === 0) previousBtn.setAttribute('disabled', '')
  else previousBtn.removeAttribute('disabled')

  if (current === slidemanager.max - 1) nextBtn.setAttribute('disabled', '')
  else nextBtn.removeAttribute('disabled')
}

// eslint-disable-next-line no-unused-vars
const slidemanager = new Slidemanager({
  el: sliders[1],
  callback,
  mouseSwipe: true
})

console.log(slidemanager)

previousBtn.addEventListener('click', () => {
  slidemanager.prev()
})

nextBtn.addEventListener('click', () => {
  slidemanager.next()
})

const onClickEl = ({ target }) => {
  const index = elems.indexOf(target)

  slidemanager.goTo(index)
}

for (const el of elems) {
  el.addEventListener('click', onClickEl)
}