const multer            = require('multer');
const fs                = require('fs');
const path              = require('path');
const ImageManager      = require('../models/ImageManager').getInstance();
const ErrorHandler      = require('../middlewares/error-handler').ErrorHandler;

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
            const newFileName = ImageManager.generateFileName(path.extname(file.originalname));

            // write the new file name to a specified field
            if (writeToField){
                req.body[writeToField] = newFileName;
            }
            else{
                cb(new Error('Field name cannot be null'));
            }
            cb(null, newFileName);
        }
    })
}

module.exports.imageUploader = (modelName, writeToField) => {
    const imageStoragePath = ImageManager.getModelFolderPath(modelName);
    const imageStorage = initStorage(imageStoragePath, writeToField);
    
    return multer({
        storage: imageStorage, 
        fileFilter: (req, file, cb) => {
            if (!file)
                cb(null, true);
            const ext = path.extname(file.originalname);
            const acceptedExts = ['.png', '.jpg', '.jpeg'];
            if (acceptedExts.includes(ext)){
                cb(null, true);
            }
            else{
                cb(ErrorHandler.createError('invalid_value', { fields: ['anhdaidien'] }), false);
            }
        },
    });
}