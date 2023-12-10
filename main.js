const Scene_Manager = class {
  constructor(_scene) {
    this.current_scene = _scene;
    this.current_scene.start()
  }

  MoveTo(_scene) {
    this.current_scene.End();
    this.current_scene = _scene;
    this.current_scene.Start();
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

let player = { p: new vec(game_width / 2, game_height / 2), v: new vec(0, 0), r: 3, graze_r: 8, speed: 12, inv: false, dash: 0, dash_interval: 0, direction: 0 }

let bullets = []
let enemies = []
let effects = []

let next_bullets = []
let next_enemies = []

const Scene_Main = class extends Scene {
  constructor() {
    super()
    SoundData.graze = new Audio("./sounds/graze.wav")
    SoundData.bullet0 = new Audio("./sounds/鈴を鳴らす.mp3")
    SoundData.bullet1 = new Audio("./sounds/きらきら輝く2.wav")
    SoundData.bullet2 = new Audio("./sounds/bullet.wav")
    SoundData.KO = new Audio("./sounds/KO.wav")
    SoundData.hakkyou = new Audio("./sounds/hakkyou!.wav")
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
  }

  end() {

  }

  continue_story() {
    this.story_num++;
    this.story_frame = 0;
  }

  story() {
    let story = [
      ["text", "Carotene:\n別に戦わなくてもいいんだけどねー"],
      ["text", "Carotene:\n君があたしを倒すつもりなら、"],
      ["text", "Carotene:\n受けて立とうじゃないか!"],
      ["enemy", [{ ...enemy_data.carotene_0 }]],
      ["wait"],
      ["popup", "Ctrl+↑!!!"],
      ["wait"],
    ]

    let element = story[this.story_num]


    switch (element[0]) {
      case "text":
        Irect(20, game_height - 200, game_width - 40, 180, "rgba(255,255,255,0.8)")

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

    }

    this.story_frame++;
  }

  loop() {
    if (!this.is_paused) {
      this.control_player()
      this.danmaku()
    }

    if (pushed.includes("Escape")) {
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

    player.speed = pressed.includes("ShiftLeft") ? 6 : 12

    if (player.dash > 0) { player.speed = 60 }

    if (pushed.includes("ControlLeft") && player.dash_interval == 0) {
      player.dash_interval = this.dash_interval
      player.dash = 12
      player.inv = true
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
          bullets.push(
            ...remodel([bullet_model], [
              "app", "ball",
              "colour", "rgba(255,255,255,0.5)",
              "type", "friend",
              "p", player.p.add(new vec(20 * (i - 2), 0)),
              "v", new vec(0, -32).rot(Math.PI * player.direction),
            ])
          )
        }
      } else {
        bullets.push(
          ...remodel([bullet_model], [
            "app", "ball",
            "colour", "rgba(255,255,255,0.5)",
            "type", "friend",
            "p", player.p,
            "v", new vec(0, -16).rot(Math.PI * player.direction),
            "frame", 0,
            "f", (me) => {
              if (me.frame < 12 && enemies.length > 0) {
                let e = [...enemies]

                e.sort((a, b) => a.p.sub(me.p).length - b.p.sub(me.p).length)

                me.v = me.v.add(e[0].p.sub(me.p).nor().mlt(6))
                me.frame++;
              }
            },
            "nway", 3, Math.PI / 12, player.p
          ])
        )
      }



    }

    if (pushed.includes("Enter")) { console.log(bullets) }



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
          console.log("dead")
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

    Icircle(player.p.x, player.p.y, player.r, "red")
    Iarc(player.p.x, player.p.y, player.r + player.graze_r, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * (1 - player.dash_interval / this.dash_interval), "white", "stroke", 2)
    Iarc(player.p.x, player.p.y, player.r + player.graze_r / 2, -Math.PI / 2 + 2 * Math.PI * player.dash / 12, -Math.PI / 2, "yellow", "stroke", 2)

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

scene_main = new Scene_Main()

scene_manager = new Scene_Manager(scene_main)

function main() {
  scene_manager.current_scene.loop();

  Irect(0, 0, width, height, "white", "stroke", 2);

  pushed = [];

}

//24fpsで実行
main_loop = setInterval(main, 1000 / 24)