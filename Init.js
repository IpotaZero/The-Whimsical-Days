const cvs = document.getElementById("canvas0");
const ctx = cvs.getContext("2d", { willReadFrequently: true });

const width = cvs.width;
const height = cvs.height;

game_width = width * 3 / 5
game_height = height - 40

//キー入力
let pressed = [];
let pushed = [];
let mouse = { clicked: false, p: new vec(0, 0) }

const okKey = ["KeyZ", "Space", "Enter"];
const cancelKey = ["KeyX", "Backspace", "Escape"];
document.addEventListener("keydown", (e) => {
	if (!pressed.includes(e.code)) {
		pressed.push(e.code);
		pushed.push(e.code);
		if (okKey.includes(e.code)) { pushed.push("ok"); }
		if (cancelKey.includes(e.code)) { pushed.push("cancel"); }
	}
	console.log(pressed);
});

document.addEventListener("keyup", (e) => {
	pressed = pressed.filter((f) => { return e.code != f; });
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

let font_size = 24;

console.log("Init.js_loaded");