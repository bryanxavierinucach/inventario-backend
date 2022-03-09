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
db.profile = require('./profile.model.js')(sequelizeConnector, Sequelize);
db.profileCategory = require('./profile-category.model.js')(sequelizeConnector, Sequelize);


/***************************Relaciones*********************************/

//Relación entre profile y user
db.user.hasOne(db.profile);
db.profile.belongsTo(db.user, { foreignKey: 'userId' });


db.profile.hasMany(db.profileCategory, { as: 'profileCategory' });

db.profileCategory.belongsTo(db.profile, { foreignKey: 'profileId'});



module.exports = db;
 
// db.sequelize.sync();