import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema({
    name : {type:String,required:true},
    email : {type:String, required:true,unique:true},
    password : {type:String, required:true},
    phoneNo : {type:Number, required:true},
    location : {type:String, default:false},
    Street1_Address: {type:String, required:true},
    Street2_Address: {type:String, default:false},
    City : {type:String, required:true},
    State : {type:String, required:true},
    Country : {type:String, required:true},
    Pincode : {type:Number, required:true},
    profilePicture :{type:String , default:false},
    role: {type:String, required:true}
})
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10)
this.password = await bcrypt.hash(this.password,salt)
})
userSchema.methods.matchPassword = async function(enterdpassword) {
   return await  bcrypt.compare(enterdpassword,this.password)
}




const User = mongoose.model("User",userSchema)
export default User