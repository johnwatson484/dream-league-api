import { calculateDistance } from '../../levenshtein.js'

const mapTeam = (teams, matchTeam) => {
  const matchText = matchTeam.replace(/' '/g, '').toUpperCase()
  let bestDistance = -1
  let bestTeamId = -1

  for (const team of teams) {
    const distance = calculateDistance(matchText, team.alias.replace(/' '/g, '').toUpperCase())
    if (bestDistance === -1 || distance < bestDistance) {
      bestDistance = distance
      bestTeamId = team.teamId
    }
  }

  return {
    bestMatchId: bestTeamId,
    distance: bestDistance,
  }
}

export { mapTeam }
