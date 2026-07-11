import Fuse from 'fuse.js'
import { normalizePlayerName, isTeamMatch } from './normalize.ts'
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

export interface IndexedPlayer {
  playerId: number
  firstName: string
  lastName: string
  position: string
  teamId: number
  teamName: string
  normalizedName: string
}

const FUSE_OPTIONS = {
  includeScore: true,
  threshold: 0.6,
  keys: ['lastName', 'normalizedName'] as string[],
}

export function buildPlayerIndex (players: any[]): { indexed: IndexedPlayer[]; fuse: Fuse<IndexedPlayer> } {
  const indexed: IndexedPlayer[] = players.map((p: any) => ({
    playerId: p.playerId,
    firstName: p.firstName || '',
    lastName: p.lastName,
    position: p.position,
    teamId: p.team?.teamId ?? p.teamId,
    teamName: p.team?.name ?? p.team?.alias ?? '',
    normalizedName: normalizePlayerName(p.lastName),
  }))

  const fuse = new Fuse(indexed, FUSE_OPTIONS)
  return { indexed, fuse }
}

function searchCandidates (fuse: Fuse<IndexedPlayer>, searchName: string): PlayerCandidate[] {
  const results = fuse.search(searchName)
  const searchNormalized = normalizePlayerName(searchName)
  const searchWords = searchNormalized.split(' ').filter(w => w.length > 1)

  return results
    .filter(r => {
      const confidence = 1 - (r.score ?? 0)
      if (confidence <= 0.4) { return false }

      const playerWords = new Set(r.item.normalizedName.split(' ').filter(w => w.length > 1))
      const hasCommonWord = searchWords.some(w => playerWords.has(w))

      return hasCommonWord || confidence > 0.8
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
}

function selectBestCandidate (candidates: PlayerCandidate[], parsedTeam: string): PlayerCandidate {
  let best = candidates[0]!

  if (parsedTeam && !isTeamMatch(best.teamName, parsedTeam)) {
    const teamMatchCandidate = candidates.find(c => isTeamMatch(c.teamName, parsedTeam))
    if (teamMatchCandidate) {
      best = teamMatchCandidate
    }
  }

  return best
}

function categorise (best: PlayerCandidate, parsedTeam: string, candidates: PlayerCandidate[], baseResult: Omit<MatchResult, 'category' | 'confidence' | 'bestMatch' | 'candidates'>): MatchResult {
  const teamMatches = parsedTeam ? isTeamMatch(best.teamName, parsedTeam) : true
  const topCandidates = candidates.slice(0, 3)

  if (best.confidence >= 0.5 && teamMatches) {
    return { ...baseResult, category: 'confident', confidence: best.confidence, bestMatch: best, candidates: topCandidates }
  }

  if (best.confidence >= 0.7 && !teamMatches && parsedTeam) {
    return {
      ...baseResult,
      category: 'transfer',
      confidence: best.confidence,
      bestMatch: best,
      candidates: topCandidates,
      transferInfo: {
        currentTeamId: best.teamId,
        currentTeamName: best.teamName,
        spreadsheetTeamName: parsedTeam,
      },
    }
  }

  if (best.confidence >= 0.5) {
    return { ...baseResult, category: 'low_confidence', confidence: best.confidence, bestMatch: best, candidates: topCandidates }
  }

  return { ...baseResult, category: 'unrecognized', confidence: best.confidence, bestMatch: null, candidates: topCandidates }
}

export function fuzzyMatchPlayer (players: any[], sourceText: string, position: string | null, prebuiltIndex?: { indexed: IndexedPlayer[]; fuse: Fuse<IndexedPlayer> }): MatchResult {
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

  const index = prebuiltIndex ?? buildPlayerIndex(players)

  let fuse = index.fuse
  if (position) {
    const filtered = index.indexed.filter(p => p.position === position)
    fuse = new Fuse(filtered, FUSE_OPTIONS)
  }

  const candidates = searchCandidates(fuse, parsed.name)

  if (candidates.length === 0) {
    return { ...baseResult, category: 'unrecognized', confidence: 0, bestMatch: null, candidates: [] }
  }

  const best = selectBestCandidate(candidates, parsed.team)
  return categorise(best, parsed.team, candidates, baseResult)
}
