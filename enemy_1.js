enemy_data.phenetylalcohol_0 = new Enemy(new vec(game_width / 2, 100), 56, 600, { is_boss: true })
    .addf((me) => {
        if (me.frame % 2 == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colour",
                        "purple",
                        "r",
                        8,
                        "p",
                        me.p,
                        "v",
                        new vec(0, 12).rot((Math.PI / 12) * Math.sin((Math.PI / 48) * me.frame)),
                        "ex",
                        16,
                        me.p,
                    ],
                ),
            )

            if (me.frame % 12 == 0) {
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "r",
                            2,
                            "app",
                            "ball",
                            "colourful",
                            me.frame,
                            "r",
                            4,
                            "p",
                            me.p,
                            "v",
                            new vec(0, 12),
                            "aim",
                            player.p,
                            "flower",
                            16,
                            5,
                        ],
                    ),
                )
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
    })
    .export()

enemy_data.phenetylalcohol_1 = new Enemy(new vec(game_width / 2, game_height / 6), 56, 600, { is_boss: true })
    .addf((me) => {
        me.p.x = Math.sin((2 * Math.PI * me.frame) / 288) * 100 + game_width / 2
        if (me.frame % 16 < 6) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec(0, 6),
                        "ex",
                        13,
                        me.p,
                        "rot",
                        (2 * Math.PI * me.frame) / 288,
                    ],
                ),
            )
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec(0, 6),
                        "ex",
                        13,
                        me.p,
                        "rot",
                        (-2 * Math.PI * me.frame) / 288,
                    ],
                ),
            )
        }

        if (me.frame % 24 == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    ["r", 16, "p", me.p, "v", new vec(0, 10), "aim", player.p, "nway", 3, Math.PI / 24, me.p],
                ),
            )
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
            for (let i = 0; i < 6; i++) {
                next_enemies.push({ ...enemy_data["phenetylalcohol_2_" + i] })
            }
        }
    })
    .export()

for (let i = 0; i < 6; i++) {
    const argument = Math.PI / 48
    const num = 6

    enemy_data["phenetylalcohol_2_" + i] = new Enemy(
        new vec(0, 80).rot((2 * Math.PI * i) / 6).add(new vec(game_width / 2, game_height / 2)),
        32,
        200,
    )
        .addf((me) => {
            if (me.frame % 3 == 0) {
                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "colourful",
                            me.frame,
                            "p",
                            me.p,
                            "v",
                            new vec(0, -12).rot(((2 * Math.PI) / num) * i),
                            "f",
                            (me0) => {
                                me0.v = me0.v.rot(argument)
                            },
                        ],
                    ),
                )

                bullets.push(
                    ...remodel(
                        [bullet_model],
                        [
                            "colourful",
                            me.frame,
                            "p",
                            me.p,
                            "v",
                            new vec(0, -12).rot(((2 * Math.PI) / num) * i),
                            "f",
                            (me0) => {
                                me0.v = me0.v.rot(-argument)
                            },
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

enemy_data.phenetylalcohol_2 = new Enemy(new vec(game_width / 2, game_height / 2), 56, 900, { is_boss: true })
    .addf((me) => {
        if (me.frame % 48 == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "app",
                        "laser",
                        "r",
                        0,
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec(0, 6),
                        "aim",
                        player.p,
                        "frame",
                        0,
                        "f",
                        (me0) => {
                            next_bullets.push(
                                ...remodel(
                                    [bullet_model],
                                    [
                                        "app",
                                        "laser",
                                        "colour",
                                        me0.colour,
                                        "p",
                                        me0.p,
                                        "v",
                                        new vec(0, 6).rot((Math.PI * me0.frame) / 60),
                                        "delete",
                                        0,
                                        "cross",
                                        20,
                                    ],
                                ),
                            )
                            me0.v = me0.v.rot(Math.PI / 96)
                            me0.frame++
                        },
                        "ex",
                        29,
                        me.p,
                    ],
                ),
            )
        } else if (me.frame % 48 == 24) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "app",
                        "laser",
                        "r",
                        0,
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec(0, 6),
                        "aim",
                        player.p,
                        "frame",
                        0,
                        "f",
                        (me0) => {
                            next_bullets.push(
                                ...remodel(
                                    [bullet_model],
                                    [
                                        "app",
                                        "laser",
                                        "colour",
                                        me0.colour,
                                        "p",
                                        me0.p,
                                        "v",
                                        new vec(0, 6).rot((Math.PI * me0.frame) / 60),
                                        "delete",
                                        0,
                                        "cross",
                                        20,
                                    ],
                                ),
                            )
                            me0.v = me0.v.rot(-Math.PI / 96)
                            me0.frame++
                        },
                        "ex",
                        29,
                        me.p,
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
            explosion(me.p)

            enemies = []

            next_enemies.push({ ...enemy_data["phenetylalcohol_3"] })
        }
    })
    .export()

