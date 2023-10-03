import mongoose from "mongoose";

const ConnectDb= async() =>{
    try{
        const con= await mongoose.connect(process.env.MONGO_URL);
        console.log("conection sucess..")
    }catch(error){
        console.log("error in mongodb connection")
    }
}

export default ConnectDb;