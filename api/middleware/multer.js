var multer  = require('multer');
var path = require('path')
module.exports= multer({
    storage:multer.diskStorage({
        destination: (req, file, callBack) => {
                    callBack(null, '../images')     // './public/images/' directory name where save the file
                },
                filename: function (req, file, cb) {
                    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
                  }
                
                
    }),
fileFilter :(req,file,cb)=>{
if(!file.mimetype.match(/jpe|jpeg|png|gif$i/)){
    cb(new Error('file is not supported'),false)
    return
}
cb(null,true)
}
})