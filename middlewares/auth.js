const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;

let isUser = (req,res,next) => {
    console.log(req.session)
    const token = req.session.token;
    if(!token) {
        return res.redirect('./login');
    }
    jwt.verify(token, secret, function(err, decoded) {
        if(err) {
            return res.redirect('./login');
        }
        if(decoded.role == 'client') {            
            next();
        }
    });

}

let isAdmin = (req,res, next) => {
    const token = req.session.token;
    if(!token) {
        return res.redirect('./login');
    }
    
    jwt.verify(token, secret, function(err, decoded) {
        if(err) {
            console.log(err)
            return res.redirect('./login');
        }
        if(decoded) {
            if(decoded.role === 'admin') {
                return next();
            }

            return res.redirect('./login');
        }
    });
}

module.exports = {isUser, isAdmin};