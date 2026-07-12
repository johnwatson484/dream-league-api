import type { Plugin, ServerRoute } from '@hapi/hapi'
import login from '../routes/identity/login.ts'
import logout from '../routes/identity/logout.ts'
import register from '../routes/identity/register.ts'
import forgotPassword from '../routes/identity/forgot-password.ts'
import resetPassword from '../routes/identity/reset-password.ts'
import tokenRefresh from '../routes/token/refresh.ts'
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
import goalReports from '../routes/goal-reports.ts'
import transfers from '../routes/transfers.ts'
import seasonSetup from '../routes/season-setup.ts'
import emailPreview from '../routes/dev/email-preview.ts'

const routes: ServerRoute[] = [
  ...login,
  ...logout,
  ...register,
  ...forgotPassword,
  ...resetPassword,
  ...tokenRefresh,
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
  ...goalReports,
  ...transfers,
  ...seasonSetup,
  ...emailPreview,
]

export default {
  plugin: {
    name: 'router',
    register: (server: any) => {
      server.route(routes)
    },
  } satisfies Plugin<any>,
}
