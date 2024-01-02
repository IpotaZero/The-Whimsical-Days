const Enemy = class {
  constructor(p, r, life) {
    this.p = p ?? new vec(-100, -100)
    this.r = r
    this.life = life
    this.f = []
  }

  addf(f) { this.f.push(f); return this }

  move(p_start, p_end, time_start, time_end, f = x => x) {
    this.f.push((me) => {
      if (time_start <= me.frame && me.frame <= time_end) {
        me.p = linear_move(me.frame - time_start, time_end - time_start, p_start, p_end, f)
      }
    })
    return this
  }

  scale(size_start, size_end, time_start, time_end, f = x => x) {
    this.f.push((me) => {
      if (time_start <= me.frame && me.frame <= time_end) {
        me.r = size_start + (size_end - size_start) * (me.frame - time_start) / (time_end - time_start)
      }
    })
    return this
  }

  export() {
    return { p: this.p, r: this.r, life: this.life, maxlife: this.life, damaged: false, frame: 0, f: this.f }
  }
}

bullet_model = {
  type: "enemy", colour: "yellow", app: "donut",
  p: new vec(0, 0), r: 3, life: 1, v: new vec(0, 0), f: [
    (me) => { me.p = me.p.add(me.v) },
    (me) => { if (wall(me.p)) { me.life--; } }
  ]
}

enemy_data = {}
enemy_vrs = { p: new vec(game_width / 2, -100) }

function wall(p) {
  return p.x < 0 || game_width < p.x | p.y < 0 || game_height < p.y
}

function linear_move(frame, time, p0, p1, fun = x => x) {
  let p = p0 ?? enemy_vrs.p
  return p.add(p1.sub(p).mlt(fun(frame / time)))
}

function circular_move(center, frame, radius, cycle, rad = 0) {
  return center.add(new vec(Math.cos(frame * Math.PI * 2 / cycle + rad), Math.sin(frame * Math.PI * 2 / cycle + rad)).mlt(radius));
}


function get_angle(v0, v1) {
  let a = Math.atan(v1.y / v1.x) - Math.atan(v0.y / v0.x);
  return v1.x > 0 ? a : a + Math.PI;
}

enemy_data.zako_0 = new Enemy(null, 16, 15)
  .addf((me) => {
    me.p = circular_move(new vec(0, 0), me.frame, 300, 4 * 120)
    if (me.frame % 24 == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 6, "p", me.p, "v", new vec(12, 0), "aim", player.p, "nway", 3, Math.PI / 12, me.p]))
      Sound_Data.bullet0.play()
    }

    me.frame++;

    if (me.life <= 0) {
      Sound_Data.KO.play()
    }

    if (me.p.x < 0 || game_width < me.p.x) { me.life = 0 }
  })



enemy_data.zako_1 = new Enemy(null, 16, 15)
  .addf((me) => {
    me.p = circular_move(new vec(game_width, 0), -me.frame, -300, 4 * 120)

    if (me.frame % 24 == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 6, "p", me.p, "v", new vec(12, 0), "aim", player.p, "nway", 3, Math.PI / 12, me.p]))
      Sound_Data.bullet0.play()
    }

    me.frame++;

    if (me.life <= 0) {
      Sound_Data.KO.play()
    }

    if (me.p.x < 0 || game_width < me.p.x) { me.life = 0 }
  })


enemy_data.zako_2 = new Enemy(null, 32, 100)
  .move(null, new vec(game_width / 2, game_height / 6), 0, 24, x => 1 - (x - 1) ** 2)
  .addf((me) => {
    if (me.frame > 24 && me.frame % 12 == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 6, "p", me.p, "v", new vec(12, 0), "aim", player.p, "nway", 7, Math.PI / 16, me.p]))
      Sound_Data.bullet0.play()
    }

    me.frame++;

    if (me.p.y > game_height) { me.life = 0 }

    if (me.life <= 0) {
      Sound_Data.KO.play()
    }
  })
  .move(new vec(game_width / 2, game_height / 6), new vec(game_width / 2, game_height + 100), 144, 288, x => x ** 2)


