var Express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

var app = Express();
app.use(cors());

// Give the driver connection of NodeJS of mongoDB
var CONNECTION_STRING="mongodb+srv://pdaw:pdaw@mongodbgrahql.xrkxwro.mongodb.net/?retryWrites=true&w=majority";

var DATABASENAME = "todoappdb";
var database;

app.listen(5038, ()=>{
    Mongoclient.connect(CONNECTION_STRING, (error, client) => {
        database = client.db(DATABASENAME);
        console.log("MongoDB connection is successful");
    })
})

app.get("/api/todoapp/GetNodes", (req, res) => {
    database.collection("todoappcollection").find({}).toArray((error, result) => {
        res.send(result);
    })
})

app.post("/api/todoapp/AddNodes", multer().none(), (req, res) => {
    database.collection("todoappcollection").count({}, (error, numOfDocs) => {
        database.collection("todoappcollection").insertOne({
            id: (numOfDocs+1).toString(),
            description: request.body.newNotes
        });
        res.json("Added successfully");
    })
})

app.delete("/api/todoapp/DeleteNotes", (req, res) => {
    database.collection("todoappcollection").deleteOne({
        id: request.query.id
    });
    res.json("Deleted Successfully");
})