const bcrypt = require('bcrypt.js')

var hashedPassword = bcrypt.hashSync('asdfasdf')

console.log(hashedPassword)

var hashTest = bcrypt.compareSync('asdfasdf',hashedPassword)
console.log(hashTest)