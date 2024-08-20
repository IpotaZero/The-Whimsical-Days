for (let i = 0; i < 2; i++)
    enemy_data["extra_zako_0_" + i] = new Enemy(new vec(100, 0), 16, 12)
        .addf((me) => {
            if (me.frame < 24) {
                me.p = new vec(game_width / 2, 0).add(new vec(0, 200).mlt(1 - (1 - me.frame / 24) ** 2))
            } else if (me.frame == 24 || me.frame == 56) {
                Sound_Data.bullet0.play()
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        ["colourful", me.frame, "p", me.p, "v", new vec(12, 0), "aim", player.p, "sim", 5, 16],
                    ),
                )
            } else if (me.frame < 32) {
            } else {
                me.p = me.p.add(new vec(6 * [1, -1][i], 0))

                if (is_touched_wall(me.p)) {
                    me.life = 0
                }
            }

            if (me.life <= 0 && !is_touched_wall(me.p)) {
                explosion(me.p)
                Sound_Data.KO.play()
            }

            me.frame++
        })
        .export()

enemy_data.extra_zako_1 = new Enemy(null, 32, 350, { is_inv: true })
    .move(null, new vec(game_width / 2, game_height / 6), 0, 24, (x) => 1 - (x - 1) ** 2)
    .addf((me) => {
        me.life = 350 - me.frame

        me.frame++
        if (me.life <= 0) {
            make_bullets_into_score()
            explosion(me.p)
            Sound_Data.KO.play()
            scene_main.scoring(me.maxlife ** 2)
        }

        if (me.frame < 24) return

        if (me.frame % 4 == 0) {
            if (me.frame % 175 < 85)
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        ["life", 3, "bound", "colour", "yellow", "p", me.p, "v", new vec(0, 8), "ex", 16, me.p],
                    ),
                )
            else
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        ["life", 3, "bound", "colour", "gray", "p", me.p, "v", new vec(0, 8), "ex", 15, me.p],
                    ),
                )
        }
    })
    .export()

for (let i = 0; i < 2; i++)
    enemy_data["extra_zako_2_" + i] = new Enemy(null, 16, 10)
        .addf((me) => {
            me.frame++

            me.p = [
                new vec(400, 0).rot(me.frame / 60),
                new vec(game_width, 0).add(new vec(-400, 0).rot(-me.frame / 60)),
            ][i]

            if (me.frame % 24 == 0) {
                Sound_Data.bullet0.play()
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        ["colourful", me.p.x / 10, "p", me.p, "v", new vec(12, 0), "aim", player.p, "sim", 5, 8],
                    ),
                )
            }

            if (me.life <= 0) {
                explosion(me.p)
                Sound_Data.KO.play()
            }

            if (is_touched_wall(me.p)) {
                me.life = 0
            }
        })
        .export()

enemy_data.extra_zako_2_3 = new Enemy(null, 32, 400)
    .move(new vec(game_width / 2, -100), new vec(game_width / 2, game_height / 2), 0, 24, (x) => 1 - (1 - x) ** 2)
    .addf((me) => {
        bullets.push(
            ...remodel(
                [bullet_model],
                [
                    "colourful",
                    me.frame,
                    "app",
                    "ball",
                    "r",
                    4,
                    "p",
                    me.p,
                    "v",
                    new vec(6, 0).rot((2 * Math.PI * Math.floor(me.frame / 3)) / 24),
                    "ex",
                    9,
                    me.p,
                ],
            ),
        )
        me.frame++

        if (me.life <= 0) {
            explosion(me.p)
            Sound_Data.KO.play()
        }

        if (me.frame > 900) {
            me.life = 0
        }
    })
    .export()

for (let i = 0; i < 12; i++) {
    enemy_data["extra_zako_3_" + i] = new Enemy(new vec(0, (i * height) / 12), 16, 8)
        .addf((me) => {
            me.p.x = [me.frame * 2, game_width - me.frame * 2][i % 2]

            if (me.frame % 1 == 0) {
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "colourful",
                            me.frame,
                            "app",
                            "ball",
                            "r",
                            4,
                            "p",
                            me.p,
                            "v",
                            new vec(6, 0).rot((2 * Math.PI * Math.floor(me.frame / 3)) / 24),
                            "ex",
                            3,
                            me.p,
                        ],
                    ),
                )
            }

            if (me.life <= 0) {
                explosion(me.p)
                Sound_Data.KO.play()
            }

            if (is_touched_wall(me.p)) {
                me.life = 0
            }

            me.frame++
        })
        .export()
}

