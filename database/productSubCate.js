import mongoose from 'mongoose';

const productsubcatSchema= new mongoose.Schema({
    psubcatname:String,
    categoryid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'product_cat',
    }
});

export default mongoose.model("product_sub_cats",productsubcatSchema); 