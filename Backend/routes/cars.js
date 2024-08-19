const express = require("express");
const Car = require('../models/car');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
} 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid) {
      error = null;
    }
    cb(error, "Backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const car = new Car({
    model: req.body.model,
    description: req.body.description,
    imagePath: url + "/images/" + req.file.filename
  });
  car.save().then(createdCar => {
    res.status(201).json({
      message: "Car added",
      car: {
        id: createdCar._id,
        model: createdCar.model,
        description: createdCar.description,
        imagePath: createdCar.imagePath
      }
    });
  });
})

router.put('/:id', checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const car = new Car({
    _id: req.body.id,
    model: req.body.model,
    description: req.body.description,
    imagePath: imagePath
  });

  console.log(car);
  Car.updateOne({_id: req.params.id}, car).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Car updated succesfully"
    });
  })
});

router.get('' , (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const carQuery = Car.find();
  let fetchedCars;

  if(pageSize && currentPage) {
    carQuery 
     .skip(pageSize * (currentPage - 1))
     .limit(pageSize);
  }

  carQuery
    .then((documents) => {
      fetchedCars = documents;
      return Car.countDocuments();
    })    
    .then(count => {
      res.status(200).json({
        message: "Cars fetched succesfully",
        cars: fetchedCars,
        maxCars: count
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

router.delete('/:id', checkAuth, (req, res, next) => {
  Car.deleteOne({_id: req.params.id})
    .then((result) => {
      console.log(result)
      res.status(200).json({
        message: "Post deleted successfully"
      })
    })
})

module.exports = router;