enemy_data.extra_zako_4 = new Enemy(new vec(game_width / 2, game_height / 6), 32, 500, { is_inv: true })
    .move(new vec(0, 0), new vec(game_width / 2, game_height / 6), 0, 24)
    .addf((me) => {
        me.life = 500 - me.frame
        if (me.frame % 12 == 0)
            bullets.push(
                ...remodel([bullet_model], ["r", 12, "p", me.p, "v", new vec(4, 0).rot(me.frame), "ex", 19, me.p]),
            )
        me.frame++
    })
    .export()

for (let i = 0; i < 4; i++) {
    enemy_data["extra_zako_4_" + i] = new Enemy(null, 16, 50)
        .addf((me) => {
            me.p = new vec(game_width / 2, game_height / 6).add(
                new vec(100, 0).rot((Math.PI / 2) * i + (2 * Math.PI * (me.frame - 18 * i)) / 60),
            )

            if (me.frame % 4 == 0) {
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "colourful",
                            me.frame + 100 * i,
                            "p",
                            me.p,
                            "v",
                            new vec(6, 0).rot(me.frame / 12 + me.life),
                            "ex",
                            15,
                            me.p,
                        ],
                    ),
                )
            }

            me.frame++

            if (me.life <= 0) {
                Sound_Data.KO.play()
                scene_main.scoring(me.maxlife ** 2)
                explosion(me.p)
            }
        })
        .export()
}

enemy_data.laninamivir_0 = new Enemy(new vec(game_width / 2, 100), 56, 300, {
    is_boss: true,
})
    .addf((me) => {
        me.p.x = Math.sin((2 * Math.PI * me.frame) / 144) * 100 + game_width / 2

        if (me.frame % 12 == 0)
            bullets.push(
                ...remodel(
                    [bullet_model],
                    ["app", "ofuda", "colourful", me.frame, "p", me.p, "v", new vec(0, 12), "ex", 63, me.p],
                ),
            )
        else if (me.frame % 12 == 6)
            bullets.push(
                ...remodel(
                    [bullet_model],
                    ["app", "ofuda", "colourful", me.frame, "p", me.p, "v", new vec(0, 12), "ex", 64, me.p],
                ),
            )

        if (me.frame % 12 == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    ["colour", "purple", "r", 4, "p", me.p, "v", new vec(0, 12), "aim", player.p, "heart", 2],
                ),
            )
        } else if (me.frame % 24 == 6) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colour",
                        "pink",
                        "r",
                        4,
                        "p",
                        me.p,
                        "v",
                        new vec(0, 6),
                        "aim",
                        player.p,
                        "rot",
                        Math.PI / 16,
                        "heart",
                        3,
                    ],
                ),
            )
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
    .move(null, new vec(game_width / 2, 100), 0, 60, (x) => x ** 2)
    .addv("angle", 0)
    .addf((me) => {
        for (let i = 0; i < 4; i++) {
            // bullets.push(...remodel([bullet_model], ["app", "ofuda", "hakkyou_colourful", me.frame, "p", me.p, "v", new vec(-6, 0).rot(me.angle)]))
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "app",
                        "ofuda",
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec(-6, 0).rot((Math.PI * me.angle * 49) / 180),
                    ],
                ),
            )
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "app",
                        "ofuda",
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec(-6, 0).rot((-Math.PI * me.angle * 49) / 180),
                    ],
                ),
            )
            me.angle++
        }
        Sound_Data.bullet1.play()

        me.frame++

        if (me.life <= 0) {
            make_bullets_into_score()
            Sound_Data.KO.play()
            scene_main.scoring(me.maxlife ** 2)
            next_enemies.push({ ...enemy_data["laninamivir_2"] })
            next_enemies.push({ ...enemy_data["laninamivir_2_0"] })
            next_enemies.push({ ...enemy_data["laninamivir_2_1"] })
        }
    })
    .export()

