---
layout: post
title: Creating Your Very Own Chip-8 Emulator
page-id: post
tags: [tutorial]
---

One of the simplest ways to learn how to make your own emulators is to start with a Chip-8 emulator. With only 4KB of memory and 36 instructions, you can be up and running with your very own Chip-8 emulator in less than a day. As well as that, you'll be supplied with the knowledge necessary to move on to bigger, more in-depth emulators.

This will be a very in-depth and long article in the hopes of making sense of everything. Though having a basic understanding of hex, binary, and bitwise operations would be beneficial. Each section is split by the file we're working in, and split again by the function we're working on to hopefully make it easier to follow. Once we're done with each file, I'll provide a link to the full code, with comments.

For this entire article, we'll be referencing the [Chip-8 technical reference](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#2.2) by Cowgod which explains every detail of Chip-8. You can use whatever language you want to make the emulator, though this article will be using JavaScript. I feel it's the simplest language to use for first-time emulator creation considering it provides support for rendering, keyboard, and sound right out of the box. The most important thing is that you understand the process of emulation, so use whatever language you are most comfortable with.

If you do decide to use JavaScript, you'll need to be running a local web server for testing. I use Python for this which allows you to start a web server in the current folder by running `python3 -m http.server`.

We're going to start by creating the `index.html` and `style.css` files, then move on to the renderer, keyboard, speaker, and finally the actual CPU. Our project structure will look like this:

```
- roms
- scripts
    chip8.js
    cpu.js
    keyboard.js
    renderer.js
    speaker.js
index.html
style.css
```

## Index and Styles

There's nothing crazy about these two files, they are very basic. The `index.html` file simply loads in the styles, creates a canvas element, and loads the `chip8.js` file.

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <canvas></canvas>

        <script type="module" src="scripts/chip8.js"></script>
    </body>
</html>
```

The `style.css` file is even simpler, as the only thing being styled is the canvas to make it easier to spot.

```css
canvas {
    border: 2px solid black;
}
```

You won't have to touch these two files again throughout this article, but feel free to style the page in whatever way you'd like.

## renderer.js

Our renderer will handle everything graphics related. It'll initialize our canvas element, toggle pixels within our display, and render those pixels on our canvas.

```javascript
class Renderer {

}

export default Renderer;
```

### constructor(scale)

The first order of business is to construct our renderer. This constructor will take in a single argument, `scale`, which will allow us to scale the display up or down making pixels larger or smaller.

```javascript
class Renderer {
    constructor(scale) {

    }
}

export default Renderer;
```

We need to initialize a few things within this constructor. First, the display size, which for Chip-8 is 64x32 pixels.

```javascript
this.cols = 64;
this.rows = 32;
```

On a modern system, this is incredibly small and hard to see which is why we want to scale up the display to make it more user-friendly. Staying within our constructor, we want to set the scale, grab the canvas, get the context, and set the width and height of the canvas.

```javascript
this.scale = scale;

this.canvas = document.querySelector('canvas');
this.ctx = this.canvas.getContext('2d');

this.canvas.width = this.cols * this.scale;
this.canvas.height = this.rows * this.scale;
```

As you can see, we are using the `scale` variable to increase the width and height of our canvas. We'll be using `scale` again when we start rendering the pixels on the screen.

The last item we need to add to our constructor is an array that'll act as our display. Since a Chip-8 display is 64x32 pixels, the size of our array is simply 64 * 32 (cols * rows), or 2048. Basically, we're representing every pixel, on (1) or off (0), on a Chip-8 display with this array.

```javascript
this.display = new Array(this.cols * this.rows);
```

This will later be used to render pixels within our canvas in the correct places.

### setPixel(x, y)

Whenever our emulator toggles a pixel on or off, the display array will be modified to represent that. Speaking of toggling pixels on or off, let's create the function that's in charge of that. We'll call the function `setPixel` and it'll take an `x` and `y` position as parameters.

```javascript
setPixel(x, y) {

}
```

According to the technical reference, if a pixel is positioned outside of the bounds of the display, it should wrap around to the opposite side, so we need to account for that.

```javascript
if (x > this.cols) {
    x -= this.cols;
} else if (x < 0) {
    x += this.cols;
}

if (y > this.rows) {
    y -= this.rows;
} else if (y < 0) {
    y += this.rows;
}
```

With that figured out, we can properly calculate the location of the pixel on the display.

```javascript
let pixelLoc = x + (y * this.cols);
```

If you're not familiar with bitwise operations, this next piece of code might be confusing. According to the technical reference, sprites are XORed onto the display:

```javascript
this.display[pixelLoc] ^= 1;
```

All that this line is doing is toggling the value at `pixelLoc` (0 to 1 or 1 to 0). A value of 1 means a pixel should be drawn, a value of 0 means a pixel should be erased. From here, we just return a value to signify whether a pixel was erased or not. This part, in particular, is important later on when we get to the CPU and writing the different instructions.

```javascript
return !this.display[pixelLoc];
```

If this returns true, a pixel was erased. If this returns false, nothing was erased. When we get to the instruction that utilizes this function, it'll make more sense.

### clear()

This function completely clears our `display` array by reinitializing it.

```javascript
clear() {
    this.display = new Array(this.cols * this.rows);
}
```

### render()

The `render` function is in charge of rendering the pixels in the `display` array onto the screen. For this project, it will run 60 times per second.

```javascript
render() {
    // Clears the display every render cycle. Typical for a render loop.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Loop through our display array
    for (let i = 0; i < this.cols * this.rows; i++) {
        // Grabs the x position of the pixel based off of `i`
        let x = (i % this.cols) * this.scale;

        // Grabs the y position of the pixel based off of `i`
        let y = Math.floor(i / this.cols) * this.scale;

        // If the value at this.display[i] == 1, then draw a pixel.
        if (this.display[i]) {
            // Set the pixel color to black
            this.ctx.fillStyle = '#000';

            // Place a pixel at position (x, y) with a width and height of scale
            this.ctx.fillRect(x, y, this.scale, this.scale);
        }
    }
}
```

### testRender()

For testing purposes, let's create a function that will draw a couple of pixels on the screen.

```javascript
testRender() {
    this.setPixel(0, 0);
    this.setPixel(5, 2);
}
```

[Full renderer.js Code](https://github.com/Erigitic/chip8-emulator/blob/master/scripts/renderer.js)

## chip8.js

Now that we have our renderer, we need to initialize it within our `chip8.js` file.

```javascript
import Renderer from './renderer.js';

