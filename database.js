require('dotenv').config()
const{URI} = process.env;
const mongoose = require("mongoose");

async function main(){
    await mongoose.connect(URI)
  }
  
module.exports = main;