const Enemy = class {
  constructor(p, r, life, { is_boss = false, is_inv = false, app = null } = {}) {
    this.pre_p = p
    this.p = p ?? new vec(game_width / 2, -100)
    this.r = r
    this.life = life
    this.f = []
    this.is_boss = is_boss
    this.is_inv = is_inv
    this.app = app

    this.var = {}
  }

  addf(f) { this.f.push(f); return this }

  addv(name, first) {
    this.var[name] = first
    return this
  }

  move(p_start, p_end, time_start, time_end, f = x => x) {
    p_start ??= this.pre_p
    this.f.push((me) => {
      if (time_start <= me.frame && me.frame <= time_end) {
        me.p = linear_move(me.frame - time_start, time_end - time_start, p_start, p_end, f)
      }
    })
    this.pre_p = p_end
    return this
  }

  scale(size_start, size_end, time_start, time_end, f = x => x) {
    this.f.push((me) => {
      if (time_start <= me.frame && me.frame <= time_end) {
        me.r = size_start + (size_end - size_start) * f((me.frame - time_start) / (time_end - time_start))
      }
    })
    return this
  }

  export() {
    return { p: this.p, r: this.r, life: this.life, maxlife: this.life, damaged: false, is_boss: this.is_boss, is_inv: this.is_inv, app: this.app, ...this.var, frame: 0, f: this.f }
  }
}

const bullet_model = {
  type: "enemy", colour: "yellow", app: "donut",
  p: new vec(0, 0), r: 8, life: 1, v: new vec(0, 0), f: [
    (me) => { me.p = me.p.add(me.v) },
    (me) => { if (is_touched_wall(me.p)) { me.life--; } }
  ]
}

const enemy_data = {}
let enemy_vrs = { p: new vec(game_width / 2, -100) }

const is_touched_wall = (p) => {
  return p.x < 0 || game_width < p.x || p.y < 0 || game_height < p.y
}

const linear_move = (frame, time, p0, p1, fun = x => x) => {
  p0 ??= enemy_vrs.p
  return p0.add(p1.sub(p0).mlt(fun(frame / time)))
}

const circular_move = (center, frame, radius, cycle, rad = 0) => {
  return center.add(new vec(Math.cos(frame * Math.PI * 2 / cycle + rad), Math.sin(frame * Math.PI * 2 / cycle + rad)).mlt(radius));
}

const get_angle = (v0, v1) => {
  let a = Math.atan(v1.y / v1.x) - Math.atan(v0.y / v0.x);
  return v1.x > 0 ? a : a + Math.PI;
}

const explosion = (pos, speed = 6) => {
  for (let i = 0; i < 16; i++) {
    let c = chroma.hsl(Math.floor(90 * Math.sin(2 * Math.PI * Math.random()) + 90), 1, 0.5).hex()
    bullets.push(...remodel([bullet_model], ["type", "effect", "colour", c, "r", 12 * Math.random() + 1, "life", 48, "p", pos, "v", new vec(speed * Math.random(), 0).rot(Math.random() * 6), "f", (me) => { me.life--; me.colour = chroma(c).alpha(me.life / 96).hex() }]))
  }
}

const heart = t => new vec(16 * Math.sin(t) ** 3, -13 * Math.cos(t) + 5 * Math.cos(2 * t) + 2 * Math.cos(3 * t) + Math.cos(4 * t))
const flower = (b, t) => new vec(Math.cos(t), Math.sin(t)).mlt(1 + Math.cos(b * t))

const make_bullets_into_score = (speed = 24) => {
  next_bullets = []
  bullets.forEach((b) => {
    if (["enemy", "score"].includes(b.type)) {
      b.r = 6
      b.app = "laser"
      b.colour = "#80ffff80"
      b.type = "score"
      b.f = [(me) => {
        me.v = player.p.sub(me.p).nor().mlt(speed)
        me.p = me.p.add(me.v)
      }]
    }

    // next_bullets.push(...remodel([bullet_model], ["p", b.p, "life", 6, "colour", "white", "type", "effect", "r", 12, "f", (me) => { me.life--; me.colour = chroma("white").alpha(me.life / 12).hex() }]))
  })
}

enemy_data.tutorial_0 = new Enemy(null, 32, 200)
  .move(null, new vec(game_width / 2, game_height / 6), 0, 24)
  .addf((me) => {
    me.frame++
    if (me.life <= 0) {
      Sound_Data.KO.play()
      explosion(me.p)
      scene_main.scoring(me.maxlife ** 2)
      scene_main.continue_story()
    }
  })
  .export()


enemy_data.tutorial_1 = new Enemy(null, 32, 200)
  .move(null, new vec(game_width / 2, game_height / 6), 0, 24)
  .addf((me) => {
    if (me.frame % 24 == 0) {
      bullets.push(...remodel([bullet_model], ["p", me.p, "v", new vec(0, 6), "aim", player.p, "ex", 7, me.p]))
      Sound_Data.bullet0.play()
    }

    me.frame++

    if (me.life <= 0) {
      Sound_Data.KO.play()
      explosion(me.p)
      scene_main.scoring(me.maxlife ** 2)
      scene_main.continue_story()
    }
  })
  .export()


enemy_data.tutorial_2 = new Enemy(null, 32, 200, { is_inv: true })
  .move(null, new vec(game_width / 2, game_height / 6), 0, 24, x => x ** 2)
  .addf((me) => {
    me.p.x = Math.sin(2 * Math.PI * me.frame / 144) * game_width / 2 + game_width / 2

    if (me.frame % 12 == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec(0, 12)]))
    }
    me.life--

    me.frame++

    if (me.life <= 0) {
      Sound_Data.KO.play()
      explosion(me.p)
      scene_main.scoring(me.maxlife ** 2)
      scene_main.continue_story()
    }
  })
  .export()

