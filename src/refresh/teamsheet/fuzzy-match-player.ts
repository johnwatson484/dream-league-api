import Fuse from 'fuse.js'
import { normalizeName, isTeamMatch } from './normalize.ts'
import { parseSourceText } from './parse-source-text.ts'

export type MatchCategory = 'confident' | 'transfer' | 'low_confidence' | 'unrecognized'

export interface PlayerCandidate {
  playerId: number
  firstName: string
  lastName: string
  position: string
  teamId: number
  teamName: string
  confidence: number
}

export interface MatchResult {
  sourceText: string
  parsedName: string
  parsedTeam: string
  position: string
  substitute: boolean
  category: MatchCategory
  confidence: number
  bestMatch: PlayerCandidate | null
  candidates: PlayerCandidate[]
  transferInfo: { currentTeamId: number; currentTeamName: string; spreadsheetTeamName: string } | null
}

interface IndexedPlayer {
  playerId: number
  firstName: string
  lastName: string
  position: string
  teamId: number
  teamName: string
  normalizedName: string
}

export function fuzzyMatchPlayer (players: any[], sourceText: string, position: string | null): MatchResult {
  const parsed = parseSourceText(sourceText)
  const baseResult = {
    sourceText,
    parsedName: parsed.name,
    parsedTeam: parsed.team,
    position: position || '',
    substitute: false,
    transferInfo: null as MatchResult['transferInfo'],
  }

  if (!parsed.name) {
    return { ...baseResult, category: 'unrecognized', confidence: 0, bestMatch: null, candidates: [] }
  }

  let filteredPlayers = players
  if (position) {
    filteredPlayers = players.filter((p: any) => p.position === position)
  }

  const indexed: IndexedPlayer[] = filteredPlayers.map((p: any) => ({
    playerId: p.playerId,
    firstName: p.firstName || '',
    lastName: p.lastName,
    position: p.position,
    teamId: p.team?.teamId ?? p.teamId,
    teamName: p.team?.name ?? p.team?.alias ?? '',
    normalizedName: normalizeName(p.lastName),
  }))

  const fuse = new Fuse(indexed, {
    includeScore: true,
    threshold: 0.6,
    keys: ['lastName', 'normalizedName'],
  })

  const results = fuse.search(parsed.name)

  const candidates: PlayerCandidate[] = results
    .filter(r => {
      const confidence = 1 - (r.score ?? 0)
      if (confidence <= 0.4) { return false }

      const searchNormalized = normalizeName(parsed.name)
      const playerNormalized = r.item.normalizedName
      const searchWords = searchNormalized.split(' ').filter(w => w.length > 1)
      const playerWords = playerNormalized.split(' ').filter(w => w.length > 1)
      const commonWords = searchWords.filter(w => playerWords.includes(w))

      return commonWords.length > 0 || confidence > 0.8
    })
    .slice(0, 5)
    .map(r => ({
      playerId: r.item.playerId,
      firstName: r.item.firstName,
      lastName: r.item.lastName,
      position: r.item.position,
      teamId: r.item.teamId,
      teamName: r.item.teamName,
      confidence: 1 - (r.score ?? 0),
    }))

  if (candidates.length === 0) {
    return { ...baseResult, category: 'unrecognized', confidence: 0, bestMatch: null, candidates: [] }
  }

  let best = candidates[0]!

  // If the top candidate's team doesn't match but another candidate's does, prefer that one
  if (parsed.team && !isTeamMatch(best.teamName, parsed.team)) {
    const teamMatchCandidate = candidates.find(c => isTeamMatch(c.teamName, parsed.team))
    if (teamMatchCandidate) {
      best = teamMatchCandidate
    }
  }

  const teamMatches = parsed.team ? isTeamMatch(best.teamName, parsed.team) : true

  if (best.confidence >= 0.8 && teamMatches) {
    return { ...baseResult, category: 'confident', confidence: best.confidence, bestMatch: best, candidates: candidates.slice(0, 3) }
  }

  // Also mark as confident if team matches and confidence is reasonable (handles same-surname cases)
  if (best.confidence >= 0.5 && teamMatches) {
    return { ...baseResult, category: 'confident', confidence: best.confidence, bestMatch: best, candidates: candidates.slice(0, 3) }
  }

  if (best.confidence >= 0.7 && !teamMatches && parsed.team) {
    return {
      ...baseResult,
      category: 'transfer',
      confidence: best.confidence,
      bestMatch: best,
      candidates: candidates.slice(0, 3),
      transferInfo: {
        currentTeamId: best.teamId,
        currentTeamName: best.teamName,
        spreadsheetTeamName: parsed.team,
      },
    }
  }

  if (best.confidence >= 0.5) {
    return { ...baseResult, category: 'low_confidence', confidence: best.confidence, bestMatch: best, candidates: candidates.slice(0, 3) }
  }

  return { ...baseResult, category: 'unrecognized', confidence: best.confidence, bestMatch: null, candidates: candidates.slice(0, 3) }
}
