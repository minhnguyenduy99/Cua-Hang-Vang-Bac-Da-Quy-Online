const sequelize         = require('sequelize');
const uuid              = require('uuid');
const appConfig         = require('../config/application-config');
const sqlInstance       = require('./DBInterface').getSequelizeInstance();
const BaseModel         = require('./BaseModel');
const ErrorHandler      = require('../middlewares/error-handler').ErrorHandler;
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

    static async createBulkNhaCC(listNhaCCObj){
        if (!listNhaCCObj || !listNhaCCObj instanceof Array || listNhaCCObj.length === 0){
            return Promise.reject(ErrorHandler.createError('invalid_value'));
        }

        return sqlInstance.transaction(async (t) => {
            for(let nhaccObj of listNhaCCObj){
                await this.create(nhaccObj, { transaction: t});
            }
        })
        .catch(err => {
            console.log(err);
            throw err;
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
        const updateResult = await super.updateModel(updateObj, transaction);
        
        return updateResult;
    }

    static async updateThongTin(idnhacc, updateObj){
        const nhacungcap = await NhaCungCap.findOne({ where: {idnhacc: idnhacc }});
        if (!nhacungcap){
            throw ErrorHandler.createError('rs_not_found', {fields: ['idnhacc']});
        }

        const success = await nhacungcap.updateModel(updateObj, null);

        return success;
    }
}

module.exports = NhaCungCap;