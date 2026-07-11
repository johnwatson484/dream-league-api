export function getWinners (scores: any[]): any[] {
  const winningMargin = Math.max(...scores.map(x => x.margin))
  return scores.filter(x => x.margin === winningMargin).map(x => ({ managerId: x.managerId, manager: x.manager, goals: x.goals }))
}
