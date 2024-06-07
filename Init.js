const cvs = document.getElementById("canvas0");
const ctx = cvs.getContext("2d", { willReadFrequently: true });

const width = cvs.width;
const height = cvs.height;

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

cvs.addEventListener("mousemove", (e) => {
	let rect = e.target.getBoundingClientRect();
	mouse.p = new vec(e.clientX - rect.left, e.clientY - rect.top)
}, false)

cvs.addEventListener("mousedown", (e) => {
	mouse.clicked = true
	console.log(mouse.p)
}, false)

const mouse_up = (e) => { mouse.clicked = false }

cvs.addEventListener("mouseup", mouse_up, false)
cvs.addEventListener("mouseleave", mouse_up, false)

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

navigator.requestMIDIAccess?.().then((midiAccess) => {
	console.log(midiAccess)
	Array.from(midiAccess.inputs).forEach((input) => {
		input[1].onmidimessage = (msg) => {
			console.log(msg);
		};
	});
});

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