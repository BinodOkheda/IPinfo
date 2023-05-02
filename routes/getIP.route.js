const express = require("express");
const app = express()
const getIP = express.Router()
var winston = require('winston');
const { authUser } = require("../middlewares/auth.middleware");
const { checkIP } = require("../middlewares/checkIP.middleware");
const axios = require("axios")
require('winston-mongodb');

const Redis = require("redis");
const { SearchModel } = require("../models/userSearch.model");

const redis_client = new Redis.createClient()

// Use Winston for logging - log any errors in application to a collection in the DB.
winston.add(new winston.transports.MongoDB({
    level:"error.",
    collection:"error",
}));


getIP.get("/",authUser,checkIP,async (req,res)=>{

    try {
        const {ip} = req.body;

        const token = req.headers.authorization.split(" ")[0]
        const decode = jwt.verify(token, process.env.jwtSecret)

        // Use MongoDB Atlas to store each user's searches in the DB
        const search = new SearchModel({userId:decode.userID, IP:ip})
        await search.save()
 
        // ^ Implement a mechanism to check if the data is already present in Redis before making an API call to get IP Info.
        const city = redis_client.get(ip);
        if(city){
            return res.send({ip,city})
        }

        const responses = axios({
            method: 'get',
            url: `https://ipapi.co/${ip}/json/`
          })

        //   The data stored in Redis for a particular IP should expire in 6 hours.
        if(responses){
            redis_client.set(ip,responses.city,"EX",60*6)

            return res.send({ip,city:responses.city})
        }else{
            return res.status(500).send({msg:"please try again later..."})
        }
       


    } catch (error) {
        res.send({msg:error.message})
    }

})

module.exports={
    getIP
}