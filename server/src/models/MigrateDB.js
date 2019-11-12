const sequelize = require('./DBInterface').getSequelizeInstance();
const associator = require('./Associator');
var prototype = {}

prototype.Account = require('./Account');
prototype.KhachHang = require('./KhachHang');
prototype.LoaiNhanVien = require('./LoaiNhanVien');
prototype.NhanVien = require('./NhanVien');
prototype.LoaiSanPham = require('./LoaiSanPham');
prototype.SanPham = require('./SanPham');
prototype.HoaDon = require('./HoaDon');
prototype.ChiTietHoaDon = require('./ChiTietHoaDon');



function getModelsArray(){
    return Object.values(prototype);
}

module.exports = class DBMigrator{
    
    static async init(models){
        if (models == undefined){
            return Promise.reject(new Error('models must contain at least 1 model'));
        }
        return Promise.resolve(models.forEach(model => {
            model.initModel();
        }));
    }

    static async initAll(){
        return DBMigrator.init(getModelsArray());
    }

    static async associateAll(){
        return associator.associateAll();
    }

    static async initAndAssociateAll(){
        this.initAll()
        .then(() => {
            return this.associateAll();
        })
    }
    
    static async syncAll(){
        sequelize.query("SET FOREIGN_KEY_CHECKS = 0")
        .then(() => {
            return sequelize.sync({ force: true })
        })
        .catch(err => reject(err));  
    }

    static async removeFKChecks(){
        return sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    }

    static async sync(modelName){
        const model = prototype[modelName];
        return model.sync({ force: true });
    }
    
    static async migrateAll(){
        this.initAndAssociateAll()
        .then(() => {
            return this.syncAll();
        })
        .catch(err => {
            return err;
        })
    }
}