const renderer = new Renderer(10);
```

From here we need to create a loop that runs at, according to the technical reference, 60hz or 60 frames per second. Just like our render function, this is not Chip-8 specific and can be modified a bit to work with practically any other project.

```javascript
let loop;

let fps = 60, fpsInterval, startTime, now, then, elapsed;

function init() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;

    // TESTING CODE. REMOVE WHEN DONE TESTING.
    renderer.testRender();
    renderer.render();
    // END TESTING CODE

    loop = requestAnimationFrame(step);
}

function step() {
    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        // Cycle the CPU. We'll come back to this later and fill it out.
    }

    loop = requestAnimationFrame(step);
}

init();
```

If you start up the web server and load the page in a web browser you should see two pixels drawn on the screen. If you want, play with the scale and find something that works best for you.

## keyboard.js

[Keyboard Reference](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#2.3)

The technical reference tells us that Chip-8 uses a 16-key hex keypad that is laid out as follows:

|     |     |     |     |
| --- | --- | --- | --- |
| 1   | 2   | 3   | C   |
| 4   | 5   | 6   | D   |
| 7   | 8   | 9   | E   |
| A   | 0   | B   | F   |

In order to make this work on modern systems, we have to map a key on our keyboard to each one of these Chip-8 keys. We'll do that within our constructor, as well as a few other things.

### constructor()

```javascript
class Keyboard {
    constructor() {
        this.KEYMAP = {
            49: 0x1, // 1
            50: 0x2, // 2
            51: 0x3, // 3
            52: 0xc, // 4
            81: 0x4, // Q
            87: 0x5, // W
            69: 0x6, // E
            82: 0xD, // R
            65: 0x7, // A
            83: 0x8, // S
            68: 0x9, // D
            70: 0xE, // F
            90: 0xA, // Z
            88: 0x0, // X
            67: 0xB, // C
            86: 0xF  // V
        }

        this.keysPressed = [];

        // Some Chip-8 instructions require waiting for the next keypress. We initialize this function elsewhere when needed.
        this.onNextKeyPress = null;

        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
        window.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }
}

export default Keyboard;
```

Within the constructor, we created a keymap that's mapping keys on our keyboard to keys on the Chip-8 keyboard. As well as that, we have an array to keep track of pressed keys, a null variable (which we'll talk about later), and a couple of event listeners for handling keyboard input.

### isKeyPressed(keyCode)

We need a way to check if a certain key is pressed. This will simply check the `keysPressed` array for the specified Chip-8 `keyCode`.

```javascript
isKeyPressed(keyCode) {
    return this.keysPressed[keyCode];
}
```

### onKeyDown(event)

In our constructor, we added a `keydown` event listener that will call this function when triggered.

```javascript
onKeyDown(event) {
    let key = this.KEYMAP[event.which];
    this.keysPressed[key] = true;

    // Make sure onNextKeyPress is initialized and the pressed key is actually mapped to a Chip-8 key
    if (this.onNextKeyPress !== null && key) {
        this.onNextKeyPress(parseInt(key));
        this.onNextKeyPress = null;
    }
}
```

All we're doing in here is adding the pressed key to our `keysPressed` array, and running `onNextKeyPress` if it's initialized and a valid key was pressed.

Let's talk about that if statement. One of the Chip-8 instructions (`Fx0A`) waits for a keypress before continuing execution. We'll make the `Fx0A` instruction initialize the `onNextKeyPress` function, which will allow us to mimic this behavior of waiting until the next keypress. Once we write this instruction, I'll explain this in more detail as it should make more sense when you see it.

### onKeyUp(event)

We also have an event listener for handling `keyup` events, and this function will be called when that event is triggered.

```javascript
onKeyUp(event) {
    let key = this.KEYMAP[event.which];
    this.keysPressed[key] = false;
}
```

[Full keyboard.js Code](https://github.com/Erigitic/chip8-emulator/blob/master/scripts/keyboard.js)

## chip8.js

With the keyboard class created, we can head back into `chip8.js` and hook the keyboard up.

```javascript
import Renderer from './renderer.js';
import Keyboard from './keyboard.js'; // NEW

const renderer = new Renderer(10);
const keyboard = new Keyboard(); // NEW
```

## speaker.js

Let's make some sounds now. This file is fairly straightforward and involves creating a simple sound and starting/stopping it.

### constructor

```javascript
class Speaker {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;

        this.audioCtx = new AudioContext();

        // Create a gain, which will allow us to control the volume
        this.gain = this.audioCtx.createGain();
        this.finish = this.audioCtx.destination;

        // Connect the gain to the audio context
        this.gain.connect(this.finish);
    }
}

