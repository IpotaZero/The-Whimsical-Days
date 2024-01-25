const Sound_Data = {};
Sound_Data.text = false;
Sound_Data.mute_bgm = false;
Sound_Data.mute_se = false;

const LocalStorage = class {
	constructor(name, dflt) {
		this.name = name;
		this.data = { ...dflt };
		this.dflt = { ...dflt }

		this.load()
	}
	reset() {
		this.data = { ...this.dflt }
	}
	delete() {
		localStorage.removeItem(this.name);
	}
	load() {
		let data = null;
		if (localStorage != null) {
			data = JSON.parse(localStorage.getItem(this.name));
		}
		if (data != null) {
			this.data = data;
			return true;
		}
		return false;
	}
	save() {
		let data = JSON.stringify(this.data);
		if (localStorage != null) {
			localStorage.setItem(this.name, data);
		}
	}
}

const Iaudio = class {
	constructor(path, type = "se") {
		this.audio = new Audio(path)
		this.type = type

		this.ended = false
	}
	play() {
		if (this.ended) { return }

		if (this.type == "se") {
			this.audio.currentTime = 0
			this.audio.muted = Sound_Data.mute_se
		} else if (this.type == "bgm") {
			this.audio.loop = true
			this.audio.muted = Sound_Data.mute_bgm
		}

		this.audio.play()
	}

	pause() {
		this.audio.pause()
	}

	reset() {
		this.audio.currentTime = 0
		this.ended = false
		if (this.type == "bgm") { this.audio.loop = true }
	}

	mute() {
		this.audio.muted = !this.audio.muted
	}

	set_volume(v) {
		this.audio.volume = v
	}

	fadeout(frame, time) {
		this.audio.volume = 0.4 * (1 - frame / time)
	}

	end() {
		this.audio.loop = false
		this.ended = !this.ended
	}
}

const Iimage = class {
	constructor(path, x = 0, y = 0, width, height, { ratio = 1, alpha = 1, rotate = 0, center_x = 0, center_y = 0, repeat_x = 1, repeat_y = 1 } = {}) {
		let p = path.split(".")
		if (p[p.length - 1] == "apng") {
			this.type = "anime"
			this.image = []
			APNG.parseURL(path).then((apngObject) => { apngObject.frames.forEach((e) => { this.image.push(e.img) }) })
			this.frame = 0

		} else {
			this.type = "not_anime"
			this.image = new Image()
			this.image.src = path

		}

		this.width = width
		this.height = height
		this.ratio = ratio
		this.alpha = alpha

		this.rotate = rotate
		this.center_x = center_x
		this.center_y = center_y

		this.repeat_x = repeat_x
		this.repeat_y = repeat_y

		this.x = x
		this.y = y
	}

	draw() {
		// コンテキストを保存する
		ctx.save();
		// // 回転の中心に原点を移動する
		ctx.translate(this.center_x * this.ratio + this.x, this.center_y * this.ratio + this.y);
		// // canvasを回転する
		ctx.rotate(this.rotate);

		ctx.globalAlpha = this.alpha

		const w = this.width * this.ratio / this.repeat_x
		const h = this.height * this.ratio / this.repeat_y

		ILoop([0, 0], [this.repeat_x - 1, this.repeat_y - 1], (a, b) => {
			if (this.type == "anime") {
				ctx.drawImage(this.image[this.frame], - this.center_x + w * a, - this.center_y + h * b, w, h)
			} else {
				ctx.drawImage(this.image, - this.center_x * this.ratio + w * a, - this.center_y * this.ratio + h * b, w, h)
			}
		})

		if (this.type == "anime") {
			this.frame = (this.frame + 1) % (this.image.length - 1)
		}

		// // コンテキストを元に戻す
		ctx.restore();

	}

	move(x, y, loop_x, loop_y) {
		this.x += x
		this.y += y

		this.x %= (loop_x - this.ratio - 1)
		this.y %= (loop_y - this.ratio - 1)
	}
}

