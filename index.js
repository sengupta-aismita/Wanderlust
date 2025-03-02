const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



main().then(()=>{
    console.log("Connected to DB");
}).catch(err =>{
    console.log(err);
})


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/",(req,res)=>{
    res.send("Hi! i am root");
})

//Index Route
app.get("/listings",async (req,res)=>{
   const allListings = await Listing.find({});
   console.log(allListings);
   res.render("listings/index.ejs",{allListings})
})

//New Route
app.get("/listings/new", async (req,res)=>{
    res.render("listings/new.ejs");
})

//Show Route
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//Create Route
app.post("/listings", async(req,res)=>{
   // let {title,description,price,image,location,country} = req.body;
   //let listing = req.body;
   //console.log(listing);
   console.log("Received Data:", req.body);
   const newListing = new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
})

// edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  });
  
  // update route
  app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  });
  
  
  // delete route
  app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  });
  


/*app.get("/testListing", async (req,res)=>{
    let sampleListing = new Listing({
        title: "My New Villa",
        description:"By the beach",
        price:1200,
        location:"Goa",
        country:"India",
    });

    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Succesful testing")
})*/

app.listen(8080, ()=>{
    console.log("Server is listening");
})