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

SoundData.Intoxicarion = new Iaudio("sounds/Intoxication.wav", "bgm")
SoundData.Drunkenness = new Iaudio("sounds/Drunkenness.wav")

ImgData.Ethanol = new Iimg("images/Ethanol.png", 250, 50, 960, 1920, 0.4)

const story = [
  [
    { type: "text", text: "Kohaku:\nくんくん...\nこっちからプログラムの気配がする\nな...", voice: SoundData.kohaku },

    { type: "bgm", bgm: SoundData.Drunkenness },
    ...on_road([
      { time: 0, type: "formation", enemy: enemy_data.zako_0, interval: 12, number: 6 },
      { time: 48, type: "formation", enemy: enemy_data.zako_1, interval: 12, number: 6 },
    ]),
    { type: "sleep", interval: 96 },
    { type: "enemy", enemy: enemy_data.zako_2 },
    { type: "wait" },

    { type: "image", image: ImgData.Ethanol },

    { type: "text", text: "Ethanol:\nやあ" },
    { type: "text", text: "Ethanol:\nさっきからあたしを\n追っかけてるみたいだね" },
    { type: "text", text: "Ethanol:\n別に戦わなくてもいいんだけどねー" },
    { type: "text", text: "Ethanol:\n君があたしを倒すつもりなら、" },
    { type: "text", text: "Ethanol:\n受けて立とうじゃないか!" },
    { type: "delete_image" },
    { type: "bgm", bgm: SoundData.Intoxicarion },
    { type: "enemy", enemy: enemy_data.ethanol_0 },
    { type: "wait" },
    { type: "popup", text: "Ctrl+↑!!!" },
    { type: "wait" },
    { type: "text", text: "Ethanol:\nぐえー" },
    { type: "end" }
  ]
]
