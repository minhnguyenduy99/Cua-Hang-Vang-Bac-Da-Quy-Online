
module.exports = {
    // specify how data should be validated in the application
    dataValidator: {
        SDT          :   RegExp(/^[0-9]{10,11}$/),
        CMND         :   RegExp(/^[0-9]*$/),
        GioiTinh     :   ['NAM', 'NU', 'KHONGRO'],
        Account      :   RegExp(/^[a-zA-Z]\w{1,}$/),
        Password     :   RegExp(/^\w{8,}$/),
        SoLuong      :   RegExp(/^[0-9]*$/)
    },

    appGlobalRule: {
        ALLOW_IMAGE_EXTENSION: ['jpg', 'jpeg', 'png'],
        // specify the conditions of data for some operations
        dataConfig: {
            MINIMUM_AGE_TRANSACTION: 18,
        }
    }
}