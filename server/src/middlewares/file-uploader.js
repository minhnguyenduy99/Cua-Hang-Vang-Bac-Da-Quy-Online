const multer = require('multer');
const path = require('path');
const publicFolderPath = require('../config/serverConfig').publicFolderPath;
const fs = require('fs');
const encryptor = require('../helpers/encryptor');

const imageSubPath = path.join(publicFolderPath, '/images');

const initStorage = (folderName, writeToField) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const storeDir = path.join(imageSubPath, folderName); 
            try{
                if (!fs.existsSync(storeDir)){
                    fs.mkdirSync(storeDir);
                }
                cb(null, storeDir);
            }
            catch(err){
                cb(err);
            }
        },
        filename: (req, file, cb) => {
            const newFileName = folderName + '__' + Date.now().toString() + path.extname(file.originalname);
            // write the new file name to a specified field
            if (writeToField){
                req.body[writeToField] = newFileName;
            }
            cb(null, newFileName);
        }
    })
}

module.exports.imageUploader = (folderName, writeToField) => {
    const imageStorage = initStorage(folderName, writeToField);
    return multer({
        storage: imageStorage, 
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const acceptedExts = ['.png', '.jpg', '.jpeg'];
            if (acceptedExts.includes(ext)){
                cb(null, true);
            }
            else{
                cb(new Error('The file extension is not allowed'), false);
            }
        },
    });
}