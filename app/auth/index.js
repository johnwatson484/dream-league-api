const people = {
  1: {
    id: 1,
    name: 'Jen Jones'
  }
}

async function validate (decoded, request, h) {
  console.log(decoded)
  if (!people[decoded.id]) {
    return { isValid: false }
  }
  return { isValid: true }
}

module.exports = validate
