import mongoose from "mongoose";
import Product from "../models/productSchema.js"
import data from "./data.js"

const seeder = async ()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/ezbuy")
    
    await Product.deleteMany()
    console.log("Deleted all Products");

    await Product.insertMany(data)
    console.log("Products Added");

    process.exit()

}


seeder()