export default Speaker;
```

All we're doing here is creating an `AudioContext` and connecting a gain to it so we can control the volume. I won't be adding volume control in this tutorial, but if you'd like to add it yourself you simply use the following:

```javascript
// Mute the audio
this.gain.setValueAtTime(0, this.audioCtx.currentTime);
```

```javascript
// Unmute the audio
this.gain.setValueAtTime(1, this.audioCtx.currentTime);
```

### play(frequency)

This function does exactly what the name suggests, plays a sound at the desired frequency.

```javascript
play(frequency) {
    if (this.audioCtx && !this.oscillator) {
        this.oscillator = this.audioCtx.createOscillator();

        // Set the frequency
        this.oscillator.frequency.setValueAtTime(frequency || 440, this.audioCtx.currentTime);

        // Square wave
        this.oscillator.type = 'square';

        // Connect the gain and start the sound
        this.oscillator.connect(this.gain);
        this.oscillator.start();
    }
}
```

We are creating an oscillator which is what will be playing our sound. We set its frequency, the type, connect it to the gain, then finally play the sound. Nothing too crazy here.

### stop()

We eventually have to stop the sound so it doesn't play constantly.

```javascript
stop() {
    if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
    }
}
```

All this is doing is stopping the sound, disconnecting it, and setting it to null so it can be reinitialized in `play()`.

[Full speaker.js Code](https://github.com/Erigitic/chip8-emulator/blob/master/scripts/speaker.js)

## chip8.js

We can now hook the speaker up to our main `chip8.js` file.

```javascript
import Renderer from './renderer.js';
import Keyboard from './keyboard.js';
import Speaker from './speaker.js'; // NEW

const renderer = new Renderer(10);
const keyboard = new Keyboard();
const speaker = new Speaker(); // NEW
```

## cpu.js

Now we're getting into the actual Chip-8 emulator. This is where things get a little bit crazy, but I'll do my best to explain everything in a way that hopefully makes sense of it all.

### constructor(renderer, keyboard, speaker)

We need to initialize a few Chip-8 specific variables within our constructor, along with a few other variables. We're going to be looking at [section 2](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#2.0) of the technical reference to figure out the specifications for our Chip-8 emulator.

Here are the specifications for Chip-8:

- 4KB (4096 bytes) of memory
- 16 8-bit registers
- A 16-bit register (`this.i`) to store memory addresses
- Two timers. One for the delay, and one for the sound.
- A program counter that stores the address currently being executed
- An array to represent the stack

We also have a variable that stores whether the emulator is paused or not, and the execution speed of the emulator.

```javascript
class CPU {
    constructor(renderer, keyboard, speaker) {
        this.renderer = renderer;
        this.keyboard = keyboard;
        this.speaker = speaker;

        // 4KB (4096 bytes) of memory
        this.memory = new Uint8Array(4096);

        // 16 8-bit registers
        this.v = new Uint8Array(16);

        // Stores memory addresses. Set this to 0 since we aren't storing anything at initialization.
        this.i = 0;

        // Timers
        this.delayTimer = 0;
        this.soundTimer = 0;

        // Program counter. Stores the currently executing address.
        this.pc = 0x200;

        // Don't initialize this with a size in order to avoid empty results.
        this.stack = new Array();

        // Some instructions require pausing, such as Fx0A.
        this.paused = false;

        this.speed = 10;
    }
}

