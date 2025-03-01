const mongoose = require("mongoose");
const {Schema} = mongoose;

const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    description: String,
    image: { 
        type: Object,
        default: "https://images.unsplash.com/photo-1740166260052-b41e5381bcbb?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1740166260052-b41e5381bcbb?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
         : v,  
     },

    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;