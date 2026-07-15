const Category=require("../models/Category")

exports.getAll=async(req,res)=>{
    try {
        const result=await Category.find({})
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error fetching categories"})
    }
}

exports.create=async(req,res)=>{
    try {
        const created=await Category.create(req.body)
        res.status(201).json(created)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error creating category"})
    }
}

exports.updateById=async(req,res)=>{
    try {
        const {id}=req.params
        const updated=await Category.findByIdAndUpdate(id,req.body,{new:true})
        if(!updated){
            return res.status(404).json({message:"Category not found"})
        }
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error updating category"})
    }
}

exports.deleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const deleted=await Category.findByIdAndDelete(id)
        if(!deleted){
            return res.status(404).json({message:"Category not found"})
        }
        res.status(200).json({message:"Category deleted successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error deleting category"})
    }
}