export default CPU;
```

### loadSpritesIntoMemory()

For this function, we'll be referencing [section 2.4](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#2.4) of the technical reference.

Chip-8 makes use of 16, 5 byte, sprites. These sprites are simply the hex digits 0 through F. You can see all of the sprites, with their binary and hex values, in section 2.4. In our code, we simply store the hex values of the sprites that the technical reference provides in an array. If you don't want to type them all out by hand, please feel free to copy and paste the array into your project.

The reference states that these sprites are stored in the interpreter section of memory (0x000 to 0x1FFF). Let's go ahead and look at the code for this function to see how this is done.

```javascript
loadSpritesIntoMemory() {
    // Array of hex values for each sprite. Each sprite is 5 bytes.
    // The technical reference provides us with each one of these values.
    const sprites = [
        0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
        0x20, 0x60, 0x20, 0x20, 0x70, // 1
        0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
        0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
        0x90, 0x90, 0xF0, 0x10, 0x10, // 4
        0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
        0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
        0xF0, 0x10, 0x20, 0x40, 0x40, // 7
        0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
        0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
        0xF0, 0x90, 0xF0, 0x90, 0x90, // A
        0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
        0xF0, 0x80, 0x80, 0x80, 0xF0, // C
        0xE0, 0x90, 0x90, 0x90, 0xE0, // D
        0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
        0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ];

    // According to the technical reference, sprites are stored in the interpreter section of memory starting at hex 0x000
    for (let i = 0; i < sprites.length; i++) {
        this.memory[i] = sprites[i];
    }
}
```

All we did was loop through each byte in the `sprites` array and stored it in memory starting at hex `0x000`.

### loadProgramIntoMemory(program)

In order to run ROMs, we have to load them into memory. This is a lot easier then it might sound. All that we have to do is loop through the contents of the ROM/program and store it in memory. The technical reference specifically [tells us](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#2.1) that "most Chip-8 programs start at location 0x200". So when we load the ROM into memory, we start at `0x200` and increment from there.

```javascript
loadProgramIntoMemory(program) {
    for (let loc = 0; loc < program.length; loc++) {
        this.memory[0x200 + loc] = program[loc];
    }
}
```

### loadRom(romName)

Now we have a way to load the ROM into memory, but we have to grab the ROM from the filesystem first before it can be loaded into memory. For this to work, you have to have a ROM. I've included a few in the [GitHub repo](https://github.com/Erigitic/chip8-emulator/tree/master/roms) for you to download and put into the `roms` folder of your project.

JavaScript provides a way to make an HTTP request and retrieve a file. I've added comments to the code below to explain what's going on:

```javascript
loadRom(romName) {
    var request = new XMLHttpRequest;
    var self = this;

    // Handles the response received from sending (request.send()) our request
    request.onload = function() {
        // If the request response has content
        if (request.response) {
            // Store the contents of the response in an 8-bit array
            let program = new Uint8Array(request.response);

            // Load the ROM/program into memory
            self.loadProgramIntoMemory(program);
        }
    }

    // Initialize a GET request to retrieve the ROM from our roms folder
    request.open('GET', 'roms/' + romName);
    request.responseType = 'arraybuffer';

    // Send the GET request
    request.send();
}
```

From here, we can start on the CPU cycle which will handle the execution of instructions, along with a few other things.

### cycle()

I think it'll be easier to understand everything if you can see what happens every time the CPU cycles. This is the function we will be calling in our `step` function in `chip8.js`, which if you remember, is executed about 60 times per second. We're going to take this function piece by piece.

At this point, the functions being called within `cycle` have yet to be created. We'll create them soon.

The first piece of code within our `cycle` function is a for loop that handles the execution of instructions. This is where our `speed` variable comes into play. The higher this value, the more instructions that will be executed every cycle.

```javascript
cycle() {
    for (let i = 0; i < this.speed; i++) {

    }
}
```

We also want to keep in mind that instructions should only be executed when the emulator is running.

```javascript
cycle() {
    for (let i = 0; i < this.speed; i++) {
        if (!this.paused) {

        }
    }
}
```

If you take a look at [section 3.1](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#3.1), you can see all the different instructions and their opcodes. They look something like `00E0` or `9xy0` to give a few examples. So our job is to grab that opcode from memory and pass that along to another function that'll handle the execution of that instruction. Let's take a look at the code first, and then I'll explain it:

```javascript
cycle() {
    for (let i = 0; i < this.speed; i++) {
        if (!this.paused) {
            let opcode = (this.memory[this.pc] << 8 | this.memory[this.pc + 1]);
            this.executeInstruction(opcode);
        }
    }
}
```

Let's take a look at this line in particular: `let opcode = (this.memory[this.pc] << 8 | this.memory[this.pc + 1]);`. For those that aren't very familiar with bitwise operations, this can be very intimidating.

First of all, each instruction is 16 bits (2 bytes) long ([3.0](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#3.0)), but our memory is made up of 8 bit (1 byte) pieces. This means we have to combine two pieces of memory in order to get the full opcode. That's why we have `this.pc` and `this.pc + 1` in the line of code above. We're simply grabbing both halves of the opcode. But you can't just combine two, 1-byte values to get a 2-byte value. To properly do this, we need to shift the first piece of memory, `this.memory[this.pc]`, 8 bits left to make it 2 bytes long. In the most basic of terms, this will add two zeros, or more accurately hex value `0x00` onto the right-hand side of our 1-byte value, making it 2 bytes. For example, shifting hex `0x11` 8 bits left will give us hex `0x1100`. From there, we bitwise OR (`|`) it with the second piece of memory, `this.memory[this.pc + 1])`.

Here's a step by step example that will help you better understand what this all means.

Let's assume a few values, each 1 byte in size:

`this.memory[this.pc] = PC = 0x10`
`this.memory[this.pc + 1] = PC + 1 = 0xF0`

Shift `PC` 8 bits (1 byte) left to make it 2 bytes:

`PC = 0x1000`

Bitwise OR `PC` and `PC + 1`:

`PC | PC + 1 = 0x10F0`

or

`0x1000 | 0xF0 = 0x10F0`

Lastly, we want to update our timers when are emulator is running (not paused), play sounds, and render sprites on the screen:

```javascript
cycle() {
    for (let i = 0; i < this.speed; i++) {
        if (!this.paused) {
            let opcode = (this.memory[this.pc] << 8 | this.memory[this.pc + 1]);
            this.executeInstruction(opcode);
        }
    }

    if (!this.paused) {
        this.updateTimers();
    }

    this.playSound();
    this.renderer.render();
}
```

This function is the brain of our emulator in a way. It handles the execution of instructions, updates timers, plays sound, and renders content on the screen. We don't have any of these functions created yet but seeing how the CPU cycles through everything will hopefully make these functions make a lot more sense when we do create them.

### updateTimers()

Let's move on to [section 2.5](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#2.5) and set up the logic for the timers and sound.

Each timer, delay and sound, decrement by 1 at a rate of 60Hz. In other words, every 60 frames our timers will decrement by 1.

```javascript
updateTimers() {
    if (this.delayTimer > 0) {
        this.delayTimer -= 1;
    }

    if (this.soundTimer > 0) {
        this.soundTimer -= 1;
    }
}
```

The delay timer is used for keeping track of when certain events occur. This timer is only used in two instructions: once for setting its value, and another for reading its value and branching to another instruction if a certain value is present.

The sound timer is what controls the length of the sound. As long as the value of `this.soundTimer` is greater than zero, the sound will continue to play. When the sound timer hits zero, the sound will stop. That brings us into our next function where we will be doing exactly that.

### playSound()

To reiterate, as long as the sound timer is greater than zero, we want to play a sound. We will be using the `play` function from our `Speaker` class we made earlier to play a sound with a frequency of 440.

```javascript
playSound() {
    if (this.soundTimer > 0) {
        this.speaker.play(440);
    } else {
        this.speaker.stop();
    }
}
```

### executeInstruction(opcode)

For this entire function, we'll be referencing [section 3.0 and 3.1](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#3.0) of the technical reference.

This is the final function we need for this file, and this one is long. We have to write out the logic for all 36 Chip-8 instructions. Thankfully, most of these instructions only require a few lines of code.

The first piece of information to be aware of is that all instructions are 2 bytes long. So every time we execute an instruction, or run this function, we have to increment the program counter (`this.pc`) by 2 so the CPU knows where the next instruction is.

```javascript
executeInstruction(opcode) {
    // Increment the program counter to prepare it for the next instruction.
    // Each instruction is 2 bytes long, so increment it by 2.
    this.pc += 2;
}
```

Let's take a look at this part of section 3.0 now:

```
In these listings, the following variables are used:

