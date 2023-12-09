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

player = { p: new vec(game_width / 2, game_height / 2), v: new vec(0, 0), r: 3, graze_r: 16, speed: 12, inv: false, dash: 0, dash_interval: 0, direction: 0 }

bullets = []
enemies = []
effects = []

const Scene_Main = class extends Scene {
  constructor() {
    super()
  }

  start() {
    bullets = []
    enemies = [enemy_data.carotene_0]

    this.frame = 0
    this.is_pause = false
  }

  end() {

  }

  loop() {
    if (!this.is_pause) {
      this.control_player()
      this.danmaku()
    }

    if (pushed.includes("Escape")) {
      this.is_pause = !this.is_pause
    }

    this.draw()

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

    if (player.dash > 0) { player.speed = 36 }

    if (pushed.includes("KeyZ") && player.dash_interval == 0) {
      player.dash_interval = 48
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

    if (pushed.includes("KeyX")) {
      player.direction = 1 - player.direction
    }
  }

  danmaku() {
    if (this.frame % 3 == 0) {
      if (pressed.includes("ShiftLeft")) {
        for (let i = 0; i < 5; i++) {
          bullets.push(
            ...remodel([bullet_model], [
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
            "colour", "rgba(255,255,255,0.5)",
            "type", "friend",
            "p", player.p,
            "v", new vec(0, -32).rot(Math.PI * player.direction),
            "nway", 3, Math.PI / 12, player.p
          ])
        )
      }


    }

    if (pushed.includes("Enter")) { console.log(bullets) }



    //敵と弾
    enemies.forEach((e) => {
      e.f(e)
      e.damaged = false

      bullets.forEach((b) => {
        if (b.type == "friend" && b.r + e.r >= b.p.sub(e.p).length) {
          b.life = 0
          e.life--;
          e.damaged = true
        }
      })
    })

    bullets.forEach((b) => {
      b.f.forEach((f) => { f(b) })

      if (b.type == "enemy" && b.r + player.r >= b.p.sub(player.p).length) {
        b.life = 0
        console.log("dead")
      }
    })

    bullets = bullets.filter((b) => { return b.life > 0 })
    enemies = enemies.filter((e) => { return e.life > 0 })
  }

  draw() {
    //描画
    ctx.clearRect(0, 0, width, height)

    Icircle(player.p.x, player.p.y, player.r, "red")
    ctx.beginPath();
    ctx.arc(player.p.x, player.p.y, player.r + player.graze_r, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * (1 - player.dash_interval / 48))
    ctx.stroke()

    //弾
    bullets.forEach((b) => {
      Icircle(b.p.x, b.p.y, b.r, b.colour)
    })

    //敵
    enemies.forEach((e) => {
      let c = e.damaged ? "red" : "white"



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