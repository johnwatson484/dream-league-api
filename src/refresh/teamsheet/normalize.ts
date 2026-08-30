export function normalizePlayerName (name: string): string {
  if (!name) { return '' }

  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Words that distinguish otherwise identically-prefixed club names (Sheffield United vs
// Sheffield Wednesday, Bristol City vs Bristol Rovers). Never strip these when normalizing a
// team name, and use them to veto a match between two names that each contain a different one.
const TEAM_DISCRIMINATORS = new Set([
  'united', 'city', 'town', 'rovers', 'wanderers', 'athletic', 'county', 'albion',
  'wednesday', 'forest', 'argyle', 'orient', 'alexandra', 'vale', 'rangers', 'villa',
  'palace', 'hotspur', 'dons', 'stanley'
])

// Common shorthand for a discriminating word, expanded so e.g. "Man Utd" still lines up with
// "Manchester United" instead of being treated as a distinct, non-conflicting token.
const TEAM_ABBREVIATIONS: Record<string, string> = {
  utd: 'united',
  wed: 'wednesday',
  weds: 'wednesday',
}

function discriminatorsOf (normalized: string): Set<string> {
  return new Set(normalized.split(' ').filter(word => TEAM_DISCRIMINATORS.has(word)))
}

// True only when both names carry a discriminator and none of them match - a name with no
// discriminator at all (e.g. "Blackpool") is never treated as conflicting.
function hasConflictingDiscriminator (normalized1: string, normalized2: string): boolean {
  const tokens1 = discriminatorsOf(normalized1)
  const tokens2 = discriminatorsOf(normalized2)
  if (!tokens1.size || !tokens2.size) { return false }
  for (const token of tokens1) { if (tokens2.has(token)) { return false } }
  return true
}

// Keeps every discriminating word (united/city/rovers/etc) since stripping them is what
// previously made e.g. "Sheffield United" and "Sheffield Wednesday" collide. Only "fc"/"afc"
// are dropped, as they never distinguish two league teams.
export function normalizeTeamName (name: string): string {
  if (!name) { return '' }

  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\b(a?fc)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(token => TEAM_ABBREVIATIONS[token] ?? token)
    .join(' ')
}

export function isTeamMatch (team1: string, team2: string): boolean {
  if (!team1 || !team2) { return false }

  const normalized1 = normalizeTeamName(team1)
  const normalized2 = normalizeTeamName(team2)

  if (normalized1 === normalized2) { return true }
  if (hasConflictingDiscriminator(normalized1, normalized2)) { return false }

  if (normalized1.length < 4 || normalized2.length < 4) {
    return normalized1 === normalized2
  }

  return normalized1.includes(normalized2) || normalized2.includes(normalized1)
}
