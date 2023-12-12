const cvs = document.getElementById("canvas0");
const ctx = cvs.getContext("2d", { willReadFrequently: true });

const app = new PIXI.Application({ view: document.querySelector('canvas') });

const width = cvs.width;
const height = cvs.height;

game_width = width * 3 / 5
game_height = height

//キー入力
let pressed = [];
let pushed = [];

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

let font_size = 24;

console.log("Init.js_loaded");