const mongoose = require("mongoose");


const searchSchema = mongoose.Schema({
    
    userId:{
        type:String,
        required:true,
      
    },
    IP  :{
        type:String,
        required:true
    }
})


const SearchModel = mongoose.model("search",searchSchema)

module.exports={

   SearchModel

}