enemy_data.zako_0 = new Enemy(null, 16, 30)
  .addf((me) => {
    me.p = circular_move(new vec(0, 0), me.frame, 300, 4 * 120)
    if (me.frame % [36, 24, 12, 6][difficulty] == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec([6, 12, 12, 12][difficulty], 0), "aim", player.p, "nway", [1, 3, 7, 11][difficulty], Math.PI / 12, me.p]))
      Sound_Data.bullet0.play()
    }

    me.frame++;

    if (me.life <= 0) {
      Sound_Data.KO.play()
      explosion(me.p)
      scene_main.scoring(me.maxlife ** 2)
    }

    if (me.p.x < 0 || game_width < me.p.x) { me.life = 0 }
  })
  .export()



enemy_data.zako_1 = new Enemy(null, 16, 30)
  .addf((me) => {
    me.p = circular_move(new vec(game_width, 0), -me.frame, -300, 4 * 120)

    if (me.frame % [36, 24, 12, 6][difficulty] == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec([6, 12, 12, 12][difficulty], 0), "aim", player.p, "nway", [1, 3, 7, 11][difficulty], Math.PI / 12, me.p]))
      Sound_Data.bullet0.play()
    }

    me.frame++;

    if (me.life <= 0) {
      Sound_Data.KO.play()
      explosion(me.p)
      scene_main.scoring(me.maxlife ** 2)
    }

    if (me.p.x < 0 || game_width < me.p.x) { me.life = 0 }
  })
  .export()


enemy_data.zako_2 = new Enemy(null, 32, 200)
  .move(null, new vec(game_width / 2, game_height / 6), 0, 24, x => 1 - (x - 1) ** 2)
  .addf((me) => {
    if (24 < me.frame && me.frame < 144 && me.frame % [24, 12, 6, 3][difficulty] == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec([6, 12, 12, 12][difficulty], 0), "aim", player.p, "nway", 7, Math.PI / 16, me.p]))
      Sound_Data.bullet0.play()
    }

    me.frame++;

    if (me.life <= 0) {
      Sound_Data.KO.play()
      explosion(me.p)
      scene_main.scoring(me.maxlife ** 2)
    }

    if (me.p.y > game_height) { me.life = 0 }

  })
  .move(null, new vec(game_width / 2, game_height + 100), 144, 240, x => x ** 2)
  .export()


for (let i = 0; i < 4; i++) {
  enemy_data["zako_3_" + (2 * i)] = new Enemy(new vec(game_width, game_height / 8 * i + 20), 16, 30)
    .addf((me) => {
      me.p = me.p.add(new vec(-4, 0));

      if (me.frame % [36, 24, 12, 6][difficulty] == 0) {
        bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec([3, 6, 6, 6][difficulty], 0), "aim", player.p, "arrow", 20]))
      }

      me.frame++;

      if (me.life <= 0) {
        Sound_Data.KO.play()
        explosion(me.p)
        scene_main.scoring(me.maxlife ** 2)
      }

      if (me.p.x < 0) { me.life = 0 }
    })
    .export()


  enemy_data["zako_3_" + (2 * i + 1)] = new Enemy(new vec(0, game_height / 8 * (i + 0.5) + 20), 16, 30)
    .addf((me) => {
      me.p = me.p.add(new vec(4, 0));

      if (me.frame % [36, 24, 12, 6][difficulty] == 0) {
        bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec([3, 6, 6, 6][difficulty], 0), "aim", player.p, "arrow", 20]))
      }

      me.frame++;

      if (me.life <= 0) {
        Sound_Data.KO.play()
        explosion(me.p)
        scene_main.scoring(me.maxlife ** 2)
      }

      if (me.p.x > game_width) { me.life = 0 }

    })
    .export()

}

for (let i = 0; i < 8; i++) {
  enemy_data["zako_4_" + (i * 2)] = new Enemy(new vec(game_width / 4 * i + 20, 0), 16, 20)
    .addf((me) => {
      me.p = me.p.add(new vec(0, 4));

      if (me.frame % [48, 24, 12, 6][difficulty] == 0) {
        bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec([3, 6, 6, 6][difficulty], 0), "aim", player.p, "arrow", 20]))
        Sound_Data.bullet0.play()
      }

      me.frame++;

      if (me.life <= 0) {
        Sound_Data.KO.play()
        explosion(me.p)
        scene_main.scoring(me.maxlife ** 2)
      }

      if (me.p.y > game_height) { me.life = 0 }
    })
    .export()

  enemy_data["zako_4_" + (i * 2 + 1)] = new Enemy(new vec(game_width / 4 * (i + 0.5) + 20, game_height), 16, 20)
    .addf((me) => {
      me.p = me.p.add(new vec(0, -4));

      if (me.frame % [36, 24, 12, 6][difficulty] == 0) {
        bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec([3, 6, 6, 6][difficulty], 0), "aim", player.p, "arrow", 20]))
        Sound_Data.bullet0.play()
      }

      me.frame++;

      if (me.life <= 0) {
        Sound_Data.KO.play()
        explosion(me.p)
        scene_main.scoring(me.maxlife ** 2)
      }

      if (me.p.y < 0) { me.life = 0 }
    })
    .export()

}

