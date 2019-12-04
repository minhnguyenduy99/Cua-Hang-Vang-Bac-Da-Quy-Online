
module.exports = {
    // specify how data should be validated in the application
    dataValidator: {
        SDT          :   { args: RegExp(/^[0-9]{10,11}$/),         msg: 'Số điện thoại phải 10 hoặc 11 chữ số' },
        CMND         :   { args: RegExp(/^[0-9]{10,11}$/),         msg: 'CMND không hợp lệ'                    },
        GioiTinh     :   { args: ['NAM', 'NU', 'KHONGRO'],         msg: 'Giới tính không hợp lệ'               },
        TenTaiKhoan  :   { args: RegExp(/^[a-zA-Z]\w*$/),          msg: 'Tên tài khoản không hợp lệ'           },
        MatKhau      :   { args: RegExp(/^\w{8,}$/),               msg: 'Mật khẩu phải từ 8 ký tự trở lên'     },
        SoLuong      :   { args: RegExp(/^[0-9]*$/),               msg: 'Số lượng không hợp lệ'                },
        TienTe       :   { args: RegExp(/^[1-9][0-9]*00$|^0$/),    msg: 'Tiền tệ không hợp lệ'                 },
        KhoiLuong    :   { args: RegExp(/^[0-9]*.?[0-9]{0,2}$/),   msg: 'Khối lượng không hợp lệ'              },
        TiLePhanTram :   { args: RegExp(/^(0(\.\d+)?|1(\.0+)?)$/), msg: 'Tỉ lệ không hợp lệ'                   },
        Thang        :   { args: [1, 12],                          msg: 'Tháng không hợp lệ'                   },
        Nam_Max      :   { args: 2100,                             msg: 'Năm không hợp lệ'                     }
    },

    AppGlobalRule: {
        ALLOW_IMAGE_EXTENSION  : ['jpg', 'jpeg', 'png'],

        // Danh sách các loại phiếu
        DANH_SACH_LOAI_PHIEU   : [
            'BÁN HÀNG',
            'DỊCH VỤ',
            'CẦM ĐỒ',
            'MUA HÀNG',
            'KIỂM KÊ',
            'THANH LÝ',
            'NHẬP KHO',
            'XUẤT KHO'
        ],


        // Tình trạng của phiếu có nợ hay đã trả
        TINN_TRANG_GHI_NO: {
            GHI_NO          : 0,
            KHONG_NO        : 1
        },

        // Danh sách các tình trạng của phiếu cầm đồ
        TINH_TRANG_PHIEU_CAM_DO     : {
            CHUA_TRA        : 0,
            DA_THANH_TOAN   : 1,
            QUA_HAN         : 2
        },

        // tình trạng phiếu dịch vụ
        TINH_TRANG_PHIEU_DICH_VU    :  {        
            CHUA_LAM             : 0,
            DA_GIAO              : 1
        },

        // Danh sách tình trạng sản phẩm
        TINH_TRANG_SAN_PHAM         :  {
            UNAVAILABLE  : 0,
            AVAILABLE    : 1,
        },

        // Danh sách các loại tài khoản
        LOAI_TAI_KHOAN              :  {
            NHAN_VIEN       : 1,
            QL_NHAN_SU      : 2,
            QUAN_LY_KHO     : 3,
            GIAM_DOC        : 4,
            KHACH_HANG      : 5,
        },

        // Danh sách các chức vụ của nhân viên
        CHUC_VU:    {
            NHAN_VIEN       : 1,
            QL_NHAN_SU      : 2,
            QUAN_LY_KHO     : 3,
            GIAM_DOC        : 4,
        },

        // các loại báo cáo
        LOAI_BAO_CAO: {
            DOANH_THU       : 1,
            CONG_NO         : 2,
        },

        // Loại công nợ trong báo cáo công nợ
        LOAI_CONG_NO: {
            THU             : 1,    // Khách hàng hoặc nhà cung cấp hợ cửa hàng
            TRA             : 2     // Cửa hàng nợ nhà cung cấp hoặc khách hàng
        },

        // data configuration (can be modified by the authorized user in the settings)
        DataConfiguration: {

            // Số tuổi nhỏ nhất được phép thưc hiện giao dịch
            TUOI_THUC_HIEN_GIAO_DICH    :  18,      

            // Lãi suất mặc định của các giao dịch liên quan
            LAI_SUAT_MAC_DINH           :  0.3,         

            // Lãi suất linh động theo thời gian
            LAI_SUAT_LINH_DONG: {
                SO_LUONG_NGAY   :    10,
                LAI_SUAT        :    0.03
            },

            //  Tỉ lệ giá thu mua sản phẩm
            TI_LE_GIA_THU_MUA_RANGE     :  [0.5, 0.9],

            // Tỉ lệ giá cầm đồ cao nhất
            TI_LE_CAM_DO_MAX            : 0.8,

            // Phần trăm lợi nhuận tối thiểu
            PHAN_TRAM_LOI_NHUAN_MIN     : 0.1
        }
    },
}