import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import ConnectDb from './database/config.js';

import nodemailer from 'nodemailer';
import cors from "cors";

import User from "./database/user.js";
import Product from "./database/product.js";
import Service from "./database/service.js";
import Inventory from "./database/inventory.js";
import Package from "./database/package.js";
import Appointment from "./database/appointment.js";
import ProductCat from "./database/ProductCat.js";
import productSubCate from "./database/productSubCate.js";
import Feedback from "./database/feedback.js";

import path from "path";
import Razorpay from "razorpay";
import crypto from "crypto";
import { fileURLToPath } from "url";

import stripe from "stripe";("sk_test_51N1nURSJ0heUjZB8De7lFuFEA303FF1viJuVdRuWas55BBjY3U3evQUtsXTaiGO4TPrnk5Zq6dZXeeoEyEiGP0nQ009F8Nne9L")
import {v4 as uuidv4} from 'uuid';

import multer from 'multer';
import parse from 'path';
import  Response  from 'express';
import  error  from 'console';



import OTPG from "otp-generator";
import Jwt from "jsonwebtoken";

const jwtKey = 'SALON'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// config env
dotenv.config();

//database config
ConnectDb();

// rest object
const app = express();

// midlle ware

app.use(express.json());
app.use(morgan('dev'));


app.use(express.static(path.join(__dirname, './salon_client/build')))
app.use(cors());


app.use('*', function(req,resp){
    resp.sendFile(path.join(__dirname, './salon_client/build/index.html'))
});
// app.use('/Upload',express.static("./Upload"));
app.use("/Upload", express.static("Upload"));





// rest api
// app.get('/', (req,resp) => {
//     resp.send({
//         message : "welcome to app",
//     });
// });


app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    // let otp = Math.floor(100000 + Math.random() * 900000);
    // const mailOptions = {
    //     from: '"SALON DIVINE"19bmiit066@gmail.com',
    //     to: req.body.email,
    //     subject: "Verify Your Email",
    //     html: '<p>Verify your email address to complete the signup and login into your account.</p><p>This link expires in 6 hours</p><p>Press to Procced.</p></a>'+otp
    // };
    let result = await user.save();
    // transporter.sendMail(mailOptions)
    result = result.toObject();
    delete result.password;
    // Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
            //     if (err) {
            //         resp.send({ result: "Something went wrong!!" })
            //     }
            //     resp.send({ result, auth: token })
            // })
    resp.send(result);
    
})

app.post("/registeremp", async (req, resp) => {
    console.log(req.body);
    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      'abcdefghijklmnopqrstuvwxyz0123456789@#$';
  
    for (let i = 1; i <= 8; i++) {
      var char = Math.floor(Math.random()
        * str.length + 1);
  
      pass += str.charAt(char)
    }

    let user = new User({
        name:req.body.name,
        gender:req.body.gender,
        dob:req.body.dob,
        address:req.body.address,
        pincode:req.body.pincode,
        contactno:req.body.contactno,
        email:req.body.email,
        password:pass,
        doj:Date(),
        salary:req.body.salary,
        role:req.body.role
    });

    
    const mailOptions = {
        from: '"SALON DIVINE"19bmiit066@gmail.com',
        to: req.body.email,
        subject: "Login Details",
        html: '<p>To login into your account</p><p>Your Username is your <b>Email ID</b> & </p> Your password is </p><b>'+pass+'</b>'
    };
    let result = await user.save();
    transporter.sendMail(mailOptions)
    result = result.toObject();
    delete result.password;
    // Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
            //     if (err) {
            //         resp.send({ result: "Something went wrong!!" })
            //     }
            //     resp.send({ result, auth: token })
            // })
    resp.send(result);
    
})


app.put("/changepassword", async (req, resp) => {

    let user = await User.findById(req.body.id)
    // console.log(user)
    // if(user.password == req.body.oldpassword){
        let result = User.findByIdAndUpdate(req.body.id, { password: req.body.newpassword }, { useFindAndModify: false})
        .then((response) => {
            console.log("The password updates")
            return resp.send(response)
        })
        .catch((error) => {
            return resp.send(error)
        })
        // return console.log(result)
    // }else{
    //     console.log("Password is not match")
    //     return resp.send("Password is not match")
    // }
    // return console.log(user.password)

})