for (let i = 0; i < 4; i++) {
  enemy_data["zako_3_" + (2 * i)] = new Enemy(new vec(game_width, game_height / 8 * i + 20), 16, 15)
    .addf((me) => {
      me.p.x -= 4;

      if (me.frame % 24 == 0) {
        bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec(6, 0), "aim", player.p, "arrow", 20]))
      }

      me.frame++;

      if (me.life <= 0) {
        Sound_Data.KO.play()
      }

      if (me.p.x < 0) { me.life = 0 }
    })


  enemy_data["zako_3_" + (2 * i + 1)] = new Enemy(new vec(0, game_height / 8 * (i + 0.5) + 20), 16, 15)
    .addf((me) => {
      me.p.x += 4;

      if (me.frame % 24 == 0) {
        bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec(6, 0), "aim", player.p, "arrow", 20]))
      }

      me.frame++;

      if (me.life <= 0) {
        Sound_Data.KO.play()
      }

      if (me.p.x > game_width) { me.life = 0 }

    })

}

for (let i = 0; i < 8; i++) {
  enemy_data["zako_4_" + (i * 2)] = new Enemy(new vec(game_width / 4 * i, 0), 16, 10)
    .addf((me) => {
      me.p.y += 4;

      if (me.frame % 24 == 0) {
        bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec(6, 0), "aim", player.p, "arrow", 20]))
        Sound_Data.bullet0.play()
      }

      me.frame++;

      if (me.life <= 0) {
        Sound_Data.KO.play()
      }

      if (me.p.y > game_height) { me.life = 0 }
    })

  enemy_data["zako_4_" + (i * 2 + 1)] = new Enemy(new vec(game_width / 4 * (i + 0.5), game_height), 16, 10)
    .addf((me) => {
      me.p.y -= 4;

      if (me.frame % 24 == 0) {
        bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec(6, 0), "aim", player.p, "arrow", 20]))
        Sound_Data.bullet0.play()
      }

      me.frame++;

      if (me.life <= 0) {
        Sound_Data.KO.play()
      }

      if (me.p.y < 0) { me.life = 0 }
    })
}

enemy_data.zako_5_0 = new Enemy(null, 16, 100)
  .move(null, new vec(game_width / 2, game_height / 6), 0, 24, x => 1 - (x - 1) ** 2)
  .addf((me) => {
    me.p.x = game_width / 3 * Math.sin(me.frame * 2 * Math.PI / 240) + game_width / 2

    bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 6, "p", me.p, "v", new vec(12, 0), "ex", 36, me.p]))
    Sound_Data.bullet0.play()

    me.frame++;
    if (me.life <= 0) {
      bullets = []
      Sound_Data.KO.play()
      scene_main.continue_story()

    }
  })


enemy_data.ethanol_0 = new Enemy(new vec(0, game_height / 6), 32, 80)
  .addf((me) => {
    me.p.x = game_width / 3 * Math.sin(me.frame * 2 * Math.PI / 120) + game_width / 2

    if (me.frame % 6 == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 6, "p", me.p, "v", new vec(12, 0), "ex", 36, me.p]))
      Sound_Data.bullet0.play()
    }

    me.frame++;

    if (me.life <= 0) {
      bullets = []
      next_enemies.push({ ...enemy_data["ethanol_1"] })
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
      scene_main.continue_story()
    }

  })


enemy_data.ethanol_1 = new Enemy(null, 32, 200)
  .move(null, new vec(game_width / 2, game_height * 5 / 6), 0, 48, x => x ** 2)
  .addf((me) => {
    if (me.frame < 48) {
      for (let i = 0; i < 7; i++) {
        bullets.push(...remodel([bullet_model], ["r", 6, "colourful", me.frame, "p", new vec(game_width / 2 + 60 * (i - 3), me.p.y - 60), "v", new vec(0, -1), "delete", 1, "arrow", 64]))
      }
    } else {
      me.p.x = game_width / 3 * Math.sin((me.frame - 48) * 2 * Math.PI / 120) + game_width / 2

      if (me.frame % 16 == 0) {
        bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 24, "p", me.p, "v", new vec(0, -6), "aim", player.p, "nway", 5, Math.PI / 24, me.p]))
        Sound_Data.bullet0.play()
      }
    }

    me.frame++;
    if (me.life <= 0) {
      bullets = []
      next_enemies.push({ ...enemy_data["ethanol_2"] }, { ...enemy_data["ethanol_2_0"] }, { ...enemy_data["ethanol_2_1"] })
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
    }

  })


