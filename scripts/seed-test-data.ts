import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import pg from 'pg'

const { Client } = pg

const { values } = parseArgs({
  options: {
    gameweek: { type: 'string', short: 'g', default: '2' },
    results: { type: 'boolean', short: 'r', default: false }
  }
})

const currentGameweek = parseInt(values.gameweek!, 10)
const includeResults = values.results!

const dbConfig = {
  host: 'localhost',
  database: 'dream_league_api',
  user: 'postgres',
  password: 'postgres',
  port: 5432
}

function mulberry32 (seed: number): () => number {
  return function () {
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T> (array: T[], rng: () => number): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function formatDate (d: Date): string {
  return d.toISOString().split('T')[0]
}

function snapToFriday (date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  const diff = day >= 5 ? day - 5 : day + 2
  d.setUTCDate(d.getUTCDate() - diff)
  return d
}

function computeGameweek1Start (currentGw: number): Date {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const raw = new Date(today)
  raw.setUTCDate(raw.getUTCDate() - (currentGw - 1) * 7)
  return snapToFriday(raw)
}

async function executeSqlFile (client: pg.Client, filename: string): Promise<void> {
  const filePath = path.join(import.meta.dirname, 'sql', 'local', filename)
  const sql = fs.readFileSync(filePath, 'utf8')
  await client.query(sql)
}

async function truncateAll (client: pg.Client): Promise<void> {
  await client.query(`
    TRUNCATE TABLE
      "cupResults", "fixtures", "managerGroups", "groups",
      "goals", "conceded", "summaries",
      "teamsheet", "managerPlayers", "managerKeepers",
      "meetings", "history", "emails",
      "refreshTokens", "userRoles", "users",
      "gameweeks", "managers", "players", "teams"
    RESTART IDENTITY CASCADE
  `)
}

async function insertManagers (client: pg.Client): Promise<void> {
  await client.query(`
    INSERT INTO "managers" ("managerId", "name", "alias") VALUES
      (1, 'John Watson', 'John'),
      (2, 'Lee Gordon', 'Lee'),
      (3, 'Scott Dormand', 'Scott'),
      (4, 'Billy Gordon', 'Billy'),
      (5, 'Tommy Gordon', 'Tommy'),
      (6, 'David Brown', 'David'),
      (7, 'Bob Brown', 'Bob'),
      (8, 'Darren Brown', 'Darren'),
      (9, 'Michael Richardson', 'Michael'),
      (10, 'Rob Doloughan', 'Rob'),
      (11, 'Ben Scott', 'Ben'),
      (12, 'Tucker Brazier', 'Tucker')
  `)
}

async function insertGameweeks (client: pg.Client, gw1Start: Date): Promise<void> {
  const endDate = new Date(gw1Start)
  endDate.setUTCDate(endDate.getUTCDate() + 39 * 7)

  await client.query(`
    INSERT INTO "gameweeks" ("startDate")
    SELECT date::date
    FROM generate_series(
      '${formatDate(gw1Start)}'::date,
      '${formatDate(endDate)}'::date,
      '1 week'::interval
    ) date
  `)
}

async function assignSquads (client: pg.Client, rng: () => number): Promise<{
  managerPlayers: Map<number, number[]>
  managerKeeperTeams: Map<number, number>
}> {
  const { rows: teams } = await client.query<{ teamId: number, divisionId: number }>(
    'SELECT "teamId", "divisionId" FROM "teams" ORDER BY "teamId"'
  )
  const championship = teams.filter(t => t.divisionId === 1)
  const nonChampionship = teams.filter(t => t.divisionId !== 1)

  const shuffledChamp = shuffle(championship, rng)
  const shuffledNonChamp = shuffle(nonChampionship, rng)

  const keeperValues: string[] = []
  const managerKeeperTeams = new Map<number, number>()

  for (let i = 0; i < 12; i++) {
    const managerId = i + 1
    const activeTeam = shuffledChamp[i]
    const subTeam = shuffledNonChamp[i]
    keeperValues.push(`(${managerId}, ${activeTeam.teamId}, false)`)
    keeperValues.push(`(${managerId}, ${subTeam.teamId}, true)`)
    managerKeeperTeams.set(managerId, activeTeam.teamId)
  }

  await client.query(`
    INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES ${keeperValues.join(', ')}
  `)

  const { rows: defenders } = await client.query<{ playerId: number }>(
    'SELECT "playerId" FROM "players" WHERE "position" = \'Defender\' ORDER BY "playerId"'
  )
  const { rows: midfielders } = await client.query<{ playerId: number }>(
    'SELECT "playerId" FROM "players" WHERE "position" = \'Midfielder\' ORDER BY "playerId"'
  )
  const { rows: forwards } = await client.query<{ playerId: number }>(
    'SELECT "playerId" FROM "players" WHERE "position" = \'Forward\' ORDER BY "playerId"'
  )

  const shuffledDef = shuffle(defenders, rng)
  const shuffledMid = shuffle(midfielders, rng)
  const shuffledFwd = shuffle(forwards, rng)

  const playerValues: string[] = []
  const managerActivePlayers = new Map<number, number[]>()

  for (let i = 0; i < 12; i++) {
    const managerId = i + 1
    const activePlayers: number[] = []

    // DEF: 2 active + 1 sub = 3 total
    const defSlice = shuffledDef.slice(i * 3, i * 3 + 3)
    for (let d = 0; d < 2; d++) {
      playerValues.push(`(${managerId}, ${defSlice[d].playerId}, false)`)
      activePlayers.push(defSlice[d].playerId)
    }
    playerValues.push(`(${managerId}, ${defSlice[2].playerId}, true)`)

    // MID: 3 active + 1 sub = 4 total
    const midSlice = shuffledMid.slice(i * 4, i * 4 + 4)
    for (let m = 0; m < 3; m++) {
      playerValues.push(`(${managerId}, ${midSlice[m].playerId}, false)`)
      activePlayers.push(midSlice[m].playerId)
    }
    playerValues.push(`(${managerId}, ${midSlice[3].playerId}, true)`)

    // FWD: 5 active + 1 sub = 6 total
    const fwdSlice = shuffledFwd.slice(i * 6, i * 6 + 6)
    for (let f = 0; f < 5; f++) {
      playerValues.push(`(${managerId}, ${fwdSlice[f].playerId}, false)`)
      activePlayers.push(fwdSlice[f].playerId)
    }
    playerValues.push(`(${managerId}, ${fwdSlice[5].playerId}, true)`)

    managerActivePlayers.set(managerId, activePlayers)
  }

  await client.query(`
    INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES ${playerValues.join(', ')}
  `)

  return { managerPlayers: managerActivePlayers, managerKeeperTeams }
}

async function insertTestUser (client: pg.Client): Promise<void> {
  await client.query(`
    INSERT INTO "users" ("userId", "email", "passwordHash")
    VALUES (1, 'test@test.com', '$2b$10$NEbLV6w7EZyw08xJUcqvYe9V4gKucChXhL1dslMSsPCItvpJxnqgC')
  `)
  await client.query(`
    INSERT INTO "userRoles" ("userId", "roleId") VALUES (1, 1), (1, 2)
  `)
}

async function insertMeetings (client: pg.Client, gw1Start: Date): Promise<void> {
  const meetingValues: string[] = []
  const firstMeeting = new Date(gw1Start)
  firstMeeting.setUTCDate(firstMeeting.getUTCDate() + 5 * 7)

  for (let i = 0; i < 5; i++) {
    const meeting = new Date(firstMeeting)
    meeting.setUTCDate(meeting.getUTCDate() + i * 4 * 7)
    meetingValues.push(`('${formatDate(meeting)}')`)
  }

  await client.query(`INSERT INTO "meetings" ("date") VALUES ${meetingValues.join(', ')}`)
}

async function generateResults (
  client: pg.Client,
  currentGw: number,
  managerActivePlayers: Map<number, number[]>,
  managerKeeperTeams: Map<number, number>,
  gw1Start: Date,
  rng: () => number
): Promise<void> {
  const goalValues: string[] = []
  const concedeValues: string[] = []

  for (let gw = 1; gw < currentGw; gw++) {
    const gwStart = new Date(gw1Start)
    gwStart.setUTCDate(gwStart.getUTCDate() + (gw - 1) * 7)

    for (let mgr = 1; mgr <= 12; mgr++) {
      const numGoals = 1 + Math.floor(rng() * 4)
      const numConceded = Math.floor(rng() * 4)
      const activePlayers = managerActivePlayers.get(mgr)!
      const keeperTeamId = managerKeeperTeams.get(mgr)!

      for (let g = 0; g < numGoals; g++) {
        const playerId = activePlayers[Math.floor(rng() * activePlayers.length)]
        const created = new Date(gwStart)
        created.setUTCDate(created.getUTCDate() + Math.floor(rng() * 3))
        goalValues.push(`(${playerId}, ${gw}, ${mgr}, false, '${formatDate(created)}', 'seed')`)
      }

      for (let c = 0; c < numConceded; c++) {
        const created = new Date(gwStart)
        created.setUTCDate(created.getUTCDate() + Math.floor(rng() * 3))
        concedeValues.push(`(${keeperTeamId}, ${gw}, ${mgr}, false, '${formatDate(created)}', 'seed')`)
      }
    }
  }

  if (goalValues.length > 0) {
    await client.query(`
      INSERT INTO "goals" ("playerId", "gameweekId", "managerId", "cup", "created", "createdBy")
      VALUES ${goalValues.join(', ')}
    `)
  }

  if (concedeValues.length > 0) {
    await client.query(`
      INSERT INTO "conceded" ("teamId", "gameweekId", "managerId", "cup", "created", "createdBy")
      VALUES ${concedeValues.join(', ')}
    `)
  }
}

async function main () {
  const client = new Client(dbConfig)
  await client.connect()
  const rng = mulberry32(42)

  console.log(`Resetting database (currentGameweek=${currentGameweek}, results=${includeResults})`)

  console.log('Truncating tables...')
  await truncateAll(client)

  console.log('Inserting teams...')
  await executeSqlFile(client, 'add-teams.sql')

  console.log('Inserting players...')
  await executeSqlFile(client, 'add-players.sql')

  console.log('Inserting managers...')
  await insertManagers(client)

  const gw1Start = computeGameweek1Start(currentGameweek)
  console.log(`Inserting gameweeks (GW1 starts ${formatDate(gw1Start)})...`)
  await insertGameweeks(client, gw1Start)

  console.log('Assigning squads...')
  const { managerPlayers: managerActivePlayers, managerKeeperTeams } = await assignSquads(client, rng)

  console.log('Inserting test user...')
  await insertTestUser(client)

  console.log('Inserting history...')
  await executeSqlFile(client, 'add-history.sql')

  console.log('Inserting meetings...')
  await insertMeetings(client, gw1Start)

  if (includeResults && currentGameweek > 1) {
    console.log(`Generating results for gameweeks 1-${currentGameweek - 1}...`)
    await generateResults(client, currentGameweek, managerActivePlayers, managerKeeperTeams, gw1Start, rng)
  }

  await client.end()
  console.log('Done.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
