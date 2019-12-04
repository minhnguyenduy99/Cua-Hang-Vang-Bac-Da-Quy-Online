// module import
const sqlInstance       =   require('./DBInterface').getSequelizeInstance();
const sequelize         =   require('sequelize');
const appConfig         =   require('../config/application-config');
const TableIDs          =   require('./TableLastIDs');
const BaseModel         =   require('./BaseModel');
const BaoCaoDoanhThu    =   require('./BaoCao');
const ErrorHandler      =   require('../middlewares/error-handler').ErrorHandler;
const DateHelper        =   require('../helpers/date-helper');

const validator         =   appConfig.dataValidator;
const globalValidator   =   appConfig.AppGlobalRule;

const Op    = sequelize.Op;

class Phieu extends BaseModel{

   
    static async initModel(){

        Phieu.init({
            idphieu: {
                type: sequelize.STRING(Phieu.getModelIDLength()),
                primaryKey: true,
                field: 'IDPhieu'
            },
            ngaylapphieu: {
                type: sequelize.DATE,
                defaultValue: () => new Date(),
                field: 'NgayLapPhieu',
            },
            ghichu: {
                type: sequelize.TEXT,
                field: 'GhiChu'
            },
            tonggiatri: {
                type: sequelize.INTEGER,
                defaultValue: 0,
                field: 'TongGiaTri',
                validate: {
                    is: validator.TienTe
                },
                set(value){
                    const intVal = Math.round(value);
                    this.setDataValue('tonggiatri', intVal - intVal % 500);
                }
            },
            tinhtrangno: {
                type: sequelize.INTEGER,
                defaultValue: globalValidator.TINN_TRANG_GHI_NO.KHONG_NO, 
                validate: {
                    isIn: [Object.values(globalValidator.TINN_TRANG_GHI_NO)]
                },
                field: 'TinhTrangNo'
            }
        }, {
            tableName: 'Phieu',
            timestamps: false,
            sequelize: sqlInstance,
            validate: {
                danhsach_ctphieu(){
                    // Nếu phiếu đã được tạo thì bỏ qua validate này
                    if (!this.changed('idphieu'))
                        return;
                    const listCTPhieu = Phieu._getListCTPhieu(this);
                    if (!listCTPhieu || listCTPhieu.length == 0)
                        throw Phieu.validationError(6, 'Cần ít nhất 1 chi tiết phiếu');
                }
            }
        })
    }

    static getModelIDPrefix(){ return 'PHIEU'; }
    static getModelIDLength(){
        return Phieu.getModelIDPrefix().length + TableIDs.ZERO_PADDING_LIST().PHIEU;
    }

