const sequelize         = require('sequelize');
const uuid              = require('uuid');
const appConfig         = require('../config/application-config');
const sqlInstance       = require('./DBInterface').getSequelizeInstance();
const BaseModel         = require('./BaseModel');
const ImageManager      = require('./ImageManager').getInstance();

const dataValidator         = appConfig.dataValidator;
const appConfigValidator    = appConfig.AppGlobalRule;


class NhaCungCap extends BaseModel{
    
    static async initModel(){
        NhaCungCap.init({
            idnhacc: {
                type: sequelize.UUID,
                primaryKey: true,
                defaultValue: () => uuid(),
                field: 'IDNhaCC'
            },
            tennhacc: {
                type: sequelize.STRING(50),
                allowNull: false,
                field: 'TenNhaCC'
            },
            diachinhacc: {
                type: sequelize.STRING(50),
                field: 'DiaChiNhaCC'
            },
            anhdaidien: {
                type: sequelize.STRING,
                allowNull: true,
                field: 'AnhDaiDien'
            },
            tonggiatrinhap: {
                type: sequelize.INTEGER,
                defaultValue: 0,
                validate: {
                    is: dataValidator.TienTe
                },
                field: 'TongGiaTriNhap',
            }
        }, {
            tableName: 'NhaCungCap',
            sequelize: sqlInstance,
            timestamps: false,
            hooks: {
                afterSync(options){
                    ImageManager.deleteAllModelImages('NhaCungCap');
                },
            },
        })
    }

    static async setAssociations(){
        const SanPham = require('./SanPham');
        
        NhaCungCap.DanhSach_SanPham = NhaCungCap.hasMany(
            SanPham, {
            as: 'danhsach_sanpham',
            foreignKey: {
                name: 'idnhacc',
                allowNull: false
            },
        })
    }

    static async defineScopes(){
        NhaCungCap.addScope('withAllSanPham', {
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('idsp')), 'soluong']
                ]
            },
            include: [{ association: NhaCungCap.DanhSach_SanPham }],
            group: ['idsp']
        })
    }
    
    static findAllSanPham(id){
        return NhaCungCap.scope('withAllSanPham').findOne({
            where: {idnhacc: id}, 
        })
    }

    getUpdatableFieldList(){
        ['tennhacc', 'anhdaidien', 'diachinhacc']
    }

    async updateModel(updateObj, transaction = null){
        let anhdaidien = updateObj.anhdaidien ? this.anhdaidien : null;
        
        const updateResult = await super.updateModel(updateObj, transaction);

        if (!anhdaidien)
            return updateResult;
        
        if (updateResult.success)
            ImageManager.deleteImage('nhacungcap', anhdaidien);
        
        return updateResult;
    }

    static async updateThongTin(idnhacc, updateObj){
        const nhacungcap = await NhaCungCap.findOne({ where: {idnhacc: idnhacc }});
        if (!nhacungcap){
            throw ErrorHandler.createError('rs_not_found', {fields: ['idnhacc']});
        }

        const result = await nhacungcap.updateModel(updateObj, null);

        return result.success;
    }
}

module.exports = NhaCungCap;