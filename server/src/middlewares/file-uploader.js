const multer = require('multer');
const path = require('path');
const imageStorageConfig = require('../config/serverConfig').storage.images;
const fs = require('fs');
const encryptor = require('../helpers/encryptor');

const initStorage = (storeDir, writeToField) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
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
            const newFileName = '__' + Date.now().toString() + path.extname(file.originalname);
            // write the new file name to a specified field
            if (writeToField){
                req.body[writeToField] = newFileName;
            }
            cb(null, newFileName);
        }
    })
}

module.exports.imageUploader = (folderName, writeToField) => {
    const imageStoragePath = imageStorageConfig.getPath(folderName);
    const imageStorage = initStorage(imageStoragePath, writeToField);
    
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