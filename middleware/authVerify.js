const { getMySecret } = require('../utils/util');
const jwt = require('jsonwebtoken');

const authVerify = async (req, res, next) => {
    let tolkien = getMySecret();
    const { authorization } = req.headers;
    if(!authorization){
        res.status(401).json({error: 'Authentication Error'});
    }
    else {
        const userToken = authorization.replace('Bearer ', '');
        jwt.verify(userToken, tolkien, async (err, payload) => {
            if (err) {
                return res.status(401).json({ error: 'Error with parse token'});
            }
            else {
                console.log(payload);
                req.user = payload;
                next();
            }
        });
    }
}

module.exports = authVerify;