const db = require('../data')
const sortArray = require('../utils/sort-array')

const getTopScorers = async () => {
  const playersToInclude = await db.Manager.count()
  let goals = await db.Goal.findAll({
    raw: true,
    group: ['playerId'],
    attributes: ['playerId', [db.sequelize.fn('COUNT', db.sequelize.col('goalId')), 'goals']]
  })

  goals = goals.sort((a, b) => { return sortArray(b.goals, a.goals) }).slice(0, playersToInclude)

  const scorers = []
  for (const goal of goals) {
    const player = await db.Player.findOne({
      raw: true,
      where: { playerId: goal.playerId },
      include: [
        { model: db.Manager, as: 'managers', attributes: [], through: { attributes: [] } },
        { model: db.Team, as: 'team', attributes: [] }
      ],
      attributes: ['playerId', 'firstName', 'lastName', [db.Sequelize.col('team.name'), 'team'], [db.Sequelize.col('managers.name'), 'manager'], [db.Sequelize.col('managers.managerId'), 'managerId']]
    })
    scorers.push({
      ...player,
      goals: Number(goal.goals)
    })
  }

  return orderScorers(scorers)
}

const orderScorers = (scorers) => {
  return scorers.sort((a, b) => { return sortArray(b.goals, a.goals) || sortArray(a.lastName, b.lastName) || sortArray(a.firstName, b.firstName) })
    .map((x, i) => ({ position: i + 1, ...x }))
}

module.exports = getTopScorers
