// 'gh G  H ""' git push
const express = require('express');
const app = express();
const connectDb = require('./connect/connectDb');
require('dotenv').config();
const blogRouter = require('./routes/blog-routes');
const userRouter = require('./routes/user-routes');

app.use(express.json());
connectDb();
app.use('/api/user', userRouter);
app.use('/api/blog', blogRouter);


app.listen(process.env.PORT, () => console.log(`Listening on port: ${process.env.PORT}`))