for (let i = 0; i < 3; i++) {
  enemy_data["zako_5_" + i] = new Enemy(null, 16, 60)
    .move(null, new vec(game_width / 2 + 120 * (i - 1), game_height / 6), 0, 24)
    .addf((me) => {
      if (24 < me.frame && me.frame < 200 && me.frame % [48, 24, 18, 12][difficulty] == 0) {
        bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec([6, 12, 12, 12][difficulty], 0), "aim", player.p, "sim", 3, [3, 6, 6, 6][difficulty], "nway", [3, 5, 7, 9][difficulty], Math.PI / 12, me.p]))
        Sound_Data.bullet1.play()
      }
      me.frame++

      if (me.life <= 0) {
        explosion(me.p)
        Sound_Data.KO.play()
        scene_main.scoring(me.maxlife ** 2)
      }

      if (me.p.y > game_height) { me.life = 0 }
    })
    .move(null, new vec(game_width / 2, game_height + 100), 144, 288, x => x ** 2)
    .export()
}

enemy_data.zako_7 = new Enemy(null, 32, 695, { is_inv: true })
  .move(null, new vec(game_width / 2, game_height / 6), 0, 24, x => 1 - (x - 1) ** 2)
  .addf((me) => {
    me.life = 695 - me.frame
    me.p.x = game_width / 3 * Math.sin(me.frame * 2 * Math.PI / 240) + game_width / 2

    bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec(12, 0), "ex", [8, 12, 14, 16][difficulty], me.p]))
    Sound_Data.bullet1.play()

    if (me.frame % [24, 24, 12, 12][difficulty] == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 12, "life", 2, "p", me.p, "v", new vec(6, 0), "bound", "aim", new vec(-player.p.x, player.p.y), "nway", [1, 3, 5, 5][difficulty], Math.PI / 12, me.p]))
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 12, "life", 2, "p", me.p, "v", new vec(6, 0), "bound", "aim", new vec(game_width * 2 - player.p.x, player.p.y), "nway", [1, 3, 5, 5][difficulty], Math.PI / 12, me.p]))
      Sound_Data.bullet0.play()
    }

    me.frame++;
    if (me.life <= 0) {
      make_bullets_into_score()
      explosion(me.p)
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
    }
  })
  .export()

enemy_data.ethanol_m1 = new Enemy(null, 56, 200, { is_boss: true, is_inv: true })
  .move(new vec(game_width + 100, -100), new vec(game_width / 2, game_height / 6), 0, 48, x => 1 - (x - 1) ** 2)
  .addf((me) => {
    me.frame++
  })
  .export()

enemy_data.ethanol_0 = new Enemy(new vec(game_width, game_height / 6), 56, 240, { is_boss: true })
  .addf((me) => {
    me.p.x = game_width / 3 * Math.sin(me.frame * 2 * Math.PI / 120) + game_width / 2

    if (me.frame % 6 == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec([6, 12, 12, 12][difficulty], 0), "ex", [6, 12, 18, 24][difficulty], me.p, "rot", Math.PI / [6, 12, 18, 24][difficulty]]))
      Sound_Data.bullet0.play()
    } else if (me.frame % 6 == 3) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec([6, 12, 12, 12][difficulty], 0), "ex", [6, 12, 18, 24][difficulty], me.p]))
      Sound_Data.bullet0.play()
    }

    me.frame++;

    if (me.life <= 0) {
      make_bullets_into_score()
      next_enemies.push({ ...enemy_data["ethanol_1"] })
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
    }
  })
  .export()


enemy_data.ethanol_1 = new Enemy(null, 56, 600, { is_boss: true })
  .move(null, new vec(game_width / 2, game_height * 5 / 6), 0, 48, x => x ** 2)
  .addf((me) => {
    if (me.frame < 48) {
      for (let i = 0; i < 7; i++) {
        bullets.push(...remodel([bullet_model], ["r", 6, "colourful", me.frame, "p", new vec(game_width / 2 + 60 * (i - 3), me.p.y - 60), "v", new vec(0, -1), "delete", 1, "arrow", 64]))
      }
    } else {
      me.p.x = game_width / 3 * Math.sin((me.frame - 48) * 2 * Math.PI / 120) + game_width / 2

      if (me.frame % [24, 16, 8, 4][difficulty] == 0) {
        bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 15, "p", me.p, "v", new vec(0, -[3, 6, 6, 6][difficulty]), "aim", player.p, "nway", 7, Math.PI / 24, me.p]))
        Sound_Data.bullet1.play()
      }
    }

    me.frame++;
    if (me.life <= 0) {
      make_bullets_into_score()
      next_enemies.push({ ...enemy_data["ethanol_2"] }, { ...enemy_data["ethanol_2_0"] }, { ...enemy_data["ethanol_2_1"] })
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
    }
  })
  .export()


for (let i = 0; i < 2; i++) {
  enemy_data["ethanol_2_" + i] = new Enemy(null, 56, 160)
    .move(null, new vec(game_width / 2, game_height / 2), 0, 48, x => x ** 2)
    .scale(56, 32, 0, 48, x => x)
    .addf((me) => {
      if (me.frame > 48) {
        me.p.x = game_width / 3 * Math.sin((2 * i - 1) * (me.frame - 48) * 2 * Math.PI / [240, 120, 90, 60][difficulty]) + game_width / 2

        if (me.frame % [6, 4, 2, 1][difficulty] == 0) {
          bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec(0, -[3, 6, 6, 6][difficulty])]))
          bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec(0, [3, 6, 6, 6][difficulty])]))
          Sound_Data.bullet1.play()
        }
      }

      me.frame++;
      if (me.life <= 0) {
        Sound_Data.KO.play()
        explosion(me.p)
        scene_main.scoring(me.maxlife ** 2)
      }
    })
    .export()

}

