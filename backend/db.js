const mongoose = require("mongoose");
require("dotenv").config();

// Use environment variable for MongoDB URI
const mongoURI = 'mongodb+srv://sasimaddipati65:afd39Uao4BS5LE4u@cluster0.obnki.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

const db = mongoose.connection;

db.on("error", (error) => console.error("MongoDB Connection Error:", error));
db.once("open", () => console.log("Connected to MongoDB"));


module.exports = {
    db
};
