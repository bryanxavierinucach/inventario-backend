'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelizeConnector) => {
    return sequelizeConnector.define('profile_category', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        profileId: {
            type: Sequelize.UUID,
            field: 'profile_id',
            allowNull: false,
        },
        categoryId: {
            type: Sequelize.UUID,
            field: 'category_id',
            allowNull: false,
        },
    },
        {
            schema: 'autorizacion',
            timestamps: false,
            freezeTableName: true
        });
}
