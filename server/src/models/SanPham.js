const sequelize         = require('sequelize');
const sqlInstance       = require('./DBInterface').getSequelizeInstance();
const appValidator      = require('../config/application-config');
const TableIDs          = require('./TableLastIDs');
const BaseModel         = require('./BaseModel');
const ImageManager      = require('./ImageManager').getInstance();
const ErrorHandler      = require('../middlewares/error-handler').ErrorHandler;

const dataValidator       = appValidator.dataValidator;
const appConfigValidator  = appValidator.AppGlobalRule;
const Op                  = sequelize.Op;

class SanPham extends BaseModel{

    static async initModel(){
        await BaseModel.initModel();

        const {deletedAt, updatedAt, createdAt} = BaseModel.timeStampsObj;

        SanPham.init({
            idsp: {
                type: sequelize.STRING(SanPham.getModelIDLength()),
                primaryKey: true,   
                field: 'IDSP'
            },
            tensp: {
                type: sequelize.STRING,
                allowNull: false,
                field: 'TenSP'
            },
            loaisp:{
                type: sequelize.STRING,
                allowNull: false,
                set(value){
                    if (value) this.setDataValue('loaisp', value.toUpperCase());
                },
                field: 'LoaiSP'
            },
            soluong: {
                type: sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    is: dataValidator.SoLuong
                },
                set(value){
                    if (value) this.setDataValue('soluong', parseInt(value));
                },
                field: 'SoLuong'
            },
            gianhap: {
                type: sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    is: dataValidator.TienTe
                },
                field: 'GiaNhap',
                set(value){
                    if (value) this.setDataValue('gianhap', parseInt(value));
                }
            },
            giaban: {
                type: sequelize.INTEGER,
                allowNull: false,
                validate: {
                    is: dataValidator.TienTe,
                    isGiaBanValid(value){
                        const loinhuan = value / this.gianhap - 1;
                        if (loinhuan < appConfigValidator.DataConfiguration.PHAN_TRAM_LOI_NHUAN_MIN)
                            throw SanPham.validationError(6, 'Lợi nhuận tối thiểu 10%');
                    }
                },
                set(value){
                    if (value) this.setDataValue('giaban', parseInt(value));
                },
                field: 'GiaBan',
            },
            tinhtrang: {
                type: sequelize.INTEGER,
                allowNull: false,
                defaultValue: appConfigValidator.TINH_TRANG_SAN_PHAM.AVAILABLE,
                validate: {
                    isIn: [Object.values(appConfigValidator.TINH_TRANG_SAN_PHAM)]
                },
                field: 'TinhTrang'
            },
            anhdaidien: {
                type: sequelize.STRING,
                defaultValue: '',
                field: 'AnhDaiDien'
            },
            tieuchuan: {
                type: sequelize.STRING,
                allowNull: true,
                field: 'TieuChuan'
            },
            khoiluong: {
                type: sequelize.FLOAT,
                allowNull: false,
                validate: {
                    is: dataValidator.KhoiLuong
                },
                set(value){
                    if (value) this.setDataValue('khoiluong', parseFloat(value));
                },
                field: 'KhoiLuong'
            },
            ghichu: {
                type: sequelize.TEXT,
                allowNull: true,
                field: 'GhiChu'
            },
        },
        {
            tableName: 'SanPham',
            sequelize: sqlInstance,
            timestamps: true,
            deletedAt: deletedAt,
            updatedAt: updatedAt,
            createdAt: createdAt,
            paranoid: true,
            indexes: [
                {
                    fields: ['tensp', 'loaisp'],
                    type: 'FULLTEXT'
                }
            ],
            hooks: {
                afterSync(options){
                    ImageManager.deleteAllModelImages('SanPham');
                },
            }
        })
    }

    static getModelIDPrefix() { return 'SP'; }
    static getModelIDLength() {
        return SanPham.getModelIDPrefix().length + TableIDs.ZERO_PADDING_LIST().SANPHAM;
    }

    static async setAssociations(){
        const NhaCungCap = require('./NhaCungCap');
        const ChiTietPhieu = require('./ChiTietPhieu');
        const ChiTietPhieuMuaHang = require('./ChiTietPhieuMuaHang');
        const CTPhieuCamDo = require('./CTPhieuCamDo');
        const Phieu = require('./Phieu');

        SanPham.NhaCungCap = SanPham.belongsTo(NhaCungCap, {
            as: 'nhacungcap',
            foreignKey: {
                name: 'idnhacc',
                allowNull: false
            }
        })

        SanPham.belongsToMany(Phieu, { 
            through: ChiTietPhieu,
            otherKey: 'idphieu',
            foreignKey: 'idsp',
        });
    

        SanPham.belongsToMany(Phieu, { 
            through: ChiTietPhieuMuaHang, 
            otherKey: 'idphieu',
            foreignKey: 'idsp'
        });

        SanPham.belongsToMany(Phieu, { 
            through: CTPhieuCamDo, 
            otherKey: 'idphieu',
            foreignKey: 'idsp'
        });
    }

    static async defineScopes(){
        SanPham.addScope('available', {
            where: { tinhtrang: appConfigValidator.TINH_TRANG_SAN_PHAM.AVAILABLE }
        })

        SanPham.addScope('unavailable', {
            where: { tinhtrang: appConfigValidator.TINH_TRANG_SAN_PHAM.UNAVAILABLE }
        })

        SanPham.addScope('deleted', {
            where: {
                deletedTime: {[Op.ne]: null}
            },
            paranoid: false
        })

        SanPham.addScope('notIncludeTimeStamps', {
            attributes: {
                exclude: ['deletedTime', 'lastUpdatedTime', 'createdTime']
            }
        })

        SanPham.addScope('withNhaCC', {
            include: [{ association: SanPham.NhaCungCap }],
        })

    }

    static findDeletedSanPham(){
        return SanPham.scope('deleted').findAll();
    }

    static async restoreOne(idsp){
        let sanpham = await SanPham.scope('deleted').findOne({
            where: {idsp: idsp}
        })
        
        if (!sanpham)   return null;

        await sanpham.restore();
        return sanpham;
    }

    static async restoreMany(listIDSP){
        let listSanPham = await SanPham.scope('deleted').findAll({
            where: {
                [Op.in]: listIDSP
            }
        })
        await Promise.all(listSanPham.map(sanpham => sanpham.restore()));
        return listSanPham;
    }

    static async createSanPham(sanPhamObj){

        sanPhamObj.idsp = await TableIDs.autoIncrementID(SanPham, SanPham.getModelIDPrefix());
        return SanPham.create(sanPhamObj)
        .then(newSanPham => {
            return newSanPham;
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
    }

    static findBySearchPattern(search){
        return sqlInstance.query(
            'SELECT * FROM SanPham WHERE MATCH(tensp, loaisp) AGAINST (? IN NATURAL LANGUAGE MODE) AND deletedTime IS NULL', {
            replacements: [search],
            type: sequelize.QueryTypes.SELECT,
        })
    }

    static findAllSanPham(){
        return SanPham.scope('available', 'withNhaCC', 'notIncludeTimeStamps').findAll();
    }

    static findSanPhamByID(id){
        return SanPham.scope('available', 'withNhaCC', 'notIncludeTimeStamps').findOne({
            where: {idsp: id},
        })
    }

    static findAllUnavailableSanPham(){
        return SanPham.scope('unavailable', 'withNhaCC', 'notIncludeTimeStamps').findAll();
    }

    static async delete(idsp){
        const sanpham = await SanPham.findOne({
            where: {idsp: idsp}
        })

        if (!sanpham)
            return { success: false };

        await sanpham.destroy();

        const listSanPham = await SanPham.findAllSanPham();
        return { success: true, listSanPham: listSanPham }
    }

    getUpdatableFieldList(){
        return ['tensp', 'loaisp', 'tinhtrang', 'anhdaidien', 'ghichu']
    }

    async updateModel(updateObj, transaction = null){
        let anhdaidien = updateObj.anhdaidien ? this.anhdaidien : null;
        
        const updateResult = await super.updateModel(updateObj, transaction);

        if (!anhdaidien)
            return updateResult;
        
        if (updateResult.success)
            ImageManager.deleteImage('sanpham', anhdaidien);
        
        return updateResult;
    }

    static async updateSanPham(idsp, updateObj){
        const sanpham = await SanPham.findSanPhamByID(idsp);

        if (!sanpham)
            throw ErrorHandler.createError('rs_not_found', { fields: ['idsp'] })
        const result = await sanpham.updateModel(updateObj, null);

        return result.success;
    }
}

module.exports = SanPham;