import { getManager, getLeaguePlayers, getLeagueTeams } from './get-league-data.ts'
import { mapPosition } from '../map-position.ts'
import { fuzzyMatchPlayer, buildPlayerIndex, type MatchResult } from './fuzzy-match-player.ts'
import { fuzzyMatchTeam, buildTeamIndex, type TeamMatchResult } from './fuzzy-match-team.ts'
import { GOALKEEPER } from '../../constants/positions.ts'

export interface PreviewTeam {
  managerId: number
  managerName: string
  matches: (MatchResult | TeamMatchResult)[]
}

export interface PreviewResponse {
  summary: {
    total: number
    confident: number
    transfers: number
    lowConfidence: number
    unrecognized: number
  }
  teams: PreviewTeam[]
}

export async function previewMatches (teams: any[]): Promise<PreviewResponse> {
  const allPlayers = await getLeaguePlayers()
  const allTeams = await getLeagueTeams()

  const playerIndex = buildPlayerIndex(allPlayers)
  const teamFuse = buildTeamIndex(allTeams)

  const result: PreviewTeam[] = []
  const summary = { total: 0, confident: 0, transfers: 0, lowConfidence: 0, unrecognized: 0 }

  for (const team of teams) {
    const manager = await getManager(team.manager)
    if (!manager) { continue }

    const managerId = (manager as any).managerId
    const matches: (MatchResult | TeamMatchResult)[] = []

    for (const player of team.players) {
      const position = mapPosition(player.position)

      let match: MatchResult | TeamMatchResult
      if (position === GOALKEEPER) {
        match = fuzzyMatchTeam(allTeams, player.player, teamFuse)
      } else {
        match = fuzzyMatchPlayer(allPlayers, player.player, position || null, playerIndex)
      }

      match.substitute = player.substitute
      match.position = position || ''
      matches.push(match)

      summary.total++
      switch (match.category) {
        case 'confident': summary.confident++; break
        case 'transfer': summary.transfers++; break
        case 'low_confidence': summary.lowConfidence++; break
        case 'unrecognized': summary.unrecognized++; break
      }
    }

    result.push({ managerId, managerName: team.manager, matches })
  }

  return { summary, teams: result }
}
