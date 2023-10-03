import mongoose from 'mongoose';

const productSchema= new mongoose.Schema({
    name:String,
    type:String,
    quantity:Number,
    price:Number,
    brand:String,
    description:String,
    photo:String,
    subcategoryid:{
        type:[{type: mongoose.Schema.Types.ObjectId, ref:'product_sub_cats'}],
        required: [true,"Product Sub-Category is required"]
    },
    status:Number
});

export default  mongoose.model("products",productSchema); 