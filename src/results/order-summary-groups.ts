interface ManagerRow {
  managerId: number
}

interface NamedGroup {
  name: string
  managers: ManagerRow[]
}

function membershipKey (managers: ManagerRow[]): string {
  return managers.map(manager => manager.managerId).sort((a, b) => a - b).join(',')
}

// Saved summaries contain tables without group IDs or names. Match their complete
// membership to current groups; leave unidentifiable historical tables in place.
export function orderSummaryGroups<T extends ManagerRow> (tables: T[][], groups: NamedGroup[]): T[][] {
  const names = new Map<string, string | null>()
  for (const group of groups) {
    const key = membershipKey(group.managers)
    if (key) {
      names.set(key, names.has(key) ? null : group.name)
    }
  }

  const entries = tables.map(table => ({ table, name: names.get(membershipKey(table)) }))
  const ordered = entries.filter(entry => entry.name != null)
    .sort((a, b) => a.name!.localeCompare(b.name!, 'en', { sensitivity: 'base' }))
  let index = 0
  return entries.map(entry => entry.name == null ? entry.table : ordered[index++]!.table)
}
