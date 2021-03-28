const db = require('../../data/models')
const sortArray = require('../../utils/sort-array')

async function getTopScorers () {
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
      include: [{ model: db.Manager, as: 'managers', attributes: [], through: { attributes: [] } }],
      attributes: ['playerId', 'firstName', 'lastName', [db.Sequelize.col('managers.name'), 'manager'], [db.Sequelize.col('managers.managerId'), 'managerId']]
    })
    scorers.push({
      ...player,
      goals: Number(goal.goals)
    })
  }

  return scorers
}

module.exports = getTopScorers
