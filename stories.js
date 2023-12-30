const on_road = function (events) {
  let transleted = []

  events.forEach((e) => {
    switch (e.type) {
      case "formation":
        for (let i = 0; i < e.number; i++) {
          transleted.push({ time: e.time + i * e.interval, value: { type: "enemy", enemy: e.enemy } })
        }
        break
      case "enemies":
        e.enemies.forEach((e) => {
          transleted.push(e)
        })
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

Image_Data.Ethanol = new Iimg("images/Ethanol.apng", 250, 50, 960, 1920, 0.4, 1)

const story = [
  [
    { type: "text", text: "Kohaku:\nくんくん...\nこっちからプログラムの気配がする\nな...", voice: Sound_Data.kohaku },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "bgm", bgm: Sound_Data.Drunkenness },
    { type: "sleep", interval: 48 },
    { type: "text", text: "" },

    ...on_road([
      { time: 0, type: "formation", enemy: enemy_data.zako_0, interval: 12, number: 6 },
      { time: 48, type: "formation", enemy: enemy_data.zako_1, interval: 12, number: 6 },
    ]),
    { type: "sleep", interval: 96 },
    { type: "enemy", enemy: enemy_data.zako_2 },
    { type: "wait" },

    { type: "image", image: Image_Data.Ethanol },
    { type: "text", text: "Ethanol:\nどーも" },
    { type: "ok" },
    { type: "text", text: "Kohaku:\nどーも..." },
    { type: "ok" },
    { type: "text", text: "Ethanol:\nさっきからあたしを\n追っかけてるみたいだね" },
    { type: "ok" },
    { type: "text", text: "Kohaku:\n...そうだね" },
    { type: "ok" },
    { type: "text", text: "Ethanol:\n別に戦わなくてもいいんだけどね\n" },
    { type: "ok" },
    { type: "text", text: "Ethanol:\n君があたしを倒すつもりなら、\n" },
    { type: "ok" },
    { type: "text", text: "Ethanol:\n受けて立とうじゃないか!" },
    { type: "ok" },
    { type: "text", text: "" },
    { type: "delete_image" },

    { type: "bgm", bgm: Sound_Data.Intoxicarion },
    { type: "enemy", enemy: enemy_data.ethanol_0 },
    { type: "wait" },
    { type: "popup", text: "Ctrl+↑!!!" },
    { type: "sleep", interval: 24 },
    { type: "popup", text: "" },
    { type: "wait" },
    { type: "text", text: "Ethanol:\nぐえー" },
    { type: "ok" },
    { type: "end" }
  ]
]