app.put("/CheckOTP", async (req, resp) => { 
    // return console.log(req.body.otp);

    let user = await User.findOne({otp: req.body.otp}).then((response) => {
        // return console.log(response)
        if(!response){
            return resp.send("The Otp is not match")
        }
        if(response.otp == req.body.otp){
            // console.log(response._id)
            return resp.send(response._id)
            // return resp.send(response._id)
        }else{
            console.log("not")
            return resp.send("The otp is not match")
        }
    })
    .catch((error) => {
        resp.send(error)
    })
    // console.log(user)
    // if(user.otp == req.body.otp)
    // {
    //     return console.log("Otp Match")
    // }
    // else{
    //     return console.log("Otp not match")
    // }
    // if(user.password == req.body.oldpassword){
    //     let result = User.findByIdAndUpdate(req.body.id, { password: req.body.newpassword }, { useFindAndModify: false})
    //     .then((response) => {
    //         return resp.send("The password updated")
    //     })
    //     .catch((error) => {
    //         return resp.send(error)
    //     })
    //     // return console.log(result)
    // }else{
    //     return resp.send("Password is not match")
    // }
    // return console.log(user.password)

})

app.put("/forgotpasswordupdate", async (req, resp) => { 
    console.log(req.body.id);
    console.log(req.body.newpassword);
    console.log(req.body.oldpassword);

    let user = await User.findByIdAndUpdate(req.body.id, {password: req.body.newpassword}).then((response) => {
        if(!response){
            console.log("The user is not found")
            return resp.send("The Otp is not match")          
        }else{
            let result = User.findByIdAndUpdate(req.body.id, {otp: ""}).then((response) => {
                return resp.send(response)
            }).catch((error) =>
            {
                return resp.send(error)
            })
            // return resp.send(response)
        }
    })
    .catch((error) => {
        resp.send(error)
    })
});

app.post("/verifyemail", async (req, resp) => {
    var bodyemail = req.body.email
    // return console.log(req.body.email)
    // return console.log("Hello")
    // var bodyotp = req.body.otp
    let otp = Math.floor(100000 + Math.random() * 900000);
    let usersDetails = await User.findOneAndUpdate({email : req.body.email}, {otp: otp})
    // return console.log(usersDetails)
    // return console.log(usersDetails)
    if(usersDetails){
        const mailOptions = {
            from: '"SALON DIVINE"19bmiit066@gmail.com',
            to: req.body.email,
            subject: "Verify Your Email",
            html: '<a href="http://localhost:3000/otpverification"><p>Please Verify your email address to complete the signup and login into your account.</p><p>This link expires in 6 hours</p><p>Press to Procced.</p></a>'+otp
        };
        transporter.sendMail(mailOptions)
    }
    
    let verifyemail = await User.find({email:bodyemail})
    if (verifyemail.length > 0) {
        sendMail(bodyemail,otp);
        var id = verifyemail._id
        var obj = {id,otp}
        console.log(otp)
        resp.send(verifyemail);
        console.log(verifyemail);
    }
    else {
        resp.send({ result: "No User Found" })
    }
})

app.post("/login", async (req, resp) => {

    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        //alert(user);
        if (user) {
            // Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
            //     if (err) {
            //         resp.send({ result: "Something went wrong!!" })
            //     }
            //     resp.send({ user, auth: token })
            // })
            resp.send(user)
        }
        else {
            resp.send({ result: 'No user found' })
        }
    } else {
        resp.send({ result: 'No user found' })
    }



})

app.post('/forgotpw',async (req,resp) => {
    try{
        let email = req.body.email;
        let otp = req.body.otp;
        console.log(email)
        sendMail(email,otp)
    }
    catch{
        console.log(e.message);
    }
})



app.get("/employees", async (req, resp) => {
    let user = await User.find();
    if (user.length > 0) {
        resp.send(user)
    }
    else {
        resp.send({ result: "No User Found" })
    }
})

app.get("/barber", async (req, resp) => {
    let user = await User.find({role:'employee'});
    if (user.length > 0) {
        resp.send(user)
    }
    else {
        resp.send({ result: "No User Found" })
    }
})

app.delete("/employees/:id", async (req, resp) => {
    const result = await User.deleteOne({ _id: req.params.id })
    resp.send(result);
})

app.get("/employees/:id", async (req, resp,next) => {
    let result = await User.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})
app.put("/employees/:id", async (req, resp, next) => {
    let result = await User.updateMany(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result)
});

app.post('/resetpw',async (req,resp) => {
    return console.log(req.body)
    try{
        let user = await User.findById(req.body.id)

        return console.log(user)
    }
    catch{
        console.log(e.message);
    }
})

