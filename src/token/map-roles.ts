export function mapRoles (roles: any[]): string[] {
  return roles.map((x: any) => x.Role ? x.Role.name : x.name)
}
