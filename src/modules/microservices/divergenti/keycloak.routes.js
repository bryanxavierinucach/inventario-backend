'use strict';
const keycloak = require('./keycloak.controller');
module.exports = function (app) {
    /**
     * @swagger
     * /api/keycloak/group/talent:
     *   get:
     *     tags: [Keycloak]
     *     summary: Obtener listado de talentos
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Keycloak'
     */
    app.get('/keycloak/group/talent', keycloak.findAllGroup);
    /**
     * @swagger
     * /api/keycloak/group/talent:
     *   get:
     *     tags: [Keycloak]
     *     summary: Obtener listado de talentos
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Keycloak'
     */
    app.get('/keycloak/group/pyme', keycloak.findAllEconomicSector);
    /**
     * @swagger
     * /api/keycloak/group/talent/{id}:
     *   get:
     *     tags: [Keycloak]
     *     summary: Obtener talento por id
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Talento id
     *         schema:
     *         type: UUID
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Keycloak'
     */
    app.get('/api/keycloak/group/talent/:id', keycloak.findByTalent);
    /**
     * @swagger
     * /api/keycloak/named/named/{name}:
     *   get:
     *     tags: [Keycloak]
     *     summary: Obtener talento por name
     *     parameters:
     *       - in: path
     *         name: name
     *         required: true
     *         description: Talento name
     *         schema:
     *         type: STRING
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Keycloak'
     */
    app.get('/api/keycloak/group/named/:name', keycloak.findByTalentName);

}
