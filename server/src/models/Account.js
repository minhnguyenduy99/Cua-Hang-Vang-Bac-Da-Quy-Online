const DBInterface = require('./DBInterface');
const uuid = require('uuid');
const encryptor = require('../helpers/encryptor');
const sequelize = require('sequelize');
const Model = sequelize.Model;
const appValidator = require('../config/application-config').dataValidator;

const sqlizeInstance = DBInterface.getSequelizeInstance();

const generateSaltAndPassword = (account) => {
    if (account.changed('password')){
        account.salt = encryptor.createSalt();
        account.password = encryptor.encrypt(account.password, account.salt);
    }
}

class Account extends Model{

    static initModel(){
        Account.init({
            id: {
                type: sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: function(){
                    return uuid();
                }
            },
            username: {
                type: sequelize.STRING,
                allowNull: false,
                unique: true,
                validate:{
                    is: appValidator.Account
                }
            },
            password: {
                type: sequelize.STRING,
                allowNull: false,
                validate: {
                    is: appValidator.Password
                },
                get(){
                    return this.getDataValue('password');
                }
            },
            salt: {
                type: sequelize.STRING,
                get(){
                    return this.getDataValue('salt');
                }
            }
        },
        {
            timestamps: false,
            sequelize: sqlizeInstance,
            tableName: 'Account'
        })
        
        Account.beforeCreate(generateSaltAndPassword);
        Account.beforeUpdate(generateSaltAndPassword);
    }

    isPasswordCorrect(enteredPassword){
        return encryptor.encrypt(enteredPassword, this.salt) === this.password;
    }

    static register(user , pw){
        return Account.findOne({
            where: {username: user}
        })
        .then(account => {
            // the account already exists
            if (account){
                return Promise.resolve({ account: null, message: 'The username already exists' })
            }
            else{
                return new Promise((resolve, reject) => {
                    Account.create({
                        username: user,
                        password: pw
                    })
                    .then(newAccount => {
                        if (newAccount){
                            resolve({account: newAccount, message: 'Register account successfully'});
                        }
                        else{
                            resolve({account: null, message: 'Register account failed'});
                        }
                    })
                    .catch(err => reject(err));
                })
                
            }
        })
    }
}

module.exports = Account;
