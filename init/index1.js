const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main().then(()=>{
    console.log("Connected to DB");
}).catch(err =>{
    console.log(err);
})


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

const initDB = async()=>{
    await Listing.deleteMany({});
    const updatedData= initData.data.map((obj)=>({ ...obj,owner:"67dea1e301c9d98aaa65c35e"}));
    await Listing.insertMany(updatedData);
    console.log("Data was initialized");
    console.log(updatedData);
}

initDB();