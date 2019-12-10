const sequelize = require('sequelize');
const express   = require('express');

const router    = express.Router();

const ERROR_KEY_MAPPING = {
    not_unique          :   { code: 1, name: 'KEY_EXISTS'           },
    is                  :   { code: 2, name: 'WRONG_FORMAT'         },
    isIn                :   { code: 3, name: 'VALUE_UNDEFINED'      },
    fk_not_found        :   { code: 4, name: 'KEY_VALUE_NOT_FOUND'  },
    rs_not_found        :   { code: 5, name: 'RESOURCE_NOT_FOUND'   },
    invalid_value       :   { code: 6, name: 'INVALID_VALUE'        },
    req_not_found       :   { code: 7, name: 'REQUEST_NOT_FOUND'    },
    unauthorized        :   { code: 8, name: 'UNAUTHORIZED'         },
}

class ErrorObjectConstructor extends Error{

    constructor(code, name, statusCode = 400, fields = null, detail = null, params = null){
        super(detail);
        this.code       = code;
        this.statusCode = statusCode;
        this.name       = name;
        this.fields     = fields  || undefined;
        this.detail     = detail  || undefined;
        this.params     = params  || undefined;
    }
}



class ErrorHandler{

    static createError(errorType, errorOption = {}){
        const { statusCode, fields = null, message = null } = errorOption;
        const { code, name } = ERROR_KEY_MAPPING[errorType];
        const error = new ErrorObjectConstructor(code, name, statusCode, fields, message);
        return error;
    }

    static get ERROR_LIST(){
        return {
            RESOURCE_NOT_FOUND: 1,
        }
    }

    static parseValidationError(errItem){
        const { path, message: detail, validatorKey } = errItem;
        // try to extract the explicit code in the message (used for custom message)
        let [ code, msg ] = detail.split(/[\[,\]]/).filter(value => value !== '');
        code = parseInt(code);
        
        // find standard error based on the validatorKey and code (if one of them exists)
        const standardErr = ERROR_KEY_MAPPING[validatorKey] 
        || Object.values(ERROR_KEY_MAPPING).filter(err => err.code == parseInt(code))[0];
    
        // the error is in error mapping
        if (standardErr){
            let msgDetail = code === NaN || !code ? detail : msg;
            return new ErrorObjectConstructor(
                standardErr.code, 
                standardErr.name, 
                path.toLowerCase(), 
                msgDetail.trim())
        }
    
        if (!code || code == NaN) throw new Error('The validation code must be specified');
    
        return new ErrorObjectConstructor(code, validatorKey, path.toLowerCase(), msg.trim());
    }

    static parseDatabaseError(err){
        const { constructor: { name } } = err;

        switch(name){
            case sequelize.ForeignKeyConstraintError.name: 
                return this.parseForeignKeyError(err);
        }
    }

    static parseForeignKeyError(err){
        const { fields } = err;
        const error = ERROR_KEY_MAPPING.fk_not_found;

        return new ErrorObjectConstructor(error.code, error.name, fields[0]);
    }
}


function validation_error(err) {
    const errItems = err.errors;

    // Not the error from sequelize
    if (!errItems){
        // stop navigating it to next middlewares
        console.log('Unexpected Error');
        throw err;
    }

    const errObj = ErrorHandler.parseValidationError(errItems[0]);

    return { status: 400, ...errObj };
}

function database_error(err) {
    const errorObj = ErrorHandler.parseDatabaseError(err);
    return { status: 400, ...errorObj };
}

function error_routing(req, res, next) {
    const err = req.error;
    if (err instanceof ErrorObjectConstructor){
        const { statusCode, ...error } = err;
        next({ status: statusCode, ...error });   
        return;
    }
    if (err instanceof sequelize.ValidationError){
        next(validation_error(err));
        return;
    }
    if (err instanceof sequelize.DatabaseError){
        next(database_error(err));
        return;
    }

    // The error has not been handled yet
    next({ err: 'UnhandledError', statusCode: 500 })
}

router.use(error_routing);

module.exports.router         = router;
module.exports.ErrorHandler   = ErrorHandler;