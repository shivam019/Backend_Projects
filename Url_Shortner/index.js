const express = require("express");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/url");
const PORT = 8000;
const app = express();
app.use(express.json());
app.use("/url", urlRoutes);
const URL = require("./models/url")

mongoose.connect("mongodb://localhost:27017/short-url").then(()=> {
    console.log("Connected to MongoDB");
})


app.get("/:shortId", async(req,res)=> {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate({
    shortId
  }, 
  {
    $push : {
        visitHistory: {
          timestamp: Date.now(),
        },
    }
  });
  res.redirect(entry.redirectURL)
})
app.listen( PORT, ()=> console.log("connected to the PORT" , PORT))


