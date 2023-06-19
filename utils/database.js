const Sequelize = require('sequelize');
const sequelize = new Sequelize('chat_app','root','homomomo',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports=sequelize;