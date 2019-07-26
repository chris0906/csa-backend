const jwt = require("jsonwebtoken");
const config = require('../config.json');

module.exports = function authUser(req, res, next) {
    let token = req.header('Authorization');
    if(!token) res.status(401).send('Unauthenticated User');
    token = token.substring(4,token.length);//get token string
    try{
        const encoded = await jwt.verify(token,config.key);
        req.user = encoded;
        next();
    }catch(err){
        return res.status(401).send("Unauthenticated User");
    }
};