enemy_data.ethanol_2 = new Enemy(null, 56, 600, { is_boss: true })
  .move(null, new vec(game_width / 2, game_height / 2), 0, 48, x => x ** 2)
  .addf((me) => {
    if (me.frame > 48 && me.frame % [24, 24, 12, 12][difficulty] == 0) {
      bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec(0, [3, 6, 6, 6][difficulty]), "aim", player.p, "nway", [1, 3, 3, 3][difficulty], Math.PI / 12, me.p, "arrow", 30]))
      bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec(0, [3, 6, 6, 6][difficulty]), "aim", player.p, "do", (me) => { me.v.y *= -1 }, "nway", [1, 3, 3, 3][difficulty], Math.PI / 12, me.p, "arrow", 30]))
      Sound_Data.bullet0.play()
    }

    me.frame++;

    if (me.life <= 0) {
      make_bullets_into_score()
      enemies = []
      next_enemies.push({ ...enemy_data["ethanol_3"] })
      for (let i = 0; i < 4; i++) { next_enemies.push({ ...enemy_data["ethanol_3_" + i] }) }
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
    }
  })
  .export()


for (let i = 0; i < 4; i++) {
  enemy_data["ethanol_3_" + i] = new Enemy(null, 32, 160)
    .move(new vec(game_width / 2, game_height / 2), new vec(game_width / 2, game_height / 2).add(new vec(120, 0).rot(Math.PI / 2 * i)), 0, 24, x => x ** 2)
    .scale(56, 32, 0, 24, x => x)
    .move(new vec(game_width / 2, game_height / 2).add(new vec(120, 0).rot(Math.PI / 2 * i)), new vec(game_width / 2, game_height / 5).add(new vec(120, 0).rot(Math.PI / 2 * i)), 25, 48, x => x ** 2)
    .addf((me) => {

      if (me.frame > 48) {
        me.p = circular_move(new vec(game_width / 2, game_height / 5), me.frame - 48, 120, 144, Math.PI / 2 * i)
        if (me.frame % [24, 24, 12, 12][difficulty] == 0) {
          bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec(0, [6, 12, 12, 12][difficulty]), "aim", player.p, "arrow", 30]))
        }
      }

      me.frame++;
      if (me.life <= 0) {
        Sound_Data.KO.play()
        explosion(me.p)
        scene_main.scoring(me.maxlife ** 2)
      }

    })
    .export()

}

enemy_data.ethanol_3 = new Enemy(null, 56, 600, { is_boss: true })
  .move(null, new vec(game_width / 2, game_height / 2), 0, 24, x => x ** 2)
  .move(new vec(game_width / 2, game_height / 2), new vec(game_width / 2, game_height / 5), 25, 48, x => x ** 2)
  .addf((me) => {
    if (me.frame > 48 && me.frame % [18, 12, 9, 6][difficulty] == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec(0, [6, 12, 12, 12][difficulty]), "aim", player.p, "ex", 32, me.p]))
      Sound_Data.bullet0.play()
    }

    me.frame++;

    if (me.life <= 0) {
      make_bullets_into_score()
      enemies = []
      next_enemies.push({ ...enemy_data["ethanol_4"] })
      for (let i = 0; i < 12; i++) { next_enemies.push({ ...enemy_data["ethanol_4_" + i] }) }
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
    }
  })
  .export()


for (let i = 0; i < 12; i++) {
  enemy_data["ethanol_4_" + i] = new Enemy(null, 56, 160)
    .move(null, new vec(game_width / 2, game_height / 2).add(new vec(90, 0).rot(2 * Math.PI * i / 12)), 0, 60, x => x ** 2)
    .scale(56, 32, 0, 60, x => x)
    .addf((me) => {
      if (me.frame > 60) {
        me.p.x = game_width / 2
        me.p.y = game_height / 2 - Math.sin(2 * Math.PI * (me.frame - 60) / 240) * game_height / 3
        me.p = me.p.add(new vec(90, 0).rot(2 * Math.PI * i / 12 + (me.frame - 60) / 36))

        if (me.frame % [12, 8, 4, 1][difficulty] == 0) {
          bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec(0, [6, 12, 12, 12][difficulty]), "aim", player.p]))
          Sound_Data.bullet1.play()
        }
      }

      me.frame++;
      if (me.life <= 0) {
        Sound_Data.KO.play()
        explosion(me.p)
        scene_main.scoring(me.maxlife ** 2)
      }

    })
    .export()

}

enemy_data.ethanol_4 = new Enemy(null, 56, 600, { is_boss: true })
  .move(null, new vec(game_width / 2, game_height / 2), 0, 60, x => x ** 2)
  .addf((me) => {
    if (me.frame > 60) {
      me.p.y = game_height / 2 - Math.sin(2 * Math.PI * (me.frame - 60) / 240) * game_height / 3

      if (me.frame % [48, 36, 24, 12][difficulty] == 0) {
        bullets.push(...remodel([bullet_model], ["app", "laser", "colourful", me.frame, "r", 2, "p", me.p, "v", new vec(0, [6, 12, 12, 12][difficulty]), "aim", player.p, "arrow", 30, "ex", [16, 24, 32, 40][difficulty], me.p]))
        Sound_Data.bullet0.play()
      }
    }

    me.frame++;
    if (me.life <= 0) {
      make_bullets_into_score(12)
      next_bullets = []

      enemies = []
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)

      if (difficulty == 3) {
        Sound_Data.hakkyou.play()
        next_enemies.push({ ...enemy_data["ethanol_5"] })
        scene_main.continue_story()
      } else {
        for (let i = 0; i < 4; i++) { explosion(me.p, 3) }
        scene_main.story_num += 4
        scene_main.continue_story()
      }
    }
  })
  .export()

