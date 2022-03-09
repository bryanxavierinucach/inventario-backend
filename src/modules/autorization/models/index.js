'use strict';
const Sequelize = require("sequelize");
const db = {};
const dbConfig = require("../../../database/db.config");

const sequelizeConnector = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
db.Sequelize = Sequelize;
db.sequelize = sequelizeConnector;

db.user = require('./user.model.js')(sequelizeConnector, Sequelize);
db.empleado = require('./empleado.model.js')(sequelizeConnector, Sequelize);


/***************************Relaciones*********************************/



module.exports = db;
 
//db.sequelize.sync();