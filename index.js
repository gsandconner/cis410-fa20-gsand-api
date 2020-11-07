const express = require('express')
const db = require('./dbConnectExec.js');
const { send } = require('process');



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
app.listen(5000,()=>{console.log("app is running on port 5000")})