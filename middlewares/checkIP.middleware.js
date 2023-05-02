

const express = require("express");
const app = express();
app.use(express.json())


const checkIP = (req,res,next)=>{
    const regex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/

    const {ip} = req.body;

    if(regex.test(ip)){
        next()
    }else{
        return res.send({msg:"please enter the valide ip address...."})
    }
}

module.exports={
    checkIP
}