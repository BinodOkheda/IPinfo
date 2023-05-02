const express = require("express");
const app = express();

app.use(express.json());


const Redis = require("redis")

const redis_client = new Redis.createClient()


const authUser = async (req,res,next)=>{

    try {
        
        const token = req.headers.authorization.split(" ")[0]
        
        const decode = jwt.verify(token, process.env.jwtSecret)

        //get blacklist token from redis
        const blacklist = redis_client.get(decode.userID)

        if(token === blacklist){
            return res.send({msg:"please login first....!"})
        }

        //check the token is decoded or not..
        if(decode){
            next()
        }else{
            return res.send({msg:"please login first....!"})
        }

    } catch (error) {
        res.send({msg:error.message})
    }


}


module.exports={
    authUser
}