const acl = require('acl');
const appConfig = require('./application-config').AppGlobalRule;

var _acl = new acl(new acl.memoryBackend());

module.exports.init = async () => {
    await _acl.allow([
        { 
            roles: 'khachhang',
            allows: [
                { resources: '/sanphams/', permissions: 'get' }
            ]
        }
    ])
    return _acl;
}

module.exports.getMappingRole = (roleid) => {
    const { LOAI_TAI_KHOAN } = appConfig;
    switch(roleid){
        case LOAI_TAI_KHOAN.KHACH_HANG  : return 'khachhang';
        case LOAI_TAI_KHOAN.NHAN_VIEN   : return 'nhanvien';
        case LOAI_TAI_KHOAN.QL_NHAN_SU  : return 'qlnhansu';
        case LOAI_TAI_KHOAN.QUAN_LY_KHO : return 'qlkho';
        case LOAI_TAI_KHOAN.GIAM_DOC    : return 'giamdoc' 
    }
    return null;
}

module.exports.acl = _acl;
