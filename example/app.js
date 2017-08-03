import { TimelineLite } from './TweenMax.min.js'
import SlideManager from '../build/SlideManager.min.js'

document.addEventListener('DOMContentLoaded', () => {
	const slides = document.querySelectorAll('.slide'),
		slideWrapper = document.getElementById('gallery'),
		message = document.getElementById('message'),
		slider = new SlideManager(slideWrapper, {
			loop: true,
			auto: true,
			callback: (event) => {
				const tl = new TimelineLite({
						onComplete: () => {
							slider.done()
							message.innerHTML = 'Current : ' + event.current
						}
					})

				tl.to(slides, 0.5, {
						alpha: 0,
						display: 'none'
					})
					.to(slides[event.current], 0.5, {
						display: 'block',
						alpha: 1
					})
			}
		})

	message.innerHTML = 'Current : ' + slider.getIndex()
})
