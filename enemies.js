enemy_data = {}


function wall(p) {
  return p.x < 0 || game_width < p.x | p.y < 0 || game_height < p.y
}

enemy_data.carotene_0 = {
  p: new vec(game_width / 2, game_height / 2), r: 32, life: 200, f: (me) => {
  }
}