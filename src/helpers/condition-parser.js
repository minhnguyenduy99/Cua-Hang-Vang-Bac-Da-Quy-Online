const sequelize     = require('sequelize');

const Op    = sequelize.Op;


class ConditionParser {

    constructor(plainConditionObj){
        this.plainCondition = plainConditionObj || { };
        this.condition = { };

        this.parseCondition(this.plainCondition);
    }

    parseCondition(){
        for(let prop in this.plainCondition){
            let value = this.plainCondition[prop];
            
            if (value instanceof Array){
                this.addRange(prop, value);
                continue;
            }
            if (value instanceof Object){
                this.addValue(prop, value);
            }
        }
    }

    getCondition(){
        return this.condition;
    }

    addRange(field, [from, to]){
        this.condition[field] = {
            [Op.in]: [from, to]
        }
        return this;
    }

    addValue(field, value){
        this.condition[field] = value;
        return this;
    }
}

module.exports = ConditionParser;