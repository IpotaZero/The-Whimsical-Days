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

let next_bullets = []
let next_enemies = []

const Scene_Main = class extends Scene {
  constructor() {
    super()
    Image_Data.background = new Iimage("./images/ba.png", 0, 0, width, height)
    Image_Data.battle_bg = new Iimage("./images/battle_bg_repaet.png", 0, 0, 720, 720, 2, 0.1)

    Sound_Data.graze = new Iaudio("./sounds/graze.wav")
    Sound_Data.dash = new Iaudio("./sounds/dash.wav")
    Sound_Data.bullet0 = new Iaudio("./sounds/鈴を鳴らす.mp3")
    Sound_Data.bullet1 = new Iaudio("./sounds/きらきら輝く2.wav")
    Sound_Data.bullet2 = new Iaudio("./sounds/bullet.wav")
    Sound_Data.KO = new Iaudio("./sounds/KO.wav")
    Sound_Data.hakkyou = new Iaudio("./sounds/hakkyou!.wav")
    this.dash_interval = 48

    this.brighten = true

    this.colours = {}
  }

  start() {
    bullets = []
    enemies = []

    this.frame = 0
    this.is_paused = false

    this.story_frame = 0
    this.story_num = 0
    this.story_images = []
    this.story_interval = 0
    this.chapter = story[0]
    this.boss = false

    this.story_image = []
    this.story_text = ""
    this.story_popup = ""

    this.s = 0

    this.c = { frame: 0, current_branch: "", current_value: 0 }

    player = { p: new vec(game_width / 2, game_height / 2), v: new vec(0, 0), r: 3, graze_r: 16, speed: 12, life: 8, graze: 0, attack: 1, inv: false, dash: 0, dash_interval: 0, dead: 0, direction: 0 }
  }

  end() {

  }

  continue_story() {
    this.story_num++;
    this.story_frame = 0;
  }

  story() {
    let element = this.chapter[this.story_num]
    let ok = ""

    if (this.story_interval == 0) {
      while (!["end", "wait", "sleep", "ok"].includes(element.type)) {
        switch (element.type) {
          case "text":
            this.story_text = element.text
            if (element.voice == null) { Sound_Data.text = false } else { Sound_Data.text = true; Sound_Data.text_sending = element.voice }
            break

          case "popup":
            this.story_popup = element.text
            break

          case "image":
            element.image.alpha = 0
            this.story_image.push(element.image)
            break

          case "delete_image":
            this.story_image = []
            break

          case "se":
            element.bgm.reset()
            element.bgm.set_volume(0.4)
            element.bgm.play()
            break

          case "bgm":
            if (BGM != null) { BGM.pause() }
            BGM = element.bgm
            BGM.reset()
            BGM.set_volume(0.4)
            BGM.play()
            break

          case "enemy":
            enemies.push({ ...element.enemy })
            break

          case "do":
            element.f()
            break
        }
        this.continue_story()
        element = this.chapter[this.story_num]

      }
    }

    switch (element.type) {
      case "wait":
        break

      case "ok":
        ok = this.frame % 24 < 12 ? "[Z]" : ""
        if (pushed.includes("ok")) { this.continue_story() }

        break

      case "sleep":
        if (this.story_interval == 0) { this.story_interval = element.interval }
        this.story_interval = Math.max(0, this.story_interval - 1)
        if (this.story_interval == 0) { this.continue_story() }
        break

      case "end":
        scene_anten.next_scene = scene_title
        scene_manager.MoveTo(scene_anten)
        break
    }

    if (this.story_popup != "") {
      Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")
      Itext5(this.story_frame, game_width + 20, game_height - 180, font_size, this.story_popup)
    }

    if (this.story_text != "") {
      Irect(40, game_height - 180, game_width - 40, 180, "rgba(255,255,255,0.8)")

      Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', serif")
      Itext5(this.story_frame, 45, game_height - 150, font_size, this.story_text + ok)
    }

    this.story_image.forEach((i) => { i.alpha += 1 / 24; i.draw() })
    this.story_frame++;
  }

  loop() {
    cvs.focus()

    if (!this.is_paused) {
      this.control_player()
      this.danmaku()
    }

    if (pushed.includes("Escape")) {
      Sound_Data.cancel.play()

      if (BGM != null) { this.is_paused ? BGM.play() : BGM.pause() }
      this.is_paused = !this.is_paused

      this.frame = 0
    }

    if (pushed.includes("KeyB")) { this.brighten = !this.brighten }

    if (pushed.includes("Delete") && enemies.length > 0) {
      enemies[0].life = 0
    }

    this.draw()

    if (this.is_paused) {
      Ifont(48, "black", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")
      Itext(this.frame, game_width + 80, height / 2 + 24, "Pause")

      Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")
      this.c = Icommand(this.c, game_width + 40, 530, font_size, { "": ["Back to Game", "Back to Title"] })

      switch (this.c.current_branch) {
        case "0":
          this.is_paused = false
          if (BGM != null) { BGM.play() }

          break
        case "1":
          scene_anten.next_scene = scene_title
          scene_manager.MoveTo(scene_anten)
          break
      }

    } else {
      this.story()
    }

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
      Sound_Data.dash.play()
    }

    if (player.dash > 0) {
      player.dash--;
      bullets.push({ type: "effect", app: "none", colour: "red", life: 12, p: player.p, r: player.r, f: [(me) => { me.life--; me.colour = "rgba(255,0,0," + (me.life / 12) + ")" }] })
      bullets.push({ type: "effect", app: "donut", colour: "white", life: 12, p: player.p, r: player.r + player.graze_r, f: [(me) => { me.life--; me.colour = "rgba(255,255,255," + (me.life / 12) + ")" }] })
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
          bullets.push(...remodel([bullet_model], ["r", 3, "app", "none", "colour", "rgba(255,255,255,0.5)", "type", "friend", "p", player.p.add(new vec(20 * (i - 2), 0)), "v", new vec(0, -32).rot(Math.PI * player.direction)]))
        }
      } else {
        bullets.push(...remodel([bullet_model], ["r", 3, "app", "none", "colour", "rgba(255,255,255,0.5)", "type", "friend", "p", player.p, "v", new vec(0, -16).rot(Math.PI * player.direction), "nway", 5, Math.PI / 12, player.p]))
      }
    }

    if (pushed.includes("Enter")) { console.log(bullets) }

    if (player.dead > 0) {
      bullets = []
      player.dead--;
    }

    //敵と弾
    enemies.forEach((e) => {
      e.damaged = false

      bullets.forEach((b) => {
        if (b.type == "friend" && b.r + e.r >= b.p.sub(e.p).length()) {
          b.life = 0
          e.life -= player.attack;
          e.damaged = true
        }
      })
      e.f.forEach((f) => { f(e) })
    })


    bullets.forEach((b) => {
      b.f.forEach((f) => { f(b) })

      if (b.type == "enemy" && !player.inv && player.dead == 0 && b.r + player.r + player.graze_r >= b.p.sub(player.p).length()) {
        player.graze++;
        Sound_Data.graze.play()
        if (b.r + player.r >= b.p.sub(player.p).length()) {
          b.life = 0
          player.dead = 24
          player.life--;
        }
      }
    })

    bullets = bullets.filter((b) => { return b.life > 0 })
    enemies = enemies.filter((e) => { return e.life > 0 })

    bullets.push(...next_bullets)
    enemies.push(...next_enemies)
    next_bullets = []
    next_enemies = []

    if (player.life <= 0) {
      scene_manager.MoveTo(scene_gameover)
    }
  }

  draw() {
    //描画
    ctx.clearRect(0, 0, width, height)

    ctx.globalCompositeOperation = "screen"

    Irect(0, 0, width, height, "#121212")

    if (this.boss) {
      Image_Data.battle_bg.move(-2, -2, 64, 64)
      Image_Data.battle_bg.draw()
    }

    //player
    ctx.globalAlpha = player.dead > 0 ? 0.4 : 1;
    IcircleC(player.p.x, player.p.y, player.r, "red")
    IarcC(player.p.x, player.p.y, player.r + player.graze_r, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * (1 - player.dash_interval / this.dash_interval), "white", "stroke", 2)
    if (this.brighten) {
      IcircleC(player.p.x, player.p.y, player.r + player.graze_r, "rgba(255,255,255,0.2)", "stroke", 8)
      IcircleC(player.p.x, player.p.y, player.r, "rgba(255,0,0,0.2)", "stroke", 8)
    }
    IarcC(player.p.x, player.p.y, player.r + player.graze_r / 2, -Math.PI / 2 + 2 * Math.PI * player.dash / 12, -Math.PI / 2, "yellow", "stroke", 2)
    ctx.globalAlpha = 1;

    let laser_count = 0

    //弾
    bullets.forEach((b) => {
      switch (b.app) {
        case "donut":
          IcircleC(b.p.x, b.p.y, b.r, b.colour, "stroke", 2)
          break
        case "laser":
          let v = b.v;
          if (v.x == 0 && v.y == 0) { v = new vec(0.01, 0); }//速度が0ベクトルだと方向が指定されなくなりますので
          IlineC(b.colour, 2 * b.r, [[b.p.sub(v.nor().mlt(b.r)).x, b.p.sub(v.nor().mlt(b.r)).y], [b.p.add(v.nor().mlt(b.r)).x, b.p.add(v.nor().mlt(b.r)).y]]);
          break
        case "ball":
          IcircleC(b.p.x, b.p.y, b.r, b.colour)
          break
        default:
          IcircleC(b.p.x, b.p.y, b.r, b.colour)
      }

      if (this.brighten) {
        this.colours[b.colour] ??= chroma(b.colour).brighten(2).css()

        if (!["none", "ball", "laser"].includes(b.app)) {
          IcircleC(b.p.x, b.p.y, b.r - 1, this.colours[b.colour], "stroke", 2)
          IcircleC(b.p.x, b.p.y, b.r, chroma(b.colour).alpha(0.1).css(), "stroke", 12)
        } else if (b.app == "laser") {
          if (laser_count % 4 == 0) {
            IcircleC(b.p.x, b.p.y, b.r * 2, chroma(b.colour).alpha(0.1).css(), "stroke", 18)
          }
          laser_count++;
        }
      }
    })

    //敵
    enemies.forEach((e) => {
      let c = e.damaged ? "red" : "white"

      IrectC(e.p.x - e.r, e.p.y - e.r - 12, 2 * e.r * e.life / e.maxlife, 6, "white");
      IrectC(e.p.x - e.r, e.p.y - e.r - 12, 2 * e.r, 6, "white", "stroke", 2);

      if (this.brighten) { IcircleC(e.p.x, e.p.y, e.r, chroma(c).alpha(0.1).css(), "stroke", 12) }
      IcircleC(e.p.x, e.p.y, e.r, c, "stroke", 2)
    })

    // let background_colour = "pink"
    // Irect(0, 0, 20, height, background_colour)
    // Irect(20 + game_width, 0, width - game_width - 20, height, background_colour)
    // Irect(20, 0, game_width, 20, background_colour)
    // Irect(20, 20 + game_height, game_width, 20, background_colour)

    ctx.globalCompositeOperation = "source-over"

    Image_Data.background.draw()

    Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', serif")
    Itext4(null, game_width + 40, height - 100, font_size, ["lives: ", "graze: " + player.graze])

    Ifont(20, "lightgreen", "'HG創英角ﾎﾟｯﾌﾟ体', serif")
    Itext(null, game_width + 40 + 70, height - 100, "★".repeat(player.life))

    if (pressed.includes("MetaLeft") && pressed.includes("ShiftLeft")) {
      this.s = 24
    }

    if (this.s > 0) {
      Itext(null, game_width + 40, height - 20, "おや、スクショかい？")
      this.s--;
    }

    Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', serif")
    Itext(null, game_width + 40, 100, "" + this.story_interval)
    Itext(null, game_width + 40, 150, "" + this.story_num)
    Itext(null, game_width + 40, 200, this.chapter[this.story_num].type)
    Itext(null, game_width + 40, 250, "bullets: " + bullets.length)
    Itext(null, game_width + 40, 300, "enemies: " + enemies.length)
  }
}

