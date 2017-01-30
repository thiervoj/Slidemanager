# SlideManager
Simple slide manager. Inspired by [Slideer](https://github.com/liqueflies/slideer) and Baptiste Briel's [slide-manager](https://github.com/baptistebriel/slider-manager)

## Usage
```javascript
const slides = document.querySelectorAll('.slide')
const slideWrapper = document.getElementById('gallery')

const slider = new SlideManager(slideWrapper, {
  callback: function(event) {
    const tl = new TimelineLite({
      onComplete: function() {
        slider.changing = false;
      }
    })

    // Your animations here
  }
})

slider.init()
```

### Element
- `el` : slider wrapper element to attach swipe event

### Options
- `callback` (`function`) : called when user swipes or slide changes
- `loop` (`boolean`) : whether to stop at the last/first slide or not
- `auto` (`boolean`) : automatically switch to the next slide
- `interval` (`number`) : if `auto` is set to `true`, specifies the interval in seconds between each slide change
- `vertical` (`boolean`) : if set to `true`, the swipe movement to change the current slide will be vertical

### Methods
- `init` : add event listeners
- `destroy` : remove event listeners
- `getIndex` : get the current active index
- `goTo(index)` : goes to the specified index


## License

MIT, see [LICENSE.md](http://github.com/thiervoj/SlideManager/blob/master/LICENSE.md) for details.