app.post("/addservice", async (req, resp) => {
    let manager = new Service(req.body);
    let result = await manager.save();
    result = result.toObject();
    resp.send(result);

})

//---------------find service by name-------------------
app.get("/service_name/:name", async (req,resp)=>{
    //console.log("service")
    //console.log(req.params.name);
    let result = await Service.findOne({price:req.params.name});
    if(result)
    {
        //console.log(result.name)
        resp.send(result._id)
    }
    else
    {
        resp.send({result:"No Product Found"})
    }
})





app.get("/service", async (req, resp) => {
    let services = await Service.find();
    if (services.length > 0) {
        resp.send(services)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})

app.delete("/service/:id", async (req, resp) => {
    const result = await Service.deleteOne({ _id: req.params.id })
    resp.send(result);
})

app.get("/service/:id", async (req, resp) => {
    let result = await Service.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})
app.put("/service/:id", async (req, resp, next) => {
    let result = await Service.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result)
});

app.post("/addinventory", async (req, resp) => {
    let manager = new Inventory(req.body);
    let result = await manager.save();
    result = result.toObject();
    resp.send(result);

})

app.get("/inventory", async (req, resp) => {
    let inventory = await Inventory.find();
    if (inventory.length > 0) {
        resp.send(inventory)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})

app.delete("/inventory/:id", async (req, resp) => {
    const result = await Inventory.deleteOne({ _id: req.params.id })
    resp.send(result);
})

app.get("/inventory/:id", async (req, resp) => {
    let result = await Inventory.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})
app.put("/inventory/:id", async (req, resp, next) => {
    let result = await Inventory.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result)
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./Upload");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

//photo filters
const fileFilter = (req, file, callback) => {
    const acceptableExt = [".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"];
    if (!acceptableExt.includes(Path.extname(file.originalname))) {
        return callback(new Error("Only .png, .jpg and .jpeg format allowed !!"));
    }
    const filesize = parseInt(req.headers["content-length"]);
    if (filesize > 1048576) {
        return callback(new Error("File Size Big!"));
    }
    callback(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    filesize: 1048576
});

//getallphotos
app.post("/add-product", upload.single("photo"), async (req, resp, next) => {
    
    const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

    // return console.log(req.body.name," ",req.body.type," ",req.body.quantity," ",req.body.price," ",req.body.brand," ",req.body.description," ", path);

    // return console.log(path);
    var model = {
        name: req.body.name,
        type: req.body.type,
        quantity: req.body.quantity,
        price: req.body.price,
        brand: req.body.brand,
        description: req.body.description,
        photo: path
    }

    let product = new Product(model);
    let result = await product.save();
    resp.send(result);
})



// app.post("/add-product", async (req,resp) => {
//     let product = new Product(req.body)
//     let result = await product.save();
//     resp.send(result);
// })

app.get("/products", async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})

app.delete("/products/:id", async (req, resp) => {
    const result = await Product.deleteOne({ _id: req.params.id })
    resp.send(result);
})

app.get("/products/:id", async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})
app.put("/products/:id", upload.single("photo"), async (req, resp, next) => {

    const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
  
    if(!path){
        var model = {
            name: req.body.name,
            type: req.body.type,
            quantity: req.body.quantity,
            price: req.body.price,
            brand: req.body.brand,
            description: req.body.description
        }
    }else{
        var model = {
            name: req.body.name,
            type: req.body.type,
            quantity: req.body.quantity,
            price: req.body.price,
            brand: req.body.brand,
            description: req.body.description,
            photo: path
        }
    }
    
    // return console.log(model)

    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: model
        }
    )
    resp.send(result)
});

app.get("/search/:key", async (req, resp) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { type: { $regex: req.params.key } },
            { brand: { $regex: req.params.key } },
            { description: { $regex: req.params.key } },
            { category: { $regex: req.params.key } }
        ]
    });
    resp.send(result)
})

app.get("/searchinv/:key", async (req, resp) => {
    let result = await Inventory.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { Pur_place: { $regex: req.params.key } }
        ]
    });
    resp.send(result)
})

app.get("/searchuser/:key", async (req, resp) => {
    let result = await User.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { gender: { $regex: req.params.key } },
            { address: { $regex: req.params.key } },
            { email: { $regex: req.params.key } },
            { role: { $regex: req.params.key } }
        ]
    });
    resp.send(result)
})

app.get("/searchservice/:key", async (req, resp) => {
    let result = await Service.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { duration: { $regex: req.params.key } },
            { price: { $regex: req.params.key } },

        ]
    });
    resp.send(result)
})

