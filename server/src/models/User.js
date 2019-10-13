const BaseModel = require('./BaseModel');

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

    static insert(model){
        return BaseModel.insert(User.name, [model.data]);
    }
}