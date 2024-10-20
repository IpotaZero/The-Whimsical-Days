const scene_main = new (class extends Scene {
    constructor() {
        super()
        Image_Data.background = new Iimage("./images/ba.png", 0, 0, width, height)
        Image_Data.battle_bg = new Iimage(
            "./images/battle_bg.png",
            -width + 20 + game_width / 2,
            -height + 20 + game_height / 2,
            width * 2,
            height * 2,
            {
                alpha: 0.0,
                center_x: width,
                center_y: height,
                repeat_x: 32,
                repeat_y: 32,
            },
        )

        Sound_Data.graze = new Iaudio("./sounds/graze.wav")
        Sound_Data.dash = new Iaudio("./sounds/dash.wav")
        Sound_Data.bullet0 = new Iaudio("./sounds/鈴を鳴らす.mp3")
        Sound_Data.bullet1 = new Iaudio("./sounds/きらきら輝く2.wav")
        Sound_Data.bullet2 = new Iaudio("./sounds/bullet.wav")
        Sound_Data.KO = new Iaudio("./sounds/KO.wav")
        Sound_Data.hakkyou = new Iaudio("./sounds/hakkyou!.wav")
        Sound_Data.u = new Iaudio("./sounds/u.wav")
        Sound_Data.player_hit = new Iaudio("./sounds/player_hit.wav")

        this.colours = {}

        this.chapter_num = 0

        this.composite_mode = "lighter"

        this.objects = []
    }

    start() {
        fpsInterval = 1000 / 24

        Icamera.vive = 0

        bullets = []
        enemies = []
        this.objects = []
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

        player = { ...player_model }
    }

    end() {}

    set_score() {
        save.data.stages[this.chapter_num].difficulties[difficulty].set_highest_score(this.score)

        save.save()
    }

    scoring(score, text = "CRUSH!") {
        this.score += score
        this.socre_text = text + ": " + score
    }

    continue_story() {
        this.story_num++
        this.story_frame = 0
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
                        if (element.voice == null) {
                            Sound_Data.text = false
                        } else {
                            Sound_Data.text = true
                            Sound_Data.text_sending = element.voice
                        }
                        break

                    case "score":
                        this.scoring((difficulty + 1) * player.life * 10 ** 5, "Life Bonus")
                        this.story_text = "Score: " + this.score
                        const a = save.data.stages[this.chapter_num].difficulties[difficulty]
                        a.is_cleard = true
                        if (player.life == 8) {
                            a.is_no_miss_cleard = true
                        }
                        this.set_score()
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
                        // console.log(element)
                        element.se.reset()
                        element.se.volume = 0.4
                        element.se.play()
                        break

                    case "set_bgm":
                        if (BGM != null) {
                            BGM.end()
                        }
                        BGM = element.bgm
                        BGM.reset()
                        break

                    case "play_bgm":
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
                if (pushed.includes("ok")) {
                    this.continue_story()
                }

                break

            case "sleep":
                if (this.story_interval == 0) {
                    this.story_interval = element.interval
                }
                this.story_interval = Math.max(0, this.story_interval - 1)
                if (this.story_interval == 0) {
                    this.continue_story()
                }
                break

            case "end":
                scene_anten.next_scene = scene_title
                scene_manager.MoveTo(scene_anten)
                break
        }

        this.story_image.forEach((i) => {
            i.alpha += 1 / 24
            i.draw()
        })

        if (this.story_popup != "") {
            Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")
            Itext5(this.story_frame, game_width + 40, game_height - 180, font_size, this.story_popup)
        }

        if (this.story_text != "") {
            Irect(lefttop.x, lefttop.y, rightbottom.x - lefttop.x, rightbottom.y - lefttop.y, "#ffffffcc")

            Iline2("#808080CC", 12, [
                lefttop.add(new vec(20, 40)),
                leftbottom.add(new vec(20, -20)),
                rightbottom.add(new vec(-40, -20)),
            ])
            Iline2("#808080CC", 12, [
                lefttop.add(new vec(40, 20)),
                righttop.add(new vec(-20, 20)),
                rightbottom.add(new vec(-20, -40)),
            ])

            Iline2("#808080CC", 6, [lefttop.add(new vec(13, 13)), lefttop.add(new vec(40, 40))])
            Iline2("#808080CC", 6, [
                lefttop.add(new vec(10, 30)),
                lefttop.add(new vec(10, 10)),
                lefttop.add(new vec(30, 10)),
            ])

            Iline2("#808080CC", 6, [rightbottom.add(new vec(-13, -13)), rightbottom.add(new vec(-40, -40))])
            Iline2("#808080CC", 6, [
                rightbottom.add(new vec(-10, -30)),
                rightbottom.add(new vec(-10, -10)),
                rightbottom.add(new vec(-30, -10)),
            ])

            Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', serif")
            Itext5(this.story_frame, lefttop.x + 40, lefttop.y + 50, font_size, this.story_text + ok)
        }

        this.story_frame++
    }

    loop() {
        cvs.focus()

        if (!this.is_paused) {
            this.control_player()
            this.danmaku()
        }

        if (pushed.includes("Escape")) {
            Sound_Data.cancel.play()

            if (BGM != null) {
                this.is_paused ? BGM.play() : BGM.pause()
            }
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
            if (pushed.includes(key_config.data.retry)) {
                scene_anten.next_scene = scene_main
                scene_manager.MoveTo(scene_anten)
            }

            Ifont(48, "black", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")
            Itext(this.frame, game_width + 80, height / 2 + 24, "Pause")

            Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', Ariel")
            this.c = Icommand(this.c, game_width + 40, 450, font_size, {
                "": ["Back to Game", "Retry[R]", "Back to Title"],
            })

            switch (this.c.current_branch) {
                case "0":
                    this.is_paused = false
                    if (BGM != null) {
                        BGM.play()
                    }

                    break
                case "1":
                    scene_anten.next_scene = scene_main
                    scene_manager.MoveTo(scene_anten)
                    break
                case "2":
                    scene_anten.next_scene = scene_title
                    scene_manager.MoveTo(scene_anten)
                    break
            }
        } else {
            this.story()
        }

        this.frame++
    }

    control_player() {
        let input = { slow: false, dash: false, turn: false }

        const key = key_config.data
        //プレイヤー操作
        player.v = new vec(0, 0)

        input.slow = pressed.includes(key["slow"])
        input.dash = pushed.includes(key["dash"])
        input.turn = pushed.includes(key["turn"])

        if (pressed.includes(key["left"])) {
            player.v.x--
        }
        if (pressed.includes(key["right"])) {
            player.v.x++
        }
        if (pressed.includes(key["up"])) {
            player.v.y--
        }
        if (pressed.includes(key["down"])) {
            player.v.y++
        }

        player.speed = input.slow ? 6 : 16

        if (input.dash && player.dash_interval == 0) {
            player.dash_interval = dash_interval
            player.dash = 12
            player.inv = true
            Sound_Data.dash.play()
        }

        if (player.dash > 0) {
            player.speed = 60
        }

        player.v = player.v.nor()
        player.p = player.v.mlt(player.speed).add(player.p)

        if (player.dash > 0) {
            player.dash--
            let ring = { ...dash_effect_ring }
            ring.p = player.p
            bullets.push(ring)
            let point = { ...dash_effect_point }
            point.p = player.p
            bullets.push(point)
        } else {
            player.inv = false
        }

        if (player.dash_interval > 0) {
            player.dash_interval--
        }

        if (config.data.control_mode == "mouse") {
            player.p = mouse.p.add(new vec(-20, -20))
        }

        if (player.p.x < 0) {
            player.p.x = 0
        }
        if (player.p.x > game_width) {
            player.p.x = game_width
        }
        if (player.p.y < 0) {
            player.p.y = 0
        }
        if (player.p.y > game_height) {
            player.p.y = game_height
        }

        if (input.turn) {
            player.direction = 1 - player.direction
        }

        if (this.frame % 3 == 0) {
            if (input.slow) {
                for (let i = 0; i < 5; i++) {
                    bullets.push(
                        ...remodel(
                            [player_bullet],
                            [
                                "p",
                                player.p.add(new vec(20 * (i - 2), 0)),
                                "v",
                                new vec(0, -32).rot(Math.PI * player.direction),
                            ],
                        ),
                    )
                }
            } else {
                bullets.push(
                    ...remodel(
                        [player_bullet],
                        [
                            "p",
                            player.p,
                            "v",
                            new vec(0, -16).rot(Math.PI * player.direction),
                            "nway",
                            5,
                            Math.PI / 12,
                            player.p,
                        ],
                    ),
                )
            }
        }
    }

    danmaku() {
        if (0 < player.dead) {
            // bullets = bullets.filter(b => b.type != "enemy")

            player.dead--
        }

        enemies.forEach((e) => {
            e.damaged = false

            //closer, higher damage
            const damage = 1 + Math.floor(3 * (1 - e.p.sub(player.p).length() / game_height))

            //player_bullet vs enemy
            bullets.forEach((b) => {
                if (b.type == "friend" && !e.is_inv && b.r + e.r >= b.p.sub(e.p).length()) {
                    b.life = 0
                    e.life -= damage
                    e.damaged = true
                    //next_bullets.push(...remodel([damage_effect], ["colour", c, "p", b.p]))
                    this.scoring(100 * damage, "HIT")
                }
            })

            //enemy's function
            e.f.forEach((f) => {
                f(e)
            })
        })

        bullets.forEach((b) => {
            //bullet's function
            b.f.forEach((f) => {
                f(b)
            })

            //enemy_bullet vs player
            if (
                b.life > 0 &&
                ["enemy", "score"].includes(b.type) &&
                b.r + player.r + player.graze_r >= b.p.sub(player.p).length()
            ) {
                if (b.type == "score") {
                    this.scoring(100, "BULLET")
                    b.life = 0
                    Sound_Data.graze.play()
                    return
                }

                //if enemy
                if (player.inv || player.dead > 0) {
                    return
                }

                Sound_Data.graze.play()

                //graze
                this.graze++
                this.scoring(1000, "GRAZE")

                //hit
                if (b.r + player.r >= b.p.sub(player.p).length()) {
                    b.life = 0
                    player.dead = 24
                    player.life--

                    Icamera.vive = 12

                    Sound_Data.u.play()
                    Sound_Data.player_hit.play()

                    this.objects.push({
                        life: 36,
                        p: player.p,
                        r: 0,
                        run() {
                            let x = (36 - this.life) / 36
                            this.r = ((game_height * 3) / 4) * (-((x - 1) ** 2) + 1)

                            bullets.forEach((b) => {
                                if (b.type == "enemy" && b.p.sub(this.p).length() < b.r + this.r) {
                                    next_bullets.push(
                                        ...remodel(
                                            [bullet_model],
                                            [
                                                "p",
                                                b.p,
                                                "life",
                                                6,
                                                "colour",
                                                "white",
                                                "type",
                                                "effect",
                                                "r",
                                                12,
                                                "f",
                                                (me) => {
                                                    me.life--
                                                    me.colour = chroma("white")
                                                        .alpha(me.life / 12)
                                                        .hex()
                                                },
                                            ],
                                        ),
                                    )
                                    b.r = 3
                                    b.app = "laser"
                                    b.colour = "#80ffff40"
                                    b.type = "score"
                                    b.v = new vec(0, 12)
                                    b.f = [
                                        (me) => {
                                            // me.v = player.p.sub(me.p).nor().mlt(24)
                                            me.p = me.p.add(me.v)
                                            // if (me.p.sub(player.p) < player.graze_r * 4) { me.v = player.p.sub(ma.p).nor().mlt(12) }
                                            if (is_touched_wall(me.p)) {
                                                me.life = 0
                                            }
                                        },
                                    ]
                                }
                            })

                            this.life--
                        },
                        draw() {
                            ctx.globalAlpha = this.life / 36
                            IcircleC(this.p.x, this.p.y, this.r, "white", "stroke", "2")
                            ctx.globalAlpha = 1
                        },
                    })
                }
            }
        })

        this.objects.forEach((obj) => {
            obj.run?.()
        })

        bullets = bullets.filter((b) => {
            return b.life > 0
        })
        enemies = enemies.filter((e) => {
            return e.life > 0
        })
        this.objects = this.objects.filter((o) => o.life > 0)

        bullets.push(...next_bullets)
        enemies.push(...next_enemies)
        next_bullets = []
        next_enemies = []

        if (player.life < 0) {
            scene_manager.MoveTo(scene_gameover)
        }
    }

    draw() {
        if (Icamera.vive > 0) {
            Icamera.vive--
            Icamera.p.x = Math.sin(Icamera.vive * 2) * 4 - 20
        }

        //描画
        ctx.clearRect(0, 0, width, height)

        ctx.globalCompositeOperation = this.composite_mode

        Irect(0, 0, width, height, "#121212")

        if (this.boss) {
            //Image_Data.battle_bg.move(-2, -2, 64, 64)
            Image_Data.battle_bg.alpha = (0.1 * Math.min(48, this.battle_image_frame)) / 48
            Image_Data.battle_bg.rotate += Math.PI / 360
            Image_Data.battle_bg.draw()

            this.battle_image_frame++
        }

        //player
        const colour_player = player.dead > 0 ? "80" : "ff"
        IcircleC(player.p.x, player.p.y, player.r, "#ff0000" + colour_player)

        // Iline2C("#ff0000" + colour_player, 4, [player.p.add(new vec(0, -6)), player.p.add(new vec(0, 6))])
        // Iline2C("#ff0000" + colour_player, 4, [player.p.add(new vec(6, 0)), player.p.add(new vec(-6, 0))])

        IarcC(
            player.p.x,
            player.p.y,
            player.r + player.graze_r,
            -Math.PI / 2,
            -Math.PI / 2 + 2 * Math.PI * (1 - player.dash_interval / dash_interval),
            "#ffffff" + colour_player,
            "stroke",
            2,
        )
        if (config.data.brighten) {
            IcircleC(player.p.x, player.p.y, player.r + player.graze_r, "rgba(255,255,255,0.2)", "stroke", 8)
            IcircleC(player.p.x, player.p.y, player.r, "rgba(255,0,0,0.2)", "stroke", 8)
        }
        IarcC(
            player.p.x,
            player.p.y,
            player.r + player.graze_r / 2,
            -Math.PI / 2 + (2 * Math.PI * player.dash) / 12,
            -Math.PI / 2,
            "#ffff00" + colour_player,
            "stroke",
            2,
        )

        let laser_count = 0

        //弾
        bullets.forEach((b) => {
            switch (b.app) {
                case "donut":
                    IcircleC(b.p.x, b.p.y, b.r, b.colour, "stroke", 2)
                    break
                case "laser":
                    let v = b.v
                    if (v.x == 0 && v.y == 0) {
                        v = new vec(0.01, 0)
                    } //速度が0ベクトルだと方向が指定されなくなりますので
                    IlineC(b.colour, 2 * b.r, [
                        [b.p.sub(v.nor().mlt(b.r)).x, b.p.sub(v.nor().mlt(b.r)).y],
                        [b.p.add(v.nor().mlt(b.r)).x, b.p.add(v.nor().mlt(b.r)).y],
                    ])
                    break
                case "ball":
                    IcircleC(b.p.x, b.p.y, b.r + 2, b.colour)
                    IcircleC(b.p.x, b.p.y, b.r, "white")
                    break
                case "ofuda":
                    const m = 1.2
                    Iline2C(
                        b.colour,
                        2,
                        [
                            new vec(-b.r * m, -b.r),
                            new vec(-b.r * m, b.r),
                            new vec(b.r * m, b.r),
                            new vec(b.r * m, -b.r),
                            new vec(-b.r * m, -b.r),
                        ].map((p) => p.rot(b.v.arg()).add(b.p)),
                    )
                    break
                default:
                    IcircleC(b.p.x, b.p.y, b.r, b.colour)
                    break
            }

            if (config.data.brighten) {
                this.colours[b.colour] ??= chroma(b.colour).brighten(2).hex()
                const c = chroma(this.colours[b.colour])

                if (b.app == "laser") {
                    if (laser_count % 4 == 0) {
                        IcircleC(b.p.x, b.p.y, b.r * 1.5, c.alpha(0.1 * c.alpha()).hex(), "stroke", 18)
                    }
                    laser_count++
                } else if (b.app == "ofuda") {
                    const m = 1.2
                    Iline2C(
                        c,
                        4,
                        [
                            new vec(-b.r * m, -b.r),
                            new vec(-b.r * m, b.r),
                            new vec(b.r * m, b.r),
                            new vec(b.r * m, -b.r),
                            new vec(-b.r * m, -b.r),
                        ].map((p) => p.rot(b.v.arg()).add(b.p)),
                    )
                } else if (b.app != "none") {
                    IcircleC(b.p.x, b.p.y, b.r - 1, c.hex(), "stroke", 2)
                    IcircleC(b.p.x, b.p.y, b.r, c.alpha(0.1 * c.alpha()).hex(), "stroke", 12)
                }
            }
        })

        // let background_colour = "pink"
        // Irect(0, 0, 20, height, background_colour)
        // Irect(20 + game_width, 0, width - game_width - 20, height, background_colour)
        // Irect(20, 0, game_width, 20, background_colour)
        // Irect(20, 20 + game_height, game_width, 20, background_colour)

        this.objects.forEach((obj) => {
            obj.draw?.()
        })

        ctx.globalCompositeOperation = "source-over"

        //敵
        enemies.forEach((e) => {
            const colour_enemy = e.damaged ? "#ec1c24" : "#ffffff"

            const colour_life_bar = e.is_inv ? "#ec1c24" : "#ffffff"

            IrectC(e.p.x - e.r, e.p.y - e.r - 12, (2 * e.r * e.life) / e.maxlife, 6, colour_life_bar)
            IrectC(e.p.x - e.r, e.p.y - e.r - 12, 2 * e.r, 6, colour_life_bar, "stroke", 2)

            const colour_pattern = colour_enemy + "80"

            if (config.data.brighten) {
                IcircleC(e.p.x, e.p.y, e.r, colour_enemy + "1a", "stroke", 12)
                if (e.is_boss) {
                    IcircleC(e.p.x, e.p.y, e.r - 24, colour_enemy + "1a", "stroke", 12)
                }
            }

            if (e.is_boss) {
                IpolygonC(7, 2, e.p.x, e.p.y, (e.r - 24) * 0.9, colour_pattern, (Math.PI * e.frame) / 144, "stroke", 2)
                IpolygonC(11, 2, e.p.x, e.p.y, e.r * 0.9, colour_pattern, (-Math.PI * e.frame) / 144, "stroke", 2)
                IcircleC(e.p.x, e.p.y, e.r - 24, colour_enemy, "stroke", 2)
            } else {
                IpolygonC(7, 2, e.p.x, e.p.y, e.r * 0.9, colour_pattern, (Math.PI * e.frame) / 144, "stroke", 2)
            }

            IcircleC(e.p.x, e.p.y, e.r, colour_enemy, "stroke", 2)

            if (e.app != null) {
                e.app.x = e.p.x - 13
                e.app.y = e.p.y - 10
                e.app.draw()
            }
        })

        Image_Data.background.draw()

        Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', serif")

        const d = this.chapter_num == 3 ? "EXTRA" : ["Easy", "Normal", "Hard", "Insane!"][difficulty]

        Itext4(null, game_width + 40, lefttop.y + font_size, font_size, [
            "Difficulty: " + d,
            "Shields: ",
            "Graze: " + this.graze,
            "Score: " + this.score,
            "",
            "HScore: " + save.data.stages[this.chapter_num].difficulties[difficulty].highest_score,
        ])

        Itext(null, game_width + 40, lefttop.y + font_size * 5, this.socre_text)

        Ifont(18, "lightgreen", "'HG創英角ﾎﾟｯﾌﾟ体', serif")
        Itext(null, game_width + 60 + 75, lefttop.y + 24 * 2 - 1, "★".repeat(Math.max(player.life, 0)))

        // Ifont(24, "black", "'HG創英角ﾎﾟｯﾌﾟ体', serif")
        // Itext4(null, game_width + 40, 100, 24, [
        //     "" + this.story_interval,
        //     "" + this.story_num,
        //     "" + this.story_frame,
        //     this.chapter[this.story_num].type,
        //     "bullets: " + bullets.length,
        //     "enemies: " + enemies.length,
        // ])
    }
})()
