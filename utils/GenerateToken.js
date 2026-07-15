require('dotenv').config()
const jwt=require('jsonwebtoken')

exports.generateToken=(payload,passwordReset=false)=>{
    const exp = passwordReset ? process.env.PASSWORD_RESET_TOKEN_EXPIRATION : process.env.LOGIN_TOKEN_EXPIRATION;
    const options = {};
    if (exp) {
        options.expiresIn = exp;
    } else {
        options.expiresIn = passwordReset ? '1h' : '30d';
    }
    return jwt.sign(payload,process.env.SECRET_KEY,options)
}