'use strict';
const profiles = require('../controllers/profile.controller');
module.exports = function (app) {

    /**
     * @swagger
     * /profile:
     *   post:
     *     tags: [Profile]
     *     summary: Crear datos generales profile
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ProfileCreate'
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *                type: object
     *                properties:
     *                  group:
     *                    $ref: '#/components/schemas/Profile'
     *                  message:
     *                    type: string
     *                    example: Profile agregada correctamente
     */
    app.post('/profile', profiles.save);
    /**
     * @swagger
     * /api/profile/{id}:
     *   put:
     *     tags: [Profile]
     *     summary: Actualizar datos generales profile
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Profile id
     *         schema:
     *         type: UUID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ProfileUpdate'
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *                type: object
     *                properties:
     *                  message:
     *                    type: string
     *                    example: Profile actualizado correctamente
     */

    app.put('/api/profile/:id', profiles.update);
    /**
     * @swagger
     * /api/profile/user/pyme/{id}:
     *   put:
     *     tags: [Profile]
     *     summary: Actualizar datos profile and user avatar
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Profile id
     *         schema:
     *         type: UUID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ProfileUpdate'
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *                type: object
     *                properties:
     *                  message:
     *                    type: string
     *                    example: Profile actualizado correctamente
     */
    app.put('/api/profile/user/pyme/:id', profiles.updateProfileAndUser);
    /**
     * @swagger
     * /api/profile:
     *   get:
     *     tags: [Profile]
     *     summary: Obtener listado profiles
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Profile'
     */
    app.get('/api/profile', profiles.findAll)


    /**
     * @swagger
     * /api/profile/{id}:
     *   get:
     *     tags: [Profile]
     *     summary: Obtener profile por id
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Profile id
     *         schema:
     *         type: UUID
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Profile'
     */
    app.get('/api/profile/:id', profiles.findById);

    /**
     * @swagger
     * /api/profile/{id}:
     *   delete:
     *     tags: [Profile]
     *     summary: Eliminar profile
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Profile id
     *         schema:
     *         type: UUID
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *                type: object
     *                properties:
     *                  message:
     *                    type: string
     *                    example: Profile eliminado correctamente
     */
    app.delete('/api/profile/:id', profiles.delete);

    /**
     * @swagger
     * /api/profile/user/{id}:
     *   get:
     *     tags: [Profile]
     *     summary: Obtener profile y usuario por id relacional
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: User id
     *         schema:
     *         type: UUID
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProfileUser'  
     */
    app.get('/api/profile/user/:id', profiles.findProfileByIdUser)
    /**
     * @swagger
     * /api/profile/user/{id}:
     *   get:
     *     tags: [Profile]
     *     summary: Obtener profile y usuario por id relacional
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: User id
     *         schema:
     *         type: UUID
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProfileUser'
     */
    app.get('/api/profile/user/:id', profiles.findProfileByIdUser)
}