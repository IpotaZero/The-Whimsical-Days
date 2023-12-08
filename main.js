const Scene_Manager = class {
  constructor(_scene) {
    this.current_scene = _scene;
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

player = { p: new vec(game_width / 2, game_height / 2), v: new vec(0, 0), r: 3, graze_r: 16, speed: 12, inv: false }

bullets = []
enemies = []

const Scene_Main = class extends Scene {
  constructor() {
    super()
  }

  start() {
    bullets = []
    enemies = []
  }

  end() {

  }

  loop() {
    //プレイヤー操作
    player.v = new vec(0, 0)

    if (pressed.includes("ArrowLeft")) { player.v.x--; }
    if (pressed.includes("ArrowRight")) { player.v.x++; }
    if (pressed.includes("ArrowUp")) { player.v.y--; }
    if (pressed.includes("ArrowDown")) { player.v.y++; }

    player.speed = pressed.includes("ShiftLeft") ? 6 : 12

    player.v = player.v.nor()
    player.p = player.v.mlt(player.speed).add(player.p)

    if (player.p.x < 0) { player.p.x = 0 }
    if (player.p.x > game_width) { player.p.x = game_width }
    if (player.p.y < 0) { player.p.y = 0 }
    if (player.p.y > game_height) { player.p.y = game_height }

    //敵と弾
    enemies.forEach((e) => {
      e.f(e)

      bullets.forEach((b) => {
        if (b.type == "friend" && b.r + e.r >= b.p.sub(e.p).length) {
          b.life = 0
          e.life--;
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

    //描画
    ctx.clearRect(0, 0, width, height)

    Icircle(player.p.x, player.p.y, player.r, "red")
    Icircle(player.p.x, player.p.y, player.r + player.graze_r, "white", "stroke", 2)

    bullets.forEach((b) => {
      Icircle(b.p.x, b.p.y, b.r, "white")
    })

    enemies.forEach((e) => {
      Icircle(e.p.x, e.p.y, e.r, "white", "stroke", 2)
    })

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