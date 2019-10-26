const sequelize = require('sequelize');

var prototype = {}
prototype.Account = require('./Account');
prototype.SanPham = require('./SanPham');
prototype.LoaiSanPham = require('./LoaiSanPham');


exports.dropModels = function(...modelNames){
    if (modelNames == undefined){
        return Promise.reject(new Error('Contain at least 1 model'));
    }
    return new Promise((resolve, reject) => {
        modelNames.forEach(modelName => {
            const model = prototype[modelName];
            model.drop();
        })
        resolve();
    })
}

exports.createModels = function(...modelNames){
    if (modelNames == undefined){
        return new Promise.reject(new Error('Must contain at least 1 model'));
    }
    return Promise.all(modelNames.map(modelName => {
        const model = prototype[modelName];
        return model.sync();
    }));
}


exports.migrate = async function(...modelNames){
    const defineModel = new Promise((resolve, reject) => {
        if (modelNames == undefined)
            reject(new Error('Must contain at least 1 model'))

        Promise.all(modelNames.map(modelName => {
            const model = prototype[modelName];
            return model.sync({force: true})
        }))
        .then(() => resolve())
    })
}