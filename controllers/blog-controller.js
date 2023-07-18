const Blog = require('../model/Blog');
const User = require('../model/User');
const asyncHandler = require('express-async-handler');

const getAllBlogs = asyncHandler(async (req, res) => {
   const blogs = await Blog.find();
    if (!blogs) {
        return res.status(404).json({ message: 'No Blogs Found' })
    }
    return res.status(200).json(blogs)
});

const addBlog = asyncHandler(async (req, res) => {
    const { title, description, image, user } = req.body;

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
    const id = req.params.id;
    const blog = await Blog.findById(id);

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

// const getByUserId = asyncHandler(async (req, res, next) => {
//     const userId = req.params.id;
//     let userBlogs;
//     try {
//         userBlogs = await User.findById(userId).populate('blogs');
//     } catch (error) {
//         return console.log(error);
//     }
//     if(!userBlogs) {
//         return res.status(404).json({ message: 'No Blog Found' })
//     }
//     return res.status(200).json({ blogs: userBlogs })
// });

module.exports = {
    getAllBlogs,
    addBlog,
    updateBlog,
    getById,
    deleteBlog,
}