enemy_data.ethanol_5 = new Enemy(null, 56, 3000, { is_boss: true })
  .addv("angle", 0)
  .move(null, new vec(game_width / 2, game_height / 2), 0, 60, x => x ** 2)
  .addf((me) => {
    if (me.frame > 60) {
      if (me.frame % 2 == 0) {
        me.angle += 6;
        bullets.push(...remodel([bullet_model], ["hakkyou_colourful", me.frame, "p", me.p, "v", new vec(0, 6).rot(me.angle * Math.PI / 180), "ex", 9, me.p]))
        Sound_Data.bullet1.play()
      } else if (me.life < me.maxlife / 2) {
        me.angle += 6;
        bullets.push(...remodel([bullet_model], ["hakkyou_colourful", me.frame - 120, "p", me.p, "v", new vec(0, 6).rot(-me.angle * Math.PI / 180), "ex", 9, me.p]))
        Sound_Data.bullet1.play()
      }
    }

    me.frame++;
    if (me.life <= 0) {
      make_bullets_into_score(12)
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
      for (let i = 0; i < 4; i++) { explosion(me.p, 3) }
      scene_main.continue_story()
      scene_main.scoring(me.maxlife ** 2)
    }
  })
  .export()


enemy_data.laninamivir_0 = new Enemy(new vec(game_width / 2, 100), 56, 600, { is_boss: true })
  .addf((me) => {
    if (me.frame % 12 == 0) {
      bullets.push(...remodel([bullet_model], ["colour", "purple", "r", 4, "p", me.p, "v", new vec(0, 12), "aim", player.p, "heart", 2, "ex", [12, 12, 12, 16][difficulty], me.p]))
    } else if (me.frame % 24 == 6) {
      bullets.push(...remodel([bullet_model], ["colour", "pink", "r", 4, "p", me.p, "v", new vec(0, 6), "aim", player.p, "rot", Math.PI / [4, 8, 12, 16][difficulty], "heart", 3, "ex", [4, 8, 12, 16][difficulty], me.p]))
    }
    me.frame++

    if (me.life <= 0) {
      make_bullets_into_score()
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
      next_enemies.push({ ...enemy_data["laninamivir_1"] })
    }
  })
  .export()

enemy_data.laninamivir_1 = new Enemy(null, 56, 600, { is_boss: true })
  .move(null, new vec(game_width / 2, 100), 0, 60, x => x ** 2)
  .addv("angle", 0)
  .addf((me) => {
    for (let i = 0; i < [1, 2, 3, 4][difficulty]; i++) {
      // bullets.push(...remodel([bullet_model], ["app", "ofuda", "hakkyou_colourful", me.frame, "p", me.p, "v", new vec(-6, 0).rot(me.angle)]))
      bullets.push(...remodel([bullet_model], ["app", "ofuda", "colourful", me.frame, "p", me.p, "v", new vec(-6, 0).rot(Math.PI * me.angle * 49 / 180)]))
      bullets.push(...remodel([bullet_model], ["app", "ofuda", "colourful", me.frame, "p", me.p, "v", new vec(-6, 0).rot(-Math.PI * me.angle * 49 / 180)]))
      me.angle++
      Sound_Data.bullet1.play()

    }
    me.frame++

    if (me.life <= 0) {
      make_bullets_into_score()
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
      next_enemies.push({ ...enemy_data["laninamivir_2"] })
      next_enemies.push({ ...enemy_data["laninamivir_2_0"] })
      next_enemies.push({ ...enemy_data["laninamivir_2_1"] })
    }
  }).export()

enemy_data.laninamivir_2 = new Enemy(new vec(game_width / 2, 100), 56, 400, { is_boss: true })
  .addf((me) => {
    if (me.frame % [16, 12, 8, 4][difficulty] == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 4, "p", me.p, "v", new vec(0, 12), "aim", player.p, "frame", 0,
        "f", (me0) => {
          if (me0.frame % 60 < 30) {
            me0.v = me0.v.rot(Math.PI / 120)
          } else {
            me0.v = me0.v.rot(-Math.PI / 120)
          }

          me0.frame++

          next_bullets.push(...remodel([bullet_model], ["colour", me0.colour, "r", 4, "p", me0.p, "v", me0.v, "delete", 1, "heart", 2]))
        },
        "ex", 16, me.p]))
    }

    if (me.life <= 0) {
      make_bullets_into_score()
      enemies.forEach(e => { e.life = 0 })
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
      enemy_vrs.p = me.p
      next_enemies.push({ ...enemy_data["laninamivir_3"] })
    }

    me.frame++
  })
  .export()

for (let i = 0; i < 2; i++) {
  enemy_data["laninamivir_2_" + i] = new Enemy(null, 32, 160)
    .addf((me) => {
      me.p = new vec(game_width / 2, 100).add(new vec(100, 0).rot((i / 2 + me.frame / 144) * 2 * Math.PI))

      if (me.frame % 12 == 0) {
        bullets.push(...remodel([bullet_model], ["app", "ofuda", "colourful", me.frame, "p", me.p, "v", new vec(0, 6), "aim", player.p, "sim", 12, 12]))
      }

      me.frame++
    })
    .export()
}

enemy_data.laninamivir_3 = new Enemy(null, 56, 300, { is_boss: true })
  .move(null, new vec(game_width / 2, 100), 0, 60, x => x ** 2)
  .addf((me) => {
    if (me.frame % [36, 30, 24, 18][difficulty] <= 4) {
      bullets.push(...remodel([bullet_model], ["colour", "pink", "app", "ofuda", "p", me.p, "v", new vec(8, 0), "rot", me.frame * Math.PI / 480, "ex", 63, me.p]))
    } else if ([36, 30, 24, 18][difficulty] / 2 <= me.frame % [36, 30, 24, 18][difficulty] && me.frame % [36, 30, 24, 18][difficulty] <= [36, 30, 24, 18][difficulty] / 2 + 4) {
      bullets.push(...remodel([bullet_model], ["colour", "purple", "app", "ofuda", "p", me.p, "v", new vec(8, 0), "rot", -me.frame * Math.PI / 480, "ex", 63, me.p]))
    }

    me.frame++

    if (me.life <= 0) {
      make_bullets_into_score()
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
      enemy_vrs.p = me.p
      next_enemies.push({ ...enemy_data["laninamivir_4"] })
    }
  }).export()

