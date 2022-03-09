'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelizeConnector) => {
    return sequelizeConnector.define('empleado', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        cedula: {
            type: Sequelize.STRING
        },
        nombres: {
            type: Sequelize.STRING
        },
        apellidos: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        fechaNacimiento: {
            type: Sequelize.DATE
        },
        domicilio: {
            type: Sequelize.TEXT,
        },
        telefono: {
            type: Sequelize.STRING
        },
        estadoVacunacion: {
            type: Sequelize.BOOLEAN
        },
        tipoVacuna: {
            type: Sequelize.STRING
        },
        fechaVacunacion: {
            type: Sequelize.DATE
        },
        nroDocis: {
            type: Sequelize.INTEGER
        },
    },
        {
            schema: 'autorizacion',
            timestamps: false,
            freezeTableName: true
        });
}
