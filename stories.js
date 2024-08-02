//ぜったいじかんでしていする
const translate = function (events) {
  let transleted = []

  events.forEach((e) => {
    switch (e.type) {
      //まったく同じ敵を間隔をあけて出す
      case "formation":
        for (let i = 0; i < e.number; i++) {
          transleted.push({ time: e.time + i * e.interval, value: { type: "enemy", enemy: e.enemy } })
        }
        break

      //同時に複数の敵を出す
      case "enemies":
        e.enemies.forEach((en) => {
          transleted.push({ time: e.time, value: { type: "enemy", enemy: en } })
        })
        break

      //配列に入った敵を間隔をあけて出す
      case "continuous":
        for (let i = 0; i < e.enemies.length; i++) {
          transleted.push({ time: e.time + i * e.interval, value: { type: "enemy", enemy: e.enemies[i] } })
        }
        break

      case "do":
        transleted.push({ time: e.time, value: e.value })
        break
    }
  })

  let res = []

  transleted.sort((a, b) => a.time - b.time)

  let current_time = 0
  transleted.forEach((e) => {
    if (e.time - current_time > 0) {
      res.push({ type: "sleep", interval: e.time - current_time })
    }
    res.push(e.value)

    current_time = e.time
  })

  return res
}

Sound_Data.Intoxicarion = new IBGM("sounds/Intoxication.wav")
Sound_Data.Drunkenness = new IBGM("sounds/Drunkenness.wav")
Sound_Data.Drunkenness.volume = 0.7
Sound_Data.Tutorial = new IBGM("sounds/Tutorial.wav")
// Sound_Data.Courage = new Iaudio("sounds/Courage.wav", "bgm")

Sound_Data.kohaku = new Iaudio("./sounds/select.wav")
Sound_Data.Ethanol = new Iaudio("./sounds/select.wav")
Sound_Data.Phenetylalcohol = new Iaudio("./sounds/select.wav")

Sound_Data.uhm = new Iaudio("./sounds/⤵.wav")
Sound_Data.uhm.volume = 0.4

Image_Data.Ethanol = new Iimage("images/Ethanol.apng", 250, 80, 960 * 0.4, 1920 * 0.4, { alpha: 1 })
Image_Data.Kohaku = new Iimage("images/kohaku.apng", -50, 50, 960 * 0.4, 1920 * 0.4, { alpha: 1 })
Image_Data.Phenetylalcohol = new Iimage("images/Phenetylalcohol.png", 250, 50, 960 * 0.4, 1920 * 0.4, { alpha: 1 })

