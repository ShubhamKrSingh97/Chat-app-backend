const sequelize = require('../utils/database');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userRegistration = async (req, res) => {
    const { name, email, phone, pass } = req.body;
    const transactions = await sequelize.transaction();
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Account with this email already exists. Please login.' });
        }
        bcrypt.hash(pass, 10, async (err, password) => {
            await User.create({
                name: name,
                email: email,
                phone: phone,
                password: password
            }, { transaction: transactions });

            await transactions.commit();
            return res.status(202).json({ message: 'Registration complete' });

        });
    } catch (err) {
        transactions.rollback();
        return res.status(500).json({ message: 'Internal server error' });
    }
}

function generateToken(id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY);
}

const userLogin = async (req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            bcrypt.compare(pass, user.password, (err, result) => {
                if (result) {
                    res.status(202).json({ message: 'Login successful', token: generateToken(user.id), name:user.name });
                }
                else {
                    res.status(401).json({ message: 'Password does not match' });
                }
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email' });
        }
    } catch (err) {
        res.status(500).json({message:'Internal server error'});
    }   
}

module.exports = { userRegistration, userLogin };
