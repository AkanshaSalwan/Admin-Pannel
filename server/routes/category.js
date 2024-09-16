const { Category } = require("../models/category");
const {ImageUpload} = require("../models/imageUpload");
const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const multer = require("multer");
const fs = require("fs");
const { create } = require("domain");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config__api_secret,
    secure: true,
});

var imagesArr = [];

const storage = multer.diskStorage({
    destination: function (req, file, cd){
        cd(null, "uploads")
    },
    filename: function (req, file, cd){
        cd(null, `${Date.now()}_${file.originalname}`)
    },
});

const upload = multer({storage: storage});

router.post('/upload', upload.array("images"), async (req, res) => {
    imagesArr = [];
    try{
      for(let i  = 0; i < req?.file?.length; i++){
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };
        const img = await cloudinary.uploader.upload(
            req.files[i].path,
            options,
            function (error, result){
                imagesArr.push(result.secure_url);
                fs.unlinkSync(`uploads/${req.files[i].filename}`);
            }
        );

        let imagesUploaded = new ImageUpload({
            images: imagesArr,
        });

        imagesUploaded = await imagesUploaded.save();
        return res.status(200).json(imagesArr);

      }

    }catch(error){
        console.log(error);
    }
});

router.post('/create', async(req,res)=>{
    if(imagesArr.length > 0){
        catObj = {
            name: req.body.name,
            images: imagesArr,
            color: req.body.color,
            slug: req.body.name,
        };
    }else{
        catObj = {
            name: req.body.name,
            slug: req.body.name,
          
        };
    }

    if(req.body.parentId){
        catObj.parentId = req.body.parentId;
    }

    let category = new Category(catObj);
   
     if(!category){
        res.status(500).json({
            error:err,
            success: false,
        });
     }

     category = await category.save();

     imagesArr = [];

     res.status(201).json(category);
});


 const createCategories = (categories, parentId=null)=>{
    const categoryList =[];
    let category;

    if(parentId == null){
        category = categories.filter((cat) => cat.parentId == undefined);
    } else {
        category = categories.filter((cat) => cat.parentId == parentId); 
    }

    for (let cat of category) {
        categoryList.push({
            _id: cat._id,
            name: cat.name,
            images: cat.images,
            color: cat.color,
            slug: cat.slug,
            children: createCategories(categories, cat._id)
        });
    }

    return categoryList;
 }


router.get('/' , async(req,res)=>{
    try{
        const categoryList = await Category.find();

        if(!categoryList){
            res.status(500).json({ success: false });
        }

        if(categoryList) {
            const categoryData = createCategories(categoryList);

            return res.status(200).json({
                categoryList: categoryData,
            });
        }
        
    }catch(error){
        console.log(error);
    }
});

router.get('/get/count', async (req, res) =>{

    const categoryCount = await Category.countDocuments({parentId:undefined});

    if(!categoryCount){
        res.status(500).json({ success: false});
    }
    else{
        res.send({
            categoryCount: categoryCount,
        });
    }
});