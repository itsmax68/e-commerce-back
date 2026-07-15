const express=require("express")
const categoryController=require("../controllers/Category")
const { verifyToken } = require("../middleware/VerifyToken")
const router=express.Router()

const requireAdmin=(req,res,next)=>{
    if(req.user?.isAdmin){
        return next()
    }
    return res.status(403).json({message:"Admin only"})
}

router
    .get("/",categoryController.getAll)
    .post("/",verifyToken,requireAdmin,categoryController.create)
    .patch("/:id",verifyToken,requireAdmin,categoryController.updateById)
    .delete("/:id",verifyToken,requireAdmin,categoryController.deleteById)

    
module.exports=router