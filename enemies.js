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

    addf(f) {
        this.f.push(f)
        return this
    }

    addv(name, first) {
        this.var[name] = first
        return this
    }

    move(p_start, p_end, time_start, time_end, f = (x) => x) {
        p_start ??= this.pre_p
        this.f.push((me) => {
            if (time_start <= me.frame && me.frame <= time_end) {
                me.p = linear_move(me.frame - time_start, time_end - time_start, p_start, p_end, f)
            }
        })
        this.pre_p = p_end
        return this
    }

    scale(size_start, size_end, time_start, time_end, f = (x) => x) {
        this.f.push((me) => {
            if (time_start <= me.frame && me.frame <= time_end) {
                me.r = size_start + (size_end - size_start) * f((me.frame - time_start) / (time_end - time_start))
            }
        })
        return this
    }

    export() {
        return {
            p: this.p,
            r: this.r,
            life: this.life,
            maxlife: this.life,
            damaged: false,
            is_boss: this.is_boss,
            is_inv: this.is_inv,
            app: this.app,
            ...this.var,
            frame: 0,
            f: this.f,
        }
    }
}

const bullet_model = {
    type: "enemy",
    colour: "yellow",
    app: "donut",
    p: new vec(0, 0),
    r: 8,
    life: 1,
    v: new vec(0, 0),
    f: [
        (me) => {
            me.p = me.p.add(me.v)
        },
        (me) => {
            if (is_touched_wall(me.p)) {
                me.life--
            }
        },
    ],
}

const enemy_data = {}
let enemy_vrs = { p: new vec(game_width / 2, -100) }

const is_touched_wall = (p) => {
    return p.x < 0 || game_width < p.x || p.y < 0 || game_height < p.y
}

const linear_move = (frame, time, p0, p1, fun = (x) => x) => {
    p0 ??= enemy_vrs.p
    return p0.add(p1.sub(p0).mlt(fun(frame / time)))
}

const circular_move = (center, frame, radius, cycle, rad = 0) => {
    return center.add(
        new vec(Math.cos((frame * Math.PI * 2) / cycle + rad), Math.sin((frame * Math.PI * 2) / cycle + rad)).mlt(
            radius,
        ),
    )
}

const get_angle = (v0, v1) => {
    let a = Math.atan(v1.y / v1.x) - Math.atan(v0.y / v0.x)
    return v1.x > 0 ? a : a + Math.PI
}

const explosion = (pos, speed = 6) => {
    for (let i = 0; i < 16; i++) {
        let c = chroma.hsl(Math.floor(90 * Math.sin(2 * Math.PI * Math.random()) + 90), 1, 0.5).hex()
        bullets.push(
            ...remodel(
                [bullet_model],
                [
                    "type",
                    "effect",
                    "colour",
                    c,
                    "r",
                    12 * Math.random() + 1,
                    "life",
                    48,
                    "p",
                    pos,
                    "v",
                    new vec(speed * Math.random(), 0).rot(Math.random() * 6),
                    "f",
                    (me) => {
                        me.life--
                        me.colour = chroma(c)
                            .alpha(me.life / 96)
                            .hex()
                    },
                ],
            ),
        )
    }
}

const heart = (t) =>
    new vec(16 * Math.sin(t) ** 3, -13 * Math.cos(t) + 5 * Math.cos(2 * t) + 2 * Math.cos(3 * t) + Math.cos(4 * t))
const flower = (b, t) => new vec(Math.cos(t), Math.sin(t)).mlt(1 + Math.cos(b * t))

