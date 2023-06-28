const Sequelize=require('sequelize');
const sequelize=require('../utils/database');
const Group=sequelize.define('groups',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true
    },
    groupName:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=Group;