const Image_Data = {};

const gcd = (x, y) => x % y ? gcd(y, x % y) : y
const lcm = (x, y) => x * y / gcd(x, y)

function Ilink(frame, x, y, link) {
	let a = ctx.measureText(link)

	ctx.save()

	if (x <= mouse.p.x && mouse.p.x <= x + a.width && y - font_size <= mouse.p.y && mouse.p.y <= y) {
		ctx.fillStyle = "#8080ff"
		Iline2("#8080ff", 1, [new vec(x, y + 2), new vec(x + a.width, y + 2)])
		if (mouse.clicked) {
			window.open(link);
		}
	}
	Itext(frame, x, y, link)

	ctx.restore()
}

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
			if (Sound_Data.text) { Sound_Data.text_sending.play(); }
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
	let textArr = text.split("<br>");
	Itext4(frame, x, y, line_space, textArr);
}

//linkの埋め込みができます
function Itext6(frame, x, y, line_space, text) {

	Itext5(frame, x, y, line_space, text.replaceAll("<link>", ""))

	let H = 0

	let text_list = text.split("<br>")
	for (let h = 0; h < text_list.length; h++) {
		let I = ""
		let t = text_list[h]
		let link = t.split("<link>")
		for (let i = 0; i < link.length; i++) {
			let l = link[i]
			if (i % 2 == 1) {
				Ilink(frame - H - I.length, x + ctx.measureText(I).width, y + h * line_space, l)
			}
			I += l
		}

		H += t.replaceAll("<link>", "").length
	}
}

//文字の表示をいい感じに
function Iadjust(max_width, text) {
	const lines = text.split("<br>");

	for (let h = 0; h < lines.length; h++) {
		let line = lines[h];
		for (let i = 0; i < line.length; i++) {
			let substring = line.slice(0, i);
			if (ctx.measureText(substring).width > max_width) {
				lines[h] = substring + "<br>" + line.slice(i);
				break;
			}
		}
	}

	const adjusted_text = lines.join("<br>");

	return adjusted_text
}

function Icircle(x, y, r, c, id = "fill", width = 2) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);

	switch (id) {
		case "fill":
			ctx.fillStyle = c;
			ctx.fill();
			break;
		case "stroke":
			ctx.strokeStyle = c;
			ctx.lineWidth = width;
			ctx.stroke();
			break;
	}
}

function Iarc(x, y, r, start, end, c, id = "fill", width = 2) {
	ctx.beginPath();
	ctx.arc(x, y, r, start, end);

	switch (id) {
		case "fill":
			ctx.fillStyle = c;
			ctx.fill();
			break;
		case "stroke":
			ctx.strokeStyle = c;
			ctx.lineWidth = width;
			ctx.stroke();
			break;
	}
}

function Ipolygon(m, n, x, y, r, c, theta = 0, id = "fill", width = 2) {
	ctx.beginPath()
	const g = gcd(m, n)
	m /= g
	n /= g

	for (let h = 0; h < g; h++) {
		const first = new vec(x, y).add(new vec(0, -r).rot(theta + 2 * Math.PI * h / g / m))
		ctx.moveTo(first.x, first.y)

		const angle = 2 * Math.PI * n / m
		for (let i = 1; i <= m; i++) {
			const to = new vec(x, y).add(new vec(0, -r).rot(theta + angle * i + 2 * Math.PI * h / g / m))
			ctx.lineTo(to.x, to.y)
		}
	}

	if (id == "fill") {
		ctx.fillStyle = c
		ctx.fill()
	} else {
		ctx.strokeStyle = c
		ctx.lineWidth = width
		ctx.stroke()
	}

}

