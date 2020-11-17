const jwt =require('jsonwebtoken')
let myToken= jwt.sign({CustomerID:18},"secretPassword",{expiresIn: '60 minutes'})

console.log(myToken)

let myDecoded = jwt.verify(myToken,'secretPassword');
console.log('my decode',myDecoded)