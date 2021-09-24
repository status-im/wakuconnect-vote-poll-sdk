import timeConvert from 'humanize-duration'

export function formatTimeLeft(timeLeft: number) {
  return timeLeft > 0 ? timeConvert(timeLeft, { largest: 1, round: true }) + ' left' : 'Vote ended'
}
