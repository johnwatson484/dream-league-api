const calculateDistance = require('../../levenshtein')

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
    distance: bestDistance
  }
}

module.exports = mapTeam