enemy_data.laninamivir_4 = new Enemy(null, 56, 1200, { is_boss: true })
  .move(null, new vec(game_width / 2, game_height / 2), 0, 60, x => x ** 2)
  .addf((me) => {
    // me.p.x = Math.cos(me.frame / 144 * Math.PI) * game_width / 2 + game_width / 2
    if (me.frame >= 60) {
      if ((me.frame - 60) % 288 == 0) {
        next_enemies.push(
          new Enemy(me.p.add(100, 0), 24, 144, { is_inv: true }).addf(
            (me0) => {
              me0.p.x = me.p.x + Math.cos(Math.PI * 2 / 144 * me0.life) * 100
              me0.p.y = me.p.y + Math.sin(Math.PI * 2 / 144 * me0.life) * 100

              if (me0.life > 0) {
                bullets.push(...remodel([bullet_model], ["colourful", me0.life * 2, "p", me0.p, "v", new vec(12, 0).rot(-2 * Math.PI / 144 * me0.life)]))
              }
              me0.life--
            }
          ).export(),

          new Enemy(me.p.add(100, 0), 24, 144, { is_inv: true }).addf(
            (me0) => {
              me0.p.x = me.p.x - Math.cos(Math.PI * 2 / 144 * me0.life) * 100
              me0.p.y = me.p.y - Math.sin(Math.PI * 2 / 144 * me0.life) * 100

              if (me0.life > 0) {
                bullets.push(...remodel([bullet_model], ["colourful", me0.life * 2, "p", me0.p, "v", new vec(12, 0).rot(2 * Math.PI / 144 * me0.life)]))
              }
              me0.life--
            }
          ).export(),

        )
      } else if ((me.frame - 60) % 288 == 144) {
        next_enemies.push(
          new Enemy(me.p.add(100, 0), 24, 144, { is_inv: true }).addf(
            (me0) => {
              me0.p.x = me.p.x + Math.cos(Math.PI * 2 / 144 * me0.life) * 100
              me0.p.y = me.p.y + Math.sin(Math.PI * 2 / 144 * me0.life) * 100
              if (me0.life > 0) {
                bullets.push(...remodel([bullet_model], ["colourful", me0.life * 2, "p", me0.p, "v", new vec(12, 0).rot(2 * Math.PI / 144 * me0.life)]))
              }
              me0.life--
            }
          ).export(),

          new Enemy(me.p.add(100, 0), 24, 144, { is_inv: true }).addf(
            (me0) => {
              me0.p.x = me.p.x - Math.cos(Math.PI * 2 / 144 * me0.life) * 100
              me0.p.y = me.p.y - Math.sin(Math.PI * 2 / 144 * me0.life) * 100
              if (me0.life > 0) {
                bullets.push(...remodel([bullet_model], ["colourful", me0.life * 2, "p", me0.p, "v", new vec(12, 0).rot(-2 * Math.PI / 144 * me0.life)]))
              }
              me0.life--
            }
          ).export(),
        )
      }

      bullets.push(...remodel([bullet_model], ["app", "ofuda", "colourful", Math.random() * 180, "p", me.p, "v", new vec(4, 0).rot(-2 * Math.PI * Math.random())]))

    }

    if (me.life <= 0) {
      make_bullets_into_score()
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
      enemies.forEach(e => { e.life = 0 })
      next_bullets = []

      if (difficulty == 3) {
        enemy_vrs.p = me.p
        Sound_Data.hakkyou.play()
        next_enemies.push({ ...enemy_data["laninamivir_5"] })
        scene_main.continue_story()
      } else {
        for (let i = 0; i < 4; i++) { explosion(me.p, 3) }
        scene_main.story_num += 4
        scene_main.continue_story()
      }
    }

    me.frame++
  })
  .export()

enemy_data.laninamivir_5 = new Enemy(null, 56, 2000, { is_boss: true })
  .move(null, new vec(game_width / 2, 100), 0, 60, x => x ** 2)
  .addv("angle", 0)
  .addf((me) => {
    if (me.frame >= 60) {
      for (let i = 0; i < 8; i++) {
        // bullets.push(...remodel([bullet_model], ["app", "ofuda", "hakkyou_colourful", me.frame, "p", me.p, "v", new vec(-6, 0).rot(me.angle)]))
        bullets.push(...remodel([bullet_model], ["app", "ofuda", "hakkyou_colourful", me.frame, "p", me.p, "v", new vec(-3, 0).rot(me.angle / 2)]))
        if (me.life <= me.maxlife / 2 && me.frame % 2 == 0) {
          bullets.push(...remodel([bullet_model], ["app", "ofuda", "hakkyou_colourful", me.frame, "p", me.p, "v", new vec(-6, 0).rot(-me.angle)]))
        }
        me.angle++
        Sound_Data.bullet1.play()

      }
    }
    me.frame++

    if (me.life <= 0) {
      make_bullets_into_score()
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
      // next_enemies.push({ ...enemy_data["laninamivir_4"] })
    }
  }).export()

enemy_data.phenetylalcohol_0 = new Enemy(new vec(game_width / 2, 100), 56, 600, { is_boss: true })
  .addf((me) => {
    if (me.frame % 2 == 0) {
      bullets.push(...remodel([bullet_model], ["colour", "purple", "r", 8, "p", me.p, "v", new vec(0, 12).rot(Math.PI / 12 * Math.sin(Math.PI / 48 * me.frame)), "ex", 16, me.p]))

      if (me.frame % 12 == 0) {
        bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 4, "p", me.p, "v", new vec(0, 12), "aim", player.p, "flower", 16, 5]))
      }
    }

    me.frame++

    if (me.life <= 0) {
      make_bullets_into_score()
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
      enemy_vrs.p = me.p
      explosion(me.p)

      next_enemies.push({ ...enemy_data["phenetylalcohol_1"] })
    }
  }).export()

