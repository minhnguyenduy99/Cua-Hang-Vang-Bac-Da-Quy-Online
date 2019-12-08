const CODE    =   require('../config/serverConfig').SERVER_RESPONE_CODE;

module.exports = class BaseController{
    
    static created(result){
        let { data, options } = result;
        
        data                   = data || null;
        const statusCode       = 201;

        return {statusCode, data, options};
    }

    static deleted(options){
        let {data} = options;

        data                   = data || undefined;
        const statusCode       = data ? 200 : 204;

        return {statusCode, data};
    }

    static get(options){
        let { data } = options;
        
        data                = data || null;
        const statusCode    = 200;

        return { statusCode, data };
    }

    static updated(options){
        let { data, ...others } = options;
        
        data                = data || undefined;
        const statusCode    = 200;

        return { statusCode, data, ...others };
    }
}