nnn or addr - A 12-bit value, the lowest 12 bits of the instruction
n or nibble - A 4-bit value, the lowest 4 bits of the instruction
x - A 4-bit value, the lower 4 bits of the high byte of the instruction
y - A 4-bit value, the upper 4 bits of the low byte of the instruction
kk or byte - An 8-bit value, the lowest 8 bits of the instruction
```

To avoid repeating code, we should create variables for the `x` and `y` values as they are the ones used by nearly every instruction. The other variables listed above aren't used enough to warrant calculating their values every time.

These two values are each 4 bits (aka. half a byte or a nibble) in size. The `x` value is located in the lower 4 bits of the high byte and `y` is located in the upper 4 bits of the low byte.

For example, if we have an instruction `0x5460`, the high byte would be `0x54` and the low byte would be `0x60`.  The lower 4 bits, or nibble, of the high byte would be `0x4` and the upper 4 bits of the low byte would be `0x6`. Therefore, in this example, `x = 0x4` and `y= 0x6`.

Knowing all of that, let's write the code that'll grab the `x` and `y` values.

```javascript
executeInstruction(opcode) {
    this.pc += 2;

    // We only need the 2nd nibble, so grab the value of the 2nd nibble
    // and shift it right 8 bits to get rid of everything but that 2nd nibble.
    let x = (opcode & 0x0F00) >> 8;

    // We only need the 3rd nibble, so grab the value of the 3rd nibble
    // and shift it right 4 bits to get rid of everything but that 3rd nibble.
    let y = (opcode & 0x00F0) >> 4;
}
```

To explain this, let's once again assume we have an instruction `0x5460`. If we `&` (bitwise AND) that instruction with hex value `0x0F00` we'll end up with `0x0400`. Shift that 8 bits right and we end up with `0x04` or `0x4`. Same thing with `y`. We `&` the instruction with hex value `0x00F0` and get `0x0060`. Shift that 4 bits right and we end up with `0x006` or `0x6`.

Now for the fun part, writing the logic for all 36 instructions. For each instruction, before you write the code, I highly recommend reading what that instruction does in the technical reference as you'll understand it a lot better.

I'm going to provide you with the empty switch statement you'll be using as it's quite long.

```javascript
switch (opcode & 0xF000) {
    case 0x0000:
        switch (opcode) {
            case 0x00E0:
                break;
            case 0x00EE:
                break;
        }

        break;
    case 0x1000:
        break;
    case 0x2000:
        break;
    case 0x3000:
        break;
    case 0x4000:
        break;
    case 0x5000:
        break;
    case 0x6000:
        break;
    case 0x7000:
        break;
    case 0x8000:
        switch (opcode & 0xF) {
            case 0x0:
                break;
            case 0x1:
                break;
            case 0x2:
                break;
            case 0x3:
                break;
            case 0x4:
                break;
            case 0x5:
                break;
            case 0x6:
                break;
            case 0x7:
                break;
            case 0xE:
                break;
        }

        break;
    case 0x9000:
        break;
    case 0xA000:
        break;
    case 0xB000:
        break;
    case 0xC000:
        break;
    case 0xD000:
        break;
    case 0xE000:
        switch (opcode & 0xFF) {
            case 0x9E:
                break;
            case 0xA1:
                break;
        }

        break;
    case 0xF000:
        switch (opcode & 0xFF) {
            case 0x07:
                break;
            case 0x0A:
                break;
            case 0x15:
                break;
            case 0x18:
                break;
            case 0x1E:
                break;
            case 0x29:
                break;
            case 0x33:
                break;
            case 0x55:
                break;
            case 0x65:
                break;
        }

        break;

    default:
        throw new Error('Unknown opcode ' + opcode);
}
```

As you can see from `switch (opcode & 0xF000)`, we're grabbing the upper 4 bits of the most significant byte of the opcode. If you take a look at the different instructions in the technical reference you'll notice that we can narrow down the different opcodes by that very first nibble.

#### 0nnn - SYS addr

This opcode can be ignored.

#### 00E0 - CLS

Clear the display.

```javascript
case 0x00E0:
    this.renderer.clear();
    break;
```

#### 00EE - RET

Pop the last element in the `stack` array and store it in `this.pc`. This will return us from a subroutine.

```javascript
case 0x00EE:
    this.pc = this.stack.pop();
    break;
```

The technical reference states this instruction also "subtracts 1 from the stack pointer". The stack pointer is used to point to the topmost level of the stack. But thanks to our `stack` array, we don't need to worry about where the top of the stack is since it's handled by the array. So for the rest of the instructions, if it says something about the stack pointer, you can safely ignore it.

#### 1nnn - JP addr

Set the program counter to the value stored in `nnn`.

```javascript
case 0x1000:
    this.pc = (opcode & 0xFFF);
    break;
```

`0xFFF` grabs the value of `nnn`. So `0x1426 & 0xFFF` will give us `0x426` and then we store that in `this.pc`.

#### 2nnn - CALL addr

For this, the technical reference says we have to increment the stack pointer so it points to the current value of `this.pc`. Again, we aren't using a stack pointer in our project as our `stack` array handles that for us. So instead of incrementing that, we just push `this.pc` onto the stack which will give us the same result. And just like with opcode `1nnn`, we grab the value of `nnn` and store that in `this.pc`.

```javascript
case 0x2000:
    this.stack.push(this.pc);
    this.pc = (opcode & 0xFFF);
    break;
