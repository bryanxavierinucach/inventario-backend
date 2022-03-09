'use strict';
const users = require('../controllers/user.controller.js');
module.exports = function (app) {

    /**
     * @swagger
     * /user/keycloak:
     *   post:
     *     tags: [Usuario]
     *     summary: Crear datos generales usuario en postgresql y keycloak
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UsuarioCreate'
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *                type: object
     *                properties:
     *                  group:
     *                    $ref: '#/components/schemas/Usuario'
     *                  message:
     *                    type: string
     *                    example: Usuario agregado correctamente
     */
    app.post('/user/keycloak', users.saveUser);

     /**
     * @swagger
     * /api/user/social:
     *   post:
     *     tags: [Usuario]
     *     summary: Crear datos generales usuario en postgresql
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UsuarioCreateSocial'
     *     responses:
     *       200:
     *         description: OK.
     */
    app.post('/api/user/social', users.saveUserSocial);


    /**
     * @swagger
     * /api/user/{id}:
     *   put:
     *     tags: [Usuario]
     *     summary: Actualizar datos generales usuario
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: User id
     *         schema:
     *         type: UUID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UsuarioUpdate'
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
     *                    example: Usuario actualizado correctamente
     */
    app.put('/api/user/:id', users.update);
     /**
     * @swagger
     * /api/user/keycloak/{id}:
     *   put:
     *     tags: [Usuario]
     *     summary: Actualizar datos generales usuario
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: User id
     *         schema:
     *         type: UUID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UsuarioUpdateKey'
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
     *                    example: Usuario actualizado correctamente
     */
    app.put('/api/user/keycloak/:id', users.updateUsers);
    /**updateUsers
     * @swagger
     * /api/user:
     *   get:
     *     tags: [Usuario]
     *     summary: Obtener listado usuarios
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Usuario'  
     */
    app.get('/api/user', users.findAll)
    /**
     * @swagger
     * /api/user/{id}:
     *   get:
     *     tags: [Usuario]
     *     summary: Obtener usuario por id
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
     *               $ref: '#/components/schemas/Usuario'  
     */
    app.get('/api/user/:id', users.findById);
    /**
     * @swagger
     * /api/user/find/{id}:
     *   get:
     *     tags: [Usuario]
     *     summary: Obtener usuario por id
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
     *               $ref: '#/components/schemas/Usuario'  
     */
    app.get('/user/find/:id', users.findUserById);

    /**
     * @swagger
     * /api/user/{id}:
     *   delete:
     *     tags: [Usuario]
     *     summary: Eliminar usuario
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
     *                type: object
     *                properties:
     *                  message:
     *                    type: string
     *                    example: Usuario eliminado correctamente
     */
    app.delete('/api/user/:id', users.delete);
    /**
     * @swagger
     * /api/user/profile/{id}:
     *   get:
     *     tags: [Usuario]
     *     summary: Encontrar el  usuario por el profile
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
     *                    example: Profile y usuario
     */
    app.get('/api/user/profile/:id', users.findUserByProfile);



    app.get('/api/user/list', users.findUserKeycloak)
    app.get('/api/user/keycloak/:id', users.findUserKeycloakById)
    //#region  /api/user/role/key/roleName Listar usuarios por rol -keycloak
    /**
     * @swagger
     * /api/user/role/key/{roleName}:
     *   get:
     *     tags:
     *       - Usuario
     *     summary: Listar usuarios por rol - Keycloak
     *     parameters:
     *       - in: path
     *         name: roleName
     *         required: true
     *         description: role name
     *         schema:
     *         type: STRING
     *       - in: query
     *         name: first
     *         required: false
     *         description: first
     *         schema:
     *         type: STRING
     *       - in: query
     *         name: max
     *         required: false
     *         description: max
     *         schema:
     *         type: STRING
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 usuarios:
     *                   type: json
     *                   example: [{ "id": "admin", "keycloak_id": "b5ce3173-455c-455c-b4f4-bf3b543eb4f4", "username": "admin", "userRoleId": null, "group": "|universidades", "create_user": null, "status": true, "creation_time": "2021-02-24T17:01:13.000Z", "modification_time": null }, { "id": "xavier", "keycloak_id": "b5ce3173-355b-455c-b4f4-bf3b543e85c0", "username": "xavierinucaAdmin", "userRoleId": null, "group": "|admin_universidades|utn", "create_user": "Xavier Haro", "status": true, "creation_time": "2021-02-24T17:01:13.000Z", "modification_time": null }]
     *       500:
     *         description: Usuarios por create_user no encontrado
    */
    //#endregion
    app.get('/api/user/role/key/:roleName', users.getUsersByRolOnlyKey)


    /**
     * @swagger
     * /user/emailverifier/{email}:
     *   put:
     *     tags: [Usuario]
     *     summary: Reenviar verificador de email
     *     parameters:
     *       - in: path
     *         name: email
     *         required: true
     *         description: Email
     *         schema:
     *         type: string
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *                type: object
     *                properties:
     *                  message:
     *                    type: JSON
     *                    example: {"emailVerificador": {"size": 0,"timeout": 0},"message":"mensaje reenviado"}
     */
    app.put('/user/emailverifier/:email', users.verifierEmail)

    //#region /user/password/:idUser update contraseña
    /**
     * @swagger
     * /user/password/{idUser}:
     *  put:
     *   tags:
     *     - Usuario
     *   summary: Update Contraseña
     *   description: update contraseña
     *   consumes:
     *    - application/json
     *   produces:
     *    - application/json
     *   parameters:
     *       - in: path
     *         name: idUser
     *         required: true
     *         description: Usuario idUser
     *         schema:
     *         type: UUID
     *   requestBody:
     *    content:
     *     application/x-www-form-urlencoded:
     *      schema:
     *       type: object
     *       properties:
     *         password:
     *           type: STRING
     *           example: 65432edsd
     *         confirmPassword:
     *           type: STRING
     *           example: 65432edsd
     *   responses:
     *    200:
     *     description: Contraseña Actualizada Correctamente
    */
    //#endregion
    app.put('/user/password/:idUser', users.changePassword)

}
