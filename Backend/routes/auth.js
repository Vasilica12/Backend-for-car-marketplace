const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/auth');
const { emit } = require("../app");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          }); 
        });
    });
});

router.post('/login', (req, res, next) => {
  console.log(req.body);
  let theUser = {};
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        throw new Error('User not found');
      }
      theUser = user;
      console.log(user.firstName, user.secondName);
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        throw new Error('User password is invalid');
      }
      const token = jwt.sign(
        { email: theUser.email, userId: theUser._id },
        'the_car_is_expensive',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, expiresIn: 3600, userId: theUser._id, email: theUser.email, firstName: theUser.firstName});
    })
    .catch(err => {
      res.status(401).json({ message: err.message });
    });
});

module.exports = router;