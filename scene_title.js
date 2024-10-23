const scene_title = new (class extends Scene {
    constructor() {
        super()

        const key = ["up", "down", "right", "left", "slow", "dash", "turn", "retry", "Reset", "Back"]

        Image_Data.ethanolSD = new Iimage("images/EthanolSD.png", 44, 170, 36, 36)

        this.sc = { frame: 0, current_value: 0 }

        this.option = {
            "": ["PLAY", "MANUAL", "STORY", "ACHIEVEMENTS", "KEY CONFIG", "CREDIT"],
            "0": ["Tutorial", "Stage0", "Stage1", "Extra"],
            "0[1-2]": ["Easy", "Normal", "Hard", "Insane!"],
            "3": Igenerator(function* () {
                for (let i = 0; i < 8; i++) {
                    yield "  " + i
                }
            }),
            "4": key,
        }

        this.loopf = {
            "0": (c) => {
                Ifont(36, "white", "serif")
                Itext5(
                    c.frame,
                    60,
                    400,
                    font_size,
                    ["Let's start here", "vs Ethanol", "Under Contruction...", "Android Girl"][c.current_value],
                )
            },
            "00": (c) => {
                difficulty = 0
                scene_main.chapter_num = 0
                scene_anten.next_scene = scene_main
                scene_manager.MoveTo(scene_anten)
            },
            "0[1-2]": (c) => {
                const stage = +c.current_branch[1]

                Ifont(36, "white", "serif")
                Itext5(
                    c.frame,
                    60,
                    400,
                    font_size,
                    ["初めての人向け", "操作を使いこなせたら", "隙間をすり抜けろ!", "テストプレイなんてしてないよ!"][
                        c.current_value
                    ],
                )
                Itext5(
                    c.frame,
                    60,
                    400 + font_size,
                    font_size,
                    "Highest Score: " + save.data.stages[stage].difficulties[c.current_value].highest_score,
                )
                Itext5(
                    c.frame,
                    60,
                    400 + font_size * 2,
                    font_size,
                    save.data.stages[stage].difficulties[c.current_value].is_cleard ? "Cleared!" : "not Cleared",
                )
            },
            "0[1-2].": (c) => {
                difficulty = +c.current_branch[2]
                scene_main.chapter_num = +c.current_branch[1]
                scene_anten.next_scene = scene_main
                scene_manager.MoveTo(scene_anten)
            },
            "03": (c) => {
                difficulty = 0
                scene_main.chapter_num = 3
                scene_anten.next_scene = scene_main
                scene_manager.MoveTo(scene_anten)
            },
            "1": (c) => {
                Ifont(24, "white", "serif")
                Itext5(
                    c.frame * 4,
                    20,
                    200,
                    font_size,
                    "・十字キーで移動<br>・Shiftキーで低速 <br>" +
                        "・Aで後ろを向く <br>・Ctrlで0.5秒ダッシュ(ダッシュ中は無敵) <br>" +
                        "・赤い点が当たり判定 <br>" +
                        "・白い円がかすり判定 <br>" +
                        "・Escでポーズ <br>" +
                        "・敵に近づくほど攻撃力が上がる!(最大3倍)<br>" +
                        "・HPバーが赤い敵は無敵!持久力勝負だぜ!<br>" +
                        "・8回まで逝ける<br>" +
                        "・重くて動かないよ!って人は <br> BrightenをOFFしてください <br>[X]",
                )
            },
            "2": (c) => {
                Ifont(36, "white", "serif")
                Itext5(
                    c.frame,
                    20,
                    200,
                    font_size,
                    "警視庁公安部対天使科実動隊のコハクは<br>今夜も天使の気配を感じて夜の東京を<br>飛翔するのであった...[X]",
                )
            },
            "3": (c) => {
                Image_Data.ethanolSD.height = 36 * this.achive.length
                Image_Data.ethanolSD.repeat_y = this.achive.length

                Image_Data.ethanolSD.draw()

                Ifont(24, "white", "serif")
                Itext5(null, 150, 200, font_size, this.achive[c.current_value])
            },
            "3.": (c) => {
                Ifont(24, "white", "serif")
                Itext5(null, 150, 200, font_size, this.achive[c.current_branch.charAt(1)])
            },
            "4": (c) => {
                Itext4(
                    c.frame * 2,
                    220,
                    200,
                    font_size,
                    Igenerator(function* () {
                        for (let i = 0; i < key.length; i++) {
                            yield key_config.data[key[i]]
                        }
                    }),
                )
            },
            "4[0-7]": (c) => {
                Itext(null, 20, 200, "Press the key you want to use!")
                if (c.frame > 0 && pushed.length > 0) {
                    key_config.data[key[c.current_branch.charAt(1)]] = pushed[0]
                    key_config.save()

                    c.cancel = true
                }
            },
            "48": (c) => {
                key_config.reset()
                key_config.save()
                c.cancel = true
            },
            "49": (c) => {
                c.current_branch = ""
            },
            "5": (c) => {
                Ifont(24, "white", "serif")
                Itext6(
                    c.frame * 2,
                    20,
                    200,
                    font_size,
                    "制作: お躁式ラケッツ! <link>https://www.nicovideo.jp/user/131397716<br>" +
                        "効果音: 効果音ラボ <link>https://soundeffect-lab.info<br>" +
                        "背景、キャラクター: Craiyon <link>https://www.craiyon.com<br>[X]",
                )
            },
        }

        Sound_Data.ok = new Iaudio("./sounds/ok.wav")
        Sound_Data.cancel = new Iaudio("./sounds/cancel.wav")
        Sound_Data.select = new Iaudio("./sounds/select.wav")
        Sound_Data.whimsicalness = new IBGM("./sounds/Whimsicalness.wav")
        Sound_Data.whimsicalness.volume = 0.7

        this.mn = [3, 1]
    }

    start() {
        fpsInterval = 1000 / 18
        this.frame = 0
        this.c = { frame: 0, current_branch: "", current_value: 0 }
        Sound_Data.text = false

        this.achive = [
            ...Igenerator(function* () {
                for (let i = 0; i < 4; i++) {
                    yield "Stage0の" +
                        ["Easy", "Normal", "Hard", "Insane!"][i] +
                        "をクリアする:<br>" +
                        (save.data.stages[1].difficulties[i].is_cleard ? "Achieved!" : "Unachived")
                }
            }),
            ...Igenerator(function* () {
                for (let i = 0; i < 4; i++) {
                    yield "Stage0の" +
                        ["Easy", "Normal", "Hard", "Insane!"][i] +
                        "をノーミスクリアする:<br>" +
                        (save.data.stages[1].difficulties[i].is_no_miss_cleard ? "Achieved!" : "Unachived")
                }
            }),
        ]

        setTimeout(() => {
            BGM = Sound_Data.whimsicalness
            BGM.reset()
            BGM.play()
        }, 1000)
    }

    loop() {
        Irect(0, 0, width, height, "#121212")

        Ifont(60, "white", "serif")
        Itext(this.frame, 20, 20 + font_size, "The Whimsical Days!")

        Ireuleaux(
            this.mn[0],
            this.mn[1],
            (width * 3) / 4,
            (height * 3) / 4,
            100,
            "#ffffff80",
            (Math.PI * this.frame) / 144,
            "stroke",
            2,
        )

        Ifont(36, "white", "serif")
        this.c = Icommand(this.c, 20, 200, font_size, this.option, this.function, this.loopf)

        this.frame++

        if (this.frame % 10 == 7) {
            let a
            do {
                a = [Math.floor(Math.random() * 6) + 2, Math.floor(Math.random() * 3) + 2]
            } while (this.mn[0] / this.mn[1] == a[0] / a[1] || a[0] / a[1] < 2)

            this.mn = a
        }
    }
})()
