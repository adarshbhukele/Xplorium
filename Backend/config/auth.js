import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({
    path:"../config/.env"
});

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token; 
        console.log(token);
        
        if(!token){
            return res.status(401).json({
                message: "User not authenticated.",
                success: false
            });
        }
        console.log("token", token);
        const decode = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decode.userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid or expired token.",
            success: false
        });
    }
};
export default isAuthenticated;