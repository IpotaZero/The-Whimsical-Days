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

Sound_Data.Intoxicarion = new Iaudio("sounds/Intoxication.wav", "bgm")
Sound_Data.Drunkenness = new Iaudio("sounds/Drunkenness.wav", "bgm")
Sound_Data.kohaku = new Iaudio("./sounds/select.wav")
Sound_Data.Ethanol = new Iaudio("./sounds/select.wav")

Sound_Data.uhm = new Iaudio("./sounds/⤵.wav")
Sound_Data.uhm.set_volume(0.4)

Image_Data.Ethanol = new Iimage("images/Ethanol.apng", 250, 50, 960, 1920, { ratio: 0.4, alpha: 1 })

Ifont(24)
const story = [
  [
    { type: "text", text: Iadjust(game_width - 140, "プログラムの気配がする...<br>"), voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "bgm", bgm: Sound_Data.Drunkenness },
    { type: "sleep", interval: 48 },
    { type: "text", text: "" },

    ...translate([
      { time: 0, type: "continuous", interval: 12, enemies: Igenerator(function* () { for (let i = 0; i < 8; i++) { yield enemy_data["zako_4_" + i] } }) },
      { time: 255, type: "do", value: { type: "text", text: "第3話: 酩酊" } },
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
        BGM.end();
        enemies.forEach((e) => { e.life = 0 });
        scene_main.boss = true;
        scene_main.story_frame = 0
      }
    },
    { type: "enemy", enemy: enemy_data.ethanol_m1 },
    { type: "sleep", interval: 48 },
    { type: "image", image: Image_Data.Ethanol },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>尾けてくるなよー"), voice: Sound_Data.Ethanol },
    { type: "ok" },
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


    { type: "enemy", enemy: enemy_data.ethanol_0 },
    { type: "bgm", bgm: Sound_Data.Intoxicarion },
    { type: "wait" },
    { type: "popup", text: "Ctrl+↑!!!" },
    { type: "sleep", interval: 72 },
    { type: "popup", text: "" },
    { type: "wait" },

    { type: "image", image: Image_Data.Ethanol },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>うううッー!"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>まだッあたしはッ<br>負けてない!"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "delete_image" },
    { type: "enemy", enemy: enemy_data.ethanol_5 },
    { type: "wait" },


    { type: "sleep", interval: 24 },
    { type: "image", image: Image_Data.Ethanol },
    { type: "do", f: () => { scene_main.boss = false } },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>ぐわーッ"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Kohaku:<br>さあ、ハイクを詠むんだな!<br>"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: Iadjust(game_width - 140, "Ethanol:<br>苦しくて、投げ出したいのはきっとアセトアルデヒド"), voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "score" },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "end" }
  ]
]
