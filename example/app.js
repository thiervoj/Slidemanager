import { TimelineLite } from './TweenMax.min.js'
import SlideManager from '../build/SlideManager.js'

document.addEventListener('DOMContentLoaded', () => {
	const slides = document.querySelectorAll('.slide')
	const slideWrapper = document.querySelector('#gallery')
	const message = document.querySelector('#message')

	const slider = new SlideManager(slideWrapper, {
			loop: true,
			auto: true,
			callback(event) {
				const tl = new TimelineLite({
						onComplete: () => {
							this.done()
							message.innerHTML = 'Current : ' + event.new
						}
					})

				tl.to(slides[event.previous], 0.5, {
						alpha: 0,
						display: 'none'
					})
					.to(slides[event.new], 0.5, {
						display: 'block',
						alpha: 1
					})
			}
		})

	message.innerHTML = 'Current : ' + slider.getIndex()
})
