
import mongoose from 'mongoose';

//const bcrypt = require('bcryptjs');

const userSchema= new mongoose.Schema({
    name:String,
    gender:String,
    dob:Date,
    address:String,
    pincode:Number,
    contactno:Number,
    email:String,
    password :{
        type: String,
        // required: [true,'Please add a Password'],
        // minlength: [6,'Password must have 6 charaters'],
        // match:[/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/]
    },
    doj:Date,
    salary:Number,
    role:String,
    otp:String,
    status:Number,
    
});


export default mongoose.model("users",userSchema);