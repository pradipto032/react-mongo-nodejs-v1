var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");
require('dotenv').config();

var app = express();
app.use(cors());

const uname = process.env.UNAME;
const password = process.env.PASSWORD;
const port = process.env.PORT;

var CONNECTION_STRING = `mongodb+srv://${uname}:${password}@mongodbgrahql.xrkxwro.mongodb.net/?retryWrites=true&w=majority`;
var DATABASE_NAME = "todoappdb";
var database;

// Connect to MongoDB before starting the server
MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        console.error('Error connecting to MongoDB:', error);
        return;
    }

    database = client.db(DATABASE_NAME);
    console.log("MongoDB connection is successful");

    // Start the Express server after MongoDB connection is established
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

app.get("/api/todoapp/GetNotes", (req, res) => {
    if (!database) {
        res.status(500).send("Database not connected yet");
        return;
    }

    database.collection("todoappcollection").find({}).toArray((error, result) => {
        res.send(result);
    });
});

app.post("/api/todoapp/AddNotes", multer().none(), (req, res) => {
    if (!database) {
        res.status(500).json("Database not connected yet");
        return;
    }

    database.collection("todoappcollection").countDocuments({}, (error, numOfDocs) => {
        database.collection("todoappcollection").insertOne({
            id: generateUUID(),
            description: req.body.newNotes
        });
        res.json("Added successfully");
    });
});

app.delete("/api/todoapp/DeleteNotes", (req, res) => {
    if (!database) {
        res.status(500).json("Database not connected yet");
        return;
    }

    database.collection("todoappcollection").deleteOne({
        id: req.query.id
    });
    res.json("Deleted Successfully");
});