```

#### 3xkk - SE Vx, byte

This is where our `x` value we calculated above comes into play.

This instruction compares the value stored in the `x` register (`Vx`) to the value of `kk`. Note that `V` signifies a register, and the value following it, in this case `x`, is the register number. If they are equal, we increment the program counter by 2, effectively skipping the next instruction.

```javascript
case 0x3000:
    if (this.v[x] === (opcode & 0xFF)) {
        this.pc += 2;
    }
    break;
```

The `opcode & 0xFF` part of the if statement is simply grabbing the last byte of the opcode. This is the `kk` portion of the opcode.

#### 4xkk - SNE Vx, byte

This instruction is very similar to `3xkk`, but instead skips the next instruction if `Vx` and `kk` are NOT equal.

```javascript
case 0x4000:
    if (this.v[x] !== (opcode & 0xFF)) {
        this.pc += 2;
    }
    break;
```

#### 5xy0 - SE Vx, Vy

Now we're making use of both `x` and `y`. This instruction, like the previous two, will skip the next instruction if a condition is met. In the case of this instruction, if `Vx` is equal to `Vy` we skip the next instruction.

```javascript
case 0x5000:
    if (this.v[x] === this.v[y]) {
        this.pc += 2;
    }
    break;
```

#### 6xkk - LD Vx, byte

This instruction will set the value of `Vx` to the value of `kk`.

```javascript
case 0x6000:
    this.v[x] = (opcode & 0xFF);
    break;
```

#### 7xkk - ADD Vx, byte

This instruction adds `kk` to `Vx`.

```javascript
case 0x7000:
    this.v[x] += (opcode & 0xFF);
    break;
```

#### 8xy0 - LD Vx, Vy

Before discussing this instruction, I'd like to explain what's going on with `switch (opcode & 0xF)`. Why the switch within a switch? The reasoning behind this is we have a handful of different instructions that fall under `case 0x8000:`. If you take a look at those instructions in the technical reference, you'll notice the last nibble of each one of these instructions ends with a value `0-7` or `E`. We have this switch to grab that last nibble, and then create a case for each one to properly handle it. We do this a few more times throughout the main switch statement.

With that explained, let's get on to the instruction. Nothing crazy with this one, just setting the value of `Vx` equal to the value of `Vy`.

```javascript
case 0x0:
    this.v[x] = this.v[y];
    break;
```

#### 8xy1 - OR Vx, Vy

Set `Vx` to the value of `Vx OR Vy`.

```javascript
case 0x1:
    this.v[x] |= this.v[y];
    break;
```

#### 8xy2 - AND Vx, Vy

Set `Vx` equal to the value of `Vx AND Vy`.

```javascript
case 0x2:
    this.v[x] &= this.v[y];
    break;
```

#### 8xy3 - XOR Vx, Vy

Set `Vx` equal to the value of `Vx XOR Vy`.

```javascript
case 0x3:
    this.v[x] ^= this.v[y];
    break;
```

#### 8xy4 - ADD Vx, Vy

This instruction sets `Vx` to `Vx + Vy`. Sounds easy, but there is a little more to it. If we read the description for this instruction provided in the technical reference it says the following:

> If the result is greater than 8 bits (i.e., > 255,) VF is set to 1, otherwise 0. Only the lowest 8 bits of the result are kept, and stored in Vx.

```javascript
case 0x4:
    let sum = (this.v[x] += this.v[y]);

    this.v[0xF] = 0;

    if (sum > 0xFF) {
        this.v[0xF] = 1;
    }

    this.v[x] = sum;
    break;
```

Taking this line by line, we first add `this.v[y]` to `this.v[x]` and store that value in a variable `sum`. From there we set `this.v[0xF]`, or `VF`, to 0. We do this to avoid having to use an if-else statement on the next line. If the sum is greater than 255, or hex `0xFF`, we set `VF` to 1. Finally, we set `this.v[x]`, or `Vx`, to the sum.

You might be wondering how we go about ensuring "only the lowest 8 bits of the result are kept, and stored in Vx". Thanks to `this.v` being a `Uint8Array`, any value over 8 bits automatically has the lower, rightmost, 8 bits taken and stored in the array. Therefore we don't need to do anything special with it.

Let me provide you with an example to make more sense of this. Assume we try to put decimal 257 into the `this.v` array. In binary that value is `100000001`, a 9-bit value. When we attempt to store that 9-bit value into the array, it will only take the lower 8 bits. This means binary `00000001`, which is 1 in decimal, would be stored in `this.v`.

#### 8xy5 - SUB Vx, Vy

This instruction subtracts `Vy` from `Vx`. Just like overflow is handled in the previous instruction, we have to handle underflow for this one.

```javascript
case 0x5:
    this.v[0xF] = 0;

    if (this.v[x] > this.v[y]) {
        this.v[0xF] = 1;
    }

    this.v[x] -= this.v[y];
    break;
```

Once again, since we're using a `Uint8Array`, we don't have to do anything to handle underflow as it's taken care of for us. So -1 will become 255, -2 becomes 254, and so forth.

#### 8xy6 - SHR Vx {, Vy}

```javascript
case 0x6:
    this.v[0xF] = (this.v[x] & 0x1);

    this.v[x] >>= 1;
    break;
