// 'gh G  H ""'
// http://localhost:3000/api/user
const express = require('express');
const mongoose = require('mongoose');
const blogRouter = require('./routes/blog-routes');
const app = express();
const router = require('./routes/user-routes');
PORT = 3000;

app.use(express.json());
app.use("/api/user", router);
app.use('/api/blog', blogRouter)

mongoose.connect("mongodb+srv://mateus-montagnini:1407Mateus@cluster0.9vbngz3.mongodb.net/Blog?retryWrites=true&w=majority")
    .then(() => app.listen(PORT))
    .then(() => console.log(`listenin on port: ${PORT}`))
    .catch((err) => console.log(err))

app.use("/", (req, res, next) => {
    res.send("Hello World")
});

