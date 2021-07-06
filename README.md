# 👨🏼‍🔧 Slidemanager
[![npm](https://img.shields.io/npm/v/slidemanager.svg)](https://www.npmjs.com/package/slidemanager)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/slidemanager?label=bundle%20size)](https://bundlephobia.com/result?p=slidemanager)
![NpmLicense](https://img.shields.io/npm/l/slidemanager.svg)

Simple slide manager 💫 **Focused on animations**.

## Installation
```bash
npm add slidemanager
```

## Usage
```javascript
import Slidemanager from 'slidemanager'

const slider = new Slidemanager({
  el: document.querySelector('#gallery'),
  callback({ current, previous, direction, done }) {
    // Your animations here
    // ...

    // Call done() when your animation is complete
    done()
  }
})
```

## Parameters
### Options
- 🖼  `el` : DOM element to attach the swipe event. If not given, please provide a `length` parameter
- ℹ️  `callback` : function called when user swipes or slide changes automatically. The scope is the slider's scope
- 🔄  `loop` : whether to stop at the last/first slide or not. (Default `false`)
- ▶️  `auto` : set it to `true` to automatically switch to the next slide. (Default `false`)
- ⏯  `interval` : specifies the interval in seconds between each slide change. `auto` must be `true`. (Default `5`)
- ↕️  `vertical` : if set to `true`, the swipe movement to change the current slide will need to be vertical. (Default `false`)
- 🔢  `length` : number of slides. If not given, The number of slides will be the number of `el`'s children
- *️⃣  `swipe` : if `false`, the swipe movement detection is disabled. (Default `true`)
- 🈁  `mouseSwipe` : Whether the swipe movement must be checked on the mouse or not. (Default `false`)
- 🔀  `random` : Switch to random slides instead of next and previous ones. Enables automatically the `loop` option. (Default `false`)
- #️⃣  `startAt` : The index from which to start the slider on initialization. (Default `0`)
- ⏭  `threshold` : Amount of pixels required to change slide when swiping (Default `60`)
- ⏺  `init` : Whether to init the manager immediately or not. If `false`, call the `.init()` method to initialize the manager. (Default `true`)

## Methods
- 🛠  `init` : adds event listeners. Call this when the `init` option is set to `false`
- ⚰️  `destroy` : removes event listeners and stops the slider
- 🔍  `getIndex` : gets the current index
- 👈  `prev` : goes to the previous slide
- 👉  `next` : goes to the next slide
- 🚗  `goTo(index, data)` : goes to the specified index, you can pass data which can be recovered in the callback
- 🚦  `pause` / `resume` : pauses/resumes the automatic sliding
- 👌  `done` : call this function when your animations are over

## Callback
The `callback` function receives a parameter containing the following properties :

- `current` : New index
- `previous` : Previous index
- `direction` : 1 for next, -1 for previous
- `done` : the function to call when you're done with your animations
- `data` : some data that may be given from a call to `goTo()`

## To do
- Manage `stopAuto` during a transition
- Rename `startAuto` and `stopAuto` to `play` and `stop`
- Add `resume` and `pause` methods

## License

MIT, see [LICENSE.md](https://github.com/thiervoj/SlideManager/blob/master/LICENSE.md) for details.