Ifont(24)
const story = [
  [
    { type: "set_bgm", bgm: Sound_Data.Tutorial },
    { type: "play_bgm" },
    { type: "text", text: Iadjust(game_width - 140, "Pause: [Escape]<br>一時停止"), voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Move: [ArrowKey]<br>移動"), voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Slow: [Shift]<br>低速移動"), voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Dash: [Control]<br>高速移動、最中は無敵、2秒に1回使える"), voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Turn: [KeyA]<br>反対を向く"), voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "キーコンフィグはタイトル画面にある"), voice: Sound_Data.kohaku },
    { type: "ok" },

    { type: "enemy", enemy: enemy_data.tutorial_0 },
    { type: "text", text: Iadjust(game_width - 140, "敵に近づくほど与えるダメージが大きくなる"), voice: Sound_Data.kohaku },
    { type: "wait" },
    { type: "enemy", enemy: enemy_data.tutorial_1 },
    { type: "text", text: Iadjust(game_width - 140, "赤い点が自機の当たり判定<br>弾を避けつつ敵をやっつけよう"), voice: Sound_Data.kohaku },
    { type: "wait" },
    { type: "enemy", enemy: enemy_data.tutorial_2 },
    { type: "text", text: Iadjust(game_width - 140, "体力バーが赤い敵は無敵<br>攻撃を避け続ければいい"), voice: Sound_Data.kohaku },
    { type: "wait" },
    { type: "text", text: Iadjust(game_width - 140, ""), voice: Sound_Data.kohaku },

    { type: "sleep", interval: 12 },

    { type: "end" }
  ],
  [
    { type: "set_bgm", bgm: Sound_Data.Drunkenness },
    { type: "text", text: Iadjust(game_width - 140, "Arthur:<br>前方2kmにプログラムの気配あり"), voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "image", image: Image_Data.Kohaku },
    { type: "text", text: Iadjust(game_width - 140, "Kohaku:<br>本当か?<br>"), voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Arthur:<br>Crosshand家の名誉に誓って<br>"), voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "delete_image" },
    { type: "play_bgm" },
    { type: "sleep", interval: 48 },
    { type: "text", text: "" },

    ...translate([
      { time: 0, type: "continuous", interval: 12, enemies: Igenerator(function* () { for (let i = 0; i < 8; i++) { yield enemy_data["zako_4_" + i] } }) },
      { time: 255, type: "do", value: { type: "text", text: "『酩酊』" } },
      { time: 325, type: "do", value: { type: "text", text: "" } },
      { time: 350, type: "formation", enemy: enemy_data.zako_0, interval: 12, number: 6 },
      { time: 422, type: "formation", enemy: enemy_data.zako_1, interval: 12, number: 6 },
      { time: 580, type: "enemies", enemies: [enemy_data.zako_2] },
      { time: 580, type: "continuous", interval: 12, enemies: Igenerator(function* () { for (let i = 0; i < 8; i++) { yield enemy_data["zako_3_" + i] } }) },
      { time: 790, type: "enemies", enemies: Igenerator(function* () { for (let i = 0; i < 3; i++) { yield enemy_data["zako_5_" + i] } }) },
      { time: 1045, type: "enemies", enemies: [enemy_data.zako_7] },
    ]),

    { type: "sleep", interval: 695 },

    {
      type: "do", f: () => {
        // BGM.end();
        enemies.forEach((e) => { e.life = 0 });
        scene_main.boss = true;
        scene_main.story_frame = 0
      }
    },
    { type: "set_bgm", bgm: Sound_Data.Intoxicarion },
    { type: "enemy", enemy: enemy_data.ethanol_m1 },
    { type: "sleep", interval: 48 },
    { type: "image", image: Image_Data.Ethanol },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>尾けてくるなよー"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "image", image: Image_Data.Kohaku },
    { type: "text", text: Iadjust(game_width - 140, "Kohaku:<br>こっちも仕事なもんでね"), voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>うーん"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>別に戦わなくてもいいんだけどね"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>あんたがあたしを倒すつもりなら"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>受けて立とうじゃないか!"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "delete_image" },
    { type: "do", f: () => { enemies = [] } },

    { type: "play_bgm" },
    { type: "enemy", enemy: enemy_data.ethanol_0 },
    { type: "wait" },

    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>シンプルな絶望をお前に!"), voice: Sound_Data.Ethanol },
    { type: "sleep", interval: 60 },
    { type: "text", text: "" },
    { type: "wait" },

    { type: "sleep", interval: 24 },
    { type: "image", image: Image_Data.Ethanol },
    { type: "do", f: () => { scene_main.boss = false } },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>ぐわーッ"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "image", image: Image_Data.Kohaku },
    { type: "text", text: Iadjust(game_width - 140, "Kohaku:<br>さあ、ハイクを詠むんだな!<br>"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>苦しくて、投げ出したいのはきっとアセトアルデヒド"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "score" },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "end" }
  ],
  [
    { type: "image", image: Image_Data.Kohaku },
    { type: "text", text: Iadjust(game_width - 140, "Kohaku:<br>ったく...夜中に何が起こったっていうんだ?"), voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Kohaku:<br>......花の、匂い...?"), voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "delete_image" },
    // { type: "bgm", bgm: Sound_Data.Drunkenness },
    { type: "sleep", interval: 0 },

    { type: "enemy", enemy: enemy_data.phenetylalcohol_0 },

    { type: "text", text: Iadjust(game_width - 140, "Laninamivir:<br>最終兵器発動までアト60フレーム..."), voice: Sound_Data.Laninamivir },
    { type: "sleep", interval: 60 },
    { type: "text", text: "" },
    { type: "wait" },

    { type: "sleep", interval: 24 },
    { type: "image", image: Image_Data.Laninamivir },
    { type: "do", f: () => { scene_main.boss = false } },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>ぐわーッ"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "image", image: Image_Data.Kohaku },
    { type: "text", text: Iadjust(game_width - 140, "Kohaku:<br>さあ、ハイクを詠むんだな!<br>"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Phenetylalcohol:<br>並んだ、並んだ、赤白黄色"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "score" },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "end" }
  ]
]
