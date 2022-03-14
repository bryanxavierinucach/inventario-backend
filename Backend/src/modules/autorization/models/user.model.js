'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelizeConnector) => {
    return sequelizeConnector.define('user', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        role: {
            type: Sequelize.STRING
        },
        user: {
            type: Sequelize.STRING
        },
        nombres: {
            type: Sequelize.STRING
        },
        apellidos: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        creation_time: {
            type: Sequelize.DATE,
            allowNull: true
        },
        modification_time: {
            type: Sequelize.DATE,
            allowNull: true
        },
    },
        {
            schema: 'autorizacion',
            timestamps: false,
            freezeTableName: true
        });
}
