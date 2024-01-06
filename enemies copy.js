bullet_model = {
  type: "enemy", colour: "yellow", app: "donut",
  p: new vec(0, 0), r: 3, life: 1, v: new vec(0, 0), f: [
    (me) => { me.p = me.p.add(me.v) },
    (me) => { if (wall(me.p)) { me.life--; } }
  ]
}

enemy_data = {}
enemy_vrs = {}

function wall(p) {
  return p.x < 0 || game_width < p.x | p.y < 0 || game_height < p.y
}

function linear_move(frame, time, p0, p1, fun = x => x) {
  return p0.add(p1.sub(p0).mlt(fun(frame / time)))
}


function get_angle(v0, v1) {
  let a = Math.atan(v1.y / v1.x) - Math.atan(v0.y / v0.x);
  return v1.x > 0 ? a : a + Math.PI;
}


enemy_data.ethanol_0 = {
  p: new vec(game_width / 2, 60), r: 32, frame: 0, life: 200, maxlife: 200, damaged: false, f: (me) => {

    me.p.x = game_width / 3 * Math.sin(me.frame * 2 * Math.PI / 120) + game_width / 2

    if (me.frame % 8 == 0) {
      bullets.push(...new Bullets([bullet_model]).set("r", 6).set("p", me.p).set("v", new vec(12, 0)).ex(36, me.p).bullets)
    }

    me.frame++;
    if (me.life <= 0) {
      bullets = []
      next_enemies.push({ ...enemy_data["ethanol_1"] })
      enemy_vrs.p = me.p
      SoundData.KO.play()
    }

  }
}

//remodel([bullet_model], ["colourful", me.frame, "r", 6, "p", me.p, "v", new vec(12, 0), "ex", 36, me.p])

const Bullets = class {
  constructor(bullets) {
    //bulletArrの参照しないコピー
    let buls = [];
    for (let i = 0; i < bullets.length; i++) {
      buls.push({ ...bullets[i] });

      buls[i].f = [];
      bullets[i].f.forEach((fun) => { buls[i].f.push(fun); });
    }

    this.bullets = buls
  }

  set(key, value) {
    let c = []
    this.bullets.forEach((b) => { b[key] = value; c.push(b) })
    return new Bullets(c)
  }

  addf(f) {
    let c = []
    this.bullets.forEach((b) => { b["f"].push(f); c.push(b) })
    return new Bullets(c)
  }

  rev(rad, center) {
    let c = []
    this.bullets.forEach((b) => {
      b.p = b.p.sub(center).rot(rad).add(center)
      b.v = b.v.rot(rad)
      c.push(b)
    })
    return new Bullets(c)
  }

  nway(num, rad, center) {
    let c = []
    let n = (num - 1) / 2;
    for (let i = 0; i < num; i++) {
      c.push(...this.rev(rad * (i - n), center).bullets);
    }
    return new Bullets(c)
  }

  ex(num, center) {
    let c = []
    c.push(...this.nway(num, 2 * Math.PI / num, center).bullets);
    return new Bullets(c)
  }
}