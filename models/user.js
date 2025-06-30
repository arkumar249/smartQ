const mongoose = require('mongoose');
const bcrypt=require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    phone: {
        type: String,
        default: null,

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
   
    password: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user',
    },
    ActiveToken:{
        type:Boolean,
        default:false
    },
    tokensRequested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Token' }]
}, {
    timestamps: true
}
);


userSchema.pre("save" , function (next){
    const USER=this;
    const saltRounds=10;
    bcrypt.hash(USER.password , saltRounds ).then((hash)=>{
        this.password=hash;
        console.log(hash);
        next(); 
    }).catch((err)=>next(err));
    
})

const User = mongoose.model('User', userSchema);
module.exports = User;
