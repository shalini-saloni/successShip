import { STALENESS } from '../data/constants.js'

export function computeScore(memory) {
  let s = memory.weight * 100

  if (memory.daysAgo > 300)      s *= 0.50
  else if (memory.daysAgo > 180) s *= 0.75
  else if (memory.daysAgo > 90)  s *= 0.90

  if (memory.staleness === STALENESS.STALE)    s *= 0.60
  if (memory.staleness === STALENESS.ARCHIVED) s *= 0.20

  if (memory.impact === 'critical') s *= 1.30
  else if (memory.impact === 'high') s *= 1.15

  if (memory.emotionalFlag) s *= 1.10

  return Math.min(Math.round(s), 99)
}

export function scoreColor(value) {
  if (value > 75) return '#16A34A'  
  if (value > 50) return '#D97706'  
  return '#DC2626'                   
}

export function decayFactor(days) {
  if (days > 300) return 0.50
  if (days > 180) return 0.75
  if (days > 90)  return 0.90
  return 1.00
}
