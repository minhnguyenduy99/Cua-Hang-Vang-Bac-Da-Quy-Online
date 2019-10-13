const query = require('./BaseQuery');
const db = require('../dbConnection');


module.exports = class BaseModel{

    constructor(queryOptions){
        this.queryOptions = queryOptions;
    }

    select(fields){
        if (this.queryOptions == undefined){
            throw new Error('The query command has not been called yet')
        }
        this.queryOptions.fields = fields.split(' ');
        return this;
    }

    exec(){
        if (this.queryOptions == undefined){
            throw new Error('The query command has not been called yet');
        }
        return new Promise((resolve, reject) => {
            const {fields, table, conditions, queryCallback} = this.queryOptions;
            db.connection.query(
                queryCallback(fields, table, conditions), 
                (err, results, fields) => {
                    if (err){
                        console.log(err);
                        reject(err);
                    }
                    else{
                        var plainResults = []
                        results.forEach(result => {
                            plainResults.push(BaseModel.getPlainData(result));
                        })
                        resolve(plainResults);
                    }
                }
            );
        })
    }

    static getPlainData(dbObject){
        if (dbObject == undefined){
            return undefined
        }
        var plainData = {}
        Object.keys(dbObject).forEach(key => {
            plainData[key] = dbObject[key];
        })
        return plainData
    }

    static findAll(className){ 
        return new BaseModel({
            fields: ['*'],
            table: className,
            conditions: undefined,
            queryCallback: query.selectString
        })
    }

    static find(className, conditions){
        return new BaseModel({
            fields: ['*'],
            table: className,
            conditions: conditions,
            queryCallback: query.selectString
        })
    }

    static insert(className, objects){
        var datas = objects.map(object => Object.values(object))
        var schema = Object.keys(objects[0]);
        return new Promise((resolve, reject) => {
            db.connection.query(
                query.insertString(schema, className),
                [datas],
                (err, results, fields) => {
                    if (err){
                        console.log(err);
                        reject(err);
                    }
                    else{
                        resolve(results);
                    }
                })
        })
    }
}

