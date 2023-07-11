const express = require('express');
const cors = require('cors');
const {ObjectId,MongoClient} = require('mongodb')
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI)
const app = express();
const db = client.db('albiton')
const todos = db.collection('toDoList');
app.use(express.json(), cors())


app.get("/items", async (req,res) => {
    const response = await todos.find({}).toArray();
    res.status(200).send(response)
})

app.post("/items", async (req,res) => {
  const item = req.body;
  if (item.name && item.status) {
    const response = await todos.insertOne(item);
    item["_id"] = response.insertedId;
    res.status(200).send(item);
  }
})


app.put("/items/:itemId", async (req,res) => {
  const itemId = req.params.itemId;
  const {status} = req.body;
  console.log("Item_id:", itemId)
  console.log("Status:", status)
  if(status){
      const result = await todos.updateOne({_id: new ObjectId(itemId)}, {
          $set: {
              status
          }
      })
      res.status(200).send(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
  } 
})

app.delete("/items/:itemId", async (req,res) => {
  const itemId = req.params.itemId;
  const result = await todos.deleteOne({_id: new ObjectId(itemId)})
  const response = await todos.find({}).toArray();
  res.status(200).send("response")
})

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
  }
}
run().catch(console.dir);

app.listen(8000, () => {
    console.log("Server is started")
})