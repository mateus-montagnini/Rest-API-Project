const Blog = require('../model/Blog');
const User = require('../model/User');
const asyncHandler = require('express-async-handler');
const { default: mongoose } = require('mongoose');

const getAllBlogs = asyncHandler(async (req, res) => {
   const blogs = await Blog.find();
    if (!blogs) {
        return res.status(404).json({ message: 'No Blogs Found' })
    }
    return res.status(200).json(blogs)
});

const addBlog = asyncHandler(async (req, res) => {
    const { title, description, image, user } = req.body;

    const existingUser = await User.findById(user)

    if(!existingUser) {
        res.status(400)
        throw new Error('Unable to find user by this id')
    }

    if(!title || !description || !image || !user) {
        res.status(400);
        throw new Error('All fields are mandatory')
    }

    const newBlog = await Blog.create({
        title,
        description,
        image,
        user,
    });

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({ session });
        existingUser.blogs.push(newBlog)
        await existingUser.save({ session });
        await session.commitTransaction();
    } catch (error) {
        console.log(error);
    }
    
    return res.status(201).json(newBlog)
});

const updateBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
        res.status(404);
        throw new Error('Blog not Found')
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.status(200).json(updatedBlog)
});

const getById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if(!blog) {
        res.status(404);
        throw new Error('Blog not Found')
    }
    res.status(200).json(blog)
});

const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if(!blog) {
        res.status(404);
        throw new Error('Blog not Found')
    }

    await Blog.findByIdAndDelete(blog);
    res.status(200).json(blog)
});

const getByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate('blogs');
    } catch (error) {
        return console.log(error);
    }
    if(!userBlogs) {
        return res.status(404).json({ message: 'No Blog Found' })
    }
    return res.status(200).json({ blogs: userBlogs })
});

module.exports = {
    getAllBlogs,
    addBlog,
    updateBlog,
    getById,
    deleteBlog,
    getByUserId
}