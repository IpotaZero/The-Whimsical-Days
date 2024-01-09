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

let difficulty = 0

//message window
const lefttop = new vec(40, 500)
const leftbottom = new vec(40, 680)
const righttop = new vec(432, 500)
const rightbottom = new vec(432, 680)

const dash_interval = 48

const player_bullet = remodel([bullet_model], ["r", 3, "app", "none", "colour", "#ffffff80", "type", "friend"])[0]

const scene_main = new class extends Scene {
  constructor() {
    super()
    Image_Data.background = new Iimage("./images/ba.png", 0, 0, width, height)
    Image_Data.battle_bg = new Iimage("./images/battle_bg.png", -width + 20 + game_width / 2, -height + 20 + game_height / 2, width * 2, height * 2, { alpha: 0.0, center_x: width, center_y: height, repeat_x: 32, repeat_y: 32 })

    Sound_Data.graze = new Iaudio("./sounds/graze.wav")
    Sound_Data.dash = new Iaudio("./sounds/dash.wav")
    Sound_Data.bullet0 = new Iaudio("./sounds/鈴を鳴らす.mp3")
    Sound_Data.bullet1 = new Iaudio("./sounds/きらきら輝く2.wav")
    Sound_Data.bullet2 = new Iaudio("./sounds/bullet.wav")
    Sound_Data.KO = new Iaudio("./sounds/KO.wav")
    Sound_Data.hakkyou = new Iaudio("./sounds/hakkyou!.wav")
    Sound_Data.u = new Iaudio("./sounds/u.wav")

    this.brighten = true
    this.colours = {}

    this.chapter_num = 0

    this.mouse_mode = false
  }

  start() {
    bullets = []
    enemies = []
    enemy_vrs.p = new vec(game_width / 2, -100)
    this.graze = 0
    this.score = 0
    this.socre_text = ""

    this.frame = 0
    this.is_paused = false

    this.battle_image_frame = 0

    this.story_frame = 0
    this.story_num = 0
    this.story_images = []
    this.story_interval = 0
    this.chapter = story[this.chapter_num]
    this.boss = false

    this.story_image = []
    this.story_text = ""
    this.story_popup = ""

    this.c = { frame: 0, current_branch: "", current_value: 0 }

    player = { p: new vec(game_width / 2, game_height / 2), v: new vec(0, 0), r: 3, graze_r: 16, speed: 12, life: 8, inv: false, dash: 0, dash_interval: 0, dead: 0, direction: 0 }
  }

  end() {

  }

  scoring(score, text = "CRUSH!") {
    this.score += score
    this.socre_text = text + ": " + score
  }

  continue_story() {
    this.story_num++;
    this.story_frame = 0;
    this.story_interval = 0
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

          case "score":
            this.scoring((difficulty + 1) * 10 ** 5, "Bonus")
            this.story_text = "Score: " + this.score
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
            console.log(element)
            element.se.reset()
            element.se.set_volume(0.4)
            element.se.play()
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

    this.story_image.forEach((i) => { i.alpha += 1 / 24; i.draw() })

    if (this.story_popup != "") {
      Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")
      Itext5(this.story_frame, game_width + 40, game_height - 180, font_size, this.story_popup)
    }

    if (this.story_text != "") {
      Irect(lefttop.x, lefttop.y, rightbottom.x - lefttop.x, rightbottom.y - lefttop.y, "#ffffffcc")

      Iline2("#808080CC", 12, [lefttop.add(new vec(20, 40)), leftbottom.add(new vec(20, -20)), rightbottom.add(new vec(-40, -20))])
      Iline2("#808080CC", 12, [lefttop.add(new vec(40, 20)), righttop.add(new vec(-20, 20)), rightbottom.add(new vec(-20, -40))])

      Iline2("#808080CC", 6, [lefttop.add(new vec(13, 13)), lefttop.add(new vec(40, 40))])
      Iline2("#808080CC", 6, [lefttop.add(new vec(10, 30)), lefttop.add(new vec(10, 10)), lefttop.add(new vec(30, 10))])

      Iline2("#808080CC", 6, [rightbottom.add(new vec(-13, -13)), rightbottom.add(new vec(-40, -40))])
      Iline2("#808080CC", 6, [rightbottom.add(new vec(-10, -30)), rightbottom.add(new vec(-10, -10)), rightbottom.add(new vec(-30, -10))])

      Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', serif")
      Itext5(this.story_frame, lefttop.x + 40, lefttop.y + 50, font_size, this.story_text + ok)
    }

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

    if (pushed.includes("KeyB")) {
      let e = this.chapter[this.story_num]
      do {
        this.continue_story()
        e = this.chapter[this.story_num]
      } while (!["text", "do", "image"].includes(e.type))
    }

    if (pushed.includes("Delete") && enemies.length > 0) {
      enemies[0].life = 0
    }

    this.draw()

    if (this.is_paused) {
      Ifont(48, "black", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")
      Itext(this.frame, game_width + 80, height / 2 + 24, "Pause")

      Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")
      this.c = Icommand(this.c, game_width + 40, 450, font_size, { "": ["Back to Game", "Back to Title"] })

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
      player.dash_interval = dash_interval
      player.dash = 12
      player.inv = true
      Sound_Data.dash.play()
    }

    if (player.dash > 0) {
      player.dash--;
      bullets.push({ type: "effect", app: "none", colour: "red", life: 12, p: player.p, r: player.r, f: [(me) => { me.life--; me.colour = "rgba(255,0,0," + (me.life / 24) + ")" }] })
      bullets.push({ type: "effect", app: "donut", colour: "white", life: 12, p: player.p, r: player.r + player.graze_r, f: [(me) => { me.life--; me.colour = "rgba(255,255,255," + (me.life / 24) + ")" }] })
    } else {
      player.inv = false
    }

    if (player.dash_interval > 0) { player.dash_interval--; }

    player.v = player.v.nor()
    player.p = player.v.mlt(player.speed).add(player.p)

    if (this.mouse_mode) { player.p = mouse.p.add(new vec(-20, -20)) }

    if (player.p.x < 0) { player.p.x = 0 }
    if (player.p.x > game_width) { player.p.x = game_width }
    if (player.p.y < 0) { player.p.y = 0 }
    if (player.p.y > game_height) { player.p.y = game_height }

    if (pushed.includes("KeyA")) { player.direction = 1 - player.direction }

  }

  danmaku() {
    if (this.frame % 3 == 0) {
      if (pressed.includes("ShiftLeft")) {
        for (let i = 0; i < 5; i++) {
          bullets.push(...remodel([player_bullet], ["p", player.p.add(new vec(20 * (i - 2), 0)), "v", new vec(0, -32).rot(Math.PI * player.direction)]))
        }
      } else {
        bullets.push(...remodel([player_bullet], ["p", player.p, "v", new vec(0, -16).rot(Math.PI * player.direction), "nway", 5, Math.PI / 12, player.p]))
      }
    }

    if (player.dead > 0) {
      bullets = []
      player.dead--;
    }

    enemies.forEach((e) => {
      e.damaged = false

      //closer, higher damage
      const damage = 1 + Math.floor(3 * (1 - e.p.sub(player.p).length() / game_height))

      //player_bullet vs enemy
      bullets.forEach((b) => {
        if (b.type == "friend" && !e.is_inv && b.r + e.r >= b.p.sub(e.p).length()) {
          b.life = 0
          e.life -= damage;
          e.damaged = true
          this.scoring(100 * damage, "HIT")
        }
      })

      //enemy's function
      e.f.forEach((f) => { f(e) })
    })

    bullets.forEach((b) => {
      //bullet's function
      b.f.forEach((f) => { f(b) })

      //enemy_bullet vs player
      if (["enemy", "score"].includes(b.type) && !player.inv && player.dead == 0 && b.life > 0 && b.r + player.r + player.graze_r >= b.p.sub(player.p).length()) {
        if (b.type == "enemy") {
          //graze
          this.graze++;
          this.scoring(1000, "GRAZE")

          if (b.r + player.r >= b.p.sub(player.p).length()) {
            b.life = 0
            player.dead = 24
            player.life--;
            Sound_Data.u.play()
          }
        } else {
          this.scoring(100, "BULLET")
          b.life = 0
        }
        Sound_Data.graze.play()
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
      //Image_Data.battle_bg.move(-2, -2, 64, 64)
      Image_Data.battle_bg.alpha = 0.1 * Math.min(48, this.battle_image_frame) / 48
      Image_Data.battle_bg.rotate += Math.PI / 360;
      Image_Data.battle_bg.draw()

      this.battle_image_frame++
    }

    //player
    const colour_player = player.dead > 0 ? "80" : "ff";
    IcircleC(player.p.x, player.p.y, player.r, "#ff0000" + colour_player)
    IarcC(player.p.x, player.p.y, player.r + player.graze_r, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * (1 - player.dash_interval / dash_interval), "#ffffff" + colour_player, "stroke", 2)
    if (this.brighten) {
      IcircleC(player.p.x, player.p.y, player.r + player.graze_r, "rgba(255,255,255,0.2)", "stroke", 8)
      IcircleC(player.p.x, player.p.y, player.r, "rgba(255,0,0,0.2)", "stroke", 8)
    }
    IarcC(player.p.x, player.p.y, player.r + player.graze_r / 2, -Math.PI / 2 + 2 * Math.PI * player.dash / 12, -Math.PI / 2, "#ffff00" + colour_player, "stroke", 2)

    //敵
    enemies.forEach((e) => {
      const colour_enemy = e.damaged ? "#ec1c24" : "#ffffff"

      const colour_life_bar = e.is_inv ? "#ec1c24" : "#ffffff"

      IrectC(e.p.x - e.r, e.p.y - e.r - 12, 2 * e.r * e.life / e.maxlife, 6, colour_life_bar);
      IrectC(e.p.x - e.r, e.p.y - e.r - 12, 2 * e.r, 6, colour_life_bar, "stroke", 2);

      const colour_pattern = colour_enemy + "80"

      if (this.brighten) {
        IcircleC(e.p.x, e.p.y, e.r, chroma(colour_enemy).alpha(0.1).hex(), "stroke", 12)
        if (e.is_boss) {
          IcircleC(e.p.x, e.p.y, e.r - 24, chroma(colour_enemy).alpha(0.1).hex(), "stroke", 12)
        }
      }

      if (e.is_boss) {
        IpolygonC(7, 2, e.p.x, e.p.y, (e.r - 24) * 0.9, colour_pattern, Math.PI * e.frame / 144, "stroke", 2)
        IpolygonC(11, 2, e.p.x, e.p.y, e.r * 0.9, colour_pattern, -Math.PI * e.frame / 144, "stroke", 2)
        IcircleC(e.p.x, e.p.y, e.r - 24, colour_enemy, "stroke", 2)
      } else {
        IpolygonC(7, 2, e.p.x, e.p.y, e.r * 0.9, colour_pattern, Math.PI * e.frame / 144, "stroke", 2)
      }

      IcircleC(e.p.x, e.p.y, e.r, colour_enemy, "stroke", 2)
    })

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
        this.colours[b.colour] ??= chroma(b.colour).brighten(2).hex()
        const c = chroma(this.colours[b.colour])

        if (!["none", "ball", "laser"].includes(b.app)) {
          IcircleC(b.p.x, b.p.y, b.r - 1, c.hex(), "stroke", 2)
          IcircleC(b.p.x, b.p.y, b.r, c.alpha(0.1 * c.alpha()).hex(), "stroke", 12)
        } else if (b.app == "laser") {
          if (laser_count % 4 == 0) {
            IcircleC(b.p.x, b.p.y, b.r * 1.5, c.alpha(0.1 * c.alpha()).hex(), "stroke", 18)
          }
          laser_count++;
        }
      }
    })



    // let background_colour = "pink"
    // Irect(0, 0, 20, height, background_colour)
    // Irect(20 + game_width, 0, width - game_width - 20, height, background_colour)
    // Irect(20, 0, game_width, 20, background_colour)
    // Irect(20, 20 + game_height, game_width, 20, background_colour)

    ctx.globalCompositeOperation = "source-over"

    Image_Data.background.draw()

    Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', serif")
    Itext4(null, game_width + 40, lefttop.y + font_size, font_size, ["Difficulty: " + ["Easy", "Normal", "Hard", "Insane!"][difficulty], "Lives: ", "Graze: " + this.graze, "Score: " + this.score])

    Itext(null, game_width + 40, lefttop.y + font_size * 5, this.socre_text)

    Ifont(20, "lightgreen", "'HG創英角ﾎﾟｯﾌﾟ体', serif")
    Itext(null, game_width + 40 + 70, lefttop.y + 24 * 2, "★".repeat(player.life))

    // Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', serif")
    // Itext(null, game_width + 40, 100, "" + this.story_interval)
    // Itext(null, game_width + 40, 150, "" + this.story_num)
    // Itext(null, game_width + 40, 200, this.chapter[this.story_num].type)
    // Itext(null, game_width + 40, 250, "bullets: " + bullets.length)
    // Itext(null, game_width + 40, 300, "enemies: " + enemies.length)
  }
}()

