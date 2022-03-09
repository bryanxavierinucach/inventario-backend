'use strict';
const OAuthService = require('../services/oauth.services.js');
const oauthService = new OAuthService();

const fetch = require('node-fetch');

/**
 * Autenticación flow code
 * @param {*} req 
 * @param {*} res 
 */
exports.authorizationCode = (req, res) => {
    return oauthService.authorizationCode(req, res);
}

/**
 * Logout
 * @param {*} req 
 * @param {*} res 
 */
 exports.logout = (req, res) => {
    return oauthService.logout(req, res);
}