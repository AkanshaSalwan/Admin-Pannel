// const mongoose = require("mongoose");

// const categoryScheme = mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     slug:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     images:[
//         {
//             type:String,
//         }
//     ],
//     color:{
//         type:String,
//     },
//     parentId:{
//         type:String,
//     }
// },{timestamps:true})

// categoryScheme.virtual('id').get(function(){
//     return this._id.toHexString();
// });

// categoryScheme.set('toJSON',{
//     virtual: true,
// });

// exports.Category = mongoose.model('Category', categoryScheme);
// exports.categoryScheme = categoryScheme;


const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    color: {
        type: String,
        required: true,
    },
});

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = { Category, categorySchema };