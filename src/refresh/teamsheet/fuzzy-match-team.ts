import Fuse from 'fuse.js'
import { normalizeTeamName } from './normalize.ts'
import { parseSourceText } from './parse-source-text.ts'
import type { MatchCategory } from './fuzzy-match-player.ts'

export interface TeamCandidate {
  teamId: number
  teamName: string
  confidence: number
}

export interface TeamMatchResult {
  sourceText: string
  parsedName: string
  parsedTeam: string
  position: string
  substitute: boolean
  category: MatchCategory
  confidence: number
  bestMatch: TeamCandidate | null
  candidates: TeamCandidate[]
  transferInfo: null
}

export interface IndexedTeam {
  teamId: number
  name: string
  alias: string
  normalizedName: string
}

const FUSE_OPTIONS = {
  includeScore: true,
  threshold: 0.3,
  keys: ['name', 'alias', 'normalizedName'] as string[],
}

export function buildTeamIndex (teams: any[]): Fuse<IndexedTeam> {
  const indexed: IndexedTeam[] = teams.map((t: any) => ({
    teamId: t.teamId,
    name: t.name,
    alias: t.alias || t.name,
    normalizedName: normalizeTeamName(t.alias || t.name),
  }))

  return new Fuse(indexed, FUSE_OPTIONS)
}

export function fuzzyMatchTeam (teams: any[], sourceText: string, prebuiltFuse?: Fuse<IndexedTeam>): TeamMatchResult {
  const parsed = parseSourceText(sourceText)
  const searchTerm = parsed.team || parsed.name

  const baseResult = {
    sourceText,
    parsedName: parsed.name,
    parsedTeam: parsed.team,
    position: 'Goalkeeper',
    substitute: false,
    transferInfo: null,
  }

  if (!searchTerm) {
    return { ...baseResult, category: 'unrecognized', confidence: 0, bestMatch: null, candidates: [] }
  }

  const fuse = prebuiltFuse || buildTeamIndex(teams)

  const results = fuse.search(searchTerm)

  const candidates: TeamCandidate[] = results
    .slice(0, 3)
    .map(r => ({
      teamId: r.item.teamId,
      teamName: r.item.name,
      confidence: 1 - (r.score ?? 0),
    }))

  if (candidates.length === 0) {
    return { ...baseResult, category: 'unrecognized', confidence: 0, bestMatch: null, candidates: [] }
  }

  const best = candidates[0]!

  if (best.confidence >= 0.7) {
    return { ...baseResult, category: 'confident', confidence: best.confidence, bestMatch: best, candidates }
  }

  if (best.confidence >= 0.5) {
    return { ...baseResult, category: 'low_confidence', confidence: best.confidence, bestMatch: best, candidates }
  }

  return { ...baseResult, category: 'unrecognized', confidence: best.confidence, bestMatch: null, candidates }
}
