const jwt = require("jsonwebtoken")
const config = require('../config.js')
const db=require('../dbConnectExec.js')
const auth =async(req,res,next)=>{
    //console.log(req.header("Authorization"))
    try{
//decode token

let myToken = req.header('Authorization').replace('Bearer ','')
//console.log(myToken)
let decodedtoken = jwt.verify(myToken, config.JWT)
console.log(decodedtoken)

let CustomerID=decodedtoken.CustomerID;
console.log(CustomerID)
//compare token with db token
let query = `SELECT CustomerID,CustomerFName,CustomerLName,CustomerEmail
FROM Customer
WHERE CustomerID=${CustomerID} and CustomerToken = '${myToken}'`

let returnedUser = await db.executeQuery(query)
console.log(returnedUser)
//Save information in request
if (returnedUser[0]){
    req.CustomerID= returnedUser[0];
    next()
}
else{returnedUser.status(401).send('Authentication Failed.')}
   
}catch(myError){
        res.status(401).send("Authentication Failed.")
    }
}
module.exports=auth