const sequelize = require('sequelize');

const Op        = sequelize.Op;

class BaseModel extends sequelize.Model{

    static _checkBase(){
        if (this instanceof BaseModel){
            throw new Error('Cannot use BaseModel class directly');
        }
    }
    static async initModel(){
        BaseModel._checkBase();

        BaseModel.timeStampsObj = {
            deletedAt: 'deletedTime',
            updatedAt: 'lastUpdatedTime',
            createdAt: 'createdTime',
        }

        // specify weither the model has image path value
        BaseModel.imageable = false;
    }

    static getModelIDPrefix() { return '' }
    static getModelIDLength() { return 0; }

    static async defineScopes(){
        BaseModel._checkBase();
    }

    async getPlainObjExclude(fieldList){
        BaseModel._checkBase();

        try{
            let plainObj = this.get({ plain: true, clone: true });
            fieldList.forEach(field => {
                delete plainObj[field];
            })
            
            return plainObj;
        }
        catch(err){
            throw err;
        }
    }

    static validationError(code, message = ''){
        return new Error(`[${code}] ${message}`);
    }


    // ** OVERRIDABLE METHOD GROUP
    // ============================================

    // These two methods should always be overriden in derived classes
    getUpdatableFieldList(){ return [] }

    async updateModel(updateObj, transaction = null){
        if (!updateObj) return { success: null }
        Object.setPrototypeOf(updateObj, null);
        try{
            const fields = this.getUpdatableFieldList();
            await this.update(updateObj, { fields: fields }, { transaction: transaction })
            return { success: true }
        }
        catch(err){
            console.log('[UpdateError] ' + err);
            throw err;
        }

        function removeNullField(obj, removePredicate = (obj, propName) => obj[propName] === undefined){
            for (var propName in obj) { 
                if (removePredicate(obj, propName)) {
                  delete obj[propName];
                }
            }
        }
    }
}

module.exports = BaseModel;