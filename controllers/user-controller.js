// const express = require('express');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../model/User');

const getAllUser = asyncHandler(async (req, res) => {
    const users = await User.find();

    if(!users) {
        res.status(404)
        throw new Error('No Users Found')
    }

    res.status(200).json(users)
});

const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res
        .status(400)
        .json({ message: `User already exists!` })
    }

    const hashedPassword = bcrypt.hashSync(password);

    const user = new User ({
        name,
        email,
        password: hashedPassword,
        blogs: [],
    });

        user.save();

    return res.status(201).json(user)
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const existinUser = await User.findOne({ email })

    if (!existinUser) {
        return res
        .status(404)
        .json({ message: 'Login Error' })
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existinUser.password)
    
    if (!isPasswordCorrect || !existinUser) {
        return res.status(400).json({ message: 'Login error' })
    }
    return res
    .status(200)
    .json({ message: 'Login Successfull' });
    
});

module.exports = {
    getAllUser,
    signup,
    login
};