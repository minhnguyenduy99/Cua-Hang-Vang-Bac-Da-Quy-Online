const jwt = require('jsonwebtoken');
const config = require('../../config');


module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, config.TOKEN_PRIVATE_KEY, (err, decoded) => {
        if (err){
            res.status(401).json({
                message: 'Authorization failed'
            })
        }
        next();
    })
}