const sequelize         = require('sequelize');
const sqlInstance       = require('./DBInterface').getSequelizeInstance();
const appValidator      = require('../config/application-config').dataValidator;
const TableIDs          = require('./TableLastIDs');
const BaseModel         = require('./BaseModel');
const ImageManager      = require('./ImageManager').getInstance();
const ErrorHandler      = require('../middlewares/error-handler').ErrorHandler;

const Op = sequelize.Op;

class DichVu extends BaseModel{
    static async initModel(){
        await BaseModel.initModel();
        const {deletedAt, updatedAt, createdAt} = BaseModel.timeStampsObj;

        DichVu.init({
            iddv: {
                type: sequelize.STRING(DichVu.getModelIDLength()),
                primaryKey: true,   
                field: 'IDDV'
            },
            tendv: {
                type: sequelize.STRING,
                allowNull: false,
                field: 'TenDichVu',
                unique: true,
                set(value){
                    this.setDataValue('tendv', value.toUpperCase());
                }
            },
            giagiacong: {
                type: sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    is: appValidator.TienTe
                },
                field: 'GiaGiaCong',
            },
            loaidv: {
                type: sequelize.STRING(20),
                allowNull: false,
                field: 'LoaiDichVu',
            },
            anhdaidien: {
                type: sequelize.STRING,
                defaultValue: '',
                field: 'AnhDaiDien'
            },
            ghichu: {
                type: sequelize.TEXT,
                allowNull: true,
                field: 'GhiChu'
            },
        },
        {
            tableName: 'DichVu',
            sequelize: sqlInstance,
            timestamps: true,
            deletedAt: deletedAt,
            updatedAt: updatedAt,
            createdAt: createdAt,
            paranoid: true,
            hooks: {
                afterSync(options){
                    ImageManager.deleteAllModelImages('DichVu');
                }
            },
        })
    }

    static getModelIDPrefix(){ return 'DV' }
    static getModelIDLength(){
        return DichVu.getModelIDPrefix().length + TableIDs.ZERO_PADDING_LIST().DICHVU;
    }

    static async setAssociations(){
        const CTPhieuDichVu = require('./CTPhieuDichVu');
    }

    static async defineScopes(){
        const {deletedAt, updatedAt, createdAt} = BaseModel.timeStampsObj;
        
        DichVu.addScope('defaultScope', {
            raw: true,
            attributes: {
                exclude: [deletedAt, updatedAt, createdAt]
            }
        })

        DichVu.addScope('fullModel', {});

        DichVu.addScope('deleted', {
            attributes: {
                exclude: [updatedAt, createdAt],
            },
            where: {
                deletedTime: {[Op.ne]: null}
            },
            paranoid: false
        })

        DichVu.addScope('notIncludeTimeStamps', {
            attributes: {
                exclude: [deletedAt, updatedAt, createdAt]
            }
        })
    }

    static async createDichVu(dichvuObj){
        const newID = await TableIDs.autoIncrementID(DichVu, DichVu.getModelIDPrefix());
        dichvuObj.iddv = newID;

        return DichVu.create(dichvuObj)
        .then(newDV => {
            return newDV;
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
    }

    static findDeletedDichVu(){
        return DichVu.scope('deleted').findAll();
    }

    static async delete(iddv){
        const dichvu = await DichVu.scope('fullModel').findOne({
            where: {iddv: iddv}
        })

        if (!dichvu)
            return { success: false };

        await dichvu.destroy();

        const listDichVu = await DichVu.findAll();
        return { success: true, listDichVu: listDichVu }
    }

    static async restoreOne(iddv){
        let dichvu = await DichVu.scope('deleted').findOne({
            where: {iddv: iddv}
        })
        
        if (!dichvu)   return null;

        await dichvu.restore();
        return dichvu;
    }

    getUpdatableFieldList(){
        return ['tendv', 'loaidv', 'anhdaidien', 'ghichu']
    }

    async updateModel(updateObj, transaction = null){
        let anhdaidien = updateObj.anhdaidien ? this.anhdaidien : null;
        
        const updateResult = await super.updateModel(updateObj, transaction);

        if (!anhdaidien)
            return updateResult;
        
        if (updateResult.success)
            ImageManager.deleteImage('dichvu', anhdaidien);
        
        return updateResult;
    }

    static async updateDichVu(iddv, updateObj){
        const dichvu = await DichVu.scope('fullModel').findOne({ where: {iddv: iddv} });

        if (!dichvu)
            throw ErrorHandler.createError('rs_not_found', { fields: ['iddv'] })
        const result = await dichvu.updateModel(updateObj, null);

        return result.success;
    }
}


module.exports = DichVu;