enemy_data.zako_0 = new Enemy(null, 16, 30)
    .addf((me) => {
        me.p = circular_move(new vec(0, 0), me.frame, 300, 4 * 120)
        if (me.frame % [36, 24, 12, 6][difficulty] == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec([6, 12, 12, 12][difficulty], 0),
                        "aim",
                        player.p,
                        "nway",
                        [1, 3, 7, 11][difficulty],
                        Math.PI / 12,
                        me.p,
                    ],
                ),
            )
            Sound_Data.bullet0.play()
        }

        me.frame++

        if (me.life <= 0) {
            Sound_Data.KO.play()
            explosion(me.p)
            scene_main.scoring(me.maxlife ** 2)
        }

        if (me.p.x < 0 || game_width < me.p.x) {
            me.life = 0
        }
    })
    .export()

enemy_data.zako_1 = new Enemy(null, 16, 30)
    .addf((me) => {
        me.p = circular_move(new vec(game_width, 0), -me.frame, -300, 4 * 120)

        if (me.frame % [36, 24, 12, 6][difficulty] == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec([6, 12, 12, 12][difficulty], 0),
                        "aim",
                        player.p,
                        "nway",
                        [1, 3, 7, 11][difficulty],
                        Math.PI / 12,
                        me.p,
                    ],
                ),
            )
            Sound_Data.bullet0.play()
        }

        me.frame++

        if (me.life <= 0) {
            Sound_Data.KO.play()
            explosion(me.p)
            scene_main.scoring(me.maxlife ** 2)
        }

        if (me.p.x < 0 || game_width < me.p.x) {
            me.life = 0
        }
    })
    .export()

enemy_data.zako_2 = new Enemy(null, 32, 200)
    .move(null, new vec(game_width / 2, game_height / 6), 0, 24, (x) => 1 - (x - 1) ** 2)
    .addf((me) => {
        if (24 < me.frame && me.frame < 144 && me.frame % [24, 12, 6, 3][difficulty] == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec([6, 12, 12, 12][difficulty], 0),
                        "aim",
                        player.p,
                        "nway",
                        7,
                        Math.PI / 16,
                        me.p,
                    ],
                ),
            )
            Sound_Data.bullet0.play()
        }

        me.frame++

        if (me.life <= 0) {
            Sound_Data.KO.play()
            explosion(me.p)
            scene_main.scoring(me.maxlife ** 2)
        }

        if (me.p.y > game_height) {
            me.life = 0
        }
    })
    .move(null, new vec(game_width / 2, game_height + 100), 144, 240, (x) => x ** 2)
    .export()

for (let i = 0; i < 4; i++) {
    enemy_data["zako_3_" + 2 * i] = new Enemy(new vec(game_width, (game_height / 8) * i + 20), 16, 30)
        .addf((me) => {
            me.p = me.p.add(new vec(-4, 0))

            if (me.frame % [36, 24, 12, 6][difficulty] == 0) {
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "app",
                            "laser",
                            "colourful",
                            me.frame,
                            "r",
                            2,
                            "p",
                            me.p,
                            "v",
                            new vec([3, 6, 6, 6][difficulty], 0),
                            "aim",
                            player.p,
                            "arrow",
                            20,
                        ],
                    ),
                )
            }

            me.frame++

            if (me.life <= 0) {
                Sound_Data.KO.play()
                explosion(me.p)
                scene_main.scoring(me.maxlife ** 2)
            }

            if (me.p.x < 0) {
                me.life = 0
            }
        })
        .export()

    enemy_data["zako_3_" + (2 * i + 1)] = new Enemy(new vec(0, (game_height / 8) * (i + 0.5) + 20), 16, 30)
        .addf((me) => {
            me.p = me.p.add(new vec(4, 0))

            if (me.frame % [36, 24, 12, 6][difficulty] == 0) {
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "app",
                            "laser",
                            "colourful",
                            me.frame,
                            "r",
                            2,
                            "p",
                            me.p,
                            "v",
                            new vec([3, 6, 6, 6][difficulty], 0),
                            "aim",
                            player.p,
                            "arrow",
                            20,
                        ],
                    ),
                )
            }

            me.frame++

            if (me.life <= 0) {
                Sound_Data.KO.play()
                explosion(me.p)
                scene_main.scoring(me.maxlife ** 2)
            }

            if (me.p.x > game_width) {
                me.life = 0
            }
        })
        .export()
}

