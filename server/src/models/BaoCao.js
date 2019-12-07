const sequelize         = require('sequelize');
const sqlInstance       = require('./DBInterface').getSequelizeInstance();
const DateHelper        = require('../helpers/date-helper');
const BaseModel         = require('./BaseModel');
const Phieu             = require('./Phieu');
const TableIDS          = require('./TableLastIDs');
const ErrorHandler      = require('../middlewares/error-handler').ErrorHandler;
const appConfig         = require('../config/application-config');
const ConditionParser   = require('../helpers/condition-parser');

const Op                 = sequelize.Op;
const globalAppValidator = appConfig.AppGlobalRule;
const dataValidator      = appConfig.dataValidator;


class BaoCao extends BaseModel{
    static async initModel(){
        BaoCao.init({
            idbc: {
                type: sequelize.STRING(BaoCao.getModelIDLength()),
                primaryKey: true,
                field: 'IDBC'
            },
            ngaylapbaocao: {
                type: sequelize.DATE,
                defaultValue: new Date(),
                set(value){
                    this.setDataValue('ngaylapbaocao', new Date());
                },
                field: 'NgayLapBC'
            },
            thoigianbd: {
                type: sequelize.DATE,
                allowNull: false,
                field: 'ThoiGianBD',
                set(value){
                    const dateCast = DateHelper.parseToYearMonth(value);
                    this.setDataValue('thoigianbd', dateCast);
                }
            },
            thoigiankt: {
                type: sequelize.DATE,
                allowNull: false,
                field: 'ThoiGianKT',
                set(value){
                    const dateCast = DateHelper.parseToYearMonth(value);
                    this.setDataValue('thoigiankt', dateCast);
                }
            },
            giatrikitruoc: {
                type: sequelize.INTEGER,
                validate: {
                    is: dataValidator.TienTe,
                },
                field: 'GiaTriKiTruoc',
            },
            tonggiatri: {
                type: sequelize.INTEGER,
                validate: {
                    is: dataValidator.TienTe
                },
                field: 'TongGiaTri'
            },
            loaibc: {
                type: sequelize.INTEGER,
                allowNull: false,
                validate: {
                    isIn: [Object.values(globalAppValidator.LOAI_BAO_CAO)]
                },
                field: 'LoaiBC'
            }
        },{
            sequelize: sqlInstance,
            timestamps: false,
            tableName: 'BaoCao',
            getterMethods: {
                ngaybatdauObj(){
                    return DateHelper.getSeparateDateObj(this.getDataValue('thoigianbd'));
                },
                ngayketthucObj(){
                    return DateHelper.getSeparateDateObj(this.getDataValue('thoigiankt'));
                }
            },
            validate: {
                // // kiểm tra thời gian bắt đầu và thời gian kết thúc có hợp lệ
                // timeRangeValid(){
                //     if (this.get('ngaybatdauObj').days >= this.getDataValue('thoigiankt'))
                //         throw ErrorHandler.createError(
                //             'invalid_value', 
                //             { fields: ['thoigianbd', 'thoigiankt'] }
                //         )
                // }
            },
            hooks: {
                beforeCreate(baocao, options){
                    return new Promise(async (resolve, reject) => {
                        const lastestBaoCao = await BaoCao.getLatestBaoCao() || {tonggiatri : 0};
                        if (!baocao.giatrikitruoc)
                            baocao.giatrikitruoc = lastestBaoCao.tonggiatri;
                        resolve();
                    })
                }
            },
        })
    }

    static async getLatestBaoCao(){
        return BaoCao.findOne({
            order: [['thoigianbd', 'DESC']]
        })
    }

    static async setAssociations(){
        const Phieu           = require('./Phieu');
        const ChiTietBaoCao   = require('./ChiTietBaoCao');

        BaoCao.belongsToMany(Phieu, {
            through: ChiTietBaoCao,
            foreignKey: 'idbc',
            otherKey: 'idphieu' 
        })

        BaoCao.hasMany(ChiTietBaoCao, {
            as: 'danhsach_ctbaocao',
            foreignKey: 'idbc'
        })
    }