    static async setAssociations(){
        const LoaiPhieu           = require('./LoaiPhieu');
        const NhanVien            = require('./NhanVien');
        const KhachHang           = require('./KhachHang');
        const SanPham             = require('./SanPham');
        const ChiTietPhieu        = require('./ChiTietPhieu');
        const ChiTietPhieuMuaHang = require('./ChiTietPhieuMuaHang');
        const CTPhieuCamDo        = require('./CTPhieuCamDo');
        const PhieuCamDo          = require('./PhieuCamDo');
        const PhieuThuMua         = require('./PhieuThuMua');
        const PhieuDichVu         = require('./PhieuDichVu');
        const CTPhieuDichVu       = require('./CTPhieuDichVu');
        const PhieuNhapKho        = require('./PhieuNhapKho');
        const BaoCao              = require('./BaoCao');
        const ChiTietBaoCao       = require('./ChiTietBaoCao');


        Phieu.LoaiPhieu = Phieu.belongsTo(LoaiPhieu, {
            as: 'loaiphieu',
            foreignKey: 'idloaiphieu'
        })

        Phieu.belongsTo(NhanVien, {
            as: 'nhanvien',
            foreignKey: {
                name: 'idnv',
                allowNull: false
            }    
        })

        Phieu.belongsTo(KhachHang, {
            as: 'khachhang',
            foreignKey: {
                name: 'idkh',
            },
        })

        Phieu.belongsToMany(SanPham, { 
            through: ChiTietPhieu,
            foreignKey: 'idphieu',
            otherKey: 'idsp'
        });

        Phieu.hasMany(ChiTietPhieu, {
            as: ChiTietPhieu.getAssociatedPhieuName(),
            foreignKey: 'idphieu'
        })

        Phieu.belongsToMany(SanPham, { 
            through: ChiTietPhieuMuaHang,
            foreignKey: 'idphieu',
            otherKey: 'idsp'
        });

        Phieu.hasMany(ChiTietPhieuMuaHang, {
            as: ChiTietPhieuMuaHang.getAssociatedPhieuName(),
            foreignKey: 'idphieu'
        })

        Phieu.hasOne(PhieuThuMua, {
            as: PhieuThuMua.getAssociatedModelName(),
            foreignKey: {
                name: 'idphieu',
                allowNull: false,
            }
        })

        Phieu.belongsToMany(SanPham, { 
            through: CTPhieuCamDo,
            foreignKey: 'idphieu',
            otherKey: 'idsp'
        });

        Phieu.hasMany(CTPhieuCamDo, {
            as: CTPhieuCamDo.getAssociatedPhieuName(),
            foreignKey: 'idphieu'
        })

        Phieu.hasOne(PhieuCamDo, {
            as: PhieuCamDo.getAssociatedModelName(),
            foreignKey: {
                name: 'idphieu',
                allowNull: false,
            }
        })

        Phieu.hasOne(PhieuDichVu, {
            as: PhieuDichVu.getAssociatedModelName(),
            foreignKey: 'idphieu'
        })

        Phieu.hasMany(CTPhieuDichVu, {
            as: CTPhieuDichVu.getAssociatedPhieuName(),
            foreignKey: 'idphieu'
        })

        Phieu.hasOne(PhieuNhapKho, {
            as: PhieuNhapKho.getAssociatedModelName(),
            foreignKey: 'idphieu'
        })

        Phieu.belongsToMany(BaoCao, {
            through: ChiTietBaoCao,
            foreignKey: 'idphieu',
            otherKey: 'idbc'
        })
    }


    
    static async defineScopes(){
        Phieu.addScope('withLoaiPhieu', (loaiphieu) => {
            const PhieuModel = Phieu.getPhieuModel(loaiphieu);
            // Phiếu bán hàng cũng chính là Phiếu
            if (PhieuModel._isAdditionModelEmpty())
                return {
                    where: { idloaiphieu: loaiphieu }
                }
            return {
                where: { idloaiphieu: loaiphieu},
                include: [
                    { model: PhieuModel, as: PhieuModel.getAssociatedModelName() }
                ]
            }
        })

        Phieu.addScope('withCTPhieu', (loaiphieu) => {
            const ChiTietModel = Phieu.getPhieuModel(loaiphieu)._getChiTietModel();
            return {
                include: [
                    { model: ChiTietModel, as: ChiTietModel.getAssociatedPhieuName() }
                ],
            }
        })

        Phieu.addScope('byIDKH', (idkh, loaiphieu) => {
            const ChiTietModel = Phieu.getPhieuModel(loaiphieu)._getChiTietModel();
            return {
                where: {idkh: idkh, idloaiphieu: 1},
                include: [
                    { model: ChiTietModel, as: ChiTietModel.getAssociatedPhieuName() }
                ],
            }
        })

        Phieu.addScope('byThoiGian', (start, end) => {
            return {
                where: {
                    ngaylapphieu: {
                        [Op.between]: [start, end]
                    }
                }
            }
        })

        Phieu.addScope('raw', {
            raw: true
        })
    }

    static async getListLoaiPhieu(){
        if (!Phieu.listLoaiPhieu){
            const LoaiPhieu = require('./LoaiPhieu');
            Phieu.listLoaiPhieu = await LoaiPhieu.findAll({ plain: true });
        }
        return Phieu.listLoaiPhieu;
    }

    static findAllPhieu(){
        return Phieu.scope('raw').findAll()
    }

    static getFindAllScope(loaiphieu = 1){
        return Phieu.scope([
            { method: ['withLoaiPhieu', loaiphieu] }, 
            { method: ['withCTPhieu', loaiphieu]}
        ])
    }

    static findPhieuByID(id, loaiphieu = 1){            
        return Phieu.scope([
            { method: ['withLoaiPhieu', loaiphieu] }, 
            { method: ['withCTPhieu', loaiphieu]}
        ]).findAll({
            where: {idphieu: id}
        });
    }

    static findPhieusByIDKH(idkh, loaiphieu = 1){
        return Phieu.scope([
            { method: ['byIDKH', idkh, loaiphieu] }, 
            { method: ['withLoaiPhieu', loaiphieu] }
        ]).findAll();
    }

    static findByDynamicallyCondition(loaiphieu, condition){
        const { ngaybatdau, ngayketthuc, ...restCondition } = condition;

        let PhieuModel = Phieu.scope({ method: ['withLoaiPhieu', loaiphieu] });
        if (ngaybatdau && ngayketthuc){
            const startTime = DateHelper.parseFrom(ngaybatdau).setHours(0);
            const endTime   = DateHelper.parseFrom(ngayketthuc).setHours(24);
            PhieuModel.scope({ method: ['byThoiGian', startTime, endTime] });
        }

        return PhieuModel.findAll({
            where: restCondition
        })
    }

