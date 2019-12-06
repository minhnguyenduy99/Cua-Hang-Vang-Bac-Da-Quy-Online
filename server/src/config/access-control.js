const acl                 = require('acl');
const appConfig           = require('./application-config').AppGlobalRule;
const { ErrorHandler }    = require('../middlewares/error-handler');
const TaiKhoan            = require('../models/TaiKhoan');

var _acl = new acl(new acl.memoryBackend());

const FIRST_LOG_ID = 'first_log_id';

module.exports.init = async () => {
    await _acl.allow([
        {
            roles: 'firstAccessor',
            allows: [
                { resources: 'quanly', permissions: 'nhanvien' }
            ]
        },
        { 
            roles: 'khachhang',
            allows: [
                { resources: 'logout',   permissions: 'get'   },
                { resources: 'sanpham',  permissions: ['get'] },
                { resources: 'khachhang',permissions: ['view', 'update', 'phieumuahang']}
            ]
        },
        {
            roles: 'nhanvien',
            allows: [
                { resources: 'nhanvien', permissions: ['phieu', 'profile'] },
                { resources: 'sanpham',  permissions: '*'},
                { resources: 'quanly', permissions: 'khachhang'},
                { resources: 'dichvu', permissions: '*'}
            ]
        }, 
        {
            roles: 'qlnhansu',
            allows: [
                { resources: 'quanly', permissions: ['nhanvien', 'khachhang'] },
                { resources: 'sanpham', permissions: 'get' }
            ]
        },
        {
            roles: 'qlkho',
            allows: [
                { resources: 'kho',     permissions: ['nhacungcap', 'phieu'] },
                { resources: 'sanpham', permissions: '*' }
            ]
        }
    ])

    _acl.addRoleParents('giamdoc', ['nhanvien', 'qlnhansu']);

    _acl.addUserRoles(FIRST_LOG_ID, 'firstAccessor');

    return _acl;
}

module.exports.getMappingRole = (roleid) => {
    const { LOAI_TAI_KHOAN } = appConfig;
    switch(roleid){
        case LOAI_TAI_KHOAN.KHACH_HANG  : return 'khachhang';
        case LOAI_TAI_KHOAN.NHAN_VIEN   : return 'nhanvien';
        case LOAI_TAI_KHOAN.QL_NHAN_SU  : return 'qlnhansu';
        case LOAI_TAI_KHOAN.QUAN_LY_KHO : return 'qlkho';
        case LOAI_TAI_KHOAN.GIAM_DOC    : return 'giamdoc';
        case LOAI_TAI_KHOAN.ADMIN       : return 'admin';
    }
    return null;
}


module.exports.idChecker = (idParamName, sessionFieldName) => {
    return (req, res, next) => {
        const sessionID = req.user ? req.user[sessionFieldName] : null;
        const paramID   = req.params[idParamName];
        if (paramID === sessionID && sessionID) next();
        else                       next(ErrorHandler.createError('unauthorized'));
    }
}

module.exports.firstTimeAuthorized = async (req, res, next) => {
    const countTK = await TaiKhoan.count();

    // first time access system
    if (countTK === 0)
        req.first_log_id = FIRST_LOG_ID;
    else   
        req.first_log_id = null;
    next();
}

module.exports.authorizator = (resource = null, permission = null, getUserID = (req, res) => null) => {
    return async (req, res, next) => {
        const rs     = resource   || req.baseUrl.split('/').filter(val => val !== '')[0];
        const pms    = permission || req.path.split('/').filter(val => val !== '')[0] || req.method.toLowerCase();
        const id     = getUserID(req, res) || req.first_log_id || (req.user ? req.user.idtk : null);
        
        const allowed = await _acl.isAllowed(id, rs, pms)
        if (allowed)
            next();
        else
            next(ErrorHandler.createError('unauthorized', { statusCode: 401 }));
    }
}

module.exports.acl = _acl;
