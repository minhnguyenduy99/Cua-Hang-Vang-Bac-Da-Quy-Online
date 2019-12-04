const path = require('path');

var serverConfig = {

    DB_CONNECTION_LIST: [
        {
            name: 'DEVELOPMENT',
            host: 'remotemysql.com',
            user: 'pKAX30MXzl',
            password: 'XlKkAmxDDu',
            database: 'pKAX30MXzl',
            port: 3306
        },
        {
            name: 'TEST',
            host: 'remotemysql.com',
            user: 'mermJaNhEo',
            password: 'TitndLydl7',
            database: 'mermJaNhEo',
            port: 3306
        },
        {
            name: 'LOCAL',
            host: '127.0.0.1',
            user: 'root',
            password: 'localhost123',
            port: 3306,
            database: 'cuahangvangbacdaquy'
        },
    ],

    publicFolderPath: path.resolve(__dirname, '../../public/'),

    storage: {
        imageFolder: {                          //   The relative path is name/subfolder          
            name: 'images',
            defaultImageFolder  : 'default',                     
            subFolders: {
                SANPHAM         :  'sanpham',   
                KHACHHANG       :  'khachhang',
                NHANVIEN        :  'nhanvien',
                NHACUNGCAP      :  'nhacungcap',
                DICHVU          :  'dichvu'
            }
        }
    },

    TOKEN_PRIVATE_KEY: 'SECRET_KEY',
}

module.exports = serverConfig;