for (let i = 0; i < 2; i++) {
  enemy_data["ethanol_2_" + i] = new Enemy(null, 32, 50)
    .move(null, new vec(game_width / 2, game_height / 2), 0, 48, x => x ** 2)
    .scale(32, 16, 0, 48, x => x)
    .addf((me) => {
      if (me.frame > 48) {
        me.p.x = game_width / 3 * Math.sin((2 * i - 1) * (me.frame - 48) * 2 * Math.PI / 120) + game_width / 2

        if (me.frame % 4 == 0) {
          bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 8, "p", me.p, "v", new vec(0, -6)]))
          bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 8, "p", me.p, "v", new vec(0, 6)]))
          Sound_Data.bullet1.play()
        }
      }

      me.frame++;
      if (me.life <= 0) {
        Sound_Data.KO.play()
      }
    })

}

enemy_data.ethanol_2 = new Enemy(null, 32, 300)
  .move(null, new vec(game_width / 2, game_height / 2), 0, 48, x => x ** 2)
  .addf((me) => {
    if (me.frame > 48 && me.frame % 12 == 0) {
      bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec(0, 12), "aim", player.p, "arrow", 30]))
      bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec(0, 12), "aim", player.p, "do", (me) => { me.v.y *= -1 }, "arrow", 30]))
    }

    me.frame++;

    if (me.life <= 0) {
      bullets = []
      enemies = []
      next_enemies.push({ ...enemy_data["ethanol_3"] })
      for (let i = 0; i < 4; i++) { next_enemies.push({ ...enemy_data["ethanol_3_" + i] }) }
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
    }
  })


for (let i = 0; i < 4; i++) {
  enemy_data["ethanol_3_" + i] = new Enemy(null, 16, 50)
    .move(new vec(game_width / 2, game_height / 2), new vec(game_width / 2, game_height / 2).add(new vec(120, 0).rot(Math.PI / 2 * i)), 0, 24, x => x ** 2)
    .scale(32, 16, 0, 24, x => x)
    .move(new vec(game_width / 2, game_height / 2).add(new vec(120, 0).rot(Math.PI / 2 * i)), new vec(game_width / 2, game_height / 5).add(new vec(120, 0).rot(Math.PI / 2 * i)), 25, 48, x => x ** 2)
    .addf((me) => {

      if (me.frame > 48) {
        me.p = circular_move(new vec(game_width / 2, game_height / 5), me.frame - 48, 120, 144, Math.PI / 2 * i)
        if (me.frame % 12 == 0) {
          bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec(0, 12), "aim", player.p, "arrow", 30]))
        }
      }

      me.frame++;
      if (me.life <= 0) {
        Sound_Data.KO.play()
      }

    })

}

enemy_data.ethanol_3 = new Enemy(null, 32, 300)
  .move(null, new vec(game_width / 2, game_height / 2), 0, 24, x => x ** 2)
  .move(new vec(game_width / 2, game_height / 2), new vec(game_width / 2, game_height / 5), 25, 48, x => x ** 2)
  .addf((me) => {
    if (me.frame > 48 && me.frame % 12 == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 6, "p", me.p, "v", new vec(0, 12), "aim", player.p, "ex", 32, me.p]))
      Sound_Data.bullet0.play()
    }

    me.frame++;

    if (me.life <= 0) {
      bullets = []
      enemies = []
      next_enemies.push({ ...enemy_data["ethanol_4"] })
      for (let i = 0; i < 12; i++) { next_enemies.push({ ...enemy_data["ethanol_4_" + i] }) }
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
      Sound_Data.hakkyou.play()
    }
  })


for (let i = 0; i < 12; i++) {
  enemy_data["ethanol_4_" + i] = new Enemy(null, 32, 50)
    .move(null, new vec(game_width / 2, game_height / 2).add(new vec(90, 0).rot(2 * Math.PI * i / 12)), 0, 60, x => x ** 2)
    .scale(32, 16, 0, 60, x => x)
    .addf((me) => {
      if (me.frame > 60) {
        me.p.x = game_width / 2
        me.p.y = game_height / 2 - Math.sin(2 * Math.PI * (me.frame - 60) / 240) * game_height / 3
        me.p = me.p.add(new vec(90, 0).rot(2 * Math.PI * i / 12 + (me.frame - 60) / 36))

        bullets.push(...remodel([bullet_model], ["hakkyou_colourful", me.frame, "r", 6, "p", me.p, "v", new vec(0, 12), "aim", player.p]))
        Sound_Data.bullet1.play()
      }

      me.frame++;
      if (me.life <= 0) {
        Sound_Data.KO.play()
      }

    })

}

