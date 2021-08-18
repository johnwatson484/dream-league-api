const mapPosition = (position) => {
  switch (position) {
    case 'GK':
      return 'Goalkeeper'
    case 'DEF':
      return 'Defender'
    case 'MID':
      return 'Midfielder'
    case 'FWD':
      return 'Forward'
    default:
      return undefined
  }
}

module.exports = mapPosition
