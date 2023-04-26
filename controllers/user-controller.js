// const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../model/User');

const getAllUser = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (error) {
        console.log(error);
    }

    if(!users) {
        return res.status(404).json({ message: 'No users found' })
    }
    return res.status(200).json({ users });
};

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    let existinUser;
    try {
        existinUser = await User.findOne({ email });
    } catch (error) {
        console.log(error);
    }
    if (existinUser) {
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

    try {
        user.save();
    } catch (error) {
        console.log(error);
    }
    return res.status(201).json({ user })
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existinUser;

    try {
        existinUser = await User.findOne({ email })
    } catch (error) {
        console.log(error);
    }
    if (!existinUser) {
        return res
        .status(404)
        .json({ message: 'Couldnt find User by this email' })
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existinUser.password)
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Incorrect password' })
    }
    return res
    .status(200)
    .json({ message: 'Login Successfull' });
    
}

module.exports = {
    getAllUser,
    signup,
    login
};