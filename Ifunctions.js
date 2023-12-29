let SoundData = {};
SoundData.text = false;
SoundData.mute_bgm = false;
SoundData.mute_se = false;

const Iaudio = class {
	constructor(path, type = "se") {
		this.audio = new Audio(path)
		this.type = type
	}
	play() {
		if (this.type == "se") {
			this.audio.currentTime = 0
			this.audio.muted = SoundData.mute_se
		} else if (this.type == "bgm") {
			this.audio.loop = true
			this.audio.muted = SoundData.mute_bgm
		}

		this.audio.play()
	}

	pause() {
		this.audio.pause()
	}

	reset() {
		this.audio.currentTime = 0
	}

	set_mute(b) {
		this.audio.muted = b
	}

	set_volume(v) {
		this.audio.volume = v
	}

	fadeout(frame, time) {
		this.audio.volume = 0.4 * (1 - frame / time)
	}
}

const Iimg = class {
	constructor(path, x, y, width, height, ratio) {
		this.image = new Image()
		this.image.src = path
		this.width = width
		this.height = height
		this.ratio = ratio
		this.alpha = 1

		this.x = x
		this.y = y
	}

	draw() {
		let a = ctx.globalAlpha
		ctx.globalAlpha = this.alpha
		ctx.drawImage(this.image, this.x, this.y, this.width * this.ratio, this.height * this.ratio)
		ctx.globalAlpha = a
	}
}

let ImgData = {};

//文字送り{frame, x, y, text}
function Itext(frame, x, y, text) {
	let t = "";

	if (typeof text != "string") {
		t = "文章が定義されていない";
	} else {
		if (text.length > frame && frame != null) {
			for (let i = 0; i < frame; i++) {
				t = t + text.charAt(i);
			}
			if (SoundData.text) { SoundData.text_sending.play(); }
		} else {
			t = text;
		}
	}

	ctx.beginPath();
	ctx.fillText(t, x, y);
}

//待機可能改行テキスト
function Itext4(frame, x, y, line_space, textArr) {
	let t = 0;
	let I = 0;

	for (let i = 0; i < textArr.length; i++) {
		let obj = textArr[i];

		if (typeof obj == "string") {
			if (frame == null) {
				Itext(null, x, y + line_space * I, obj);
			} else {
				Itext(frame - t, x, y + line_space * I, obj);
				t += obj.length;
			}
			I++;
		} else if (typeof obj == "number") {
			t += obj;
		}
	}
}

function Itext5(frame, x, y, line_space, text) {
	let textArr = text.split("\n");
	Itext4(frame, x, y, line_space, textArr);
}

function Icircle(x, y, r, c, id = "fill", size = 2) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);

	switch (id) {
		case "fill":
			ctx.fillStyle = c;
			ctx.fill();
			break;
		case "stroke":
			ctx.strokeStyle = c;
			ctx.lineWidth = size;
			ctx.stroke();
			break;
	}
}

function Iarc(x, y, r, start, end, c, id = "fill", size = 2) {
	ctx.beginPath();
	ctx.arc(x, y, r, start, end);

	switch (id) {
		case "fill":
			ctx.fillStyle = c;
			ctx.fill();
			break;
		case "stroke":
			ctx.strokeStyle = c;
			ctx.lineWidth = size;
			ctx.stroke();
			break;
	}
}

//座標、幅、高さ、色、ID,太さ
function Irect(x, y, width, height, c, id = "fill", size = 2) {
	ctx.beginPath();

	switch (id) {
		case "fill":
			ctx.fillStyle = c;
			ctx.fillRect(x, y, width, height);
			break;
		case "stroke":
			ctx.strokeStyle = c;
			ctx.lineWidth = size;
			ctx.strokeRect(x, y, width, height);
			break;
	}
}


//通る座標[[x,y],[x,y]]、色、太さ
function Iline(colour, size, arr) {
	ctx.strokeStyle = colour;
	ctx.lineWidth = size;

	ctx.beginPath();
	ctx.moveTo(arr[0][0], arr[0][1]);
	for (let i = 1; i < arr.length; i++) {
		ctx.lineTo(arr[i][0], arr[i][1]);
	}
	ctx.stroke();
}

