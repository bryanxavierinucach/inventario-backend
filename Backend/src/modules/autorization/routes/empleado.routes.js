'use strict';
const empleado = require('../controllers/empleado.controller');
module.exports = function (app) {

    /**
     * @swagger
     * /api/empleado:
     *   post:
     *     tags: [Empleado]
     *     summary: Crear datos generales empleado
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/EmpleadoCreate'
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *                type: object
     *                properties:
     *                  group:
     *                    $ref: '#/components/schemas/Empleado'
     *                  message:
     *                    type: string
     *                    example: Empleado agregado correctamente
     */
    app.post('/api/empleado', empleado.save);

    /**
     * @swagger
     * /api/empleado/{id}:
     *   put:
     *     tags: [Empleado]
     *     summary: Actualizar datos generales empleado
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Empleado id
     *         schema:
     *         type: UUID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/EmpleadoUpdate'
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
     *                    example: Empleado actualizado correctamente
     */

    app.put('/api/empleado/:id', empleado.update);
    /**
     * @swagger
     * /api/empleado/list:
     *   get:
     *     tags: [Empleado]
     *     summary: Obtener listado empleado
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Empleado'
     */
    app.get('/api/empleado/list', empleado.findAllempleadot)
    /**
     * @swagger
     * /api/empleado:
     *   get:
     *     tags: [Empleado]
     *     summary: Obtener listado Empleado
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Empleado'
     */
    app.get('/api/empleado', empleado.findAll)

    /**
     * @swagger
     * /api/empleado/{id}:
     *   get:
     *     tags: [Empleado]
     *     summary: Obtener Empleado por id
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Empleado id
     *         schema:
     *         type: UUID
     *     responses:
     *       200:
     *         description: OK.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Empleado'
     */
    app.get('/api/empleado/:id', empleado.findById);

    /**
     * @swagger
     * /api/empleado/{id}:
     *   delete:
     *     tags: [Empleado]
     *     summary: Eliminar Empleado
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Empleado id
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
     *                    example: Empleado eliminado correctamente
     */
    app.delete('/api/empleado/:id', empleado.delete);

    /**
     * @swagger
     * /api/empleado/user/{id}:
     *   get:
     *     tags: [Empleado]
     *     summary: Obtener empleado y usuario por id relacional
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
     *               $ref: '#/components/schemas/EmpleadoUser'  
     */
     app.get('/api/empleado/user/:id', empleado.findEmpleadoByIdUser)
}