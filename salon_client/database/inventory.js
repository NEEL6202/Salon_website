import mongoose from 'mongoose';


const inventorySchema= new mongoose.Schema({
    name:String,
    Pur_date:Date,
    Pur_place:String,
    price:Number,
    quantity:Number,
    status:Number
});

export default  mongoose.model("inventory",inventorySchema); 