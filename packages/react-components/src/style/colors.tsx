const colorsRoulette = ['#d3d9f3', '#fcd5de', '#daf0e0', '#fbe7de', '#daf4fb', '#fdf3d0']

export function* colorRouletteGenerator() {
  let idx = 0
  while (true) {
    yield colorsRoulette[idx]
    idx++
    if (idx >= colorsRoulette.length) {
      idx = 0
    }
  }
}
