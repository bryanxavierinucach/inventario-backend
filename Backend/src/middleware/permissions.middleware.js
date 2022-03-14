const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const keyPath = path.join(__dirname, '../public/public.key');
const publicKey = fs.readFileSync(keyPath);
const errorsGen = require('./../utils/errors/general.error');

module.exports = (expectedScopes) => {
    return function (req, res, next) {
        try {
            const authHeader = req.header('Authorization');
            if (!authHeader) return res.status(401).send(errorsGen.gen_no_auth);
            const token = authHeader.replace('Bearer', '').trim();
            if (!token) return res.status(401).send(errorsGen.gen_no_auth);
            // Verificar que token con llave publica
            jwt.verify(token, publicKey, {
                algorithm: 'RS256'
            });

            const tokenDecode = jwt.decode(token);
            const scopes = tokenDecode['scope'];
            if (!scopes)
                return res.status(401).send(errorsGen.gen_no_permission);
            const userScopes = scopes.split(' ');
            if (userScopes.length == 0)
                return res.status(401).send(errorsGen.gen_no_permission);
            let allowed = false;
            for (let i = 0; i < expectedScopes.length; i++) {
                const scope = expectedScopes[i];
                allowed = userScopes.includes(scope);
                if(allowed) break;
            }
            if (allowed)
                next();
            else {
                return res.status(401).send(errorsGen.gen_no_permission);
            }
        } catch (error) {
            return res.status(401).send(errorsGen.gen_no_auth);
        }
    }
};