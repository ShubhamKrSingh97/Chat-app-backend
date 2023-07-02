const Sequelize=require('sequelize');
const sequelize=require('../utils/database');

const UserToGroup=sequelize.define('userGroups',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true
    },
    isAdmin:{
        type:Sequelize.BOOLEAN
    }
});

module.exports=UserToGroup;