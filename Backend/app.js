const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Car = require('./models/car');

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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/cars', (req, res, next) => {
  const car = new Car({
    brand: req.body.brand,
    model: req.body.model,
    description: req.body.description
  });
  car.save().then(createdCar => {
    res.status(201).json({
      message: "Car added",
      carId: createdCar._id
    });
  });
})

app.get('/api/cars' , (req, res, next) => {
  Car.find()
    .then((documents) => {
      res.status(200).json({
        message: "Posts fetched succesfully",
        cars: documents
      });
    });
});

app.delete('/api/cars/:id', (req, res, next) => {
  Car.deleteOne({_id: req.params.id})
    .then((result) => {
      console.log(result)
      res.status(200).json({
        message: "Post deleted successfully"
      })
    })
})

module.exports = app; // this will export the entire app