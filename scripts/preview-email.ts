import http from 'node:http'
import { getHtmlStringFromFile } from '../src/notifications/get-html-string.ts'

const mockData = {
  gameweekId: 5,
  scores: [
    {
      managerId: 1,
      manager: 'John Watson',
      goals: 6,
      conceded: 1,
      margin: 5,
      result: 'W',
      scorers: [
        { playerId: 1, name: 'Salah M', goals: 2 },
        { playerId: 2, name: 'Palmer C', goals: 2 },
        { playerId: 3, name: 'Saka B', goals: 1 },
        { playerId: 4, name: 'Watkins O', goals: 1 }
      ]
    },
    {
      managerId: 2,
      manager: 'Lee Gordon',
      goals: 3,
      conceded: 3,
      margin: 0,
      result: 'D',
      scorers: [
        { playerId: 5, name: 'Haaland E', goals: 2 },
        { playerId: 6, name: 'Isak A', goals: 1 }
      ]
    },
    {
      managerId: 3,
      manager: 'Scott Dormand',
      goals: 1,
      conceded: 4,
      margin: -3,
      result: 'L',
      scorers: [
        { playerId: 7, name: 'Solanke D', goals: 1 }
      ]
    },
    {
      managerId: 4,
      manager: 'Mike Brearley',
      goals: 4,
      conceded: 2,
      margin: 2,
      result: 'W',
      scorers: [
        { playerId: 8, name: 'Son H', goals: 2 },
        { playerId: 9, name: 'Gordon A', goals: 1 },
        { playerId: 10, name: 'Mbeumo B', goals: 1 }
      ]
    },
    {
      managerId: 5,
      manager: 'Chris Sherwood',
      goals: 2,
      conceded: 5,
      margin: -3,
      result: 'L',
      scorers: [
        { playerId: 11, name: 'Cunha M', goals: 1 },
        { playerId: 12, name: 'Nkunku C', goals: 1 }
      ]
    },
    {
      managerId: 6,
      manager: 'Dave Hartley',
      goals: 10,
      conceded: 1,
      margin: 9,
      result: 'W',
      scorers: [
        { playerId: 13, name: 'Fernandes B', goals: 3 },
        { playerId: 14, name: 'Diaz L', goals: 3 },
        { playerId: 15, name: 'Johnson B', goals: 2 },
        { playerId: 16, name: 'Wissa Y', goals: 2 }
      ]
    }
  ],
  winners: [
    { managerId: 6, manager: 'Dave Hartley', goals: 10 }
  ],
  table: [
    { position: 1, managerId: 6, manager: 'Dave Hartley', played: 5, won: 4, drawn: 1, lost: 0, gf: 28, ga: 8, gd: 20, points: 13 },
    { position: 2, managerId: 1, manager: 'John Watson', played: 5, won: 4, drawn: 0, lost: 1, gf: 22, ga: 10, gd: 12, points: 12 },
    { position: 3, managerId: 4, manager: 'Mike Brearley', played: 5, won: 3, drawn: 1, lost: 1, gf: 18, ga: 12, gd: 6, points: 10 },
    { position: 4, managerId: 2, manager: 'Lee Gordon', played: 5, won: 2, drawn: 2, lost: 1, gf: 15, ga: 14, gd: 1, points: 8 },
    { position: 5, managerId: 5, manager: 'Chris Sherwood', played: 5, won: 1, drawn: 1, lost: 3, gf: 10, ga: 18, gd: -8, points: 4 },
    { position: 6, managerId: 3, manager: 'Scott Dormand', played: 5, won: 0, drawn: 1, lost: 4, gf: 7, ga: 22, gd: -15, points: 1 }
  ],
  cupScores: [
    { cupId: 1, cupName: 'Dream Cup', round: 2, homeManagerId: 1, homeManager: 'John Watson', awayManagerId: 3, awayManager: 'Scott Dormand', homeMargin: 5, awayMargin: -3, result: 'H' },
    { cupId: 1, cupName: 'Dream Cup', round: 2, homeManagerId: 6, homeManager: 'Dave Hartley', awayManagerId: 5, awayManager: 'Chris Sherwood', homeMargin: 9, awayMargin: -3, result: 'H' },
    { cupId: 1, cupName: 'Dream Cup', round: 2, homeManagerId: 2, homeManager: 'Lee Gordon', awayManagerId: 4, awayManager: 'Mike Brearley', homeMargin: 0, awayMargin: 2, result: 'A' }
  ],
  groups: [
    [
      { position: 1, managerId: 6, manager: 'Dave Hartley', played: 2, won: 2, drawn: 0, lost: 0, gf: 14, ga: 3, gd: 11, points: 6 },
      { position: 2, managerId: 1, manager: 'John Watson', played: 2, won: 1, drawn: 1, lost: 0, gf: 8, ga: 4, gd: 4, points: 4 },
      { position: 3, managerId: 3, manager: 'Scott Dormand', played: 2, won: 0, drawn: 0, lost: 2, gf: 3, ga: 10, gd: -7, points: 0 }
    ],
    [
      { position: 1, managerId: 4, manager: 'Mike Brearley', played: 2, won: 2, drawn: 0, lost: 0, gf: 9, ga: 4, gd: 5, points: 6 },
      { position: 2, managerId: 2, manager: 'Lee Gordon', played: 2, won: 1, drawn: 0, lost: 1, gf: 6, ga: 6, gd: 0, points: 3 },
      { position: 3, managerId: 5, manager: 'Chris Sherwood', played: 2, won: 0, drawn: 0, lost: 2, gf: 4, ga: 9, gd: -5, points: 0 }
    ]
  ]
}

const html = getHtmlStringFromFile('results.html', mockData)

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(html)
})

const port = 3003

server.listen(port, () => {
  console.log(`Email preview available at http://localhost:${port}`)
})
