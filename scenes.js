const Scene = class {
    constructor() {}

    start() {}

    loop() {}

    end() {}
}

const player_model = {
    p: new vec(game_width / 2, game_height / 2),
    v: new vec(0, 0),
    r: 3,
    graze_r: 16,
    speed: 12,
    life: 8,
    inv: false,
    dash: 0,
    dash_interval: 0,
    dead: 0,
    direction: 0,
}

let player = { ...player_model }

let bullets = []
let enemies = []

let next_bullets = []
let next_enemies = []

let difficulty = 0

let key_config = new LocalStorage("key_config", {
    up: "ArrowUp",
    down: "ArrowDown",
    right: "ArrowRight",
    left: "ArrowLeft",
    slow: "ShiftLeft",
    dash: "ControlLeft",
    turn: "KeyA",
    retry: "KeyR",
})

let config = new LocalStorage("config", {
    brighten: true,
    control_mode: "key",
    volume_bgm: 12,
    volume_se: 12,
})

//message window
const lefttop = new vec(40, 500)
const leftbottom = new vec(40, 680)
const righttop = new vec(432, 500)
const rightbottom = new vec(432, 680)

const dash_interval = 48

const player_bullet = remodel([bullet_model], ["r", 3, "app", "none", "colour", "#ffffff80", "type", "friend"])[0]

const damage_effect = {
    type: "effect",
    colour: "#00ffff80",
    app: "laser",
    p: new vec(0, 0),
    r: 6,
    life: 6,
    v: new vec(0, 0),
    f: [
        (me) => {
            me.life--
        },
    ],
}

const dash_effect_point = {
    type: "effect",
    app: "none",
    colour: "red",
    life: 12,
    p: new vec(0, 0),
    r: player_model.r,
    f: [
        (me) => {
            me.life--
            me.colour = "rgba(255,0,0," + me.life / 24 + ")"
        },
    ],
}

const dash_effect_ring = {
    type: "effect",
    app: "donut",
    colour: "white",
    life: 12,
    p: new vec(0, 0),
    r: player_model.r + player_model.graze_r,
    f: [
        (me) => {
            me.life--
            me.colour = "rgba(255,255,255," + me.life / 24 + ")"
        },
    ],
}

const test_item = {
    value: 0,
    f: (me) => {
        me.value++
    },
}

const scene_pretitle = new (class extends Scene {
    constructor() {
        super()
    }

    start() {
        this.frame = 0
    }

    end() {
        $("#buttons").append("BGM Volume:")
        $("#buttons").append("<input type='range' id=volume_bgm min=0 max=12 step=1 onchange='range(id)'></input>")
        $("#buttons").append("SE Volume:")
        $("#buttons").append("<input type='range' id=volume_se min=0 max=12 step=1 onchange='range(id)'></input>")

        $("#volume_bgm").val(config.data.volume_bgm)
        $("#volume_se").val(config.data.volume_se)

        //bodyにボタンを追加
        const buttons = {
            brighten: "Brighten:" + (config.data.brighten ? "ON" : "OFF"),
            control_mode: "Control_mode:" + config.data.control_mode,
        }
        const keys = Object.keys(buttons)
        for (let key of keys) {
            $("#buttons").append(
                "<input type='button' id=" + key + " value=" + buttons[key] + " onclick='button(id)'></input>",
            )
        }
    }

    loop() {
        if (this.frame <= 9) {
            Irect(0, 0, width, height, "#121212")

            Ifont(48, "white", "serif")
            //中央ぞろえ
            let text = "Push KeyZ"
            let sub_text = text.slice(0, this.frame)
            length = ctx.measureText(sub_text).width
            Itext(this.frame, (width - length) / 2, height / 2, text)

            this.frame++
        }

        if (pushed.includes("ok")) {
            scene_manager.MoveTo(scene_title)
        }
    }
})()

const scene_anten = new (class extends Scene {
    start() {
        this.frame = 0
    }

    loop() {
        Irect(0, 0, width, height, "rgba(0,0,0," + this.frame / 24 + ")")

        this.frame++

        if (BGM != null) {
            BGM.fadeout(this.frame, 24)
        }

        if (this.frame == 24) {
            if (BGM != null) {
                BGM.pause()
            }

            scene_manager.MoveTo(this.next_scene)
        }
    }
})()

