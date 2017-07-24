# 👨🏼‍🔧 SlideManager
Simple slide manager 💫 Focused on animations.

## Installation
With npm :

```
npm install slidemanager
```

With Yarn :

```
yarn add slidemanager
```

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
```

## Parameters
### Element
- `el` : slider wrapper element to attach the swipe event

### Options
- ℹ️  `callback` : function called when user swipes or slide changes automatically
- 🔄  `loop` : whether to stop at the last/first slide or not. (Default `false`)
- ▶️  `auto` : set it to `true` to automatically switch to the next slide. (Default `false`)
- ⏯  `interval` : specifies the interval in seconds between each slide change. `auto` must be `true`. (Default `5`)
- ↕️  `vertical` : if set to `true`, the swipe movement to change the current slide will need to be vertical. (Default `false`)
- 🔢  `length` : number of slides. If not given, The number of slides will be the number of element's children
- *️⃣  `swipe` : if `false`, the swipe movement detection is disabled. (Default `true`)
- 🔀  `random` : Switch to random slides instead of next and previous ones. Enables automatically the `loop` option. (Default `false`)
- #️⃣  `startAt` : The index from which to start the slider on initialization. (Default `0`)
- ⏭  `threshold` : Amount of pixels required to change slide when swiping (Default `60`)
- ⏺  `init` : Whether to init the manager immediately or not. If `false`, call the `.init()` method to initialize the manager. (Default `true`)

### Methods
- 🛠  `init` : add event listeners. Call this when the `init` option is set to `false`
- ⚰️  `destroy` : remove event listeners and stops the slider
- 🔍  `getIndex` : get the current index
- 🚗  `goTo(index)` : goes to the specified index
- 🚦  `pause` / `resume` : pauses/resumes the automatic slide switching
- 👌  `done` : call this function when all your animations are over

## Callback
The `callback` function has one parameter named `event` :

- `event.current` : Current (new) index
- `event.previous` : Previous index
- `event.direction` : 1 for next, -1 for previous


## License

MIT, see [LICENSE.md](https://github.com/thiervoj/SlideManager/blob/master/LICENSE.md) for details.
