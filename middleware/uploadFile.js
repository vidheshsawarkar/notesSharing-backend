const path = require("path");
const multer = require("multer");

let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        let ext = path.extname(file.originalname);
        cb(null, file.originalname);
    }
})

let upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        cb(null, true);
    },
    // limits: {
    //     fileSize: 1024 * 1024 * 5,
    // },
})

module.exports = upload;