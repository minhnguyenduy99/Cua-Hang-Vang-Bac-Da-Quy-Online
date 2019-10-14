

module.exports = class BaseQuery{

    static selectString(fields, table, condition){
        var str = 'select ';

        str = str.concat(BaseQuery.getFieldSelectString(fields), ' ');

        str = str.concat(`from ${table} `);
        
        if (condition == undefined)
            return str;

        str = str.concat('where ');

        const keys = Object.keys(condition);
        
        keys.forEach((key, index) => {
            var conditionStr = `${key} = '${condition[key]}' `
            // last key
            if (index != keys.length -1)
                conditionStr = conditionStr.concat('AND ');
            str = str.concat(conditionStr);
        })

        return str.concat(';')
    }

    static insertString(schemas, table){
        var query = `insert into ${table} `;

        var fieldString = '(' + BaseQuery.getFieldSelectString(schemas) + ')';
            
        query = query.concat(fieldString, ' VALUES ?');

        return query;
    }

    static deleteString(table, conditions){
        var query = `delete from ${table} `;

        if (conditions == undefined){
            return query;
        }

        query = query.concat(BaseQuery.getConditionString(conditions));

        return query;
    }

    static getValueInsertString(data){
        if (data.length == 1){
            return '(' + BaseQuery.getFieldSelectString(data[0]) + ')'
        }
        var inserts = data.reduce((pre, cur) => {
            var insert = '(' + BaseQuery.getFieldSelectString(cur) + ')'
            return pre + insert
        })
        return inserts;
    }

    static getFieldSelectString(fields){
        return fields.reduce((pre, cur, curIndex, array) => {
            return `${pre}, ${cur}`
        })
    }

    static getConditionString(conditions){
        if (conditions == undefined){
            return '';
        }

        var conditionQuery = 'WHERE ';

        const keys = Object.keys(conditions);
        
        keys.forEach((key, index) => {
            var conditionStr = `${key} = '${conditions[key]}' `
            // last key
            if (index != keys.length -1)
                conditionStr = conditionStr.concat('AND ');
            conditionQuery = conditionQuery.concat(conditionStr);
        })

        return conditionQuery;
    }
}