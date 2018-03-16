# 👨🏼‍🔧 SlideManager
Simple slide manager 💫 Focused on animations.

## Installation
```
yarn add slidemanager
```

## Usage
```javascript
const slideWrapper = document.querySelector('#gallery')

const slider = new SlideManager(slideWrapper, {
  callback(event) {
    // Your animations here
    // ...

    // Call done() when your animation is complete
    this.done()
  }
})
```

## Parameters
### Element
- `el` : slider wrapper element to attach the swipe event

### Options
- ℹ️  `callback` : function called when user swipes or slide changes automatically. The scope is the slider's scope
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

## Methods
- 🛠  `init` : adds event listeners. Call this when the `init` option is set to `false`
- ⚰️  `destroy` : removes event listeners and stops the slider
- 🔍  `getIndex` : gets the current index
- 🚗  `goTo(index, skipAnims)` : goes to the specified index, you can choose to skip the animations (read the Callback part for details)
- 🚦  `pause` / `resume` : pauses/resumes the automatic sliding
- 👌  `done` : call this function when your animations are over

## Callback
The `callback` function has one parameter named `event` :

- `event.new` : New index
- `event.previous` : Previous index
- `event.direction` : 1 for next, -1 for previous
- `event.skipAnims` : true if `skipAnims` has been set to true when calling `goTo()`

## License

MIT, see [LICENSE.md](https://github.com/thiervoj/SlideManager/blob/master/LICENSE.md) for details.