app.post("/addpackage", async (req, resp) => {
    let manager = new Package(req.body);
    let result = await manager.save();
    result = result.toObject();
    resp.send(result);

})

app.get("/package", async (req, resp) => {
    let packages = await Package.find().populate('serviceid', 'name');
    if (packages.length > 0) {
        resp.send(packages)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})

app.delete("/package/:id", async (req, resp) => {
    const result = await Package.deleteOne({ _id: req.params.id })
    resp.send(result);
})

app.get("/package/:id", async (req, resp) => {
    let result = await Package.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})
app.put("/package/:id", async (req, resp, next) => {
    let result = await Package.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result)
});

app.get("/searchpackage/:key", async (req, resp) => {
    let result = await Package.find({
        "$or": [
            { pname: { $regex: req.params.key } },
            { price: { $regex: req.params.key } }

        ]
    });
    resp.send(result)
})

//-------------book appointment------------
app.post("/book_appointment", async(req,resp) =>{

        let result= new Appointment(req.body);
        let  result1 = await result.save();
        result1 = result1.toObject();
        resp.send(result1);
        //console.log(result1);
})


app.post("/payment",(req,res) => {
    const {product , token } = req.body;
    console.log("Product",product);
    console.log("Price",product.price);
    // To avoid duplication for payments
    const idempotencyKey = uuid();
    return stripe.customers.create({
    email:token.email,
    source:token.id
    })
    .then(customer =>{
    stripe.charger.create({
    amount: product.price * 100,
    currency:'usd',
    customer:customer.id,
    receipt_email: token.email,
    description: `purchase of $(product.name)`,
    shipping: {
    name: token.card.name,
    address:{
    country:token.card.address_country
    }
    }
    },{idempotencyKey})})
    .then(result => res.status(200).json(result))
    .catch(err => {console.log(err)})
    })    
// --------------view appointment-----------------
app.get("/appointment", async (req,resp)=>{
    let appointment = await Appointment.find();
    if(appointment.length>0)
    {
       // console.log(appointment)
        resp.send(appointment)
    }
    else
    {
        resp.send({result:"No Product Found"})
    }
})

app.get("/user-appointment/:id", async (req,resp)=>{
    let appointment = await Appointment.find({_id:req.params.id});
    if(appointment.length>0)
    {
       // console.log(appointment)
        resp.send(appointment)
    }
    else
    {
        resp.send({result:"No Product Found"})
    }
})

app.get("/customer-view-appointment/:id", async (req,resp)=>{
    let appointment = await Appointment.find({customerid:req.params.id}).populate("barber");
    if(appointment.length>0)
    {
       // console.log(appointment)
        resp.send(appointment)
    }
    else
    {
        resp.send({result:"No Product Found"})
    }
})

//-------------view-Appointment-By-aprrove/cancle
app.get("/appointment_status/:bid", async (req,resp)=>{
    console.log(req.body)
    let result = await Appointment.find({status:'0',barber:req.params.bid}).populate("customerid").populate("barber");
    console.log(result)
    if(result)
    {
        resp.send(result)
    }
    else
    {
        resp.send({result:"No Product Found"})
    }
})



//-------------delete appointment-------------------
app.delete("/appointment/:id",async(req,resp)=>{
    const result = await Appointment.deleteOne({_id:req.params.id})
    resp.send(result);
})


//------------view appointment by id-----------------
app.get("/appointment/:id", async (req,resp)=>{
    let result = await Appointment.findOne({_id:req.params.id});
    if(result)
    {
        resp.send(result)
    }
    else
    {
        resp.send({result:"No Product Found"})
    }
})


//------------view appointment by approve or cancle-----------------
app.get("/appointment_status", async (req,resp)=>{
    //console.log(req.body)
    let result = await Appointment.findOne({status:'0'});
    if(result)
    {
        resp.send(result)
    }
    else
    {
        resp.send({result:"No Product Found"})
    }
})




//----------update appointment---------------------
app.put("/appointment/:id" , async(req,resp, next)=>{
    let result = await Appointment.updateOne(
        {_id: req.params.id},
        {
            $set : req.body
        }
    )
    resp.send(result)
});