enemy_data.phenetylalcohol_1 = new Enemy(new vec(game_width / 2, game_height / 6), 56, 600, { is_boss: true })
  .addf((me) => {
    me.p.x = Math.sin(2 * Math.PI * me.frame / 288) * 100 + game_width / 2
    if (me.frame % 16 < 6) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec(0, 6), "ex", 13, me.p, "rot", 2 * Math.PI * me.frame / 288]))
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec(0, 6), "ex", 13, me.p, "rot", -2 * Math.PI * me.frame / 288]))
    }

    if (me.frame % 24 == 0) {
      bullets.push(...remodel([bullet_model], ["r", 16, "p", me.p, "v", new vec(0, 10), "aim", player.p, "nway", 3, Math.PI / 24, me.p]))
    }

    me.frame++

    if (me.life <= 0) {
      make_bullets_into_score()
      enemy_vrs.p = me.p
      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
      enemy_vrs.p = me.p
      explosion(me.p)

      next_enemies.push({ ...enemy_data["phenetylalcohol_2"] })
    }
  })
  .export()

enemy_data.phenetylalcohol_2 = new Enemy(new vec(game_width / 2, game_height / 2), 56, 900, { is_boss: true })
  .addf((me) => {
    me.p.x = Math.sin(2 * Math.PI * me.frame / 144) * 100 + game_width / 2

    if (me.frame % 12 == 0) {
      bullets.push(...remodel([bullet_model], ["colour", "yellow", "p", me.p, "v", new vec(0, 6), "aim", player.p, "frame", 0, "f", (me0) => {
        if (me0.frame == 12) {
          me0.v = me0.v.rot(Math.PI / 2)
        }
        me0.frame++
      }, "ex", 15, me.p]))

      bullets.push(...remodel([bullet_model], ["colour", "cyan", "p", me.p, "v", new vec(0, 6), "aim", player.p, "frame", 0, "f", (me0) => {
        if (me0.frame == 12) {
          me0.v = me0.v.rot(-Math.PI / 2)
        }
        me0.frame++
      }, "ex", 15, me.p]))
    }

    if (me.frame % 24 == 0) {
      bullets.push(...remodel([bullet_model], ["colour", "magenta", "p", me.p, "v", new vec(0, 6), "aim", player.p, "ex", 15, me.p]))
    }

    me.frame++

    if (me.life <= 0) {
      make_bullets_into_score()
      enemy_vrs.p = me.p

      Sound_Data.KO.play()
      scene_main.scoring(me.maxlife ** 2)
      explosion(me.p)

      next_enemies.push({ ...enemy_data["phenetylalcohol_3"] })

    }
  })
  .export()



