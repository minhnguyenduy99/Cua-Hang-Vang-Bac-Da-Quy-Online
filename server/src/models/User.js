const DBInterface = require('./DBInterface');
const uuid = require('uuid');
const encryptor = require('../helpers/encryptor');
const sequelize = require('sequelize');
const Model = sequelize.Model;

const sqlizeInstance = DBInterface.getSequelizeInstance();

class User extends Model{

    isPasswordCorrect(enteredPassword){
        return encryptor.encrypt(enteredPassword, this.salt()) === this.password();
    }
}

User.init({
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
        get(){
            return () => this.getDataValue('username');
        }
    },
    password: {
        type: sequelize.STRING,
        allowNull: false,
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
    modelName: 'User',
    timestamps: false,
    sequelize: sqlizeInstance
})

const generateSaltAndPassword = (user) => {
    if (user.changed('password')){
        user.salt = encryptor.createSalt();
        user.password = encryptor.encrypt(user.password(), user.salt());
    }
}

User.beforeCreate(generateSaltAndPassword);
User.beforeUpdate(generateSaltAndPassword);


//User.sync({force: true});

module.exports = User;
