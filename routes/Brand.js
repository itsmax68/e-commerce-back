const express=require("express")
const brandController=require("../controllers/Brand")
const { verifyToken } = require("../middleware/VerifyToken")
const router=express.Router()

const requireAdmin=(req,res,next)=>{
    if(req.user?.isAdmin){
        return next()
    }
    return res.status(403).json({message:"Admin only"})
}

router
    .get("/",brandController.getAll)
    .post("/",verifyToken,requireAdmin,brandController.create)
    .patch("/:id",verifyToken,requireAdmin,brandController.updateById)
    .delete("/:id",verifyToken,requireAdmin,brandController.deleteById)

module.exports=router