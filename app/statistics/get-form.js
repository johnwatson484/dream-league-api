const db = require('../data')
const getPoints = require('../results/get-points')
const sortArray = require('../utils/sort-array')

async function getForm (weeksToInclude = 6) {
  const managers = await db.Manager.findAll({ raw: true })
  let summaries = await db.Summary.findAll({ raw: true, order: [['gameweekId', 'DESC']], limit: weeksToInclude })
  summaries = summaries.reverse()
  const form = []
  managers.forEach(manager => {
    let points = 0
    const results = []
    summaries.forEach(gameweek => {
      const result = gameweek.summary.scores.find(x => x.managerId === manager.managerId)?.result || 'X'
      points += getPoints(result)
      results.push(result)
    })
    form.push({
      managerId: manager.managerId,
      manager: manager.name,
      points,
      results
    })
  })
  return orderForm(form)
}

function orderForm (form) {
  return form.sort((a, b) => { return sortArray(b.points, a.points) || sortArray(a.manager, b.manager) })
    .map((x, i) => ({ position: i + 1, ...x }))
}

module.exports = getForm
