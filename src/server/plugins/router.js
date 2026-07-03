import login from '../routes/identity/login.js'
import register from '../routes/identity/register.js'
import forgotPassword from '../routes/identity/forgot-password.js'
import resetPassword from '../routes/identity/reset-password.js'
import division from '../routes/league/division.js'
import team from '../routes/league/team.js'
import player from '../routes/league/player.js'
import teamsheet from '../routes/teamsheet.js'
import results from '../routes/results.js'
import goals from '../routes/goals.js'
import conceded from '../routes/conceded.js'
import gameweeks from '../routes/gameweeks.js'
import statistics from '../routes/statistics.js'
import meetings from '../routes/meetings.js'
import managers from '../routes/managers.js'
import history from '../routes/history.js'
import cups from '../routes/cups.js'
import groups from '../routes/groups.js'
import fixtures from '../routes/fixtures.js'
import winners from '../routes/winners.js'
import search from '../routes/search.js'
import validate from '../routes/validate.js'
import token from '../routes/token.js'

const routes = [
  ...login,
  ...register,
  ...forgotPassword,
  ...resetPassword,
  ...division,
  ...team,
  ...player,
  ...teamsheet,
  ...results,
  ...goals,
  ...conceded,
  ...gameweeks,
  ...statistics,
  ...meetings,
  ...managers,
  ...history,
  ...cups,
  ...groups,
  ...fixtures,
  ...winners,
  ...search,
  ...validate,
  ...token,
]

export default {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route(routes)
    },
  },
}
