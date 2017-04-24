# 👨🏼‍🔧 SlideManager
Simple slide manager. Inspired by 🦌 [Slideer](https://github.com/liqueflies/slideer) and Baptiste Briel's [slide-manager](https://github.com/baptistebriel/slider-manager)

## Installation
With npm :

```
npm install slidemanager
```

With Yarn :

```
yarn add slidemanager
```

❗️**Don't forget to import** `hammerjs` **to use** `slidemanager` 🔨

## Usage
```javascript
const slides = document.querySelectorAll('.slide'),
  slideWrapper = document.getElementById('gallery')

const slider = new SlideManager(slideWrapper, {
  callback: (event) => {
    const tl = new TimelineLite({
      onComplete: () => {
        slider.done() // Call done() when you are done
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
- ℹ️  `callback` : function called when user swipes or slide changes automatically
- 🔄  `loop` : whether to stop at the last/first slide or not. (Default `false`)
- ▶️  `auto` : set it to `true` to automatically switch to the next slide. (Default `false`)
- ⏯  `interval` : specifies the interval in seconds between each slide change. Works when `auto` is set to `true`. (Default `5`)
- ↕️  `vertical` : if set to `true`, the swipe movement to change the current slide will need to be vertical. (Default `false`)
- 🔢  `length` : number of slides. If not given, The number of slides will be the length of the direct children
- *️⃣  `hammer` : if `false` hammerjs is not needed and the swipe movement detection is disabled. (Default `true`)
- 🔀  `random` : Switch to random slides instead of next and previous ones. Enables automatically the `loop` option. (Default `false`)
- #️⃣  `startAt` : The index from which to start the slider on initialization. (Default `0`)

### Methods
- 🛠  `init` : add event listeners
- ⚰️  `destroy` : remove event listeners
- 🔍  `getIndex` : get the current active index
- 🚗  `goTo(index)` : goes to the specified index
- 👌  `done` : call this function when all your animations are over

## Callback
The `callback` function has one parameter named `event`, here is its structure :

- `event.current` : Current (new) index
- `event.previous` : Previous index
- `event.direction` : 1 for next, -1 for previous


## License

MIT, see [LICENSE.md](https://github.com/thiervoj/SlideManager/blob/master/LICENSE.md) for details.
