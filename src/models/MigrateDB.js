const sequelize         = require('sequelize');
const sqlInstance       = require('./DBInterface').getSequelizeInstance();
const associator        = require('./Associator');
const TableLastIDs       = require('./TableLastIDs');


// declare all models for DB migration
var prototype                   = {}
prototype.TaiKhoan              = require('./TaiKhoan');
prototype.KhachHang             = require('./KhachHang');
prototype.NhanVien              = require('./NhanVien');
prototype.NhaCungCap            = require('./NhaCungCap');
prototype.SanPham               = require('./SanPham');
prototype.LoaiPhieu             = require('./LoaiPhieu');
prototype.Phieu                 = require('./Phieu');
prototype.ChiTietPhieu          = require('./ChiTietPhieu');
prototype.PhieuCamDo            = require('./PhieuCamDo');
prototype.PhieuThuMua           = require('./PhieuThuMua');
prototype.ChiTietPhieuMuaHang   = require('./ChiTietPhieuMuaHang');
prototype.CTPhieuCamDo          = require('./CTPhieuCamDo');
prototype.DichVu                = require('./DichVu');
prototype.PhieuDichVu           = require('./PhieuDichVu');
prototype.CTPhieuDichVu         = require('./CTPhieuDichVu');
prototype.PhieuNhapKho          = require('./PhieuNhapKho');
prototype.PhieuKiemKe           = require('./PhieuKiemKe');
prototype.PhieuThanhLy          = require('./PhieuThanhLy');
prototype.BaoCao                = require('./BaoCao');
prototype.ChiTietBaoCao         = require('./ChiTietBaoCao');
prototype.ChiTietLuong          = require('./ChiTietLuong');
prototype.ChiTietDiemDanh       = require('./ChiTietDiemDanh');


function getModelsArray(){
    return Object.values(prototype);
}

module.exports = class DBMigrator{

    static async migrateTableID(sync = false){
        await TableLastIDs.initModel();
        if (!sync) 
            return;
        if (sync == true){
            await TableLastIDs.sync({ force: true });
            return;
        }
        if (!(sync instanceof Array)) throw new Error('sync is wrong type');
        
        sync = sync.map(field => field.toUpperCase());
        const tableID = await TableLastIDs.findOne();

        sync.forEach(field => {
            tableID.setDataValue(field, 0);
        })
        return tableID.save();
    }
    
    static async init(models){
        if (models == undefined){
            return Promise.reject(new Error('models must contain at least 1 model'));
        }
        const done = await models.map((model) => {
            model.initModel()
        });
        return done;
    }

    static async initAll(){
        return DBMigrator.init(getModelsArray());
    }

    static async associateAll(){
        try{
            const models = getModelsArray();
            return Promise.all(models.map(async (model) => {
                if (model.setAssociations)
                    await model.setAssociations();
                return model.defineScopes();
            }));
        }
        catch(err) {
            return Promise.reject(err);
        }
    }

    static async initAndAssociateAll(){
        return this.initAll()
        .then(() => {
            return this.associateAll();
        })
        .catch(err => {
            console.log(err);
        })
    }

    static async removeFKChecks(){
        return sqlInstance.query('SET FOREIGN_KEY_CHECKS = 0');
    }

    static async addFKChecks(){
        return sqlInstance.query('SET FOREIGN_KEY_CHECKS = 1');
    }
    
    static async syncAll(){
        try{
            await DBMigrator.removeFKChecks();
            await sqlInstance.sync({ force: true })
            await DBMigrator.addFKChecks();
        }
        catch(err){
            return Promise.reject(err)
        };  
    }

    static async sync(listModelName){
        const models = Object.values(prototype).filter((value) => {
            const includeModel = listModelName.includes(value.tableName);
            return includeModel;
        })

        await this.removeFKChecks();
        await this.drop(models.reverse());
        await Promise.all(models.reverse().map(model => model.sync()));
        return this.addFKChecks();
    }

    static async drop(models){
        await Promise.all(models.map(model => {
            return model.drop();
        }))
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