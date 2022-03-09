'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelizeConnector) => {
    return sequelizeConnector.define('profile', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        country: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        economicSector: {
            type: Sequelize.STRING,
            field: 'economic_sector'
        },
        linkedin: {
            type: Sequelize.STRING
        },
        instagram: {
            type: Sequelize.STRING
        },
        website: {
            type: Sequelize.STRING
        },
        github: {
            type: Sequelize.STRING
        },
        telephone: {
            type: Sequelize.JSON
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
            field: "user_id"
        },
        summary: {
            type: Sequelize.TEXT
        },
    },
        {
            schema: 'autorizacion',
            timestamps: false,
            freezeTableName: true
        });
}
