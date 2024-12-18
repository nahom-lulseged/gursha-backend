const mongoose = require("mongoose");

const connectDB = () => {
    return mongoose.connect(process.env.MONGODB_URI)
    .then(function() {
        console.log("DB Connected");
    })
    .catch(function(error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });
}

module.exports = connectDB;