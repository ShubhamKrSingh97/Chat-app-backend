const Group = require('../models/group.model');
const User = require('../models/user.model');
const UserToGroup = require('../models/userGroup.model');
const makeGroup = async (req, res) => {
    try {
        const users = await User.findAll();
        const group = await Group.create({
            groupName: req.body.groupName
        });
        res.status(202).json({ groupId: group.id, users: users });
    } catch (err) {
        res.status(402).json({ message: 'Something went wrong' });
    }

};

const addMember = async (req, res) => {
    try {
        const user = await User.findByPk(req.body.userId);
        const group = await Group.findByPk(req.body.groupId);
        await group.addUsers(user);
        res.status(202).json({ message: "Successfully added" });
    } catch (err) {
        res.status(402).json({ message: "Something went wrong" })
    }
}

module.exports = { makeGroup, addMember };