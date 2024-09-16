const mongoose = require("mongoose");

const categoryScheme = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    images:[
        {
            type:String,
        }
    ],
    color:{
        type:String,
    },
    parentId:{
        type:String,
    }
},{timestamps:true})

categoryScheme.virtual('id').get(function(){
    return this._id.toHexString();
});

categoryScheme.set('toJSON',{
    virtual: true,
});

exports.Category = mongoose.model('Category', categoryScheme);
exports.categoryScheme = categoryScheme;