enemy_data.phenetylalcohol_3 = new Enemy(new vec(game_width / 2, game_height / 2), 56, 1200, { is_boss: true })
    .addf((me) => {
        // me.p.y = Math.sin(2 * Math.PI * me.frame / 144) * 200 + game_height / 2

        for (let i = 0; i < 5; i++) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec(0, 6).rot((2 * Math.PI * me.frame) / 144 + (2 * Math.PI * i) / 5),
                        "wait",
                        "frame",
                        32,
                        (me0) => {
                            me0.v = me0.v.mlt(-1)
                        },
                        "delete",
                        64,
                    ],
                ),
            )
        }

        if (me.frame % 24 == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "r",
                        2,
                        "app",
                        "ball",
                        "p",
                        me.p,
                        "v",
                        new vec(0, 12),
                        "aim",
                        player.p,
                        "ex",
                        19,
                        me.p,
                        "sim",
                        6,
                        4,
                    ],
                ),
            )
        } else if (me.frame % 24 == 12) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "r",
                        2,
                        "app",
                        "ball",
                        "p",
                        me.p,
                        "v",
                        new vec(0, 12),
                        "aim",
                        player.p,
                        "ex",
                        18,
                        me.p,
                        "sim",
                        6,
                        4,
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
            explosion(me.p)

            next_enemies.push({ ...enemy_data.phenetylalcohol_4 })
        }
    })
    .export()

enemy_data.phenetylalcohol_4 = new Enemy(new vec(game_width / 2, game_height / 2), 56, 1200, { is_boss: true })
    .addf((me) => {
        if (me.frame % 8 == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec(0, 6),
                        "frame",
                        0,
                        "f",
                        (me0) => {
                            next_bullets.push(
                                ...remodel([bullet_model], ["p", me0.p, "v", me0.v, "delete", 1, "arrow", 60]),
                            )

                            if (12 < me0.frame && me0.frame < 24) {
                                me0.v = player.p.sub(me0.p).nor().mlt(6)
                            }

                            me0.frame++
                        },
                        "ex",
                        11,
                        me.p,
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
            explosion(me.p)

            next_enemies.push({ ...enemy_data.phenetylalcohol_4 })
        }
    })
    .export()

enemy_data.phenetylalcohol_5 = new Enemy(new vec(game_width / 2, game_height / 6), 56, 1200, { is_boss: true })
    .addf((me) => {
        if (me.frame % 4 == 0) {
            bullets.push(
                ...remodel(
                    [bullet_model],
                    [
                        "colourful",
                        me.frame,
                        "p",
                        me.p,
                        "v",
                        new vec(0, 6).rot((Math.PI * me.frame) / 13),
                        "ex",
                        19,
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
                        "p",
                        me.p,
                        "v",
                        new vec(0, 6).rot((-Math.PI * me.frame) / 13),
                        "ex",
                        19,
                        me.p,
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
            explosion(me.p)

            next_enemies.push({ ...enemy_data.laninamivir_0 })
        }
    })
    .export()