//----------approve appointment---------------------
app.put("/appointment_approve/:id" , async(req,resp, next)=>{
    console.log(req.body.cid)
    let email_result = await User.find({_id:req.body.cid});
    console.log(email_result)
    let result = await Appointment.updateOne(
        {_id: req.params.id},
        {
            //$Status :req.body
            $set : req.body
        }
    )

    const mailOptions = {
        from: '"Steve"19bmiit066@gmail.com',
        to: email_result[0].email,
        subject: "Appointment Status",
        html: '<h2>Your Appointment is Aprooved.</h2>'
    };
    transporter.sendMail(mailOptions)

    resp.send(result)
});


//----------cancle appointment---------------------
// app.put("/appointment_cancle/:id" , async(req,resp, next)=>{
//     let result = await Appointment.updateOne(
//         {_id: req.params.id},
//         {
//             $set : req.body
//         }
//     )
//     resp.send(result)
// });

app.delete("/appointment_cancle/:id" , async(req,resp, next)=>{
    console.log(req.body.cid)
    let email_result = await User.find({_id:req.body.cid});
    console.log(email_result)
    let result = await Appointment.deleteOne({_id: req.params.id})
    const mailOptions = {
        from: '"Steve"19bmiit066@gmail.com',
        to: email_result[0].email,
        subject: "Appointment Status",
        html: '<h2>Your Appointment is Cancelled.</h2>'
    };
    transporter.sendMail(mailOptions)

    resp.send(result)
});





app.get("/searchappointment/:key", async (req, resp) => {
    let result = await Appointment.find({
        "$or": [
            //  {adate:{$regex:req.params.key}},
            { atime: { $regex: req.params.key } }

        ]
    });
    resp.send(result)
})

app.post("/product-category", async (req, resp) => {
    let manager = new Product_cat(req.body);
    let result = await manager.save();
    result = result.toObject();
    resp.send(result);

})

app.get("/product-category", async (req, resp) => {
    let product_cat = await Product_cat.find();
    if (product_cat.length > 0) {
        resp.send(product_cat)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})

app.delete("/product-category/:id", async (req, resp) => {
    const result = await Product_cat.deleteOne({ _id: req.params.id })
    resp.send(result);
})

app.get("/product-category/:id", async (req, resp) => {
    let result = await Product_cat.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})
app.put("/product-category/:id", async (req, resp, next) => {
    let result = await Product_cat.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result)
});

app.get("/searchproduct-category/:key", async (req, resp) => {
    let result = await Product_cat.find({
        "$or": [
            //  {adate:{$regex:req.params.key}},
            { pcatname: { $regex: req.params.key } }

        ]
    });
    resp.send(result)
})

app.post("/product-sub-category", async (req, resp) => {
    let manager = new Product_sub_cat(req.body);
    let result = await manager.save();
    result = result.toObject();
    resp.send(result);

})

app.get("/product-sub-category", async (req, resp) => {
    let product_sub_cat = await Product_sub_cat.find().populate("categoryid");
    if (product_sub_cat.length > 0) {
        resp.send(product_sub_cat)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})

app.delete("/product-sub-category/:id", async (req, resp) => {
    const result = await Product_sub_cat.deleteOne({ _id: req.params.id })
    resp.send(result);
})

app.get("/product-sub-category/:id", async (req, resp) => {
    let result = await Product_sub_cat.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})
app.put("/product-sub-category/:id", async (req, resp, next) => {
    let result = await Product_sub_cat.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result)
});

app.get("/searchproduct-sub-category/:key", async (req, resp) => {
    let result = await Product_sub_cat.find({
        "$or": [
            //  {adate:{$regex:req.params.key}},
            { psubcatname: { $regex: req.params.key } }

        ]
    });
    resp.send(result)
})


app.post("/addfeedback", async (req, resp) => {
    let manager = new Feedback(req.body);
    let result = await manager.save();
    result = result.toObject();
    resp.send(result);

})

app.get("/feedback", async (req, resp) => {
    let feedback = await Feedback.find().populate("customerid");
    if (feedback.length > 0) {
        resp.send(feedback)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})

app.delete("/feedback/:id", async (req, resp) => {
    const result = await Feedback.deleteOne({ _id: req.params.id })
    resp.send(result);
})

app.get("/feedback/:id", async (req, resp) => {
    let result = await Feedback.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No Product Found" })
    }
})
app.put("/feedback/:id", async (req, resp, next) => {
    let result = await Feedback.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result)
});

app.get("/searchfeedback/:key", async (req, resp) => {
    let result = await Feedback.find({
        "$or": [
            //  {adate:{$regex:req.params.key}},
            { feedback: { $regex: req.params.key } }

        ]
    });
    resp.send(result)
})





// port
 const  PORT=process.env.PORT || 8080;

 // run listen
 app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
 });
