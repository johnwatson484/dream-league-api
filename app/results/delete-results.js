const db = require('../data')

const deleteResults = async (gameweekId) => {
  const transaction = await db.sequelize.transaction()
  try {
    await db.Concede.destroy({ where: { gameweekId }, transaction })
    await db.Goal.destroy({ where: { gameweekId }, transaction })
    await db.Summary.destroy({ where: { gameweekId }, transaction })
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

module.exports = {
  deleteResults
}
