const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const keyPath = path.join(__dirname, '../public/public.key');
const publicKey=fs.readFileSync(keyPath);
const errorsGen = require('./../utils/errors/general.error');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).send(errorsGen.gen_no_auth);

    const token = authHeader.replace('Bearer', '').trim();
    if (!token) return res.status(401).send(errorsGen.gen_no_auth);
    try {
        jwt.verify(token, publicKey, {
            algorithm: 'RS256'
        });
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send(errorsGen.gen_no_auth);
    }
};
