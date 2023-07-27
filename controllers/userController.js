import userModel from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import e from "cors";


class UserController{
    static userRegistration= async(req,res)=>{
        const {name,email,password,password_confirmation,tc}=req.body
        const user= await userModel.findOne({email:email})

        if (user){
            res.send({"status":"failed","message":"User is already exist"})
        }else{
            if(name && email && password && password_confirmation && tc){
                if (password===password_confirmation){

                    try{
                        //Password Hashing
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword=await bcrypt.hash(password,salt)

                    const doc= new userModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        tc:tc
                    })
                    await doc.save()
                    const saved_user=await userModel.findOne({email:email})
                    //Generate JWT Token
                    const token= jwt.sign({userID:saved_user._id},
                        process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                    
                    
                    
                        res.status(201).send({"success":"sucess","message":"registered successfully","token":token})

                    }
                    catch(error){
                        console.log(error)
                        res.send({"status":"failed","message":"something is wrong"})

                    }
                   }
                else{
                    res.send({"status":"failed","message":"Password and password confirmation do not match"})

                }

            }
            else{
                res.send({"status":"failed","message":"Please filled all the field"})

            }

        }
        



    }
    //login 

    static userLogin=async (req,res)=>{
        try{
            const {email,password}=req.body

            if(email && password){
                const user =await userModel.findOne({email:email})
                if(user!=null){
                    const isMatch=await bcrypt.compare(password,user.password)

                    if((user.email===email) && isMatch){

                       
                        const saved_user=await userModel.findOne({email:email})
                    //Generate JWT Token
                    const token= jwt.sign({userID:saved_user._id},
                        process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                        res.send({"status":"success","message":"You are logged in","token":token})


                    }else{

                         res.send({"status":"failed","message":"Email and password does not match"})
                    }

                }
                else{
                    res.send({"status":"failed","message":"you are not registered user"})
                }

            }
            else{
                res.send({"status":"failed","message":"Email and password is required"})
            }

        }


        catch(error){
            res.send({"message":"something is wrong"})

        }
    }


    //Change Password
    static cahngePassword=async(req,res)=>{
         const {password,password_confirmation}=req.body

         if(password && password_confirmation){
            if(password===password_confirmation){
                const salt =await bcrypt.genSalt(10)
                const newhashPassword= await bcrypt.hash(password,salt)
                await userModel.findByIdAndUpdate(req.user._id,{$set:{
                    password:newhashPassword}})
                
                res.send({'status':'successfull','message':'password changed successfully'})

            }
            else{
                res.send({'status':'false','message':'password and password confirmation does not match'})
            }

         }
         else{
            res.send({'status':'false','message':'All fields are required'})
         }
    }


    //logged user data

    static logUser=async(req,res)=>{
       res.send({'user':req.user})
    }


    //Reset Password

    static resetPassword=async(req,res)=>{
        const {email,password}= req.body
       try{
        const user=await userModel.findOne({email:email})
        const secret =user._id + process.env.JWT_SECRET_KEY
        if(user){
            const token=jwt.sign({userID:user._id},secret,{
                expiresIn:'15m'
            })
            const link =`http://127.0.0.1:300/api/user/reset/${user._id}/${token}`
            
        }
        else{
            res.send({'message':'Invalid email'})
        }
    }

        catch(error){

}
    }

    static userPasswordReset= async(req,res)=>{
         const {password,password_confirmation}=req.body
         const {id,token}=req.params//url data come with url
         const user=await userModel.findById(id)
         const new_secret=user._id +process.env.JWT_SECRET_KEY
         
         try{
            jwt.verify(token,new_secret)
            if(password&&password_confirmation){
                if(password!==password_confirmation){
                res.send({'success':'false','message':'password and password confirmation does not match'})
                }
                else{
                    const salt =await bcrypt.genSalt(10)
                    const newhashPassword= await bcrypt.hash(password,salt)
                    await userModel.findByIdAndUpdate(req.user._id,{$set:{
                        password:newhashPassword}})
                    
                    res.send({'status':'successfull','message':'password changed successfully'})
                }

            }
            else{

                res.send({'status':'false','message':'All field required'})
            }

         }
         catch{
            console.log("invalid token")

         }

    }
    
}

export default UserController