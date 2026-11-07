export function orderScores<T extends { manager: string }> (scores: T[]): T[] {
  return scores.toSorted((a, b) => a.manager.localeCompare(b.manager, 'en', { sensitivity: 'base' }))
}
