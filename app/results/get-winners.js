function getWinners (scores) {
  const winningMargin = Math.max.apply(Math, scores.map(x => { return x.margin }))
  return scores.filter(x => x.margin === winningMargin).map(x => { return { managerId: x.managerId, manager: x.manager, goals: x.goals } })
}

module.exports = getWinners