const Itrochoid = (m, n, o, x, y, rc, theta, c, id = "fill", width) => {
	const d = 255
	const g = Math.abs(gcd(m, n))
	m /= g
	n /= g

	const rm = rc / (m / n)
	const rd = rm * o

	ctx.beginPath()

	for (let h = 0; h < g; h++) {

		const b = new vec(rm + rc - rd, 0).rot(theta + 2 * Math.PI * h / g / m)
		ctx.moveTo(b.x + x, b.y + y)

		for (let i = 1; i < 1 + d * Math.abs(m); i++) {
			const a = new vec(
				(rm + rc) * Math.cos(2 * Math.PI / d * i) - rd * Math.cos((rc / rm + 1) * (2 * Math.PI / d * i)),
				(rm + rc) * Math.sin(2 * Math.PI / d * i) - rd * Math.sin((rc / rm + 1) * (2 * Math.PI / d * i))
			).rot(theta + 2 * Math.PI * h / g / m)

			ctx.lineTo(a.x + x, a.y + y)
		}
	}

	if (id == "fill") {
		ctx.fillStyle = c
		ctx.fill()
	} else {
		ctx.strokeStyle = c
		ctx.lineWidth = width
		ctx.stroke()
	}

}

//奇数角形の時はるーろー
const Ireuleaux = (m, n, x, y, r, c = "white", theta = 0, id = "fill", width = 2) => {
	const g = Math.abs(gcd(m, n))

	m /= g
	n /= g

	const angle = Math.PI / m * n
	const length = 2 * r * Math.cos(angle / 2)

	ctx.strokeStyle = c
	ctx.lineWidth = width

	for (let h = 0; h < g; h++) {
		ctx.beginPath()
		for (let i = 0; i < Math.abs(m); i++) {
			const point = new vec(x, y).add(new vec(0, -r).rot(2 * Math.PI / m * n * i + theta + 2 * Math.PI * h / g / m))
			ctx.arc(point.x, point.y, length,
				Math.PI / 2 + 2 * Math.PI / m * n * i - angle / 2 + theta + 2 * Math.PI * h / g / m,
				Math.PI / 2 + 2 * Math.PI / m * n * i + angle / 2 + theta + 2 * Math.PI * h / g / m)
		}
		ctx.stroke()

	}

	if (id == "fill") {
		ctx.fillStyle = c
		ctx.fill()
	}

}

const Iellipse = (x, y, r0, r1, arg, colour, start = 0, end = 2 * Math.PI, id = "fill", width = 2) => {
	ctx.beginPath()

	ctx.ellipse(x, y, r0, r1, arg, start, end)

	switch (id) {
		case "fill":
			ctx.fillStyle = colour
			ctx.fill()
			break
		case "stroke":
			ctx.strokeStyle = colour
			ctx.lineWidth = width
			ctx.stroke()
			break
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

//座標をベクトルで指定する
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
	}
	length() { return Math.sqrt(this.x ** 2 + this.y ** 2); }

	add(v) { return new vec(this.x + v.x, this.y + v.y); }
	sub(v) { return new vec(this.x - v.x, this.y - v.y); }
	mlt(m) { return new vec(this.x * m, this.y * m); }
	nor() { if (this.length() == 0) { return this; } else { return new vec(this.x / this.length(), this.y / this.length()); } }
	rot(rad) { return new vec(this.x * Math.cos(rad) - this.y * Math.sin(rad), this.x * Math.sin(rad) + this.y * Math.cos(rad)); }
	new() { return new vec(this.x, this.y); }
	dot(v) { return this.x * v.x + this.y * v.y; }
	arg() { return Math.atan2(this.y, this.x) }
}

