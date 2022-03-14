require("dotenv").config({
    path: __dirname + '/./../../../.env'
});
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        /**
         * Ejecutar node generate-jwt-apple.js '{"path":"/path/donde/esta/key/key.txt"}'
         * node generate-jwt-apple.js '{"path":"/Users/edwin/Documents/develop/divergenti/recursos/key.txt"}'
         */
        var args = JSON.parse(process.argv.slice(2));

        const keyPath = path.join(args.path);
        const privateKey = fs.readFileSync(keyPath);
        const header = {
            kid: process.env.APPLE_KEY_ID
        };
        const claims = {
            iss: process.env.APPLE_TEAM_ID,
            iat: Math.floor(Date.now() / 1000),
            aud: 'https://appleid.apple.com',
            sub: process.env.APPLE_CLIENT_ID,
        }
        var token = jwt.sign(claims, privateKey, { algorithm: 'ES256', expiresIn: '60d', header });
        console.log(token);
    } catch (error) {
        console.error(`Failed generate jwt": ${error}`);
        process.exit(1);
    }
}

main();