for (let i = 0; i < 8; i++) {
    enemy_data["zako_4_" + i * 2] = new Enemy(new vec((game_width / 4) * i + 20, 0), 16, 20)
        .addf((me) => {
            me.p = me.p.add(new vec(0, 4))

            if (me.frame % [48, 24, 12, 6][difficulty] == 0) {
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "app",
                            "laser",
                            "colourful",
                            me.frame,
                            "r",
                            2,
                            "p",
                            me.p,
                            "v",
                            new vec([3, 6, 6, 6][difficulty], 0),
                            "aim",
                            player.p,
                            "arrow",
                            20,
                        ],
                    ),
                )
                Sound_Data.bullet0.play()
            }

            me.frame++

            if (me.life <= 0) {
                Sound_Data.KO.play()
                explosion(me.p)
                scene_main.scoring(me.maxlife ** 2)
            }

            if (me.p.y > game_height) {
                me.life = 0
            }
        })
        .export()

    enemy_data["zako_4_" + (i * 2 + 1)] = new Enemy(new vec((game_width / 4) * (i + 0.5) + 20, game_height), 16, 20)
        .addf((me) => {
            me.p = me.p.add(new vec(0, -4))

            if (me.frame % [36, 24, 12, 6][difficulty] == 0) {
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "app",
                            "laser",
                            "colourful",
                            me.frame,
                            "r",
                            2,
                            "p",
                            me.p,
                            "v",
                            new vec([3, 6, 6, 6][difficulty], 0),
                            "aim",
                            player.p,
                            "arrow",
                            20,
                        ],
                    ),
                )
                Sound_Data.bullet0.play()
            }

            me.frame++

            if (me.life <= 0) {
                Sound_Data.KO.play()
                explosion(me.p)
                scene_main.scoring(me.maxlife ** 2)
            }

            if (me.p.y < 0) {
                me.life = 0
            }
        })
        .export()
}

for (let i = 0; i < 3; i++) {
    enemy_data["zako_5_" + i] = new Enemy(null, 16, 60)
        .move(null, new vec(game_width / 2 + 120 * (i - 1), game_height / 6), 0, 24)
        .addf((me) => {
            if (24 < me.frame && me.frame < 200 && me.frame % [48, 24, 18, 12][difficulty] == 0) {
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "colourful",
                            me.frame,
                            "p",
                            me.p,
                            "v",
                            new vec([6, 12, 12, 12][difficulty], 0),
                            "aim",
                            player.p,
                            "sim",
                            3,
                            [3, 6, 6, 6][difficulty],
                            "nway",
                            [3, 5, 7, 9][difficulty],
                            Math.PI / 12,
                            me.p,
                        ],
                    ),
                )
                Sound_Data.bullet1.play()
            }
            me.frame++

            if (me.life <= 0) {
                explosion(me.p)
                Sound_Data.KO.play()
                scene_main.scoring(me.maxlife ** 2)
            }

            if (me.p.y > game_height) {
                me.life = 0
            }
        })
        .move(null, new vec(game_width / 2, game_height + 100), 144, 288, (x) => x ** 2)
        .export()
}

enemy_data.zako_7 = new Enemy(null, 32, 695, { is_inv: true })
    .move(null, new vec(game_width / 2, game_height / 6), 0, 24, (x) => 1 - (x - 1) ** 2)
    .addf((me) => {
        me.life = 695 - me.frame
        me.p.x = (game_width / 3) * Math.sin((me.frame * 2 * Math.PI) / 240) + game_width / 2

        bullets.push(
            ...remodel(
                [bullet_model],
                ["colourful", me.frame, "p", me.p, "v", new vec(12, 0), "ex", [8, 12, 14, 16][difficulty], me.p],
            ),
        )
        Sound_Data.bullet1.play()

        if (me.frame % [24, 24, 12, 12][difficulty] == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "r",
                        12,
                        "life",
                        2,
                        "p",
                        me.p,
                        "v",
                        new vec(6, 0),
                        "bound",
                        "aim",
                        new vec(-player.p.x, player.p.y),
                        "nway",
                        [1, 3, 5, 5][difficulty],
                        Math.PI / 12,
                        me.p,
                    ],
                ),
            )
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "r",
                        12,
                        "life",
                        2,
                        "p",
                        me.p,
                        "v",
                        new vec(6, 0),
                        "bound",
                        "aim",
                        new vec(game_width * 2 - player.p.x, player.p.y),
                        "nway",
                        [1, 3, 5, 5][difficulty],
                        Math.PI / 12,
                        me.p,
                    ],
                ),
            )
            Sound_Data.bullet0.play()
        }

        me.frame++
        if (me.life <= 0) {
            make_bullets_into_score()
            explosion(me.p)
            Sound_Data.KO.play()
            scene_main.scoring(me.maxlife ** 2)
        }
    })
    .export()

