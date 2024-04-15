const express = require("express")
const mongoose = require("mongoose")
const nftRoute = require("./routes/nft.route.js")
const cors = require("cors")
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

const app = express()
app.use(cors(corsOptions))

app.use(express.json())
app.use("/api/nfts", nftRoute)

mongoose
    .connect(
        "mongodb+srv://camillehenrotte:3gB0puUX51CtSsKH@nfturl.hetecbc.mongodb.net/Node-API?retryWrites=true&w=majority&appName=nftURL"
    )
    .then(() => {
        console.log("Conneted to the database")
        app.listen(3001, () => {
            console.log("Server is running on port 3001")
        })
    })
    .catch((error) => {
        console.log("Connection failed !")
        console.log(error)
    })
