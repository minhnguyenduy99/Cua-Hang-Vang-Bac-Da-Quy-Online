const path                     = require('path');
const fs                       = require('fs');
const { 
    publicFolderPath, 
    storage: { imageFolder } } = require('../config/serverConfig');

class ImageManager {

    static getInstance(){
        if (!this.instance){
            this.instance = new ImageManager();
        }

        return this.instance;
    }

    generateFileName(ext = ''){
        return '__' + Date.now().toString() + ext;
    }

    getModelFolderPath(modelName){
        const uModel = modelName.toUpperCase();
        const modelPath = path.resolve(publicFolderPath, imageFolder.name, imageFolder.subFolders[uModel]);
        if (!fs.existsSync(modelPath)) 
            fs.mkdirSync(modelPath);
        return modelPath;
    }

    async getImagePath(modelName, name){
        const folder = this.getModelFolderPath(modelName);
        return path.resolve(folder, name);
    }

    getImageFile(model, name){
        return new Promise(async (resolve, reject) => {
            const imagePath = await this.getImagePath(model, name);
            fs.readFile(imagePath, (err, data) => {
                if (err) reject(err);
                else     resolve(data);
            })
        })
    }

    async deleteImage(modelName, name){
        const imagePath = await this.getImagePath(modelName, name);
        fs.unlink(imagePath, (err) => {
            if (err) console.log(err);
        })
    }

    async getDefaultImage(model){
        const lModel = model.toLowerCase();
        const defaultFolder = path.resolve(publicFolderPath, 
            imageFolder.name, 
            imageFolder.defaultImageFolder);

        if (!fs.existsSync(defaultFolder))
            throw new Error('The default image folder must be available');

        const listImageNames = fs.readdirSync(defaultFolder);
        const imageName = listImageNames.find((value) => value === lModel);

        return fs.readFileSync(path.join(defaultFolder, imageName));
    }

    // async useDefaultImage(modelName, imageName){
    //     const image = await this.getDefaultImage(modelName);
    //     const imgName = ImageManager.generateFileName();
    //     const imagePath = path.join(this.getModelFolderPath(modelName), imgName);

    //     fs.writeFile(imagePath, image, (err) => {
    //         if (err) console.log(`[${modelName.toUpperCase()}] Cannot write the image`);
    //     })

    //     return imagePath;
    // }

    async deleteAllModelImages(model){
        const modelDir = this.getModelFolderPath(model);
        
        const listImageNames = fs.readdirSync(modelDir);
        let count = 0;

        await Promise.all(listImageNames.map(async (imageName) => {
            const imagePath = path.join(modelDir, imageName);
            fs.unlink(imagePath, (err) => {
                if (err)
                    throw new Error('Error while deleting image');
            })
            count = count + 1;
        }))

        console.log(`[${model.toUpperCase()}] Deleted Images: ${count}`);
    }
}


module.exports = ImageManager;