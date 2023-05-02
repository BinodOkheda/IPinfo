const express = require("express");
const app = express();
const Redis = require("redis")
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user.route");
const { authUser } = require("./middlewares/auth.middleware");
const { getIP } = require("./routes/getIP.route");

require("dotenv").config()

const PORT = process.env.PORT || 8000

app.get("/",(req,res)=>{

  res.send("Home page...!!")

})

app.use("/user",userRouter)
app.use("/ip",getIP)






app.listen(PORT,async (req,res)=>{

    try {
        
            await mongoose.connect(process.env.MongoURL)

            console.log("connected to DB")

    } catch (error) {
        
        console.log(error.message)

    }



    console.log(`Server is running at ${PORT}`)
})