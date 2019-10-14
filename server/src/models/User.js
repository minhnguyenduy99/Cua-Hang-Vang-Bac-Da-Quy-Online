const BaseModel = require('./BaseModel');
const crypto = require('crypto');

module.exports = class User extends BaseModel{
    
    constructor(data){
        super(undefined);
        this.data = data;
    }

    static findAll(){
        return BaseModel.findAll(User.name);
    }

    static find(conditions){
        return BaseModel.find(User.name, conditions);
    }

    static delete(conditions){
        return BaseModel.delete(User.name, conditions);
    }

    save(){
        const id = crypto.randomBytes(8).toString('hex');
        const savedData = {
            id: id,
            username: this.data.username,
            password: this.data.password
        }  
        return BaseModel.insert(User.name, [savedData]);
    }
}