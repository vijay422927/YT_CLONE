import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { Apierror } from '../utils/Apierror.js';
const verifyJwt = async (req, res, next) => {
    try {
        const token =req.cookies?.accessToken ||  req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            throw new Apierror(400, "Token Must required");
        }

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        

        const user = await User.findById(decode._id).select('-password -refreshToken');
        if (!user) {
            throw new Apierror(409, "User Not Registered");
        }


        req.user = user;
        next();
    } catch (error) {
           console.log("Token problem:",error);
           
    }
}
export {verifyJwt};