const scene_title = new class extends Scene {
  constructor() {
    super()
    this.option = { "": ["PLAY", "MANUAL", "STORY", "CREDIT"], "0": ["Stage0"], "0.": ["Easy", "Normal", "Hard", "Insane!"] }

    this.function = {
      "0": (c) => {
        scene_main.chapter = c.current_value
      },
      "0.": (c) => {
        difficulty = c.current_value
        scene_anten.next_scene = scene_main
        scene_manager.MoveTo(scene_anten)
      }
    }

    this.loopf = {
      "0": (c) => {
        Itext5(c.frame, 60, 400, font_size, ["vs Ethanol"][c.current_value]);
      },
      "0.": (c) => {
        Itext5(c.frame, 60, 400, font_size, ["弾幕初めての人向け", "操作を使いこなせたら", "隙間をすり抜けろ!", "テストプレイなんてしてないよ!"][c.current_value]);
      },
      "1": (c) => {
        Ifont(24, "white", "serif")
        Itext5(c.frame * 2, 20, 200, font_size,
          "・十字キーで移動<br>・Shiftキーで低速 <br>"
          + "・Aで後ろを向く <br>・Ctrlで0.5秒ダッシュ(ダッシュ中は無敵) <br>"
          + "・赤い点が当たり判定 <br>"
          + "・白い円がかすり判定 <br>"
          + "・Escでポーズ <br>"
          + "・敵に近づくほど攻撃力が上がる!(最大3倍)<br>"
          + "・HPバーが赤い敵は無敵!持久力勝負だぜ!<br>"
          + "・重くて動かないよ!って人は <br> BrightenをOFFしてください <br>[X]"
        )
      },
      "2": (c) => {
        Ifont(24, "white", "serif")
        Itext5(c.frame, 20, 200, font_size, "警視庁公安部対天使科実動隊のコハクは今夜も天使の気配を感じて<br>夜の東京を飛翔するのであった...[X]")
      },
      "3": (c) => {
        Ifont(24, "white", "serif")
        Itext6(c.frame * 2, 20, 200, font_size,
          "制作: お躁式ラケッツ! <link>https://www.nicovideo.jp/user/131397716<br>"
          + "効果音: 効果音ラボ <link>https://soundeffect-lab.info<br>"
          + "背景、キャラクター: Craiyon <link>https://www.craiyon.com<br>[X]"
        )
      }
    }

    Sound_Data.ok = new Iaudio("./sounds/ok.wav")
    Sound_Data.cancel = new Iaudio("./sounds/cancel.wav")
    Sound_Data.select = new Iaudio("./sounds/select.wav")

    // const num = 120
    // this.circle = Igenerator(
    //   function* () {
    //     for (let h = 0; h < 36; h++) {
    //       yield Igenerator(
    //         function* () { for (let i = 0; i < num; i++) { yield new vec3(Math.cos(2 * Math.PI * i / num), Math.sin(2 * Math.PI * i / num), 0).rot(2 * Math.PI * h / 36, new vec3(1, 2, 1)).to2() } }
    //       )
    //     }
    //   }
    // )

    this.mn = [3, 4]
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

    Ipolygon(this.mn[0], this.mn[1], width * 3 / 4, height * 3 / 4, 120, "white", Math.PI * this.frame / 144, "stroke", 2)
    //Itext(null, 480, height / 2, this.mn[0] + "/" + this.mn[1])

    // this.circle[this.frame % 36].forEach((c) => {
    //   const d = c.mlt(120)
    //   const e = c.mlt(60)
    //   Icircle(width * 3 / 4 + d.x, height * 3 / 4 + d.y, 1, "white")
    //   Icircle(width * 3 / 4 + e.x, height * 3 / 4 + e.y, 1, "white")
    // })

    Ifont(36, "white", "serif")
    this.c = Icommand(this.c, 20, 200, font_size, this.option, this.function, this.loopf)

    this.frame++;

    if (this.frame % 14 == 0) {
      let a
      do {
        a = [Math.floor(Math.random() * 12) + 2, Math.floor(Math.random() * 3) + 2]
      } while (this.mn[0] / this.mn[1] == a[0] / a[1] || a[0] / a[1] < 2)

      this.mn = a

    }
  }
}()

