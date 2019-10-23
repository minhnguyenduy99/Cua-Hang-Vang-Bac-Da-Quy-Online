
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
}
