const mongoose=require("mongoose");


const tokenSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"User",
        required:true
    },
    store:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Store",
        required:true
    },
    status:{
        type:String,
        enum:["active" , "used" , "cancelled"],
        default:"active"
    },
    tokenNumber:{ // unique token number 
        type:Number,
    },
    tokenPosition:{
        type:Number,
        default:1,
    },
    prescription:{
        
            uploaded:{
                type:Boolean , default:false,
            },
            imageUrl:String ,

        
        // type:mongoose.Schema.Types.ObjectId,
        // ref:"Prescription",  
    },
    
},{
    timestamps:true
})

module.exports=mongoose.model("Token" , tokenSchema);