bullet_model = {
  type: "enemy", colour: "yellow",
  p: new vec(0, 0), r: 3, life: 1, v: new vec(0, 0), f: [
    (me) => { me.p = me.p.add(me.v) },
    (me) => { if (wall(me.p)) { me.life--; } }
  ]
}

enemy_data = {}

function wall(p) {
  return p.x < 0 || game_width < p.x | p.y < 0 || game_height < p.y
}

enemy_data.carotene_0 = {
  p: new vec(game_width / 2, 60), r: 32, frame: 0, life: 200, maxlife: 200, damaged: false, f: (me) => {

    me.p.x = game_width / 3 * Math.sin(me.frame * 2 * Math.PI / 120) + game_width / 2

    if (me.frame % 8 == 0) {
      bullets.push(...remodel([bullet_model], ["colourful", me.frame, "r", 12, "p", me.p, "v", new vec(12, 0), "ex", 36, me.p]))
    }

    me.frame++;
    if (me.life <= 0) {
      bullets = []
    }

  }
}


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
        c.push(...remodel(buls, ["colour", "hsl(" + (120 * Math.sin(2 * Math.PI * color_frame / 240) + 60) + ",100%,50%)"]))
        i++;
        break

      //["aim",目標地点]
      case "aim":
        const p = pro[i + 1];
        buls.forEach((b) => { c.push(...remodel([b], ["v", p.sub(b.p).nor().mlt(b.v.length)])); });
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
          let l = points[j + 1].sub(points[j]).length;
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
          c.push(...remodel(bul, ["v", new vec(b.v.length, 0), "rev", getAngle(new vec(1, 0), b.v), b.p]));
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
        c.push(...remodel(buls, ["f", (me) => { if (me.v.length <= maxSpeed) { me.v = me.v.add(accel); } }]));
        i += 2; break;

      //["bound"]壁で跳ね返るようにする
      case "bound":
        c.push(...remodel(buls, ["f", (me) => { if (me.p.x + me.r < 0 || gamewidth < me.p.x - me.r) { me.v.x *= -1; } if (me.p.y + me.r < 0 || gameheight < me.p.y - me.r) { me.v.y *= -1; } }]));
        break;

      //["shift",対象,数値やベクトル]指定の分ずらす(使いどころはないかも)
      case "shift":
        switch (pro[i + 2].constructor.name) {
          case "vec": buls.forEach((b) => { b[pro[i + 1]] = b[pro[i + 1]].add(pro[i + 2]); c.push(b); }); break;
          case "number": buls.forEach((b) => { b[pro[i + 1]] += pro[i + 2]; c.push(b); }); break;
        }
        i += 2; break;

      //[対象,数値やベクトルや関数]代入(基本操作)
      case "f": buls.forEach((b) => { b["f"].push(pro[i + 1]); c.push(b); }); i++; break;
      default: buls.forEach((b) => { b[pro[i]] = pro[i + 1]; c.push(b); }); i++; break;
    }

    buls = c;
  }

  return buls;
}