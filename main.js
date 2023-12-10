const Scene_Manager = class {
  constructor(_scene) {
    this.current_scene = _scene;
    this.current_scene.start()
  }

  MoveTo(_scene) {
    this.current_scene.end();
    this.current_scene = _scene;
    this.current_scene.start();
  }
}

const Scene = class {
  constructor() {

  }

  start() {

  }

  loop() {

  }

  end() {

  }
}

let player

let bullets = []
let enemies = []
let effects = []

let next_bullets = []
let next_enemies = []

const Scene_Main = class extends Scene {
  constructor() {
    super()
    SoundData.graze = new Audio("./sounds/graze.wav")
    SoundData.dash = new Audio("./sounds/dash.wav")
    SoundData.bullet0 = new Audio("./sounds/鈴を鳴らす.mp3")
    SoundData.bullet1 = new Audio("./sounds/きらきら輝く2.wav")
    SoundData.bullet2 = new Audio("./sounds/bullet.wav")
    SoundData.KO = new Audio("./sounds/KO.wav")
    SoundData.hakkyou = new Audio("./sounds/hakkyou!.wav")

    SoundData.Weariness = new Audio("./sounds/Weariness.wav")

    SoundData.kohaku = new Audio("./sounds/select.wav")
    this.dash_interval = 48
  }

  start() {
    bullets = []
    enemies = []

    this.frame = 0
    this.is_paused = false

    this.story_frame = 0
    this.story_num = 0
    this.story_images = []

    player = { p: new vec(game_width / 2, game_height / 2), v: new vec(0, 0), r: 3, graze_r: 8, speed: 12, inv: false, dash: 0, dash_interval: 0, dead: 0, direction: 0 }

    BGM = SoundData.Weariness
    BGM.volume = 0.4
    BGM.currentTime = 0

    sound_play(BGM, "as bgm")

  }

  end() {

  }

  continue_story() {
    this.story_num++;
    this.story_frame = 0;
  }

  story() {
    let story = [
      ["text", "Kohaku:\nくんくん...\nこっちからプログラムの気配がする\nな...", SoundData.kohaku],
      ["text", "Carotene:\n別に戦わなくてもいいんだけどねー"],
      ["text", "Carotene:\n君があたしを倒すつもりなら、"],
      ["text", "Carotene:\n受けて立とうじゃないか!"],
      ["enemy", [{ ...enemy_data.carotene_0 }]],
      ["wait"],
      ["popup", "Ctrl+↑!!!"],
      ["wait"],
      ["text", "Carotene:\nぐえー"],
      ["end"]
    ]

    let element = story[this.story_num]

    SoundData.text = false

    switch (element[0]) {
      case "text":
        Irect(20, game_height - 200, game_width - 40, 180, "rgba(255,255,255,0.8)")

        if (element[2] != null) { SoundData.text = true; SoundData.text_sending = element[2] }

        Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', serif")
        Itext5(this.story_frame, 30, game_height - 180, font_size, element[1])
        if (pushed.includes("ok")) { this.continue_story() }
        break

      case "popup":
        Ifont(24, "white", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")
        Itext5(this.story_frame, game_width + 20, game_height - 180, font_size, element[1])
        break

      case "enemy":
        enemies.push(...element[1])
        this.continue_story()
        break

      case "end":
        scene_anten.next_scene = scene_title
        scene_manager.MoveTo(scene_anten)
        break

    }

    this.story_frame++;
  }

  loop() {
    if (!this.is_paused) {
      this.control_player()
      this.danmaku()
    }

    if (pushed.includes("Escape")) {
      this.is_paused ? sound_play(BGM, "as bgm") : BGM.pause()

      this.is_paused = !this.is_paused


    }

    if (pushed.includes("Delete") && enemies.length > 0) {
      enemies[0].life = 0
    }

    this.draw()

    this.story()

    this.frame++;
  }

  control_player() {
    //プレイヤー操作
    player.v = new vec(0, 0)

    if (pressed.includes("ArrowLeft")) { player.v.x--; }
    if (pressed.includes("ArrowRight")) { player.v.x++; }
    if (pressed.includes("ArrowUp")) { player.v.y--; }
    if (pressed.includes("ArrowDown")) { player.v.y++; }

    player.speed = pressed.includes("ShiftLeft") ? 6 : 16

    if (player.dash > 0) { player.speed = 60 }

    if (pushed.includes("ControlLeft") && player.dash_interval == 0) {
      player.dash_interval = this.dash_interval
      player.dash = 12
      player.inv = true
      sound_play(SoundData.dash)
    }

    if (player.dash > 0) {
      player.dash--;
      effects.push({ ...player, "effect_time": 12, "effect_type": "player" })
    } else {
      player.inv = false
    }
    if (player.dash_interval > 0) { player.dash_interval--; }

    player.v = player.v.nor()
    player.p = player.v.mlt(player.speed).add(player.p)

    if (player.p.x < 0) { player.p.x = 0 }
    if (player.p.x > game_width) { player.p.x = game_width }
    if (player.p.y < 0) { player.p.y = 0 }
    if (player.p.y > game_height) { player.p.y = game_height }

    if (pushed.includes("KeyA")) {
      player.direction = 1 - player.direction
    }
  }

  danmaku() {
    if (this.frame % 3 == 0) {
      if (pressed.includes("ShiftLeft")) {
        for (let i = 0; i < 5; i++) {
          bullets.push(...remodel([bullet_model], ["app", "ball", "colour", "rgba(255,255,255,0.5)", "type", "friend", "p", player.p.add(new vec(20 * (i - 2), 0)), "v", new vec(0, -32).rot(Math.PI * player.direction)]))
        }
      } else {
        bullets.push(...remodel([bullet_model], ["app", "ball", "colour", "rgba(255,255,255,0.5)", "type", "friend", "p", player.p, "v", new vec(0, -16).rot(Math.PI * player.direction), "nway", 5, Math.PI / 12, player.p]))
      }



    }

    if (pushed.includes("Enter")) { console.log(bullets) }

    if (player.dead > 0) {
      bullets = bullets.filter((b) => { return b.type != "enemy" });
      player.dead--;
    }

    //敵と弾
    enemies.forEach((e) => {
      e.damaged = false

      bullets.forEach((b) => {
        if (b.type == "friend" && b.r + e.r >= b.p.sub(e.p).length) {
          b.life = 0
          e.life--;
          e.damaged = true
        }
      })
      e.f(e)
    })

    bullets.forEach((b) => {
      b.f.forEach((f) => { f(b) })

      if (b.type == "enemy" && !player.inv && b.r + player.r + player.graze_r >= b.p.sub(player.p).length) {
        sound_play(SoundData.graze)
        if (b.r + player.r >= b.p.sub(player.p).length) {
          b.life = 0
          player.dead = 24
        }
      }
    })

    bullets = bullets.filter((b) => { return b.life > 0 })
    enemies = enemies.filter((e) => { return e.life > 0 })

    bullets.push(...next_bullets)
    enemies.push(...next_enemies)
    next_bullets = []
    next_enemies = []
  }

  draw() {
    //描画
    ctx.clearRect(0, 0, width, height)

    Irect(0, 0, game_width, game_height, "#121212")

    ctx.globalAlpha = player.dead > 0 ? 0.4 : 1;
    Icircle(player.p.x, player.p.y, player.r, "red")
    Iarc(player.p.x, player.p.y, player.r + player.graze_r, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * (1 - player.dash_interval / this.dash_interval), "white", "stroke", 2)
    Iarc(player.p.x, player.p.y, player.r + player.graze_r / 2, -Math.PI / 2 + 2 * Math.PI * player.dash / 12, -Math.PI / 2, "yellow", "stroke", 2)
    ctx.globalAlpha = 1;

    //弾
    bullets.forEach((b) => {
      if (b.app == "donut") {
        Icircle(b.p.x, b.p.y, b.r, b.colour, "stroke", 2)
      } else if (b.app == "laser") {
        let v = b.v;
        if (v.x == 0 && v.y == 0) { v = new vec(0.01, 0); }//速度が0ベクトルだと方向が指定されなくなりますので
        Iline(b.colour, b.r * 2 * 1.5, [[b.p.sub(v.nor().mlt(b.r)).x, b.p.sub(v.nor().mlt(b.r)).y], [b.p.add(v.nor().mlt(b.r)).x, b.p.add(v.nor().mlt(b.r)).y]]);
      } else {
        Icircle(b.p.x, b.p.y, b.r, b.colour)
      }
    })

    //敵
    enemies.forEach((e) => {
      let c = e.damaged ? "red" : "white"

      Irect(e.p.x - e.r, e.p.y - e.r - 12, 2 * e.r * e.life / e.maxlife, 6, "white");
      Irect(e.p.x - e.r, e.p.y - e.r - 12, 2 * e.r, 6, "white", "stroke", 2);

      Icircle(e.p.x, e.p.y, e.r, c, "stroke", 2)
    })

    //エフェクト
    effects.forEach((e) => {
      if (e.effect_type == "player") {
        Icircle(e.p.x, e.p.y, e.r, "rgba(255,0,0," + (e.effect_time / 12) + ")")
      }
      e.effect_time--;
    })

    effects = effects.filter((e) => { return e.effect_time > 0 })

    Irect(game_width, 0, width - game_width, height, "rgba(127,127,127,1)")
  }
}

const Scene_Title = class extends Scene {
  constructor() {
    super()
    this.option = { "": ["PLAY", "MANUAL", "STORY"], "0": ["Stage0"] }

    SoundData.ok = new Audio("./sounds/ok.wav")
    SoundData.cancel = new Audio("./sounds/cancel.wav")
    SoundData.select = new Audio("./sounds/select.wav")
  }

  start() {
    this.frame = 0
    this.c = { frame: 0, current_branch: "", current_value: 0 }
  }

  loop() {
    Irect(0, 0, width, height, "#121212")

    Ifont(60, "white", "serif")
    Itext(this.frame, 20, 20 + font_size, "The Whimsical Days!")

    Ifont(36, "white", "serif")
    this.c = Icommand(this.c, 20, 200, font_size, this.option)

    switch (this.c.current_branch) {
      case "00":
        scene_anten.next_scene = scene_main
        scene_manager.MoveTo(scene_anten)
        break
      case "1":
        Itext5(this.c.frame, 20, 200, font_size, "十字キーで移動、Shiftキーで低速、\nAで後ろを向く、\nCtrlで0.5秒ダッシュ(ダッシュ中は無敵)")
        break
      case "2":
        Ifont(24, "white", "serif")
        Itext5(this.c.frame, 20, 200, font_size, "バグを取り除くために派遣された天使である\nコハクは2つのバグを取り除き\nまた次のバグを探して夜の街をさまようのであった...")
        break
    }

    this.frame++;
  }
}

const Scene_preTitle = class extends Scene {
  constructor() {
    super()
  }

  start() {
    this.frame = 0
  }

  loop() {
    Irect(0, 0, width, height, "#121212")

    Ifont(48, "white", "serif")
    //中央ぞろえ
    let text = "Push KeyZ"
    let sub_text = text.slice(0, this.frame)
    length = ctx.measureText(sub_text).width
    Itext(this.frame, (width - length) / 2, height / 2, text)

    if (pushed.includes("KeyZ")) {
      scene_manager.MoveTo(scene_title)
    }

    this.frame++;
  }

}

const Scene_Anten = class extends Scene {
  start() {
    this.frame = 0
  }

  loop() {
    Irect(0, 0, width, height, "rgba(0,0,0," + (this.frame / 24) + ")")

    this.frame++;

    if (BGM != null) { BGM.volume = 0.4 * (1 - this.frame / 24) }

    if (this.frame == 24) {
      if (BGM != null) { BGM.pause() }

      scene_manager.MoveTo(this.next_scene)
    }
  }
}

let scene_anten = new Scene_Anten()
let scene_pretitle = new Scene_preTitle()
let scene_title = new Scene_Title()
let scene_main = new Scene_Main()

let scene_manager = new Scene_Manager(scene_pretitle)

let BGM = null

function main() {
  scene_manager.current_scene.loop();

  Irect(0, 0, width, height, "white", "stroke", 2);

  pushed = [];

  //if (BGM != null) { BGM.volume = 0.4 }

}

//24fpsで実行
main_loop = setInterval(main, 1000 / 24)