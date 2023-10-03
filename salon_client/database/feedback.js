import mongoose from 'mongoose';

const UserSchema= new mongoose.Schema({
    customerid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
    },
    feedback:String
});

export default mongoose.model("feedbacks",UserSchema); 