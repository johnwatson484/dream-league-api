export function normalizeName (name: string): string {
  if (!name) { return '' }

  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\b(fc|united|city|town|rovers|wanderers|athletic|county|albion)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isTeamMatch (team1: string, team2: string): boolean {
  if (!team1 || !team2) { return false }

  const normalized1 = normalizeName(team1)
  const normalized2 = normalizeName(team2)

  if (normalized1.length < 4 || normalized2.length < 4) {
    return normalized1 === normalized2
  }

  return normalized1.includes(normalized2) || normalized2.includes(normalized1)
}
