const express = require('express')
const db = require('./dbConnectExec.js')



//azurewebsites.net, colostate.edu
const app = express();
app.use(express.json())


app.get("/hi",(req,res)=>{
    res.send("hello World")
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

app.listen(5000,()=>{console.log("app is running on port 5000")})