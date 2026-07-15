const Brand=require("../models/Brand")

exports.getAll=async(req,res)=>{
    try {
        const result=await Brand.find({})
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error fetching brands"})
    }
}

exports.create=async(req,res)=>{
    try {
        const created=await Brand.create(req.body)
        res.status(201).json(created)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error creating brand"})
    }
}

exports.updateById=async(req,res)=>{
    try {
        const {id}=req.params
        const updated=await Brand.findByIdAndUpdate(id,req.body,{new:true})
        if(!updated){
            return res.status(404).json({message:"Brand not found"})
        }
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error updating brand"})
    }
}

exports.deleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const deleted=await Brand.findByIdAndDelete(id)
        if(!deleted){
            return res.status(404).json({message:"Brand not found"})
        }
        res.status(200).json({message:"Brand deleted successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error deleting brand"})
    }
}