const vec3 = class {
	constructor(_x, _y, _z) {
		this.x = _x;
		this.y = _y;
		this.z = _z
	}
	length() { return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2); }

	add(v) { return new vec3(this.x + v.x, this.y + v.y, this.z + v.z); }
	sub(v) { return new vec3(this.x - v.x, this.y - v.y, this.z - v.z); }
	mlt(m) { return new vec3(this.x * m, this.y * m, this.z * m); }
	nor() { if (this.length() == 0) { return this; } else { const l = this.length(); return new vec3(this.x / l, this.y / l, this.z / l); } }
	rot(theta, v) {
		//軸ベクトル
		const u = v.nor()

		//作用素
		const r = new qua(Math.cos(theta / 2), Math.sin(theta / 2) * u.x, Math.sin(theta / 2) * u.y, Math.sin(theta / 2) * u.z)

		//四元数にす
		const a = new qua(0, this.x, this.y, this.z)

		//回転させる
		const e = r.mlt(a).mlt(r.cnj())

		//ベクトルに戻す
		const i = new vec3(e.b, e.c, e.d)

		return i
	}
	to2() { return new vec(this.x, this.y) }
	new() { return new vec3(this.x, this.y, this.z) }
}

const qua = class {
	constructor(a, b, c, d) {
		this.a = a
		this.b = b
		this.c = c
		this.d = d
	}
	length() { return Math.sqrt(this.a ** 2 + this.b ** 2 + this.c ** 2 + this.d ** 2) }
	add(q) { return new qua(this.a + q.a, this.b + q.b, this.c + q.c, this.d + q.d) }
	mlt(q) {
		if (typeof q == "number") {
			return new qua(this.a * q, this.b * q, this.c * q, this.d * q)
		} else {
			return new qua(
				this.a * q.a - this.b * q.b - this.c * q.c - this.d * q.d,
				this.a * q.b + this.b * q.a + this.c * q.d - this.d * q.c,
				this.a * q.c - this.b * q.d + this.c * q.a + this.d * q.b,
				this.a * q.d + this.b * q.c - this.c * q.b + this.d * q.a
			)
		}
	}
	cnj() {
		return new qua(this.a, -this.b, -this.c, -this.d)
	}
}

//多重for文(f:関数, a:初期値, b:終了値)
function ILoop(a = null, b, f) {
	a ??= Igenerator(function* () { for (let i = 0; i < b.length; i++) { yield 0 } })

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

function IpolygonC(m, n, x, y, r, c, theta, id, width) {
	Ipolygon(m, n, x - Icamera.p.x, y - Icamera.p.y, r, c, theta, id, width)
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

function Icommand(c, x, y, line_space, option, f, loop) {
	let o = Iget(option, c.current_branch)

	c.cancel = false
	if (pushed.includes("cancel")) {
		c.cancel = true
		Sound_Data.cancel.play()
	}

	if (o != null) {
		Itext4(c.frame * 2, x + line_space, y, line_space, o)
		Itext(c.frame, x, y + line_space * c.current_value, "→")

		if (pushed.includes("ArrowDown")) { c.current_value++; Sound_Data.select.play() }
		if (pushed.includes("ArrowUp")) { c.current_value--; Sound_Data.select.play() }
		c.current_value = (c.current_value + o.length) % o.length		//loop

		if (pushed.includes("ok")) {
			//押したときなんかなります
			let fun = Iget(f, c.current_branch)
			if (fun != null) { fun(c) }

			c.current_branch += c.current_value
			c.frame = 0
			c.current_value = 0
			Sound_Data.ok.play()
		}
	}

	//ずっとなんかなります
	let l = Iget(loop, c.current_branch)
	if (l != null) { l(c) }

	if (c.cancel && c.current_branch != "") {
		c.current_value = Number(c.current_branch.charAt(c.current_branch.length - 1))
		c.current_branch = c.current_branch.slice(0, -1)
		c.frame = 0
	}

	c.frame++;

	return c
}

//.は後に処理される感じがする
function Iget(obj, key) {
	for (let dictKey in obj) {
		// 正規表現を使用して部分一致を判定
		let regex = new RegExp("^" + dictKey + "$");
		if (key.match(regex)) {
			return obj[dictKey]; // 部分一致するキーが見つかった場合、その値を返す
		}
	}
	return undefined; // 部分一致するキーが見つからない場合は undefined を返す

}

//generatorを展開する
function Igenerator(generator) {
	let list = []

	for (let i of generator()) {
		list.push(i)
	}

	return list
}

console.log("Ifunctions.js_loaded");
