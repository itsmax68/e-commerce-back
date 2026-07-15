const express=require("express")
const userController=require("../controllers/User")
const { verifyToken } = require('../middleware/VerifyToken')
const router=express.Router()

const requireAdmin = (req,res,next)=>{
    if(req.user?.isAdmin){
        return next()
    }
    return res.status(403).json({message:'Admin only'})
}

router
    .get("/:id",userController.getById)

    // Admin only: list all users
    .get("/",verifyToken,requireAdmin,userController.getAll)

    // Admin only: update user
    .patch("/:id",verifyToken,requireAdmin,userController.updateById)

    // Admin only: delete user
    .delete("/:id",verifyToken,requireAdmin,userController.deleteById)

module.exports=router