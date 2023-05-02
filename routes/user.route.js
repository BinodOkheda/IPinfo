const express = require("express");
const app = express()
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const userRouter = express.Router();
const jwt = require("jsonwebtoken")
require("dotenv").config()
app.use(express.json())
const Redis = require("redis")

const redis_client = new Redis.createClient()


userRouter.post("/register", async (req,res)=>{

    try {
        const {name, email, password} = req.body

        const user = await UserModel.findOne({email});
        if(user){
            return res.send({msg:"User already register...."})
        }


        const hash = bcrypt.hashSync(password,8)

        const new_user = new UserModel({name,email, password:hash})
        await new_user.save()

        res.send("registation successfull.....")

    } catch (error) {
        res.send({msg:error.message})
    }

})


userRouter.post("/login",async ( req,res)=>{
    const {email,password} = req.body;

    try {
        const user = await UserModel.findOne({email})
        
        const result = bcrypt.compareSync(password, user.password);

        if(!result){
            return res.send({msg:"wrong credential......!!"})
        }

        const token = jwt.sign({ userID:user._id }, process.env.jwtSecret);

        res.send({user,token})

    } catch (error) {
        res.send({msg:error.message})
    }
})

userRouter.get("/logout",async (req,res)=>{
    try {
        
        const token = req.headers.authorization.split(" ")[0]

        const decode = jwt.verify(token, process.env.jwtSecret)

        //blacklist token..
        redis_client.set(decode.userID,token)

        res.send({msg:"logout successfull...."})


    } catch (error) {
        res.send({msg:error.message})
    }
})


module.exports={
    userRouter
}