const DBInterface = require('./DBInterface');
const sequelize = require('sequelize');
const uuid = require('uuid');
const instance = DBInterface.getSequelizeInstance();

const KhachHang = require('./KhachHang');
const NhanVien = require('./NhanVien');
const SanPham = require('./SanPham');
const LoaiSanPham = require('./LoaiSanPham');

class HoaDon extends sequelize.Model{

    static findAndIncludeAll_HoaDon(){
        return HoaDon.findAll({
            include: [
                {
                    model: SanPham,
                    as: 'listSanPham',
                    include: [LoaiSanPham]
                },
                {
                    model: require('./NhanVien')
                },
                {
                    model: require('./KhachHang')
                }
            ]
        })
    }

    static initModel(){
        HoaDon.init({
            ID_HD: {
                type: sequelize.UUID,
                primaryKey: true,
                defaultValue: function(){
                    return uuid()
                }
            },
            NgayLap: {
                type: sequelize.DATE,
                defaultValue: new Date()
            },
            GhiChu: {
                type: sequelize.TEXT,
                allowNull: true,
            }
        },{
            timestamps: false,
            modelName: 'HoaDon',
            sequelize: instance,
        })
    }

    static async saveHoaDon(hoadonObj, listCTHD){
        let hoaDon = {};
        HoaDon.create(hoadonObj)
        .then(newHoaDon => {
            if (newHoaDon){
                hoaDon[hoaDon] = newHoaDon;
                hoaDon[cthd] = listCTHD.map(async (cthd) => {
                    ChiTietHoaDon.create(cthd)
                    .then(newCTHD => {
                        if (newCTHD){
                            return newCTHD;
                        }
                        throw new Error('Error while creating')
                    })
                })
                return Promise.resolve(hoaDon);              
            }
            else{
                throw new Error('Error while creating')
            }
        })
        .catch(err => {
            return Promise.reject(err);
        })
    }
}

module.exports = HoaDon;