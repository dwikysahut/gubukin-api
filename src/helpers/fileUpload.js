const multer = require('multer');
const path = require('path');
const imageName=""
const helper = require('.')
const storage= multer.diskStorage({
    destination:function(req,file,cb){
        if (file.fieldname === "file_ebook"){
            cb(null, './public/ebook'),file
        }
        else if (file.fieldname === "image"){
        cb(null, './public/image'),file
        }
        else{
            cb(null, './public/imageProfile'),file
        }
    },
    filename:function(req,file,cb){
        const fileExt = file.originalname.split('.')[1]
        cb(null,file.fieldname+ "-"+ Date.now() + "."+ fileExt);

    }
})
const upload= multer({
    storage:storage,
    limits:{fileSize:100000024},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
})
function checkFileType(file,cb){
    let fileTypes='';
    let text='';
    if (file.fieldname === "image"|| file.fieldname ==="image_profile"){ 
        fileTypes =/jpeg|jpg|png|gif/  
        text='upload image file only'
    } 
    else if (file.fieldname === "file_ebook"){ 
       fileTypes =/pdf/;
       text='upload pdf file only'
    }
       
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType =fileTypes.test(file.mimetype)

    if(extName && mimeType){
        return cb(null, true)
    }else{
        return cb(text,false)
    }
}
module.exports = upload.fields([{
    name: 'image', maxCount: 1
  },{
    name: 'image_profile', maxCount: 1
  }, {
    name: 'file_ebook', maxCount: 1
  }]), function(req, res, next){
// ...
console.log(res)
next()
}
