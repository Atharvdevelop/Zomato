const Sequelize = require("sequelize");
const db = new Sequelize('zomato_db', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = db;



