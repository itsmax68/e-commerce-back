const User=require("../models/User")

exports.getById=async(req,res)=>{
    try {
        const {id}=req.params
        const result=(await User.findById(id)).toObject()
        delete result.password
        res.status(200).json(result)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error getting your details, please try again later'})
    }
}

exports.getAll=async(req,res)=>{
    try {
        // `-password` keeps the admin UI from receiving hashed passwords.
        const results=await User.find({}).select('-password').lean()
        res.status(200).json(results)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error getting users, please try again later'})
    }
}

exports.updateById=async(req,res)=>{
    try {
        const {id}=req.params
        const updated=(await User.findByIdAndUpdate(id,req.body,{new:true})).toObject()
        delete updated.password
        res.status(200).json(updated)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error getting your details, please try again later'})
    }
}

exports.deleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const deleted=await User.findByIdAndDelete(id).select('-password').lean()
        if(!deleted){
            return res.status(404).json({message:'User not found'})
        }
        res.status(200).json({message:'User deleted successfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error deleting user, please try again later'})
    }
}