enemy_data.laninamivir_2 = new Enemy(new vec(game_width / 2, 100), 56, 400, {
    is_boss: true,
})
    .addf((me) => {
        if (me.frame % 4 == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "app",
                        "ofuda",
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec(0, 12),
                        "aim",
                        player.p,
                        "frame",
                        0,
                        "f",
                        (me0) => {
                            if (me0.frame % 60 < 30) {
                                me0.v = me0.v.rot(Math.PI / 120)
                            } else {
                                me0.v = me0.v.rot(-Math.PI / 120)
                            }

                            me0.frame++

                            // next_bullets.push(
                            //     ...remodel(
                            //         [bullet_model],
                            //         ["colour", me0.colour, "r", 4, "p", me0.p, "v", me0.v, "delete", 1, "heart", 2],
                            //     ),
                            // )
                        },
                        "ex",
                        16,
                        me.p,
                    ],
                ),
            )
        }

        if (me.life <= 0) {
            make_bullets_into_score()
            enemies.forEach((e) => {
                e.life = 0
            })
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
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "app",
                            "ofuda",
                            "colourful",
                            me.frame,
                            "p",
                            me.p,
                            "v",
                            new vec(0, 6),
                            "aim",
                            player.p,
                            "sim",
                            12,
                            12,
                        ],
                    ),
                )
            }

            me.frame++
        })
        .export()
}

enemy_data.laninamivir_3 = new Enemy(null, 56, 300, { is_boss: true })
    .move(null, new vec(game_width / 2, 100), 0, 60, (x) => x ** 2)
    .addf((me) => {
        if (me.frame % 18 <= 4) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colour",
                        "pink",
                        "app",
                        "ofuda",
                        "p",
                        me.p,
                        "v",
                        new vec(8, 0),
                        "rot",
                        (me.frame * Math.PI) / 480,
                        "ex",
                        63,
                        me.p,
                    ],
                ),
            )
        } else if (18 / 2 <= me.frame % 18 && me.frame % 18 <= 18 / 2 + 4) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colour",
                        "purple",
                        "app",
                        "ofuda",
                        "p",
                        me.p,
                        "v",
                        new vec(8, 0),
                        "rot",
                        (-me.frame * Math.PI) / 480,
                        "ex",
                        63,
                        me.p,
                    ],
                ),
            )
        }

        me.frame++

        if (me.life <= 0) {
            make_bullets_into_score()
            Sound_Data.KO.play()
            scene_main.scoring(me.maxlife ** 2)
            enemy_vrs.p = me.p
            next_enemies.push({ ...enemy_data["laninamivir_4"] })
        }
    })
    .export()

