const canvas_background = document.getElementById("background");
const layer_background = canvas_background.getContext("2d", { willReadFrequently: true });

const canvas_front = document.getElementById("front")
const layer_front = canvas_front.getContext("2d", { willReadFrequently: true })

const width = canvas_background.width;
const height = canvas_background.height;

game_width = 432
game_height = 680

//キー入力
let pressed = [];
let pushed = [];
let mouse = { clicked: false, p: new vec(0, 0) }

const okKey = ["KeyZ", "Space", "Enter"];
const cancelKey = ["KeyX", "Backspace", "Escape"];

const key_down = (e) => {
	if (!pressed.includes(e.code)) {
		pressed.push(e.code);
		pushed.push(e.code);
		if (okKey.includes(e.code)) { pushed.push("ok"); }
		if (cancelKey.includes(e.code)) { pushed.push("cancel"); }
	}
	console.log(pressed);
}

const key_up = (e) => {
	pressed = pressed.filter((f) => { return e.code != f; });
}

document.addEventListener("keydown", (e) => {
	key_down(e)
});

document.addEventListener("keyup", (e) => {
	key_up(e)
});

canvas_background.addEventListener("mousemove", (e) => {
	let rect = e.target.getBoundingClientRect();
	mouse.p = new vec(e.clientX - rect.left, e.clientY - rect.top)
}, false)

canvas_background.addEventListener("mousedown", (e) => {
	mouse.clicked = true
	console.log(mouse.p)
}, false)

const mouse_up = (e) => { mouse.clicked = false }

canvas_background.addEventListener("mouseup", mouse_up, false)
canvas_background.addEventListener("mouseleave", mouse_up, false)

window.addEventListener("gamepadconnected", (e) => {
	gamepad_connected = true
	console.log(e)
})

window.addEventListener("gamepaddisconnected", (e) => {
	gamepad_connected = false
	console.log(e)
})

let font_size = 24;

let gamepad_connected = false

// const number_to_scale = (number) => {
// 	return "midi" + ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][number % 12] + Math.floor(number / 12)
// }

// navigator.requestMIDIAccess?.().then((midiAccess) => {
// 	console.log(midiAccess)
// 	midiAccess.inputs.forEach((input) => {
// 		// console.log(input)
// 		input.onmidimessage = (msg) => {
// 			// console.log([msg.data[0], msg.data[1], msg.data[2]])
// 			const data = msg.data
// 			const scale = number_to_scale(msg.data[1])

// 			//down
// 			if (data[0] == 144) {
// 				data[2] == 0 ? key_up({ code: scale }) : key_down({ code: scale })

// 				// up
// 			} else if (data[0] == 128) {
// 				key_up({ code: scale })

// 				// pitch
// 			}

// 			key_up({ code: "pitchUp" })
// 			key_up({ code: "pitchDown" })

// 			if (data[0] == 224) {
// 				if (data[2] > 64) {
// 					key_down({ code: "pitchUp" })
// 				} else if (data[2] < 64) {
// 					key_down({ code: "pitchDown" })
// 				}
// 			} else {

// 			}

// 		};
// 	});

// 	// midiAccess.outputs.forEach((output) => {
// 	// 	console.log(output)
// 	// 	output.send([0x80, 60, 127])
// 	// });
// });

// fetch("sounds/chord19.mid")
// 	.then(response => response.arrayBuffer())
// 	.then(buffer => {
// 		console.log(buffer)
// 	})

console.log("Init.js_loaded");

Irect(0, 0, width, height, "#121212")
Irect(0, 0, width, height, "white", "stroke", 2)
Ifont(24, "white", "serif")
Itext(null, 10, height - 24, "Now Loading...")