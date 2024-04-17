import mongoose from "mongoose";

export async function connect(){
    mongoose.connect(String(process.env.MONGO_URL))
    .then(()=>{
        console.log("Sucessfully Connected to Database");
    })
    .catch((error)=>{
        console.log("Error Connecting Database: ", error);
    })
}