const { ValidateSignature, ValidateAdmin } = require('../../utils');

module.exports.UserAuth = async (req,res,next) => {
    
    const isAuthorized = await ValidateSignature(req);

    if(isAuthorized){
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}

module.exports.AdminAuth = async (req,res,next) => {
    
    const isAuthorized = await ValidateAdmin(req);

    if(isAuthorized){
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}