enemy_data.ethanol_m1 = new Enemy(null, 56, 200, {
    is_boss: true,
    is_inv: true,
})
    .move(new vec(game_width + 100, -100), new vec(game_width / 2, game_height / 6), 0, 48, (x) => 1 - (x - 1) ** 2)
    .addf((me) => {
        me.frame++
    })
    .export()

enemy_data.ethanol_0 = new Enemy(new vec(game_width, game_height / 6), 56, 240, { is_boss: true })
    .addf((me) => {
        me.p.x = (game_width / 3) * Math.sin((me.frame * 2 * Math.PI) / 120) + game_width / 2

        if (me.frame % 6 == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec([6, 12, 12, 12][difficulty], 0),
                        "ex",
                        [6, 12, 18, 24][difficulty],
                        me.p,
                        "rot",
                        Math.PI / [6, 12, 18, 24][difficulty],
                    ],
                ),
            )
            Sound_Data.bullet0.play()
        } else if (me.frame % 6 == 3) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec([6, 12, 12, 12][difficulty], 0),
                        "ex",
                        [6, 12, 18, 24][difficulty],
                        me.p,
                    ],
                ),
            )
            Sound_Data.bullet0.play()
        }

        me.frame++

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
    .move(null, new vec(game_width / 2, (game_height * 5) / 6), 0, 48, (x) => x ** 2)
    .addf((me) => {
        if (me.frame < 48) {
            for (let i = 0; i < 7; i++) {
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "r",
                            6,
                            "colourful",
                            me.frame,
                            "p",
                            new vec(game_width / 2 + 60 * (i - 3), me.p.y - 60),
                            "v",
                            new vec(0, -1),
                            "delete",
                            1,
                            "arrow",
                            64,
                        ],
                    ),
                )
            }
        } else {
            me.p.x = (game_width / 3) * Math.sin(((me.frame - 48) * 2 * Math.PI) / 120) + game_width / 2

            if (me.frame % [24, 16, 8, 4][difficulty] == 0) {
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "colourful",
                            me.frame,
                            "r",
                            15,
                            "p",
                            me.p,
                            "v",
                            new vec(0, -[3, 6, 6, 6][difficulty]),
                            "aim",
                            player.p,
                            "nway",
                            7,
                            Math.PI / 24,
                            me.p,
                        ],
                    ),
                )
                Sound_Data.bullet1.play()
            }
        }

        me.frame++
        if (me.life <= 0) {
            make_bullets_into_score()
            next_enemies.push(
                { ...enemy_data["ethanol_2"] },
                { ...enemy_data["ethanol_2_0"] },
                { ...enemy_data["ethanol_2_1"] },
            )
            enemy_vrs.p = me.p
            Sound_Data.KO.play()
            scene_main.scoring(me.maxlife ** 2)
        }
    })
    .export()

for (let i = 0; i < 2; i++) {
    enemy_data["ethanol_2_" + i] = new Enemy(null, 56, 160)
        .move(null, new vec(game_width / 2, game_height / 2), 0, 48, (x) => x ** 2)
        .scale(56, 32, 0, 48, (x) => x)
        .addf((me) => {
            if (me.frame > 48) {
                me.p.x =
                    (game_width / 3) *
                        Math.sin(((2 * i - 1) * (me.frame - 48) * 2 * Math.PI) / [240, 120, 90, 60][difficulty]) +
                    game_width / 2

                if (me.frame % [6, 4, 2, 1][difficulty] == 0) {
                    bullets.push(
                        ...remodel(
                            [bullet_model],
                            ["colourful", me.frame, "p", me.p, "v", new vec(0, -[3, 6, 6, 6][difficulty])],
                        ),
                    )
                    bullets.push(
                        ...remodel(
                            [bullet_model],
                            ["colourful", me.frame, "p", me.p, "v", new vec(0, [3, 6, 6, 6][difficulty])],
                        ),
                    )
                    Sound_Data.bullet1.play()
                }
            }

            me.frame++
            if (me.life <= 0) {
                Sound_Data.KO.play()
                explosion(me.p)
                scene_main.scoring(me.maxlife ** 2)
            }
        })
        .export()
}

