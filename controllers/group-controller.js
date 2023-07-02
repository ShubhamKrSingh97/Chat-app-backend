const Group = require('../models/group.model');
const User = require('../models/user.model');
const sequelize = require('../utils/database');
const UserGroup = require('../models/userGroup.model');
const { Op } = require('sequelize');
const makeGroup = async (req, res) => {
    const transactions = await sequelize.transaction();
    try {
        const [users, group] = await Promise.all([
            User.findAll({
                where: {
                    id: {
                        [Op.not]: req.user.id
                    }
                }
            }),
            Group.create({
                groupName: req.body.groupName
            },{transactions})
        ]);

        await group.addUsers(req.user, { through: { isAdmin: true } },{transactions});
        await transactions.commit();
        res.status(202).json({ groupId: group.id, users: users });
    } catch (err) {
        await transactions.rollback();
        res.status(402).json({ message: 'Something went wrong' });
    }
};


const addMember = async (req, res) => {
    try {
        const [user, group] = await Promise.all([
            User.findByPk(req.body.userId),
            Group.findByPk(req.body.groupId)
        ]);

        await group.addUsers(user);
        res.status(202).json({ message: "Successfully added" });
    } catch (err) {
        res.status(402).json({ message: "Something went wrong" });
    }
};


const getAllGroups = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { include: Group });
        const groups = user.groups;
        res.status(202).json({ groups: groups });
    } catch (err) {
        res.status(402).json({ message: "Something went wrong" });
    }
}

const getAllMembers = async (req, res) => {
    try {
        const groupId = req.query.groupId;
        const group = await Group.findByPk(groupId);
        const members = await group.getUsers({
            attributes: ['id', 'name']
        });

        res.status(200).json({ members: members });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const makeAdmin = async (req, res) => {
    try {
        let { id, groupId } = req.body
        const superAdminCheck = await UserGroup.findOne({ where: { userId: req.user.id, groupId: groupId } });
        if (!superAdminCheck.isAdmin) {
            return res.status(400).json({ message: 'You are not authorized' });
        }
        const adminCheck = await UserGroup.findOne({ where: { userId: id, groupId: groupId } });
        if (adminCheck.isAdmin) {
            return res.status(400).json({ message: 'User is already admin' });
        }
        await UserGroup.update({ isAdmin: true },
            {
                where: {
                    userId: id,
                    groupId: groupId
                }
            });
        res.status(202).json({ message: 'User is now an admin' });
    } catch (err) {
        res.status(402).json({ message: 'Something went wrong' });
    }
}

const removeMember = async (req, res) => {
    try {
        const id = req.query.id;
        const groupId = req.query.groupId;
        const superAdminCheck = await UserGroup.findOne({ where: { userId: req.user.id, groupId: groupId } });
        if (!superAdminCheck.isAdmin) {
            return res.status(404).json({ message: 'You are not authorized' });
        }
        await UserGroup.destroy({ where: { UserId: id, groupId: groupId } });
        return res.status(202).json({ message: 'User removed' });
    } catch (err) {
        res.status(402).json({ message: 'Something went wrong' });
    }
}

module.exports = { makeGroup, addMember, getAllGroups, getAllMembers, makeAdmin, removeMember };