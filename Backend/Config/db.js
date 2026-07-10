const Sequelize = require("sequelize");
const db = new Sequelize('railway', 'root', 'eBEAbcAyLZCpyvaPLEsejrbLMJTZnAvo', {
    host: 'hayabusa.proxy.rlwy.net',
    port: 32404,
    dialect: 'mysql',
});

module.exports = db;



