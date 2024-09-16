const { Category } = require("../models/category");
const {ImageUpload} = require("../models/imageUpload");
const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const multer = require("multer");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    // cloud_
})

var imagesArr = [];

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