enemy_data.laninamivir_4 = new Enemy(null, 56, 1200, { is_boss: true })
    .move(null, new vec(game_width / 2, game_height / 2), 0, 60, (x) => x ** 2)
    .addf((me) => {
        // me.p.x = Math.cos(me.frame / 144 * Math.PI) * game_width / 2 + game_width / 2
        if (me.frame >= 60) {
            if ((me.frame - 60) % 288 == 0) {
                next_enemies.push(
                    new Enemy(me.p.add(100, 0), 24, 144, { is_inv: true })
                        .addf((me0) => {
                            me0.p.x = me.p.x + Math.cos(((Math.PI * 2) / 144) * me0.life) * 100
                            me0.p.y = me.p.y + Math.sin(((Math.PI * 2) / 144) * me0.life) * 100

                            if (me0.life > 0) {
                                bullets.push(
                                    ...remodel(
                                        [bullet_model],
                                        [
                                            "colourful",
                                            me0.life * 2,
                                            "p",
                                            me0.p,
                                            "v",
                                            new vec(12, 0).rot(((-2 * Math.PI) / 144) * me0.life),
                                        ],
                                    ),
                                )
                            }
                            me0.life--
                        })
                        .export(),

                    new Enemy(me.p.add(100, 0), 24, 144, { is_inv: true })
                        .addf((me0) => {
                            me0.p.x = me.p.x - Math.cos(((Math.PI * 2) / 144) * me0.life) * 100
                            me0.p.y = me.p.y - Math.sin(((Math.PI * 2) / 144) * me0.life) * 100

                            if (me0.life > 0) {
                                bullets.push(
                                    ...remodel(
                                        [bullet_model],
                                        [
                                            "colourful",
                                            me0.life * 2,
                                            "p",
                                            me0.p,
                                            "v",
                                            new vec(12, 0).rot(((2 * Math.PI) / 144) * me0.life),
                                        ],
                                    ),
                                )
                            }
                            me0.life--
                        })
                        .export(),
                )
            } else if ((me.frame - 60) % 288 == 144) {
                next_enemies.push(
                    new Enemy(me.p.add(100, 0), 24, 144, { is_inv: true })
                        .addf((me0) => {
                            me0.p.x = me.p.x + Math.cos(((Math.PI * 2) / 144) * me0.life) * 100
                            me0.p.y = me.p.y + Math.sin(((Math.PI * 2) / 144) * me0.life) * 100
                            if (me0.life > 0) {
                                bullets.push(
                                    ...remodel(
                                        [bullet_model],
                                        [
                                            "colourful",
                                            me0.life * 2,
                                            "p",
                                            me0.p,
                                            "v",
                                            new vec(12, 0).rot(((2 * Math.PI) / 144) * me0.life),
                                        ],
                                    ),
                                )
                            }
                            me0.life--
                        })
                        .export(),

                    new Enemy(me.p.add(100, 0), 24, 144, { is_inv: true })
                        .addf((me0) => {
                            me0.p.x = me.p.x - Math.cos(((Math.PI * 2) / 144) * me0.life) * 100
                            me0.p.y = me.p.y - Math.sin(((Math.PI * 2) / 144) * me0.life) * 100
                            if (me0.life > 0) {
                                bullets.push(
                                    ...remodel(
                                        [bullet_model],
                                        [
                                            "colourful",
                                            me0.life * 2,
                                            "p",
                                            me0.p,
                                            "v",
                                            new vec(12, 0).rot(((-2 * Math.PI) / 144) * me0.life),
                                        ],
                                    ),
                                )
                            }
                            me0.life--
                        })
                        .export(),
                )
            }

            if (me.frame % 2 == 0)
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "app",
                            "ofuda",
                            "colourful",
                            Math.random() * 180,
                            "p",
                            me.p,
                            "v",
                            new vec(4, 0).rot(me.frame / 24),
                            "ex",
                            5,
                            me.p,
                        ],
                    ),
                )
        }

        if (me.life <= 0) {
            make_bullets_into_score()
            Sound_Data.KO.play()
            scene_main.scoring(me.maxlife ** 2)
            enemies.forEach((e) => {
                e.life = 0
            })
            next_bullets = []

            enemy_vrs.p = me.p
            Sound_Data.hakkyou.play()
            next_enemies.push({ ...enemy_data["laninamivir_5"] })
        }

        me.frame++
    })
    .export()

enemy_data.laninamivir_5 = new Enemy(null, 56, 2000, { is_boss: true })
    .move(null, new vec(game_width / 2, 100), 0, 60, (x) => x ** 2)
    .addv("angle", 0)
    .addf((me) => {
        if (me.frame >= 60) {
            for (let i = 0; i < 8; i++) {
                // bullets.push(...remodel([bullet_model], ["app", "ofuda", "hakkyou_colourful", me.frame, "p", me.p, "v", new vec(-6, 0).rot(me.angle)]))
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "app",
                            "ofuda",
                            "hakkyou_colourful",
                            me.frame,
                            "p",
                            me.p,
                            "v",
                            new vec(-3, 0).rot(me.angle / 2),
                        ],
                    ),
                )
                if (me.life <= me.maxlife / 2 && me.frame % 2 == 0) {
                    bullets.push(
                        ...remodel(
                            [bullet_model],
                            [
                                "app",
                                "ofuda",
                                "hakkyou_colourful",
                                me.frame,
                                "p",
                                me.p,
                                "v",
                                new vec(-6, 0).rot(-me.angle),
                            ],
                        ),
                    )
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
            scene_main.continue_story()
            // next_enemies.push({ ...enemy_data["laninamivir_4"] })
        }
    })
    .export()