function Iline2(colour, size, points) {
	ctx.strokeStyle = colour;
	ctx.lineWidth = size;

	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	for (let i = 1; i < points.length; i++) {
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.stroke();
}

function Ifont(size, colour = "black", _font = "Arial") {
	ctx.fillStyle = colour;
	font_size = size;
	ctx.font = font_size + "px " + _font;
}

const vec = class {
	constructor(_x, _y) {
		this.x = _x;
		this.y = _y;
		this.length = Math.sqrt(_x ** 2 + _y ** 2);
	}

	add(v) { return new vec(this.x + v.x, this.y + v.y); }
	sub(v) { return new vec(this.x - v.x, this.y - v.y); }
	mlt(m) { return new vec(this.x * m, this.y * m); }
	nor() { if (this.length == 0) { return this; } else { return new vec(this.x / this.length, this.y / this.length); } }
	rot(rad) { return new vec(this.x * Math.cos(rad) - this.y * Math.sin(rad), this.x * Math.sin(rad) + this.y * Math.cos(rad)); }
	new() { return new vec(this.x, this.y); }
	dot(v) { return this.x * v.x + this.y * v.y; }
}


const vec3 = class {
	constructor(_x, _y, _z) {
		this.x = _x;
		this.y = _y;
		this.z = _z;
		this.length = Math.sqrt(_x ** 2 + _y ** 2 + _z ** 2);
		this.lengthH = Math.sqrt(_x ** 2 + _z ** 2);
	}

	add(v) { return new vec3(this.x + v.x, this.y + v.y, this.z + v.z); }
	sub(v) { return new vec3(this.x - v.x, this.y - v.y, this.z - v.z); }
	mlt(m) { return new vec3(this.x * m, this.y * m, this.z * m); }
}

//多重for文(f:関数, a:初期値, b:終了値)
function ILoop(a = null, b, f) {
	if (a == null) {
		a = [];
		for (let i = 0; i < b.length; i++) {
			a.push(0);
		}
	}

	//aをコピー
	let arr = [...a];

	while (arr.join() != b.join()) {
		f(...arr);
		arr[arr.length - 1]++;
		for (let i = arr.length - 1; i != 0; i--) {
			if (arr[i] > b[i]) {
				arr[i] = a[i];
				arr[i - 1]++;
			}
		}
	}
	f(...arr);
}

let Icamera = { p: new vec(-20, -20), v: new vec(0, 0) };

function IcircleC(x, y, r, c, id, size) {
	Icircle(x - Icamera.p.x, y - Icamera.p.y, r, c, id, size);
}

function IarcC(x, y, r, start, end, c, id, size) {
	Iarc(x - Icamera.p.x, y - Icamera.p.y, r, start, end, c, id, size);
}

function IrectC(x, y, width, height, c, id, size) {
	Irect(x - Icamera.p.x, y - Icamera.p.y, width, height, c, id, size);
}

function IlineC(c, size, arr) {
	let a = [];
	arr.forEach((p) => { a.push([p[0] - Icamera.p.x, p[1] - Icamera.p.y]); });
	Iline(c, size, a);
}

function IimageC(image, x, y, width, height) {
	ctx.drawImage(image, x, y, width, height);
}

function Idice(a, b) {
	let n = 0;
	for (let i = 0; i < a; i++) {
		n += Math.floor(Math.random() * b) + 1;
	}
	return n;
}

function Icommand(c, x, y, linespace, option) {
	if (option[c.current_branch] != null) {
		Itext4(c.frame * 2, x + linespace, y, linespace, option[c.current_branch])
		Itext(c.frame, x, y + font_size * c.current_value, "→")

		if (pushed.includes("ArrowDown")) { c.current_value++; SoundData.select.play() }
		if (pushed.includes("ArrowUp")) { c.current_value--; SoundData.select.play() }

		c.current_value = (c.current_value + option[c.current_branch].length) % option[c.current_branch].length

		if (pushed.includes("ok")) {
			c.current_branch += c.current_value
			c.frame = 0
			c.current_value = 0
			SoundData.ok.play()
		}
	}

	if (pushed.includes("cancel") && c.current_branch != "") {
		c.current_value = Number(c.current_branch.charAt(c.current_branch.length - 1))
		c.current_branch = c.current_branch.slice(0, -1)
		c.frame = 0
		SoundData.cancel.play()
	}

	c.frame++;

	return c
}

console.log("Ifunctions.js_loaded");
