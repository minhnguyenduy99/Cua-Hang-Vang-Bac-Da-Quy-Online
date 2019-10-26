const DBInterface = require('./DBInterface');
const uuid = require('uuid');
const encryptor = require('../helpers/encryptor');
const sequelize = require('sequelize');
const Model = sequelize.Model;

const sqlizeInstance = DBInterface.getSequelizeInstance();

class Account extends Model{

    isPasswordCorrect(enteredPassword){
        return encryptor.encrypt(enteredPassword, this.salt()) === this.password();
    }

    static register(username, password){
        return Account.findOne({
            where: {username: username}
        })
        .then(account => {
            // the account already exists
            if (account){
                return Promise.resolve({ account: null, message: 'The username already exists' })
            }
            else{
                return new Promise((resolve, reject) => {
                    Account.create({
                        username: username,
                        password: password
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
        .catch(err => {
            return Promise.reject(err)
        });
    }
}

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
            notEmpty: true
        }
    },
    password: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        get(){
            return () => this.getDataValue('password');
        }
    },
    salt: {
        type: sequelize.STRING,
        get(){
            return () => this.getDataValue('salt');
        }
    }
},
{
    modelName: 'Account',
    timestamps: false,
    sequelize: sqlizeInstance
})

const generateSaltAndPassword = (account) => {
    if (account.changed('password')){
        account.salt = encryptor.createSalt();
        account.password = encryptor.encrypt(account.password(), account.salt());
    }
}

Account.beforeCreate(generateSaltAndPassword);
Account.beforeUpdate(generateSaltAndPassword);


//account.sync({force: true});

module.exports = Account;
