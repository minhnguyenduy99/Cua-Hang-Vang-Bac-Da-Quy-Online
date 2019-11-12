const responser = require('../../controllers/baseController');


module.exports = class ResponeSender{
    
    static error(res, resResult){
        return res.status(resResult.statusCode).json({ error: resResult.err });
    }    

    static get(res, resResult){
        if (resResult.data){
            return res.status(resResult.statusCode).json(resResult.data);
        }
        return res.status(resResult.statusCode).json(resResult);
       
    }

    static created(res, resResult){
        if (resResult.err){
            return ResponeSender.error(res, resResult);
        }
        return res.status(resResult.statusCode).json(resResult);
    }

    static delete(res, resResult){
        if (resResult.err){
            return ResponeSender.error(res, resResult);
        }
        return res.status(resResult.statusCode).json({ message: resResult.message });
    }

    static authenticated(res, resResult){
        let statusCode = resResult.statusCode;        
        if (resResult.err){
            statusCode = statusCode || 500;
            return res.status(statusCode).json(resResult);
        }
        statusCode = statusCode || 200;
        return res.status(statusCode).json({ message: resResult.message, data: resResult.data});
    }
}