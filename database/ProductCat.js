import mongoose from 'mongoose';

const productcatSchema= new mongoose.Schema({
    pcatname:String,
});

export default mongoose.model("product_cat",productcatSchema); 