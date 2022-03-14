'use strict';
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const errorsGen = require('../../../utils/errors/general.error');

module.exports = class OauthService {


    /**
     * Autenticación con authorization_code
     * @param {*} req 
     * @param {*} res 
     */
    async authorizationCode(req, res) {
        try {
            const { code, sessionState, redirectUri } = req.body;
            const body = new URLSearchParams();
            body.append('grant_type', 'authorization_code');
            body.append('client_id', process.env.KEYCLOAK_CLIENT_ID_SOCIAL);
            body.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET_SOCIAL);
            body.append('code', code);
            body.append('session_state', sessionState);
            body.append('redirect_uri', redirectUri);
            const resToken = await fetch(process.env.TOKEN, {
                method: 'POST',
                body: body,
            });
            res.status(resToken.status).send(await resToken.json());
        } catch (error) {
            console.log(error);
            res.status(500).send(errorsGen.gen_internal);
        }
    }


    async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            const token = req.headers.authorization.replace('Bearer', '').trim();
            const tokenDecode = jwt.decode(token);
            if (tokenDecode) {
                const body = new URLSearchParams();
                body.append('client_id', tokenDecode['azp']);
                body.append('refresh_token', refreshToken);
                if (tokenDecode['azp'] === process.env.KEYCLOAK_CLIENT_ID_SOCIAL) {
                    body.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET_SOCIAL);
                }
                const resToken = await fetch(process.env.LOGOUT, {
                    method: 'POST',
                    headers: {
                        'Authorization': req.headers.authorization
                    },
                    body: body,
                });
                res.status(resToken.status).send();
            } else {
                res.status(400).send(errorsGen.gen_bad_request);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(errorsGen.gen_internal);
        }
    }
}
