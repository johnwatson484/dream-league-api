import login from '../routes/identity/login.ts'
import register from '../routes/identity/register.ts'
import forgotPassword from '../routes/identity/forgot-password.ts'
import resetPassword from '../routes/identity/reset-password.ts'
import division from '../routes/league/division.ts'
import team from '../routes/league/team.ts'
import player from '../routes/league/player.ts'
import teamsheet from '../routes/teamsheet.ts'
import results from '../routes/results.ts'
import goals from '../routes/goals.ts'
import conceded from '../routes/conceded.ts'
import gameweeks from '../routes/gameweeks.ts'
import statistics from '../routes/statistics.ts'
import meetings from '../routes/meetings.ts'
import managers from '../routes/managers.ts'
import history from '../routes/history.ts'
import cups from '../routes/cups.ts'
import groups from '../routes/groups.ts'
import fixtures from '../routes/fixtures.ts'
import winners from '../routes/winners.ts'
import search from '../routes/search.ts'
import validate from '../routes/validate.ts'

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
]

export default {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route(routes)
    },
  },
}