const scene_gameover = new (class extends Scene {
    constructor() {
        super()
        Sound_Data.gameover = new Iaudio("./sounds/gameover.wav")
    }
    start() {
        this.frame = 0
        Sound_Data.uhm.play()
        Sound_Data.text = false
    }

    loop() {
        if (this.frame < 24) {
            Irect(0, 0, width, height, "rgba(0,0,0," + this.frame / 180 + ")")
            if (BGM != null) {
                BGM.fadeout(this.frame, 24)
            }
        } else if (this.frame == 36) {
            Sound_Data.gameover.play()
            if (BGM != null) {
                BGM.pause()
            }
        } else if (this.frame > 36) {
            Ifont(60, "white", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")

            let text = "GAMEOVER!"
            length = ctx.measureText(text).width
            Itext((this.frame - 36) / 15, (width - length) / 2, height / 2 + 30, text)

            Ifont(32, "white", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")
            Itext4(null, 0, game_height - font_size, font_size, ["[Z] to back to title", "[R] to retry"])

            if (pushed.includes("ok")) {
                scene_anten.next_scene = scene_title
                scene_manager.MoveTo(scene_anten)
            }

            if (pushed.includes(key_config.data.retry)) {
                scene_anten.next_scene = scene_main
                scene_manager.MoveTo(scene_anten)
            }
        }

        this.frame++
    }

    end() {
        Sound_Data.gameover.pause()
    }
})()

const scene_manager = new (class {
    constructor(_scene) {
        this.current_scene = _scene
        this.current_scene.start()
    }

    MoveTo(_scene) {
        this.current_scene.end()
        this.current_scene = _scene
        this.current_scene.start()
    }
})(scene_pretitle)

let BGM = null

let fpsInterval = 1000 / 24
let then = Date.now()
let start_time = then

const main = () => {
    requestAnimationFrame(main)

    let now = Date.now()
    let elapsed = now - then

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval)

        scene_manager.current_scene.loop()

        Irect(0, 0, width, height, "white", "stroke", 2)

        pushed = []

        gamepad_manager()
    }
}

const gamepad_manager = () => {
    if (!gamepad_connected) {
        return
    }

    let gp = navigator.getGamepads()[0]

    // console.log(gp)

    let axes = gp.axes

    if (axes[0] >= 0.1) {
        key_down({ code: "ArrowRight" })
    } else {
        key_up({ code: "ArrowRight" })
    }
    if (axes[0] <= -0.1) {
        key_down({ code: "ArrowLeft" })
    } else {
        key_up({ code: "ArrowLeft" })
    }
    if (axes[1] >= 0.1) {
        key_down({ code: "ArrowDown" })
    } else {
        key_up({ code: "ArrowDown" })
    }
    if (axes[1] <= -0.1) {
        key_down({ code: "ArrowUp" })
    } else {
        key_up({ code: "ArrowUp" })
    }

    let buttons = gp.buttons

    buttons.forEach((b, i) => {
        if (b.pressed) {
            key_down({ code: "Button" + i })
        } else {
            key_up({ code: "Button" + i })
        }
    })

    try {
        if (buttons[0].pressed) {
            key_down({ code: "ok" })
        } else {
            key_up({ code: "ok" })
        }
        if (buttons[1].pressed) {
            key_down({ code: "cancel" })
        } else {
            key_up({ code: "cancel" })
        }
    } catch (e) {
        console.error(e)
    }
}

const button = (id) => {
    console.log(id)
    switch (id) {
        case "brighten":
            config.data.brighten = !config.data.brighten
            config.save()
            $("#brighten").val("Brighten:" + (config.data.brighten ? "ON" : "OFF"))
            break

        case "control_mode":
            config.data.control_mode = { mouse: "key", key: "mouse" }[config.data.control_mode]
            config.save()
            $("#control_mode").val("Control_mode:" + config.data.control_mode)
            break
    }
}

const range = (id) => {
    switch (id) {
        case "volume_bgm":
            const volume = $("#" + id).val()
            config.data.volume_bgm = volume
            config.save()

            BGM.gain.gain.value = (BGM.volume * volume) / 12
            break
        case "volume_se":
            const volume_se = $("#" + id).val()
            config.data.volume_se = volume_se
            config.save()
            break
    }
    console.log(id, $("#" + id).val())
}