const make_bullets_into_score = (speed = 24) => {
    next_bullets = []
    bullets.forEach((b) => {
        if (["enemy", "score"].includes(b.type)) {
            b.r = 6
            b.app = "laser"
            b.colour = "#80ffff80"
            b.type = "score"
            b.f = [
                (me) => {
                    me.v = player.p.sub(me.p).nor().mlt(speed)
                    me.p = me.p.add(me.v)
                },
            ]
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
    .move(null, new vec(game_width / 2, game_height / 6), 0, 24, (x) => x ** 2)
    .addf((me) => {
        me.p.x = (Math.sin((2 * Math.PI * me.frame) / 144) * game_width) / 2 + game_width / 2

        if (me.frame % 12 == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    ["r", 2, "app", "ball", "colourful", me.frame, "p", me.p, "v", new vec(0, 6), "sim", 3, 12],
                ),
            )
            Sound_Data.bullet0.play()
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

function remodel(bulletArr, pro) {
    //bulletArrの参照しないコピー
    let bullet_list = []
    for (let i = 0; i < bulletArr.length; i++) {
        bullet_list.push({ ...bulletArr[i] })

        bullet_list[i].f = []
        bulletArr[i].f.forEach((fun) => {
            bullet_list[i].f.push(fun)
        })
    }

    for (let i = 0; i < pro.length; i++) {
        let c = []

        switch (pro[i]) {
            //["colourful",seed値]
            case "colourful":
                const color_frame = pro[i + 1]
                c.push(
                    ...remodel(bullet_list, [
                        "colour",
                        "hsl(" + Math.floor(90 * Math.sin((2 * Math.PI * color_frame) / 240) + 90) + ",100%,50%)",
                    ]),
                )
                i++
                break

            case "hakkyou_colourful":
                const color_frame2 = pro[i + 1]
                c.push(
                    ...remodel(bullet_list, [
                        "colour",
                        "hsl(" +
                            Math.floor(90 * Math.sin((2 * Math.PI * color_frame2) / 240 + Math.PI / 2) - 40) +
                            ",100%,50%)",
                    ]),
                )
                i++
                break

            //["aim",目標地点]
            case "aim":
                const p = pro[i + 1]
                bullet_list.forEach((b) => {
                    c.push(...remodel([b], ["v", p.sub(b.p).nor().mlt(b.v.length())]))
                })
                i++
                break

            //["rot",rad]速度ベクトルの回転
            case "rot":
                const rad = pro[i + 1]
                bullet_list.forEach((b) => {
                    c.push(...remodel([b], ["v", b.v.rot(rad)]))
                })
                i++
                break

            //["rev",rad,center]全体をcenter中心に回転させる
            case "rev":
                const radRev = pro[i + 1]
                const center = pro[i + 2]
                bullet_list.forEach((b) => {
                    c.push(...remodel([b], ["p", b.p.sub(center).rot(radRev).add(center), "v", b.v.rot(radRev)]))
                })
                i += 2
                break

            //tフレームでp0からp1へ移動する
            case "move":
                const p1 = pro[i + 1]
                const t = pro[i + 2]
                const move_function = pro[i + 3] //f is in C[0,1] such that =>[0,1]
                for (b of bullet_list) {
                    c.push(
                        ...remodel(
                            [b],
                            [
                                "frameMove",
                                0,
                                "f",
                                (me) => {
                                    if (me.frameMove <= t) {
                                        me.p = b.p.add(p1.sub(b.p).mlt(move_function(me.frameMove / t)))
                                    }
                                    me.frameMove++
                                },
                            ],
                        ),
                    )
                }
                i += 3
                break

            //["nway",num,rad,center]3way弾とか
            case "nway":
                const numnway = pro[i + 1]
                const radnway = pro[i + 2]
                const centernway = pro[i + 3]

                const n = (numnway - 1) / 2
                for (let i = 0; i < numnway; i++) {
                    c.push(...remodel(bullet_list, ["rev", radnway * (i - n), centernway]))
                }
                i += 3
                break

            //["ex",num,center]center中心に回転しつつ一周する(自機狙いとかで偶数にするとnwayを使っている関係で自機狙いじゃなくなるので注意)
            case "ex":
                const num = pro[i + 1]
                const centerEx = pro[i + 2]
                c.push(...remodel(bullet_list, ["nway", num, (2 * Math.PI) / num, centerEx]))
                i += 2
                break

            //["line",間隔d,通る点points]線をなぞる
            case "line":
                const d = pro[i + 1]
                const points = pro[i + 2]
                for (let j = 0; j < points.length - 1; j++) {
                    let l = points[j + 1].sub(points[j]).length()
                    for (k = 0; k * d < l; k++) {
                        c.push(
                            ...remodel(bullet_list, [
                                "p",
                                points[j].add(points[j + 1].sub(points[j]).mlt((k * d) / l)),
                            ]),
                        )
                    }
                }
                i += 2
                break

            //["laser",長さl]lineを利用してレーザーを作る
            case "laser":
                const l = pro[i + 1]
                bullet_list.forEach((b) => {
                    c.push(...remodel([b], ["line", b.r, [b.p, b.p.add(b.v.nor().mlt(l))]]))
                })
                i++
                break

            //["arrow",長さl]laserを使って矢印を作る
            case "arrow":
                const arrow_size = pro[i + 1]
                let bul = []
                bullet_list.forEach((b) => {
                    bul.push(...remodel([b], ["v", new vec(1, 0), "laser", arrow_size]))
                    bul.push(
                        ...remodel(
                            [b],
                            [
                                "p",
                                b.p.add(new vec(1, 0).nor().mlt(arrow_size)),
                                "v",
                                new vec(-1, -1),
                                "laser",
                                arrow_size / 2,
                            ],
                        ),
                    )
                    bul.push(
                        ...remodel(
                            [b],
                            [
                                "p",
                                b.p.add(new vec(1, 0).nor().mlt(arrow_size)),
                                "v",
                                new vec(-1, 1),
                                "laser",
                                arrow_size / 2,
                            ],
                        ),
                    )
                    c.push(...remodel(bul, ["v", new vec(b.v.length(), 0), "rev", get_angle(new vec(1, 0), b.v), b.p]))
                })
                i++
                break

            //["cross",直径]laserを使って十字を作る
            case "cross":
                const cross_size = pro[i + 1]
                let bul1 = []
                bullet_list.forEach((b) => {
                    if (b.v.x == 0 && b.v.y == 0) {
                        b.v = new vec(0.01, 0)
                    }

                    for (let i = 0; i < 4; i++) {
                        bul1.push(...remodel([b], ["laser", cross_size / 2, "rev", (Math.PI / 2) * i, b.p, "v", b.v]))
                    }
                })
                c.push(...bul1)
                i++
                break

            //["circle",直径dia]円(arrowとかと大きさの感覚を合わせるために直径で指定)
            case "circle":
                const circle_diagram = pro[i + 1]
                bullet_list.forEach((b) => {
                    for (let j = 0; j < (Math.PI * circle_diagram) / b.r / 2; j++) {
                        c.push(
                            ...remodel(
                                [b],
                                [
                                    "p",
                                    b.p.add(
                                        new vec(
                                            Math.cos(((4 * b.r) / circle_diagram) * j),
                                            Math.sin(((4 * b.r) / circle_diagram) * j),
                                        ).mlt(circle_diagram / 2),
                                    ),
                                ],
                            ),
                        )
                    }
                })
                i++
                break

            case "heart":
                const heart_size = pro[i + 1]

                bullet_list.forEach((b) => {
                    const heart_num = Math.floor((102.16754687718105 * heart_size) / b.r / 2)
                    let buls = []
                    for (let i = 0; i < heart_num; i++) {
                        let t = ((2 * Math.PI) / heart_num) * i
                        buls.push(...remodel([b], ["p", b.p.add(heart(t).mlt(heart_size))]))
                    }
                    c.push(...remodel(buls, ["v", new vec(0, b.v.length()), "rev", -Math.PI / 2 + b.v.arg(), b.p]))
                })

                i++
                break

            case "flower":
                const flower_size = pro[i + 1]
                const flower_num = pro[i + 2]

                bullet_list.forEach((b) => {
                    const bullet_num = Math.floor(
                        ([
                            7.999999999835435, 11.041383983887872, 14.49290096006739, 18.131108630480195,
                            21.8717625996455, 25.675358558569684, 29.520691991450203, 33.39527309545395,
                        ][flower_num - 1] *
                            flower_size) /
                            b.r /
                            1.5,
                    )
                    let buls = []
                    for (let i = 0; i < bullet_num; i++) {
                        let t = ((2 * Math.PI) / bullet_num) * i
                        buls.push(...remodel([b], ["p", b.p.add(flower(flower_num, t).mlt(flower_size))]))
                    }
                    c.push(...buls)
                })
                i += 2
                break

            //["wait",使う変数,frame,f]待ってから実行
            case "wait":
                const thev = pro[i + 1]
                const frame = pro[i + 2]
                const f = pro[i + 3]
                c.push(
                    ...remodel(bullet_list, [
                        thev,
                        0,
                        "f",
                        (me) => {
                            if (me[thev] == frame) {
                                f(me)
                            }
                            me[thev]++
                        },
                    ]),
                )
                i += 3
                break

            //自身をnフレーム後に消す
            case "delete":
                c.push(
                    ...remodel(bullet_list, [
                        "wait",
                        "deadline",
                        pro[i + 1],
                        (me) => {
                            me.life = 0
                        },
                    ]),
                )
                i++
                break

            //["bound"]壁で跳ね返るようにする
            case "bound":
                c.push(
                    ...remodel(bullet_list, [
                        "f",
                        (me) => {
                            if (me.p.x - me.r < 0 || game_width < me.p.x + me.r) {
                                me.v.x *= -1
                                me.life--
                            }
                            if (me.p.y - me.r < 0 || game_height < me.p.y + me.r) {
                                me.v.y *= -1
                                me.life--
                            }
                        },
                    ]),
                )
                break

            //["sim",num,max_speed]
            case "sim":
                const sim_num = pro[i + 1]
                const sim_max_speed = pro[i + 2]
                bullet_list.forEach((b) => {
                    const default_speed = b.v.length()
                    for (let i = 0; i < sim_num; i++) {
                        c.push(
                            ...remodel(
                                [b],
                                [
                                    "v",
                                    b.v
                                        .nor()
                                        .mlt(default_speed + ((sim_max_speed - default_speed) * i) / (sim_num - 1)),
                                ],
                            ),
                        )
                    }
                })
                i += 2
                break

            //わざわざコマンドにするほどでもないことをして(数は変えられない)
            case "do":
                bullet_list.forEach((b) => {
                    pro[i + 1](b)
                    c.push(b)
                })
                i++
                break

            //[対象,数値やベクトルや関数]代入(基本操作)
            case "f":
                bullet_list.forEach((b) => {
                    b["f"].push(pro[i + 1])
                    c.push(b)
                })
                i++
                break
            default:
                bullet_list.forEach((b) => {
                    b[pro[i]] = pro[i + 1]
                    c.push(b)
                })
                i++
                break
        }

        bullet_list = c
    }

    return bullet_list
}
