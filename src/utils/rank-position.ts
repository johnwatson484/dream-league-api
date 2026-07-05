export function rankPosition (position: string | undefined): number {
  switch (position) {
    case 'Defender':
      return 0
    case 'Midfielder':
      return 1
    default:
      return 2
  }
}
