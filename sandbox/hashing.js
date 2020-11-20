const bcrypt = require('bcrypt')

var hashedPassword = bcrypt.hashSync('asdfasdf')

console.log(hashedPassword)

var hashTest = bcrypt.compareSync('asdfasdf',hashedPassword)
console.log(hashTest)