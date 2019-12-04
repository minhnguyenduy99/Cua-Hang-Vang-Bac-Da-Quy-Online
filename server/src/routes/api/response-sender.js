const responser     = require('../../controllers/baseController');
const CODE          = require('../../config/serverConfig').SERVER_RESPONE_CODE;

module.exports = class ResponeSender{
    
    static send(res, { statusCode, data, options }){
        if (!options)
            return res.status(statusCode).json(data);
        return res.status(statusCode).json({ data: data, ...options });
    }

    static error(res, resResult){
        let statusCode = 500;
        let result = resResult;
        switch(resResult.code){
            case CODE.AUTHENTICATED_FAILED: 
                statusCode = 401;
                result = {valid: false, ...resResult};
                break;
            case CODE.UNAUTHORIZED:
            case CODE.CREATE_FAILED:
            case CODE.DELETED_FAILED:
            case CODE.RESTORE_FAILED:
                statusCode = 400;
        }
        return res.status(statusCode).json(result);
    }    

    static get(res, resResult){
        return res.status(200).json(resResult.data);
    }

    static created(res, resResult){
        return res.status(201).json(resResult);
    }

    static deleted(res, resResult){
        let statusCode = 204;
        if (resResult.data){
            statusCode = 202;
        }
        return res.status(statusCode).json(resResult);
    }

    static authenticated(res, resResult){
        const result = {valid: true, ...resResult};
        return res.status(200).json(result);
    }

    static authorized(res, resResult){
        return res.status(200).json(resResult);
    }

    static custom(res, resResult){
        const {statusCode, ...rest} = resResult;
        return res.status(statusCode).json(rest);
    }
}