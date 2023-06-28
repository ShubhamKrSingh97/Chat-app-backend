const Message = require('../models/message.model');
const User=require('../models/user.model');
const {Op}=require('sequelize');
const addMessage = async (req, res) => {
    try {
        const msg = await Message.create({
            message: req.body.message,
            userId: req.user.id
        });
        res.status(202).json({ name: req.user.name, message: msg.message });
    } catch (err) {
        res.status(500).json({ message: 'something went wrong' });
    }

};

const getAllChats = async (req, res) => {
    try {
        const index=parseInt(req.query.msgid);
        const allmsg = await Message.findAll({
            include:[{
                model: User,
                attributes:['name'],
            }],
            where:{id:{[Op.gt]:index}}
        });
        console.log(allmsg);
        res.status(202).json({ msg: allmsg })
    } catch (err) {
        console.log(err);
        res.status(402).json({ message: 'Something went wrong' })
    }
};
module.exports = { addMessage, getAllChats };