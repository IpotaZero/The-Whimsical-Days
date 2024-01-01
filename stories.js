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


Image_Data.Ethanol = new Iimage("images/Ethanol.apng", 250, 50, 960, 1920, 0.4, 1)

const story = [
  [
    { type: "text", text: "Kohaku:\nくんくん...\nこっちからプログラムの気配がする\nな...", voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "bgm", bgm: Sound_Data.Drunkenness },
    { type: "sleep", interval: 48 },
    { type: "text", text: "" },

    // ...translate([
    //   { time: 0, type: "continuous", interval: 12, enemies: Igenerator(function* () { for (let i = 0; i < 8; i++) { yield enemy_data["zako_4_" + i] } }) },

    //   { time: 350, type: "formation", enemy: enemy_data.zako_0, interval: 12, number: 6 },
    //   { time: 422, type: "formation", enemy: enemy_data.zako_1, interval: 12, number: 6 },
    //   { time: 580, type: "enemies", enemies: [enemy_data.zako_2] },
    //   { time: 580, type: "continuous", interval: 12, enemies: Igenerator(function* () { for (let i = 0; i < 8; i++) { yield enemy_data["zako_3_" + i] } }) },
    // ]),

    // { type: "wait" },

    { type: "image", image: Image_Data.Ethanol },
    { type: "text", text: "Ethanol:\nどーも", voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: "Kohaku:\nどーも...", voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: "Ethanol:\nさっきからあたしを\n追っかけてるみたいだね", voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: "Ethanol:\n別に戦わなくても\nいいんだけどね\n", voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: "Ethanol:\n君があたしを倒すつもりなら、\n", voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: "Ethanol:\n受けて立とうじゃないか!", voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "delete_image" },

    { type: "bgm", bgm: Sound_Data.Intoxicarion },
    { type: "enemy", enemy: enemy_data.ethanol_0 },
    { type: "wait" },
    { type: "popup", text: "Ctrl+↑!!!" },
    { type: "sleep", interval: 72 },
    { type: "popup", text: "" },
    { type: "wait" },

    { type: "image", image: Image_Data.Ethanol },
    { type: "text", text: "Ethanol:\n苦しくて、投げ出したいのは\nきっとアセトアルデヒド", voice: Sound_Data.Ethanol },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "end" }
  ]
]