```

This line `this.v[0xF] = (this.v[x] & 0x1);` is going to determine the least-significant bit and set `VF` accordingly.

This is a lot easier to understand if you look at its binary representation. If `Vx`, in binary, is `1001`, `VF` will be set to 1 since the least-significant bit is 1. If `Vx` is `1000`, `VF` will be set to 0.

#### 8xy7 - SUBN Vx, Vy

```javascript
case 0x7:
    this.v[0xF] = 0;

    if (this.v[y] > this.v[x]) {
        this.v[0xF] = 1;
    }

    this.v[x] = this.v[y] - this.v[x];
    break;
```

This instruction subtracts `Vx` from `Vy` and stores the result in `Vx`. If `Vy` is larger then `Vx`, we need to store 1 in `VF`, otherwise we store 0.

#### 8xyE - SHL Vx {, Vy}

This instruction not only shifts `Vx` left 1, but also sets `VF` to either 0 or 1 depending on if a condition is met.

```javascript
case 0xE:
    this.v[0xF] = (this.v[x] & 0x80);
    this.v[x] <<= 1;
    break;
```

The first line of code, `this.v[0xF] = (this.v[x] & 0x80);`, is grabbing the most significant bit of `Vx` and storing that in `VF`. To explain this, we have an 8-bit register, `Vx`, and we want to get the most significant, or leftmost, bit. To do this we need to AND `Vx` with binary `10000000`, or `0x80` in hex. This will accomplish setting `VF` to the proper value.

After that, we simply multiply `Vx` by 2 by shifting it left 1.

#### 9xy0 - SNE Vx, Vy

This instruction simply increments the program counter by 2 if `Vx` and `Vy` are not equal.

```javascript
case 0x9000:
    if (this.v[x] !== this.v[y]) {
        this.pc += 2;
    }
    break;
```

#### Annn - LD I, addr

Set the value of register `i` to `nnn`. If the opcode is `0xA740` then `(opcode & 0xFFF)` will return `0x740`.

```javascript
case 0xA000:
    this.i = (opcode & 0xFFF);
    break;
```

#### Bnnn - JP V0, addr

Set the program counter (`this.pc`) to `nnn` plus the value of register 0 (`V0`).

```javascript
case 0xB000:
    this.pc = (opcode & 0xFFF) + this.v[0];
    break;
```

#### Cxkk - RND Vx, byte

```javascript
case 0xC000:
    let rand = Math.floor(Math.random() * 0xFF);

    this.v[x] = rand & (opcode & 0xFF);
    break;
```

Generate a random number in the range 0-255 and then AND that with the lowest byte of the opcode. For example, if the opcode is `0xB849`, then `(opcode & 0xFF)` would return `0x49`.

#### Dxyn - DRW Vx, Vy, nibble

This is a big one! This instruction handles the drawing and erasing of pixels on the screen. I'm going to provide you all the code and explain it line-by-line.

```javascript
case 0xD000:
    let width = 8;
    let height = (opcode & 0xF);

    this.v[0xF] = 0;

    for (let row = 0; row < height; row++) {
        let sprite = this.memory[this.i + row];

        for (let col = 0; col < width; col++) {
            // If the bit (sprite) is not 0, render/erase the pixel
            if ((sprite & 0x80) > 0) {
                // If setPixel returns 1, which means a pixel was erased, set VF to 1
                if (this.renderer.setPixel(this.v[x] + col, this.v[y] + row)) {
                    this.v[0xF] = 1;
                }
            }

            // Shift the sprite left 1. This will move the next next col/bit of the sprite into the first position.
            // Ex. 10010000 << 1 will become 0010000
            sprite <<= 1;
        }
    }

    break;
```

We have a `width` variable set to 8 because each sprite is 8 pixels wide, so it's safe to hardcode that value in. Next, we set `height` to the value of the last nibble (`n`) of the opcode. If our opcode is `0xD235`, `height` will be set to 5. From there we set `VF` to 0, which if necessary, will be set to 1 later on if pixels are erased.

Now onto the for loops. Remember that a sprite looks something like this:

```
11110000
10010000
10010000
10010000
11110000
```

Our code is going row by row (first `for` loop), then it's going bit by bit or column by column (second `for` loop) through that sprite.

This piece of code, `let sprite = this.memory[this.i + row];`, is grabbing 8-bits of memory, or a single row of a sprite, that's stored at `this.i + row`. The technical reference states we start at the address stored in `I`, or `this.i` in our case, when we read sprites from memory.

Within our second `for` loop, we have an `if` statement that is grabbing the leftmost bit and checking to see if it's greater than 0. A value of 0 indicates that the sprite does not have a pixel at that location, so we don't need to worry about drawing or erasing it. If the value is 1, we move on to another if statement that checks the return value of `setPixel`. Let's look into the values passed into that function.

Our `setPixel` call looks like this: `this.renderer.setPixel(this.v[x] + col, this.v[y] + row)`. According to the technical reference, the `x` and `y` positions are located in `Vx` and `Vy` respectively. Add the `col` number to `Vx` and the `row` number to `Vy`, and you get the desired position to draw/erase a pixel. If `setPixel` returns 1, we erase the pixel and set `VF` to 1. If it returns 0, we don't do anything, keeping the value of `VF` equal to 0.

Lastly, we are shifting the sprite left 1 bit. This allows us to go through each bit of the sprite. For example, if `sprite` is currently set to `10010000`, it will become `0010000` after being shifted left. From there, we can go through another iteration of our inner `for` loop to determine whether or not to draw a pixel. And continuing this process till we reach the end or our sprite.

#### Ex9E - SKP Vx

This one is fairly simple and just skips the next instruction if the key stored in `Vx` is pressed, by incrementing the program counter by 2.

```javascript
case 0x9E:
    if (this.keyboard.isKeyPressed(this.v[x])) {
        this.pc += 2;
    }
    break;
