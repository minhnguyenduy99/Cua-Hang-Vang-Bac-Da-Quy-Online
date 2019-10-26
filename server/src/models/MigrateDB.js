var prototype = {}
prototype.Account = require('./Account');
prototype.SanPham = require('./SanPham');
const sequelize = require('sequelize');



exports.migrate = function(modelName){
    if (modelName === undefined || modelName === ''){
        sequelize.Model.sync({force: true});
        return;
    }

    const model = prototype[modelName];
    model.sync({force: true});
}