import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bio: {
        type: String,
        default: ""   // optional text about user
    },
    profilePic: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" // default avatar
    },
    bannerPic: {
        type: String,
        default: "https://cdn.wallpapersafari.com/89/34/JUk8Dn.jpg" // default banner image
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    }, 
    bookmarks:{
        type:Array,
        default:[]
    }
},{timestamps:true});
export const User = mongoose.model("User", userSchema);