```

#### ExA1 - SKNP Vx

This does the opposite of the previous instruction. If the specified key is not pressed, skip the next instruction.

```javascript
case 0xA1:
    if (!this.keyboard.isKeyPressed(this.v[x])) {
        this.pc += 2;
    }
    break;
```

#### Fx07 - LD Vx, DT

Another simple one. We're just setting `Vx` to the value stored in `delayTimer`.

```javascript
case 0x07:
    this.v[x] = this.delayTimer;
    break;
```

#### Fx0A - LD Vx, K

Taking a look at the technical reference, this instruction pauses the emulator until a key is pressed. Here's the code for it:

```javascript
case 0x0A:
    this.paused = true;

    this.keyboard.onNextKeyPress = function(key) {
        this.v[x] = key;
        this.paused = false;
    }.bind(this);
    break;
```

We first set `paused` to true in order to pause the emulator. Then, if you remember from our `keyboard.js` file where we set `onNextKeyPress` to null, this is where we initialize it. With the `onNextKeyPress` function initialized, the next time the `keydown` event is triggered, the following code in our `keyboard.js` file will be run:

```javascript
// keyboard.js
if (this.onNextKeyPress !== null && key) {
    this.onNextKeyPress(parseInt(key));
    this.onNextKeyPress = null;
}
```

From there, we set `Vx` to the pressed key's keycode and finally start the emulator back up by setting `paused` to false.

### Fx15 - LD DT, Vx

This instruction simply sets the value of the delay timer to the value stored in register `Vx`.

```javascript
case 0x15:
    this.delayTimer = this.v[x];
    break;
```

#### Fx18 - LD ST, Vx

This instruction is very similar to Fx15 but sets the sound timer to `Vx` instead of the delay timer.

```javascript
case 0x18:
    this.soundTimer = this.v[x];
    break;
```

#### Fx1E - ADD I, Vx

Add `Vx` to `I`.

```javascript
case 0x1E:
    this.i += this.v[x];
    break;
```

#### Fx29 - LD F, Vx - ADD I, Vx

For this one, we are setting `I` to the location of the sprite at `Vx`. It's multiplied by 5 because each sprite is 5 bytes long.

```javascript
case 0x29:
    this.i = this.v[x] * 5;
    break;
```

#### Fx33 - LD B, Vx

This instruction is going to grab the hundreds, tens, and ones digit from register `Vx` and store them in registers `I`, `I+1`, and `I+2` respectively.

```javascript
case 0x33:
    // Get the hundreds digit and place it in I.
    this.memory[this.i] = parseInt(this.v[x] / 100);

    // Get tens digit and place it in I+1. Gets a value between 0 and 99,
    // then divides by 10 to give us a value between 0 and 9.
    this.memory[this.i + 1] = parseInt((this.v[x] % 100) / 10);

    // Get the value of the ones (last) digit and place it in I+2.
    this.memory[this.i + 2] = parseInt(this.v[x] % 10);
    break;
```

#### Fx55 - LD [I], Vx

In this instruction, we are looping through registers `V0` through `Vx` and storing its value in memory starting at `I`.

```javascript
case 0x55:
    for (let registerIndex = 0; registerIndex <= x; registerIndex++) {
        this.memory[this.i + registerIndex] = this.v[registerIndex];
    }
    break;
```

#### Fx65 - LD Vx, [I]

Now on to the last instruction. This one does the opposite of `Fx55`. It reads values from memory starting at `I` and stores them in registers `V0` through `Vx`.

```javascript
case 0x65:
    for (let registerIndex = 0; registerIndex <= x; registerIndex++) {
        this.v[registerIndex] = this.memory[this.i + registerIndex];
    }
    break;
```

## chip8.js

With our CPU class created, let's finish up our `chip8.js` file by loading in a ROM and cycling our CPU. We'll need to import `cpu.js` and initialize a CPU object:

```javascript
import Renderer from './renderer.js';
import Keyboard from './keyboard.js';
import Speaker from './speaker.js';
import CPU from './cpu.js'; // NEW

const renderer = new Renderer(10);
const keyboard = new Keyboard();
const speaker = new Speaker();
const cpu = new CPU(renderer, keyboard, speaker); // NEW
```

Our `init` function becomes:

```javascript
function init() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;

    cpu.loadSpritesIntoMemory(); // NEW
    cpu.loadRom('BLITZ'); // NEW
    loop = requestAnimationFrame(step);
}
```

When our emulator is initialized we will load the sprites into memory and load up the `BLITZ` rom. Now we just need to cycle the CPU:

```javascript
function step() {
    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        cpu.cycle(); // NEW
    }

    loop = requestAnimationFrame(step);
}
```

With that done, we should now have a working Chip8 emulator.

## Conclusion

I started this project a while ago and was fascinated by it. Emulator creation was always something that interested me but never made sense to me. That was until I learned about Chip-8 and the simplicity of it in comparison to more advanced systems out there. The moment I finished this emulator, I knew I had to share it with other people by providing an in-depth, step-by-step of creating it yourself. The knowledge I gained, and hopefully you've gained, will no doubt prove useful elsewhere.

All in all, I hope you enjoyed the article and learned something. I aimed to explain everything in detail and in as simple of a way as possible. Regardless, if anything is still confusing you or you just have a question, please feel free to let me know over on [Twitter](https://twitter.com/ericgrandt) or post an issue on the [GitHub repo](https://github.com/Erigitic/chip8-emulator/issues) as I'd love to help you out.

I'd like to leave you with a couple of ideas on features you can add to your Chip-8 emulator:

- Audio control (mute, change frequency, change wave type (sine, triangle), etc)
- Ability to change render scale and emulator speed from the UI
- Pause and unpause
- Ability to save and load a save
- ROM selection