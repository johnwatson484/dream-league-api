const rankPosition = (position) => {
  switch (position) {
    case 'Defender':
      return 0
    case 'Midfielder':
      return 1
    default:
      return 2
  }
}

module.exports = {
  rankPosition
}
