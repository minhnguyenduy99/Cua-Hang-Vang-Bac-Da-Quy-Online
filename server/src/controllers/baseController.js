
module.exports = class BaseController{
    
    static getCreatedRespone(options){
        let {statusCode, err, data, message} = options;

        statusCode = statusCode         ?   statusCode : 201;
        err        = err                ?   err        : null;
        data       = data               ?   data       : null;
        message    = message            ?   message    : null;

        return {statusCode, message, err, data};
    }

    static getDeleteRespone(options = {}){
        let {statusCode, err, data, message} = options;

        statusCode = statusCode         ?   statusCode : 200;
        err        = err                ?   err        : null;
        data       = data               ?   data       : null;
        message    = message            ?   message    : null;

        return {statusCode, message, err, data};
    }

    static getRetrieveRespone(options){
        let {statusCode, err, data, message} = options;

        statusCode = statusCode         ?   statusCode : 200;
        err        = err                ?   err        : null;
        data       = data               ?   data       : null;
        message    = message            ?   message    : null;

        return {statusCode, message, err, data};
    }

    static getErrorRespone(options){
        let {statusCode, err, data, message} = options;

        statusCode = statusCode         ?   statusCode : 500;
        err        = err                ?   err        : new Error('Internal server error');
        data       = data               ?   data       : null;
        message    = message            ?   message    : null;

        return {statusCode, message, err, data};
    }

    static sendErrorRespone(res, resResult){
        return res.status(resResult.statusCode).json(resResult.err);
    }
}