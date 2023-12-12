const width = 720
const height = 720

// PixiJSのアプリケーションを作成
const app = new PIXI.Application({
	width: width,
	height: height,
	backgroundColor: 0x121212,
});

document.body.appendChild(app.view)

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

const style = {
	fontFamily: 'serif', // フォントファミリー
	fontSize: 36, // フォントサイズ
	fill: 'white', // テキストの色
	align: "left",

	stroke: 'black', // ストロークの色
	strokeThickness: 0, // ストロークの太さ
	dropShadow: true, // ドロップシャドウの有無
	dropShadowColor: '#000000', // ドロップシャドウの色
	dropShadowBlur: 4, // ドロップシャドウのぼかし
	dropShadowDistance: 4, // ドロップシャドウの距離
}


console.log("Init.js_loaded");