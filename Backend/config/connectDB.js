import mongoose from "mongoose";

const connectDB = ()=>{
    const url = process.env.DB_URL
    mongoose.connect(url).then((con)=>{
        console.log("Database connected with host "+con.connection.host);
    })
}


export default connectDB