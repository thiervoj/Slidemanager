import { TimelineLite } from './TweenMax.min.js'
import { SlideManager } from '../build/SlideManager.min.js'

document.addEventListener('DOMContentLoaded', () => {
	let x = 0
	const slides = document.querySelectorAll('.slide'),
		slideWrapper = document.getElementById('gallery'),
		message = document.getElementById('message'),
		slider = new SlideManager(slideWrapper, {
			callback: (event) => {
				const tl = new TimelineLite({
						onComplete: () => {
							slider.done()
							message.innerHTML = 'Current : ' + event.current
						}
					}),
					newX = event.direction == 1 ? -500 : 500

				x += newX

				tl.to(slides, 0.5, { x: x })
			}
		})

	message.innerHTML = 'Current : ' + slider.getIndex()
})