const scene_pretitle = new class extends Scene {
  constructor() {
    super()
  }

  start() {
    this.frame = 0
  }

  end() {
    //bodyにボタンを追加
    const buttons = { "brighten": "Brighten:ON", "control_mode": "Control_mode:key", "mute_bgm": "Mute_bgm", "mute_se": "Mute_se" };
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
    if (this.frame <= 9) {
      Irect(0, 0, width, height, "#121212")

      Ifont(48, "white", "serif")
      //中央ぞろえ
      let text = "Push KeyZ"
      let sub_text = text.slice(0, this.frame)
      length = ctx.measureText(sub_text).width
      Itext(this.frame, (width - length) / 2, height / 2, text)

      this.frame++;
    }

    if (pushed.includes("KeyZ")) {
      scene_manager.MoveTo(scene_title)
    }
  }

}()

const scene_anten = new class extends Scene {
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
}()

const scene_gameover = new class extends Scene {
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

  end() {
    Sound_Data.gameover.pause()
  }

}()

const scene_manager = new class {
  constructor(_scene) {
    this.current_scene = _scene;
    this.current_scene.start()
  }

  MoveTo(_scene) {
    this.current_scene.end();
    this.current_scene = _scene;
    this.current_scene.start();
  }
}(scene_pretitle)

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

    case "control_mode":
      scene_main.mouse_mode = !scene_main.mouse_mode
      $("#control_mode").val("Control_mode:" + (scene_main.mouse_mode ? "mouse" : "key"))
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