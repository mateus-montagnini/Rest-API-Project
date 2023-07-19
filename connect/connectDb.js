const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Database connected: ',
        connect.connection.host,
        connect.connection.name);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDb;