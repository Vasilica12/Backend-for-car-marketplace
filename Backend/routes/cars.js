const express = require("express");
const Car = require('../models/car');

const router = express.Router();

router.post('', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
  const car = new Car({
    _id: req.body.id,
    brand: req.body.brand,
    model: req.body.model,
    description: req.body.description
  });

  Car.updateOne({_id: req.params.id}, car).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Car updated succesfully"
    });
  })
});

router.get('' , (req, res, next) => {
  Car.find()
    .then((documents) => {
      res.status(200).json({
        message: "Posts fetched succesfully",
        cars: documents
      });
    });
});

router.get('/:id', (req, res, next) => {
  Car.findById(req.params.id)
    .then(car => {
      if(car) {
        res.status(200).json(car);
      } else {
        res.status(404).json({ message: 'Car not found!'});
      }
    })
});

router.delete('/:id', (req, res, next) => {
  Car.deleteOne({_id: req.params.id})
    .then((result) => {
      console.log(result)
      res.status(200).json({
        message: "Post deleted successfully"
      })
    })
})

module.exports = router;