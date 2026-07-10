const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname,'..', 'public', 'images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage, limits: {fileSize: 5*1024*1024} ,
    fileFilter: function(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/; 
    const fileType = allowedTypes.test(file.mimetype);
    const extension = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const Isvalid = fileType && extension;
    if(!Isvalid){
        return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
} });

module.exports = upload;
