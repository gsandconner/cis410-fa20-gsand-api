const express = require('express')
const db = require('./dbConnectExec.js');
//const { send } = require('process');
const jwt =require('jsonwebtoken')
const config =require('./config.js')
 const bcrypt = require('bcrypt')
const auth =require("./middleware/authenticate")
const cors=require('cors')
//azurewebsites.net, colostate.edu
const app = express();
app.use(express.json())

app.use(cors())


app.post('/Customer/logout', auth, (req,res)=>{
var query =`UPDATE Customer
SET CustomerToken =NULL
WHERE CustomerID = ${req.CustomerID.CustomerID}`
db.executeQuery(query)
.then(()=>{res.status(200).send()})
.catch((error)=>{console.log("Error in POST /contacts/logout", error)
res.status(500).send()
})
})

app.get('/CheckOut/me', auth,async(req,res)=>{
let CustomerID=req.CustomerID.CustomerID

let query= `SELECT *
FROM OrderTable
Where CustomerFK = ${CustomerID}`

let MyCheckout = await db.executeQuery(query)

console.log(MyCheckout)


})

app.post("/CheckOut",auth, async (req,res)=>{
  try{
    var StickerID= req.body.StickerID;
    var NumberOfItems=req.body.NumberOfItems;
    var DateOfOrder=req.body.DateOfOrder;
    

 let insertQuery =`INSERT INTO OrderTable(StickerID, DateOfOrder,NumberOfItems,CustomerFK)
 OUTPUT inserted.OrderID,inserted.DateOfOrder,inserted.NumberOfItems,inserted.StickerID
 VALUES(${StickerID},${DateOfOrder},${NumberOfItems},${req.CustomerID.CustomerID})`

 let insertedOrder = await db.executeQuery(insertQuery)
 //console.log(insertedOrder)
 res.status(201).send(insertedOrder[0])


  
    if(!StickerID|| !NumberOfItems ||!DateOfOrder){
        res.status(400).send("Bad Request")
    }
    console.log(req.CustomerID)
    res.send("Here is your response")}
  catch(error){
 console.log("There is an Error",error)
 res.status(400).send()
  }
})



app.post("/Customer/login", async (req,res)=>{
    //console.log(req.body)
    var CustomerEmail = req.body.CustomerEmail;
    var CustomerPassword = req.body.CustomerPassword;

    if(!CustomerEmail, !CustomerPassword){
 return res.status(400).send('bad request')
    }

    //1. Chech that Email Exists in Database
    var query =`SELECT *
    FROM Customer
    WHERE CustomerEmail = '${CustomerEmail}'`

    let result;
    try{
    result = await db.executeQuery(query);
    }catch(myError){
        console.log('Error in Contacts/login:',myError)
        return res.status(500).send()
    }
    console.log(result)
    if(!result[0]){return res.status(400).send('Invalid User Credentials')}
    //2. Check Password Matches
    let user = result[0];
    console.log(user);

    if(!bcrypt.compareSync(CustomerPassword,user.CustomerPassword)){
        console.log("Invalid Password")
        return res.status(400).send("Invalid user crendentials")
    }
    //3. Generate Token
    let token = jwt.sign({CustomerID: user.CustomerID}, config.JWT, {expiresIn: '60 minutes'})
    console.log(token)
    //4. Save Token

let setTokenQuery = `UPDATE Customer
SET CustomerToken = '${token}'
WHERE CustomerID =${user.CustomerID}`

try{
    await db.executeQuery(setTokenQuery)
    res.status(200).send({
        token:token,
        user: {
            CustomerFName: user.CustomerFName,
            CustomerLName: user.CustomerLName,
            CustomerEmail: user.CustomerEmail,
            CustomerID:user.CustomerID
        }

    })
}
catch(myError){
    console.log("Error setting user token",mytoken)
    res.status(500).send()
}

})

app.get('/contacts/me',auth,(req,res)=>{
    res.send(req.ContactID)
})

app.get("/hi",(req,res)=>{
    res.send("hello World")
})
app.post("/Customer", async (req,res)=>{
    res.send("creating user")
    console.log("request body", req.body)

var CustomerFName =req.body.CustomerFName;
var CustomerLName =req.body.CustomerLName;
var CustomerEmail =req.body.CustomerEmail;
var CustomerPassword=req.body.CustomerPassword;

if(!CustomerFName || !CustomerLName || !CustomerEmail ||!CustomerPassword){
    return res.status[400].send("Bad Request")
}
CustomerFName=CustomerFName.replace("'","''")
CustomerLName=CustomerLName.replace("'","''")

var emailCheckQuery=`SELECT CustomerEmail
FROM Customer
WHERE CustomerEmail='${CustomerEmail}'`

var existingUser = db.executeQuery(emailCheckQuery)


//console.log("existing user", existingUser)

if(existingUser[0]){
    return res.status(409).send('Please Enter a Different Email.')}

var hashedPassword = bycrypt.hashSync(CustomerPassword)

var insertQuery =`INSERT INTO Customer(CustomerFName,CustomerLName,CustomerEmail,CustomerPassword,CustomerStreet,CustomerState,CustomerZip,CustomerPhone)
VALUES('${CustomerFName}','${CustomerLName}','${CustomerEmail}','${hashedPassword}','123 Dove Lane','CO','1234567','99999999')`
db.executeQuery(insertQuery).then(()=>{res.status[201].send()})
.catch((myError)=>{
    console.log("ERROR")
})

})
app.get("/stickers", (req,res)=>{
db.executeQuery (`SELECT *
FROM Sticker
left join Artist
ON Artist.ArtistID = Sticker.ArtistID`)

.then((result)=>{
res.status(200).send(result)
})
.catch((myError)=>{
    console.log(myError)
    res.status(500).send()
})
})
app.get("/stickers/:ID", (req,res)=>{
    var ID =req.params.ID
    //console.log("myID:" , ID)
    var myQuery = `SELECT *
    FROM Sticker
    left join Artist
    ON Artist.ArtistID = Sticker.ArtistID
    WHERE StickerID =${ID}`

    db.executeQuery(myQuery)
    .then((stickers)=>{
        //console.log("Stickers: ", stickers)

        if(stickers[0]){
            res.send(stickers[0])
        }else{
            res.status(404).send('bad request')
        }
        
    })
    .catch((myError)=>{
        console.log("ERROR",myError)
        res.status(500).send()
                })
})
const PORT=process.env.PORT ||5000
app.listen(PORT,()=>{console.log(`app is running on port ${PORT}`)})