    static getPhieuModel(loaiphieu){
        switch(loaiphieu){
            case 1: return Phieu;
            case 2: return require('./PhieuDichVu');
            case 3: return require('./PhieuCamDo');
            case 4: return require('./PhieuThuMua');
            case 5: return require('./PhieuKiemKe');
            case 6: return require('./PhieuThanhLy');
            case 7: return require('./PhieuNhapKho');
        }
    }
    
    static async createPhieu(phieuObj, idloaiphieu){
        try{

            const ModelPhieu = Phieu.getPhieuModel(idloaiphieu);
            phieuObj.idloaiphieu = idloaiphieu;
        
            await ModelPhieu._beforeCreateHook(phieuObj);        // Được gọi trước khi phiếu được tạo

            const newPhieu = await ModelPhieu._createNewPhieu(phieuObj, phieuObj.idloaiphieu);

            await ModelPhieu._afterCreateHook(newPhieu);           // Được gọi sau khi phiếu được tạo

            return newPhieu;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }



    static _isAdditionModelEmpty(){
        return this.getAssociatedModelName() == null;
    }

    static _getAdditionModel(loaiphieu){
        switch(loaiphieu){
            case 2: return require('./PhieuDichVu');
            case 3: return require('./PhieuCamDo');
            case 7: return require('./PhieuNhapKho');
        }
        return null;
    }

    static _getListCTPhieu(phieuObj){
        const ChiTietModel = Phieu.getPhieuModel(phieuObj.idloaiphieu)._getChiTietModel();
        return phieuObj[ChiTietModel.getAssociatedPhieuName()];
    }

    

    // overridable method group
    // *********************************************************

    // ** SHOULD ALWAYS BE OVERRIDdEN
    // *****************************************

    // Lấy ra model của chi tiết phiếu ứng với phiếu cần tạo
    static _getChiTietModel(){
        return require('./ChiTietPhieu');
    }

    static getAssociatedModelName(){
        return null;
    }

    // =========================================

    static async _createNewPhieu(phieuObj, loaiphieu){
        const ChiTietModel = this._getChiTietModel();

        const newPhieu = await sqlInstance.transaction(t => {
            let include = null;
            // Nếu không include thông tin khác
            if (this._isAdditionModelEmpty()){
                include = [{ model: ChiTietModel, as: ChiTietModel.getAssociatedPhieuName() }];
            }            
            else{
                const ModelPhieu = Phieu._getAdditionModel(loaiphieu);
                include = [
                    { model: ChiTietModel, as: ChiTietModel.getAssociatedPhieuName() },
                    { model: ModelPhieu, as: ModelPhieu.getAssociatedModelName() }
                ]          
            }
            return Phieu.create(phieuObj, {
                include: include,
                transaction: t,
            })
        })  

        return newPhieu;
    }

    static async _beforeCreateHook(phieuObj){

        const validationResult = await this._customValidate(phieuObj);
        
        // check validation in cross-model range
        if (validationResult.err)
            throw validationResult.err;

        const newID = await TableIDs.autoIncrementID(Phieu, Phieu.getModelIDPrefix());
        phieuObj.idphieu = newID;

        return phieuObj;
    }

    static async _customValidate(phieuObj){
        const { tinhtrangno } = phieuObj;

        if (tinhtrangno === globalValidator.TINN_TRANG_GHI_NO.GHI_NO)
            return { err: ErrorHandler.createError('invalid_value', { fields: ['tinhtrangno'] })}
        return { err: null };
    }

    static async _afterCreateHook(phieu){

        await this._updatePhieu(phieu);

        this._updateChiTiet(phieu);
    }

    static async _updatePhieu(phieu){
        const listCTPhieu = this._getListCTPhieu(phieu);
        const tongGiaTri = listCTPhieu
            .map(ctphieu => ctphieu.getDataValue('giatri'))
            .reduce((pre, cur) => pre + cur);
        await phieu.update({ tonggiatri: tongGiaTri}, {fields: ['tonggiatri']})
        return phieu;
    }

    static async _updateChiTiet(phieu){
        const SanPham = require('./SanPham');
        const listCTPhieu = this._getListCTPhieu(phieu);

        listCTPhieu.forEach(async (ctphieu) => {          
            const soLuongDaBan = ctphieu.getDataValue('soluong');
            const sanpham = await SanPham.findSanPhamByID(ctphieu.idsp); 
            const soLuongConLai = sanpham.getDataValue('soluong') - soLuongDaBan;
            sanpham.setDataValue('soluong', soLuongConLai);
            sanpham.save().then(value => {
                //console.log(value.soluong);
            });
        })
    }

    // ********************************************************
}


module.exports = Phieu;