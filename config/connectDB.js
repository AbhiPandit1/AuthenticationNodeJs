import mongoose from "mongoose"

const connectDB=async (DATABASE_URL)=>{
   try{
    const DB_OPTIONS={
        dbNAME:'geekshop'
    }
    await mongoose.connect(DATABASE_URL,DB_OPTIONS)
    console.log(`connected Successfully...`)
   }catch(error){
    console.log(error)

   }
}

export default connectDB;