enemy_data.ethanol_4 = new Enemy(null, 32, 200)
  .move(null, new vec(game_width / 2, game_height / 2), 0, 60, x => x ** 2)
  .addf((me) => {
    if (me.frame > 60) {
      me.p.y = game_height / 2 - Math.sin(2 * Math.PI * (me.frame - 60) / 240) * game_height / 3

      if (me.frame % 36 == 0) {
        bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec(0, 12), "aim", player.p, "arrow", 30, "ex", 32, me.p]))
        Sound_Data.bullet0.play()
      }
    }

    me.frame++;
    if (me.life <= 0) {
      bullets = []
      enemies = []
      enemy_vrs.p = me.p
      Sound_Data.KO.play()

      scene_main.continue_story()
    }
  })



function remodel(bulletArr, pro) {

  //bulletArrの参照しないコピー
  let buls = [];
  for (let i = 0; i < bulletArr.length; i++) {
    buls.push({ ...bulletArr[i] });

    buls[i].f = [];
    bulletArr[i].f.forEach((fun) => { buls[i].f.push(fun); });
  }

  for (let i = 0; i < pro.length; i++) {
    let c = [];

    switch (pro[i]) {
      //["colourful",seed値]
      case "colourful":
        const color_frame = pro[i + 1]
        c.push(...remodel(buls, ["colour", "hsl(" + Math.floor(90 * Math.sin(2 * Math.PI * color_frame / 240) + 90) + ",100%,50%)"]))
        i++;
        break

      case "hakkyou_colourful":
        const color_frame2 = pro[i + 1]
        c.push(...remodel(buls, ["colour", "hsl(" + Math.floor(90 * Math.sin(2 * Math.PI * color_frame2 / 240 + Math.PI / 2)) + ",100%,50%)"]))
        i++;
        break

      //["aim",目標地点]
      case "aim":
        const p = pro[i + 1];
        buls.forEach((b) => { c.push(...remodel([b], ["v", p.sub(b.p).nor().mlt(b.v.length())])); });
        i++; break;

      //["rot",rad]速度ベクトルの回転
      case "rot":
        const rad = pro[i + 1];
        buls.forEach((b) => { c.push(...remodel([b], ["v", b.v.rot(rad)])); });
        i++; break;

      //["rev",rad,center]全体をcenter中心に回転させる
      case "rev":
        const radRev = pro[i + 1];
        const center = pro[i + 2];
        buls.forEach((b) => { c.push(...remodel([b], ["p", b.p.sub(center).rot(radRev).add(center), "v", b.v.rot(radRev)])) });
        i += 2; break;

      //tフレームでp0からp1へ移動する
      case "move":
        const p1 = pro[i + 1];
        const t = pro[i + 2];
        const move_function = pro[i + 3]//f in C[0,1] such that =>[0,1]
        for (b of buls) {
          c.push(...remodel([b], ["frameMove", 0, "f", (me) => { if (me.frameMove <= t) { me.p = b.p.add(p1.sub(b.p).mlt(move_function(me.frameMove / t))); } me.frameMove++; }]));
        }
        i += 3;
        break;

      //["nway",num,rad,center]3way弾とか
      case "nway":
        const numnway = pro[i + 1];
        const radnway = pro[i + 2];
        const centernway = pro[i + 3];

        const n = (numnway - 1) / 2;
        for (let i = 0; i < numnway; i++) {
          c.push(...remodel(buls, ["rev", radnway * (i - n), centernway]));
        }
        i += 3; break;

      //["ex",num,center]center中心に回転しつつ一周する(自機狙いとかで偶数にするとnwayを使っている関係で自機狙いじゃなくなるので注意)
      case "ex":
        const num = pro[i + 1];
        const centerEx = pro[i + 2];
        c.push(...remodel(buls, ["nway", num, 2 * Math.PI / num, centerEx]));
        i += 2; break;

      //["line",間隔d,通る点points]線をなぞる
      case "line":
        const d = pro[i + 1];
        const points = pro[i + 2];
        for (let j = 0; j < points.length - 1; j++) {
          let l = points[j + 1].sub(points[j]).length();
          for (k = 0; k * d < l; k++) {
            c.push(...remodel(buls, ["p", points[j].add(points[j + 1].sub(points[j]).mlt(k * d / l))]));
          }
        }
        i += 2; break;

      //["laser",長さl]lineを利用してレーザーを作る
      case "laser":
        const l = pro[i + 1];
        buls.forEach((b) => { c.push(...remodel([b], ["line", b.r, [b.p, b.p.add(b.v.nor().mlt(l))]])); });
        i++; break;

      //["arrow",長さl]laserを使って矢印を作る
      case "arrow":
        const larrow = pro[i + 1];
        let bul = [];
        buls.forEach((b) => {
          bul.push(...remodel([b], ["v", new vec(1, 0), "laser", larrow]));
          bul.push(...remodel([b], ["p", b.p.add(new vec(1, 0).nor().mlt(larrow)), "v", new vec(-1, -1), "laser", larrow / 2]));
          bul.push(...remodel([b], ["p", b.p.add(new vec(1, 0).nor().mlt(larrow)), "v", new vec(-1, 1), "laser", larrow / 2]));
          c.push(...remodel(bul, ["v", new vec(b.v.length(), 0), "rev", get_angle(new vec(1, 0), b.v), b.p]));
        });
        i++; break;

      //["cross",直径]laserを使って十字を作る
      case "cross":
        const size = pro[i + 1];
        let bul1 = [];
        buls.forEach((b) => {
          if (b.v.x == 0 && b.v.y == 0) {
            b.v = new vec(0.01, 0);
          }

          for (let i = 0; i < 4; i++) {
            bul1.push(...remodel([b], ["laser", size / 2, "rev", Math.PI / 2 * i, b.p, "v", b.v]));
          }

        });
        c.push(...bul1);
        i++; break;

      //["circle",直径dia]円(arrowとかと大きさの感覚を合わせるために直径で指定)
      case "circle":
        const dia = pro[i + 1];
        buls.forEach((b) => {
          for (let j = 0; j < Math.PI * dia / b.r / 2; j++) {
            c.push(...remodel([b], ["p", b.p.add(new vec(Math.cos(4 * b.r / dia * j), Math.sin(4 * b.r / dia * j)).mlt(dia / 2))]));
          }
        });
        i++; break;

      //["wait",使う変数,frame,f]待ってから実行
      case "wait":
        const thev = pro[i + 1]
        const frame = pro[i + 2];
        const f = pro[i + 3];
        c.push(...remodel(buls, [thev, 0, "f", (me) => { if (me[thev] == frame) { f(me); } me[thev]++; }]));
        i += 3; break;

      //自身をnフレーム後に消す
      case "delete":
        c.push(...remodel(buls, ["wait", "deadline", pro[i + 1], (me) => { me.life = 0; }]));
        i++;
        break;

      //["accel",加速度,最大速さ]
      case "accel":
        const accel = pro[i + 1];
        const maxSpeed = pro[i + 2];
        c.push(...remodel(buls, ["f", (me) => { if (me.v.length() <= maxSpeed) { me.v = me.v.add(accel); } }]));
        i += 2; break;

      //["bound"]壁で跳ね返るようにする
      case "bound":
        c.push(...remodel(buls, ["f", (me) => { if (me.p.x + me.r < 0 || gamewidth < me.p.x - me.r) { me.v.x *= -1; } if (me.p.y + me.r < 0 || gameheight < me.p.y - me.r) { me.v.y *= -1; } }]));
        break;

      //わざわざコマンドにするほどでもないことをして
      case "do": buls.forEach((b) => { pro[i + 1](b); c.push(b) }); i++; break;

      //[対象,数値やベクトルや関数]代入(基本操作)
      case "f": buls.forEach((b) => { b["f"].push(pro[i + 1]); c.push(b); }); i++; break;
      default: buls.forEach((b) => { b[pro[i]] = pro[i + 1]; c.push(b); }); i++; break;
    }

    buls = c;
  }

  return buls;
}