const Scene_Title = class extends Scene {
  constructor() {
    super()
    this.option = { "": ["PLAY", "MANUAL", "STORY"], "0": ["Stage0"] }

    Sound_Data.ok = new Iaudio("./sounds/ok.wav")
    Sound_Data.cancel = new Iaudio("./sounds/cancel.wav")
    Sound_Data.select = new Iaudio("./sounds/select.wav")
  }

  start() {
    this.frame = 0
    this.c = { frame: 0, current_branch: "", current_value: 0 }
    Sound_Data.text = false
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
        Itext5(this.c.frame, 20, 200, font_size, "・十字キーで移動\n・Shiftキーで低速\n・Aで後ろを向く\n・Ctrlで0.5秒ダッシュ(ダッシュ中は無敵)\n・赤い点が当たり判定\n・白い円がかすり判定\n・Escでポーズ\n[X]")
        break
      case "2":
        Ifont(24, "white", "serif")
        Itext5(this.c.frame, 20, 200, font_size, "警視庁公安部対天使科のコハクは今夜も天使の気配を感じて\n夜の東京を飛翔するのであった...[X]")
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

  end() {
    //bodyにボタンを追加
    const buttons = { "brighten": "Brighten:ON", "mute_bgm": "Mute_bgm", "mute_se": "Mute_se" };
    const keys = Object.keys(buttons)
    $(function () {
      for (let key of keys) {
        $("body").append("<input type='button' id=" + key + " value=" + buttons[key] + " onclick='button(id);'></input>");
      }
      //ボタンの数をcss側に伝えます
      $("body").css("--button_num", keys.length)
    });
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

    if (BGM != null) { BGM.fadeout(this.frame, 24) }

    if (this.frame == 24) {
      if (BGM != null) { BGM.pause() }

      scene_manager.MoveTo(this.next_scene)
    }
  }
}

const Scene_Gameover = class extends Scene {
  constructor() {
    super()
    Sound_Data.gameover = new Iaudio("./sounds/gameover.wav")
    Sound_Data.uhm = new Iaudio("./sounds/⤵.wav")
    Sound_Data.uhm.set_volume(0.4)
  }
  start() {
    this.frame = 0
    Sound_Data.uhm.play()
    Sound_Data.text = false
  }

  loop() {
    if (this.frame < 24) {
      Irect(0, 0, width, height, "rgba(0,0,0," + (this.frame / 180) + ")")
      if (BGM != null) { BGM.fadeout(this.frame, 24) }
    } else if (this.frame == 36) {
      Sound_Data.gameover.play()
      if (BGM != null) { BGM.pause() }
    } else if (this.frame > 36) {
      Ifont(60, "white", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")

      let text = "GAMEOVER!"
      length = ctx.measureText(text).width
      Itext((this.frame - 36) / 15, (width - length) / 2, height / 2, text)

      if (pushed.includes("ok")) {
        scene_anten.next_scene = scene_title
        scene_manager.MoveTo(scene_anten)
      }
    }

    this.frame++;
  }

}

let scene_anten = new Scene_Anten()
let scene_gameover = new Scene_Gameover()
let scene_pretitle = new Scene_preTitle()
let scene_title = new Scene_Title()
let scene_main = new Scene_Main()

let scene_manager = new Scene_Manager(scene_pretitle)

let BGM = null

const main = () => {
  scene_manager.current_scene.loop();

  Irect(0, 0, width, height, "white", "stroke", 2);

  pushed = [];

}

const button = (id) => {
  console.log(id)
  switch (id) {
    case "brighten":
      scene_main.brighten = !scene_main.brighten
      $("#brighten").val("Brighten:" + (scene_main.brighten ? "ON" : "OFF"))
      break
    case "mute_bgm":
      Sound_Data.mute_bgm = !Sound_Data.mute_bgm
      if (BGM != null) {
        BGM.mute()
      }
      break
    case "mute_se":
      Sound_Data.mute_se = !Sound_Data.mute_se
      break
  }
}

//24fpsで実行
main_loop = setInterval(main, 1000 / 24)