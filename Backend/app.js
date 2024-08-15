const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const carRoutes = require('./routes/cars');

const app = express(); // create an express app

mongoose.connect('mongodb+srv://vasilicacernovschi1234:Shfq0BdGaVjBu23P@cluster0.gwjlyhm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("Backend/images")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/cars', carRoutes);

module.exports = app; // this will export the entire app