enemy_data.ethanol_2 = new Enemy(null, 56, 600, { is_boss: true })
    .move(null, new vec(game_width / 2, game_height / 2), 0, 48, (x) => x ** 2)
    .addf((me) => {
        if (me.frame > 48 && me.frame % [24, 24, 12, 12][difficulty] == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "app",
                        "laser",
                        "colourful",
                        me.frame,
                        "r",
                        2,
                        "p",
                        me.p,
                        "v",
                        new vec(0, [3, 6, 6, 6][difficulty]),
                        "aim",
                        player.p,
                        "nway",
                        [1, 3, 3, 3][difficulty],
                        Math.PI / 12,
                        me.p,
                        "arrow",
                        30,
                    ],
                ),
            )
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "app",
                        "laser",
                        "colourful",
                        me.frame,
                        "r",
                        2,
                        "p",
                        me.p,
                        "v",
                        new vec(0, [3, 6, 6, 6][difficulty]),
                        "aim",
                        player.p,
                        "do",
                        (me) => {
                            me.v.y *= -1
                        },
                        "nway",
                        [1, 3, 3, 3][difficulty],
                        Math.PI / 12,
                        me.p,
                        "arrow",
                        30,
                    ],
                ),
            )
            Sound_Data.bullet0.play()
        }

        me.frame++

        if (me.life <= 0) {
            make_bullets_into_score()
            enemies = []
            next_enemies.push({ ...enemy_data["ethanol_3"] })
            for (let i = 0; i < 4; i++) {
                next_enemies.push({ ...enemy_data["ethanol_3_" + i] })
            }
            enemy_vrs.p = me.p
            Sound_Data.KO.play()
            scene_main.scoring(me.maxlife ** 2)
        }
    })
    .export()

for (let i = 0; i < 4; i++) {
    enemy_data["ethanol_3_" + i] = new Enemy(null, 32, 160)
        .move(
            new vec(game_width / 2, game_height / 2),
            new vec(game_width / 2, game_height / 2).add(new vec(120, 0).rot((Math.PI / 2) * i)),
            0,
            24,
            (x) => x ** 2,
        )
        .scale(56, 32, 0, 24, (x) => x)
        .move(
            new vec(game_width / 2, game_height / 2).add(new vec(120, 0).rot((Math.PI / 2) * i)),
            new vec(game_width / 2, game_height / 5).add(new vec(120, 0).rot((Math.PI / 2) * i)),
            25,
            48,
            (x) => x ** 2,
        )
        .addf((me) => {
            if (me.frame > 48) {
                me.p = circular_move(
                    new vec(game_width / 2, game_height / 5),
                    me.frame - 48,
                    120,
                    144,
                    (Math.PI / 2) * i,
                )
                if (me.frame % [24, 24, 12, 12][difficulty] == 0) {
                    bullets.push(
                        ...remodel(
                            [bullet_model],
                            [
                                "app",
                                "laser",
                                "colourful",
                                me.frame,
                                "r",
                                2,
                                "p",
                                me.p,
                                "v",
                                new vec(0, [6, 12, 12, 12][difficulty]),
                                "aim",
                                player.p,
                                "arrow",
                                30,
                            ],
                        ),
                    )
                }
            }

            me.frame++
            if (me.life <= 0) {
                Sound_Data.KO.play()
                explosion(me.p)
                scene_main.scoring(me.maxlife ** 2)
            }
        })
        .export()
}

enemy_data.ethanol_3 = new Enemy(null, 56, 600, { is_boss: true })
    .move(null, new vec(game_width / 2, game_height / 2), 0, 24, (x) => x ** 2)
    .move(new vec(game_width / 2, game_height / 2), new vec(game_width / 2, game_height / 5), 25, 48, (x) => x ** 2)
    .addf((me) => {
        if (me.frame > 48 && me.frame % [18, 12, 9, 6][difficulty] == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec(0, [6, 12, 12, 12][difficulty]),
                        "aim",
                        player.p,
                        "ex",
                        32,
                        me.p,
                    ],
                ),
            )
            Sound_Data.bullet0.play()
        }

        me.frame++

        if (me.life <= 0) {
            make_bullets_into_score()
            enemies = []
            next_enemies.push({ ...enemy_data["ethanol_4"] })
            for (let i = 0; i < 12; i++) {
                next_enemies.push({ ...enemy_data["ethanol_4_" + i] })
            }
            enemy_vrs.p = me.p
            Sound_Data.KO.play()
            scene_main.scoring(me.maxlife ** 2)
        }
    })
    .export()

