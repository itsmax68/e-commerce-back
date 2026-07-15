const Product=require("../models/Product")
const Review=require("../models/Review")
const Cart=require("../models/Cart")
const Wishlist=require("../models/Wishlist")

const toNumber = (v, fallback = 0) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
}

const normalizeImages = (body) => {
    let images = body.images
    if (images == null) images = []
    if (!Array.isArray(images)) images = [images]
    return images.map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean)
}

exports.create=async(req,res)=>{
    try {
        const body = { ...req.body }
        body.images = normalizeImages(body)
        if (!body.thumbnail || !String(body.thumbnail).trim()) {
            body.thumbnail = body.images[0] || ""
        } else {
            body.thumbnail = String(body.thumbnail).trim()
        }
        body.price = toNumber(body.price)
        body.discountPercentage = toNumber(body.discountPercentage, 0)
        body.stockQuantity = toNumber(body.stockQuantity)

        const created=new Product(body)
        await created.save()
        res.status(201).json(created)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error adding product, please trying again later'})
    }
}

exports.getAll = async (req, res) => {
    try {
        const filter={}
        const sort={}
        let skip=0
        let limit=0

        if(req.query.brand){
            filter.brand={$in:req.query.brand}
        }

        if(req.query.category){
            filter.category={$in:req.query.category}
        }

        if(req.query.user){
            filter['isDeleted']=false
        }

        if(req.query.sort){
            sort[req.query.sort]=req.query.order?req.query.order==='asc'?1:-1:1
        }

        if(req.query.page && req.query.limit){

            const pageSize=req.query.limit
            const page=req.query.page

            skip=pageSize*(page-1)
            limit=pageSize
        }

        const totalDocs=await Product.find(filter).sort(sort).populate("brand").countDocuments().exec()
        const results=await Product.find(filter).sort(sort).populate("brand").skip(skip).limit(limit).exec()

        res.set("X-Total-Count",totalDocs)

        res.status(200).json(results)
    
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error fetching products, please try again later'})
    }
};

exports.getById=async(req,res)=>{
    try {
        const {id}=req.params
        const result=await Product.findById(id).populate("brand").populate("category")
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error getting product details, please try again later'})
    }
}

exports.updateById=async(req,res)=>{
    try {
        const {id}=req.params
        const { _id, ...raw } = req.body
        const updates = { ...raw }

        if (Object.prototype.hasOwnProperty.call(updates, "images")) {
            updates.images = normalizeImages(updates)
        }
        if (updates.thumbnail !== undefined) {
            updates.thumbnail = String(updates.thumbnail || "").trim()
        }
        if (updates.price !== undefined) updates.price = toNumber(updates.price)
        if (updates.discountPercentage !== undefined) {
            updates.discountPercentage = toNumber(updates.discountPercentage, 0)
        }
        if (updates.stockQuantity !== undefined) {
            updates.stockQuantity = toNumber(updates.stockQuantity)
        }

        const updated=await Product.findByIdAndUpdate(id,updates,{new:true}).populate("brand").populate("category")
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error updating product, please try again later'})
    }
}

exports.undeleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const unDeleted=await Product.findByIdAndUpdate(id,{isDeleted:false},{new:true}).populate('brand')
        res.status(200).json(unDeleted)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error restoring product, please try again later'})
    }
}

exports.deleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const existing=await Product.findById(id)
        if(!existing){
            return res.status(404).json({message:'Product not found'})
        }
        await Promise.all([
            Review.deleteMany({ product: id }),
            Cart.deleteMany({ product: id }),
            Wishlist.deleteMany({ product: id }),
        ])
        await Product.findByIdAndDelete(id)
        res.status(200).json({ _id: id, message: 'Product deleted permanently' })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error deleting product, please try again later'})
    }
}


