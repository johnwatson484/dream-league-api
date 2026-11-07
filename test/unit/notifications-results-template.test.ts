import { getHtmlStringFromFile } from '../../src/notifications/get-html-string.ts'

test('renders emailed scores alphabetically while preserving scores and league standings', () => {
  const scores = [
    { managerId: 3, manager: 'Charlie', goals: 4, conceded: 0, result: 'W', scorers: [{ name: 'Smith', goals: 4 }] },
    { managerId: 2, manager: 'Bob', goals: 2, conceded: 1, result: 'W', scorers: [] },
    { managerId: 1, manager: 'alice', goals: 0, conceded: 3, result: 'L', scorers: [] },
  ]
  const table = [{ manager: 'Charlie', position: 1 }, { manager: 'Bob', position: 2 }, { manager: 'alice', position: 3 }]

  const html = getHtmlStringFromFile('results.html', { gameweekId: 1, scores, table, winners: [], cupScores: [], groups: [] })
  const scoreSection = html.split('<!-- ===== SCORES SECTION ===== -->')[1]!.split('<!-- ===== TABLE SECTION ===== -->')[0]!
  const tableSection = html.split('<!-- ===== TABLE SECTION ===== -->')[1]!.split('<!-- ===== WINNERS SECTION ===== -->')[0]!

  expect(scoreSection.indexOf('alice')).toBeLessThan(scoreSection.indexOf('Bob'))
  expect(scoreSection.indexOf('Bob')).toBeLessThan(scoreSection.indexOf('Charlie'))
  expect(scoreSection).toContain('4 - 0')
  expect(scoreSection).toContain('0 - 3')
  expect(scoreSection).toContain('Smith (4)')
  expect(tableSection.indexOf('Charlie')).toBeLessThan(tableSection.indexOf('Bob'))
  expect(tableSection.indexOf('Bob')).toBeLessThan(tableSection.indexOf('alice'))
  expect(scores.map(score => score.manager)).toEqual(['Charlie', 'Bob', 'alice'])
})
