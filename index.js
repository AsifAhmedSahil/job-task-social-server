const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { application } = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.quaequt.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
            const postCollection = client.db("endgame").collection("posts");
            const engadgeCollection = client.db("endgame").collection("comments");
            const userCollection = client.db("endgame").collection("users");

            app.post("/posts",async(req,res)=>{
                const post = req.body;
                const result = await postCollection.insertOne(post);
                res.send(result)
            })

            app.get("/posts",async(req,res)=>{
                const query = {};
                const posts = await postCollection.find(query,{"_id":1}).sort({_id:-1}).toArray();
                res.send(posts);
            })

            app.get("/posts/:id",async(req,res) =>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const result = await postCollection.findOne(query);
                res.send(result)
            })

            app.post("/comments",async(req,res) =>{
                const comment = req.body;
                const result = await engadgeCollection.insertOne(comment)
                res.send(result)
            })
            // app.post("/comments",async(req,res) =>{
            //     const comment = req.body;
            //     const result = await postCollection.insertOne(comment)
            //     res.send(result)
            // })
            app.get("/comments",async(req,res) =>{
                const query = {};
                const comments = await engadgeCollection.find(query).toArray();
                res.send(comments);
            })

            app.post("/users",async(req,res)=>{
                const user = req.body;
                const result = await userCollection.insertOne(user);
                res.send(result);
              })

            //   app.get("/users/:id",async(req,res)=>{

            //   })

            app.get("/users",async(req,res)=>{
                const email = req.query.email;
                const query = {email:email}
                const result = await userCollection.find(query).toArray();
                res.send(result)
            })
    }
    finally{

    }
}
run().catch(err => console.log(err));


app.get("/",(req,res)=>{
    res.send("server is running");
})

app.listen(port , () =>{
    console.log("listing on port")
})