function remodel(bulletArr, pro) {

  //bulletArrの参照しないコピー
  let bullet_list = [];
  for (let i = 0; i < bulletArr.length; i++) {
    bullet_list.push({ ...bulletArr[i] });

    bullet_list[i].f = [];
    bulletArr[i].f.forEach((fun) => { bullet_list[i].f.push(fun); });
  }

  for (let i = 0; i < pro.length; i++) {
    let c = [];

    switch (pro[i]) {
      //["colourful",seed値]
      case "colourful":
        const color_frame = pro[i + 1]
        c.push(...remodel(bullet_list, ["colour", "hsl(" + Math.floor(90 * Math.sin(2 * Math.PI * color_frame / 240) + 90) + ",100%,50%)"]))
        i++;
        break

      case "hakkyou_colourful":
        const color_frame2 = pro[i + 1]
        c.push(...remodel(bullet_list, ["colour", "hsl(" + Math.floor(90 * Math.sin(2 * Math.PI * color_frame2 / 240 + Math.PI / 2) - 40) + ",100%,50%)"]))
        i++;
        break

      //["aim",目標地点]
      case "aim":
        const p = pro[i + 1];
        bullet_list.forEach((b) => { c.push(...remodel([b], ["v", p.sub(b.p).nor().mlt(b.v.length())])); });
        i++; break;

      //["rot",rad]速度ベクトルの回転
      case "rot":
        const rad = pro[i + 1];
        bullet_list.forEach((b) => { c.push(...remodel([b], ["v", b.v.rot(rad)])); });
        i++; break;

      //["rev",rad,center]全体をcenter中心に回転させる
      case "rev":
        const radRev = pro[i + 1];
        const center = pro[i + 2];
        bullet_list.forEach((b) => { c.push(...remodel([b], ["p", b.p.sub(center).rot(radRev).add(center), "v", b.v.rot(radRev)])) });
        i += 2; break;

      //tフレームでp0からp1へ移動する
      case "move":
        const p1 = pro[i + 1];
        const t = pro[i + 2];
        const move_function = pro[i + 3]//f is in C[0,1] such that =>[0,1]
        for (b of bullet_list) {
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
          c.push(...remodel(bullet_list, ["rev", radnway * (i - n), centernway]));
        }
        i += 3; break;

      //["ex",num,center]center中心に回転しつつ一周する(自機狙いとかで偶数にするとnwayを使っている関係で自機狙いじゃなくなるので注意)
      case "ex":
        const num = pro[i + 1];
        const centerEx = pro[i + 2];
        c.push(...remodel(bullet_list, ["nway", num, 2 * Math.PI / num, centerEx]));
        i += 2; break;

      //["line",間隔d,通る点points]線をなぞる
      case "line":
        const d = pro[i + 1];
        const points = pro[i + 2];
        for (let j = 0; j < points.length - 1; j++) {
          let l = points[j + 1].sub(points[j]).length();
          for (k = 0; k * d < l; k++) {
            c.push(...remodel(bullet_list, ["p", points[j].add(points[j + 1].sub(points[j]).mlt(k * d / l))]));
          }
        }
        i += 2; break;

      //["laser",長さl]lineを利用してレーザーを作る
      case "laser":
        const l = pro[i + 1];
        bullet_list.forEach((b) => { c.push(...remodel([b], ["line", b.r, [b.p, b.p.add(b.v.nor().mlt(l))]])); });
        i++; break;

      //["arrow",長さl]laserを使って矢印を作る
      case "arrow":
        const arrow_size = pro[i + 1];
        let bul = [];
        bullet_list.forEach((b) => {
          bul.push(...remodel([b], ["v", new vec(1, 0), "laser", arrow_size]));
          bul.push(...remodel([b], ["p", b.p.add(new vec(1, 0).nor().mlt(arrow_size)), "v", new vec(-1, -1), "laser", arrow_size / 2]));
          bul.push(...remodel([b], ["p", b.p.add(new vec(1, 0).nor().mlt(arrow_size)), "v", new vec(-1, 1), "laser", arrow_size / 2]));
          c.push(...remodel(bul, ["v", new vec(b.v.length(), 0), "rev", get_angle(new vec(1, 0), b.v), b.p]));
        });
        i++; break;

      //["cross",直径]laserを使って十字を作る
      case "cross":
        const cross_size = pro[i + 1];
        let bul1 = [];
        bullet_list.forEach((b) => {
          if (b.v.x == 0 && b.v.y == 0) {
            b.v = new vec(0.01, 0);
          }

          for (let i = 0; i < 4; i++) {
            bul1.push(...remodel([b], ["laser", cross_size / 2, "rev", Math.PI / 2 * i, b.p, "v", b.v]));
          }

        });
        c.push(...bul1);
        i++; break;

      //["circle",直径dia]円(arrowとかと大きさの感覚を合わせるために直径で指定)
      case "circle":
        const circle_diagram = pro[i + 1];
        bullet_list.forEach((b) => {
          for (let j = 0; j < Math.PI * circle_diagram / b.r / 2; j++) {
            c.push(...remodel([b], ["p", b.p.add(new vec(Math.cos(4 * b.r / circle_diagram * j), Math.sin(4 * b.r / circle_diagram * j)).mlt(circle_diagram / 2))]));
          }
        });
        i++; break;

      case "heart":
        const heart_size = pro[i + 1]

        bullet_list.forEach((b) => {
          const heart_num = Math.floor(102.16754687718105 * heart_size / b.r / 2)
          let buls = []
          for (let i = 0; i < heart_num; i++) {
            let t = 2 * Math.PI / heart_num * i
            buls.push(...remodel([b], ["p", b.p.add(heart(t).mlt(heart_size))]))
          }
          c.push(...remodel(buls, ["v", new vec(0, b.v.length()), "rev", -Math.PI / 2 + b.v.arg(), b.p]))
        })

        i++
        break

      case "flower":
        const flower_size = pro[i + 1]
        const flower_num = pro[i + 2]

        bullet_list.forEach(b => {
          const bullet_num = Math.floor([7.999999999835435, 11.041383983887872, 14.49290096006739, 18.131108630480195, 21.8717625996455, 25.675358558569684, 29.520691991450203, 33.39527309545395][flower_num - 1] * flower_size / b.r / 1.5)
          let buls = []
          for (let i = 0; i < bullet_num; i++) {
            let t = 2 * Math.PI / bullet_num * i
            buls.push(...remodel([b], ["p", b.p.add(flower(flower_num, t).mlt(flower_size))]))
          }
          c.push(...buls)
        })
        i += 2
        break

      //["wait",使う変数,frame,f]待ってから実行
      case "wait":
        const thev = pro[i + 1]
        const frame = pro[i + 2];
        const f = pro[i + 3];
        c.push(...remodel(bullet_list, [thev, 0, "f", (me) => { if (me[thev] == frame) { f(me); } me[thev]++; }]));
        i += 3; break;

      //自身をnフレーム後に消す
      case "delete":
        c.push(...remodel(bullet_list, ["wait", "deadline", pro[i + 1], (me) => { me.life = 0; }]));
        i++;
        break;

      //["bound"]壁で跳ね返るようにする
      case "bound":
        c.push(...remodel(bullet_list, ["f", (me) => { if (me.p.x - me.r < 0 || game_width < me.p.x + me.r) { me.v.x *= -1; me.life--; } if (me.p.y - me.r < 0 || game_height < me.p.y + me.r) { me.v.y *= -1; me.life--; } }]));
        break;

      //["sim",num,max_speed]
      case "sim":
        const sim_num = pro[i + 1]
        const sim_max_speed = pro[i + 2]
        bullet_list.forEach((b) => {
          const default_speed = b.v.length()
          for (let i = 0; i < sim_num; i++) {
            c.push(...remodel([b], ["v", b.v.nor().mlt(default_speed + (sim_max_speed - default_speed) * i / (sim_num - 1))]))
          }
        })
        i += 2
        break

      //わざわざコマンドにするほどでもないことをして(数は変えられない)
      case "do": bullet_list.forEach((b) => { pro[i + 1](b); c.push(b) }); i++; break;

      //[対象,数値やベクトルや関数]代入(基本操作)
      case "f": bullet_list.forEach((b) => { b["f"].push(pro[i + 1]); c.push(b); }); i++; break;
      default: bullet_list.forEach((b) => { b[pro[i]] = pro[i + 1]; c.push(b); }); i++; break;
    }

    bullet_list = c;
  }

  return bullet_list;
}