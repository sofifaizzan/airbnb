const express = require("express");
const data = require("./data.js")
const app = express();
const mongoose = require("mongoose");
const Listing = require('../models/listing.js')
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
}
main().then(()=>{
    console.log("mongoo connectes")
}).catch(()=>{
    console.log("mongoo not connectes")
})

const init = async()=>{
    Listing.insertMany(data);
    console.log("data added");
}
init();