    static async defineScopes(){
        const ChiTietBaoCao = require('./ChiTietBaoCao');
        BaoCao.addScope('byLoaiBC', (loaibc) => {
            return {
                where: {idbc: idbc}
            }
        })

        BaoCao.addScope('withCTBaoCao', {
            include: [
                { model: ChiTietBaoCao, as: 'danhsach_ctbaocao' }
            ]
        })

        BaoCao.addScope('raw', {
            raw: true
        })
    }

    static getModelIDPrefix(){
        return 'BC';
    }

    static getModelIDLength(){
        return TableIDS.ZERO_PADDING_LIST().BAOCAO + BaoCao.getModelIDPrefix().length;
    }

    static getBaoCaoModel(loaibaocao){
        switch(loaibaocao){
            case globalAppValidator.LOAI_BAO_CAO.DOANH_THU: return require('./BaoCaoDoanhThu');
            case globalAppValidator.LOAI_BAO_CAO.CONG_NO  : return require('./BaoCaoCongNo');
        }
        return null;
    }

    static async sumGiaTriPhieu(listPhieuID){
        const Phieu = require('./Phieu');
        let tonggiatri = await Phieu.sum('tonggiatri', {
            where: {
                idphieu: { [Op.in]: listPhieuID }
            },
        });
        if (!tonggiatri || isNaN(tonggiatri))
            tonggiatri = 0;
        return tonggiatri;
    }

    static async updateTongGiaTri(baocao){
        const listPhieuID = baocao.danhsach_ctbaocao.map(chitiet => chitiet.idphieu);
        const tonggiatri = await this.sumGiaTriPhieu(listPhieuID);
        baocao.setDataValue('tonggiatri', tonggiatri);

        baocao.save({ fields: ['tonggiatri'] });
    }

    static async createBaoCao(baocaoObj){
        const ChiTietBaoCao  = require('./ChiTietBaoCao');
        const BaoCaoModel    = this.getBaoCaoModel(baocaoObj.loaibc);

        await BaoCaoModel._beforeCreateHook(baocaoObj);

        const newBaoCao = await BaoCao.create(baocaoObj, {
            include: [
                { 
                    model: ChiTietBaoCao, 
                    as: 'danhsach_ctbaocao',
                },
            ],
        })

        await BaoCaoModel._afterCreateHook(newBaoCao);

        return newBaoCao.dataValues;
    }

    static async findAllBaoCao(loaibc = globalAppValidator.LOAI_BAO_CAO.DOANH_THU){
        return BaoCao.scope({ method: ['byLoaiBC', loaibc]}, 'withCTBaoCao', 'raw')
            .findAll()
    }

    static async findByIDBC(idbc){
        return BaoCao.scope('withCTBaoCao', 'raw')
            .findOne({
                where: {idbc: idbc}
            });
    }

    static async findWithDynamicCondition(condition){
        let { thoigianbd, thoigiankt, ...restCondition } = condition;
        thoigianbd = DateHelper.parseToYearMonth(thoigianbd);
        thoigiankt = DateHelper.parseToYearMonth(thoigiankt);
        const whereCondition = new ConditionParser({ thoigianbd, thoigiankt, ...restCondition}).getCondition();
        return BaoCao.scope('withCTBaoCao')
            .findAll({ where: whereCondition })
    }

    // ** OVERRIDABLE METHOD GROUP
    // =================================================

    // Lấy ID của toàn bộ phiếu nằm trong báo cáo
    static async _getAllPhieuBaoCaoID(phieuObj){ return []; }

    // Lấy danh sách các loại phiếu dùng trong báo cáo
    static _getListLoaiPhieu()  { return null; }

    static async _beforeCreateHook(baocaoObj){

        baocaoObj.idbc = await TableIDS.autoIncrementID(BaoCao, BaoCao.getModelIDPrefix());

        const listPhieuID = await this._getAllPhieuBaoCaoID(baocaoObj);
        baocaoObj.danhsach_ctbaocao = listPhieuID.map(idphieu => {
            return {
                idphieu: idphieu
            }
        });
    }

    static async _afterCreateHook(baocao){
        await this.updateTongGiaTri(baocao);
    }    
}   


module.exports = BaoCao;