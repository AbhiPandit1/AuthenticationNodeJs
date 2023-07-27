import jwt from 'jsonwebtoken'
import userModel from '../models/user.js'


var checkUserAuth=async(req,res,next)=>{
    let token 
    const {authorisation} =req.headers //it will come throgh client//Beares is passed in header of front end 
    if(authorisation && authorisation.startsWith('Bearer')){
        try{
            token=authorisation.split('')[1]//Bearer with split with token and at the one will be token

            //verify token
            const {userID}=jwt.verify(token,process.env.JWT_SECRET_KEY)//it will verify token on base of jwt key we have given

            //Get user from tokne

            req.user=await userModel.findById(userID).select('-password')//it will give everything except password in req.user
              next()
        }
        catch(error){
            res.status(401).send({'suuccess':'failed','message':'unauthorised User'})

        }

    }
    if(!token){
        res.status(401).send({'suuccess':'failed','message':'unauthorised User No token'})
    }
}

export default checkUserAuth