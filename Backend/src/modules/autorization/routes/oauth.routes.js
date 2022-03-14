'use strict';
const oauth = require('../controllers/oauth.controller.js');
module.exports = function (app) {

    /**
     * @swagger
     * /auth/social:
     *   post:
     *     tags: [Auth]
     *     summary: Autenticación
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SocialFlow'
     */
    app.post('/auth/social', oauth.authorizationCode);

    /**
     * @swagger
     * /auth/logout:
     *   post:
     *     tags: [Auth]
     *     summary: Logout
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Logout'
     */
         app.post('/auth/logout', oauth.logout);
}