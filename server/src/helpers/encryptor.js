const path = require('path');
const crypto = require('crypto');

module.exports = class encryptor{
    static encrypt(plainText, salt){
        return crypto.createHash('RSA-SHA256')
                     .update(plainText)
                     .update(salt)
                     .digest('hex');
    }

    static createSalt(){
        return crypto.randomBytes(16).toString('HEX');
    }

    static formatFileName(name, formatOption){
        const { prefix, timeStamps } = formatOption;
        const nameOnly = path.normalize(name);
        const ext = path.extname(name);

        prefix = prefix ? prefix : nameOnly.substring(0, parseInt(Math.random() * nameOnly.length + 1));
        
        if (!name){
            throw new Error('File name must be specified');
        }

        if (!ext){
            throw new Error('The file extension must be specified');
        }

        return prefix + '__' + (timeStamps ? timeStamps : '') + ext;
    }
}
