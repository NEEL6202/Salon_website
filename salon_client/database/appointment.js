import mongoose from 'mongoose';



const appointmentSchema= new mongoose.Schema({
    customerid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
    },
    cdate:{
        type:Date,
        value:Date.now()
    },
    adate:Date,
    atime:String,
    service: Array,
    barber: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
    },
    payment:{
        type: String,
        default: "pending"
    },
    status:{
        type:Number,
        default:"0"
    }
    // serviceid:{
    //     type:[{type: mongoose.Schema.Types.ObjectId, ref:'Service'}],
    //     required: [true,"Service is required"]
    // },
    // packageid:{
    //     type:[{type: mongoose.Schema.Types.ObjectId, ref:'packages'}],
    //     required: [true,"Package is required"]
    // }


});


 function barber_d()
 {
    return mongoose.model()
 }
export default mongoose.model("appointment",appointmentSchema);

