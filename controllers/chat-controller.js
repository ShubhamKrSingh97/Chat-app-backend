const Message = require('../models/message.model');
const sequelize = require('../utils/database');
const User=require('../models/user.model');
const {Op}=require('sequelize');
const addMessage = async (req, res) => {
    try {
        const msg = await Message.create({
            message: req.body.message,
            userId: req.user.id,
            groupId:req.body.groupId
        });
        res.status(202).json({ name: req.user.name, message: msg.message });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }

};

const getAllChats = async (req, res) => {
    try {
        const index=parseInt(req.query.msgid);
        const groupId= parseInt(req.query.groupid);
        const allmsg = await Message.findAll({
            include:[{
                model: User,
                attributes:['name'],
            }],
            where:{id:{[Op.gt]:index},groupId:groupId}
        });
        res.status(202).json({ msg: allmsg })
    } catch (err) {
        console.log(err);
        res.status(402).json({ message: 'Something went wrong' })
    }
};
module.exports = { addMessage, getAllChats };