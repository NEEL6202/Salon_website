import mongoose from 'mongoose';

const packageSchema= new mongoose.Schema({
    pname:String,
    serviceid:{
        type:[{type: mongoose.Schema.Types.ObjectId, ref:'Service'}],
        required: [true,"Service is required"]
    },
    price:String,
    status:Number
});

export default  mongoose.model("packages",packageSchema); 