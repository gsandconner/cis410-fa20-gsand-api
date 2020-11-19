const jwt = require("jsonwebtoken")
const config = require('../config.js')

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
//Save information in request
    }catch(myError){
        res.status(401).send("Authentication Failed")
    }
}
module.exports=auth