for (let i = 0; i < 12; i++) {
    enemy_data["ethanol_4_" + i] = new Enemy(null, 56, 160)
        .move(
            null,
            new vec(game_width / 2, game_height / 2).add(new vec(90, 0).rot((2 * Math.PI * i) / 12)),
            0,
            60,
            (x) => x ** 2,
        )
        .scale(56, 32, 0, 60, (x) => x)
        .addf((me) => {
            if (me.frame > 60) {
                me.p.x = game_width / 2
                me.p.y = game_height / 2 - (Math.sin((2 * Math.PI * (me.frame - 60)) / 240) * game_height) / 3
                me.p = me.p.add(new vec(90, 0).rot((2 * Math.PI * i) / 12 + (me.frame - 60) / 36))

                if (me.frame % [12, 8, 4, 1][difficulty] == 0) {
                    bullets.push(
                        ...remodel(
                            [bullet_model],
                            [
                                "colourful",
                                me.frame,
                                "p",
                                me.p,
                                "v",
                                new vec(0, [6, 12, 12, 12][difficulty]),
                                "aim",
                                player.p,
                            ],
                        ),
                    )
                    Sound_Data.bullet1.play()
                }
            }

            me.frame++
            if (me.life <= 0) {
                Sound_Data.KO.play()
                explosion(me.p)
                scene_main.scoring(me.maxlife ** 2)
            }
        })
        .export()
}

enemy_data.ethanol_4 = new Enemy(null, 56, 600, { is_boss: true })
    .move(null, new vec(game_width / 2, game_height / 2), 0, 60, (x) => x ** 2)
    .addf((me) => {
        if (me.frame > 60) {
            me.p.y = game_height / 2 - (Math.sin((2 * Math.PI * (me.frame - 60)) / 240) * game_height) / 3

            if (me.frame % [48, 36, 24, 12][difficulty] == 0) {
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "app",
                            "laser",
                            "colourful",
                            me.frame,
                            "r",
                            2,
                            "p",
                            me.p,
                            "v",
                            new vec(0, [6, 12, 12, 12][difficulty]),
                            "aim",
                            player.p,
                            "arrow",
                            30,
                            "ex",
                            [16, 24, 32, 40][difficulty],
                            me.p,
                        ],
                    ),
                )
                Sound_Data.bullet0.play()
            }
        }

        me.frame++
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
                for (let i = 0; i < 4; i++) {
                    explosion(me.p, 3)
                }
                scene_main.story_num += 4
                scene_main.continue_story()
            }
        }
    })
    .export()

enemy_data.ethanol_5 = new Enemy(null, 56, 3000, { is_boss: true })
    .addv("angle", 0)
    .move(null, new vec(game_width / 2, game_height / 2), 0, 60, (x) => x ** 2)
    .addf((me) => {
        if (me.frame > 60) {
            if (me.frame % 2 == 0) {
                me.angle += 6
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "hakkyou_colourful",
                            me.frame,
                            "p",
                            me.p,
                            "v",
                            new vec(0, 6).rot((me.angle * Math.PI) / 180),
                            "ex",
                            9,
                            me.p,
                        ],
                    ),
                )
                Sound_Data.bullet1.play()
            } else if (me.life < me.maxlife / 2) {
                me.angle += 6
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "hakkyou_colourful",
                            me.frame - 120,
                            "p",
                            me.p,
                            "v",
                            new vec(0, 6).rot((-me.angle * Math.PI) / 180),
                            "ex",
                            9,
                            me.p,
                        ],
                    ),
                )
                Sound_Data.bullet1.play()
            }
        }

        me.frame++
        if (me.life <= 0) {
            make_bullets_into_score(12)
            enemy_vrs.p = me.p
            Sound_Data.KO.play()
            for (let i = 0; i < 4; i++) {
                explosion(me.p, 3)
            }
            scene_main.continue_story()
            scene_main.scoring(me.maxlife ** 2)
        }
    })
    .export()
