var Express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");
require('dotenv').config();

var app = Express();
app.use(cors());

const uname = process.env.UNAME;
const password = process.env.PASSWORD;
const port = process.env.PORT;

// Give the driver connection of NodeJS of mongoDB
var CONNECTION_STRING=`mongodb+srv://${uname}:${password}@mongodbgrahql.xrkxwro.mongodb.net/?retryWrites=true&w=majority`;

var DATABASENAME = "todoappdb";
var database;

app.listen(port, ()=>{
    Mongoclient.connect(CONNECTION_STRING, (error, client) => {
        database = client.db(DATABASENAME);
        console.log("MongoDB connection is successful");
    })
})

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

app.get("/api/todoapp/GetNotes", (req, res) => {
    database.collection("todoappcollection").find({}).toArray((error, result) => {
        res.send(result);
    })
})

app.post("/api/todoapp/AddNotes", multer().none(), (req, res) => {
    database.collection("todoappcollection").count({}, (error, numOfDocs) => {
        database.collection("todoappcollection").insertOne({
            id: generateUUID(),
            description: req.body.newNotes
        });
        res.json("Added successfully");
    })
})

app.delete("/api/todoapp/DeleteNotes", (req, res) => {
    database.collection("todoappcollection").deleteOne({
        id: req.query.id
    });
    res.json("Deleted Successfully");
})