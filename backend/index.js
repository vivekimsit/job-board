'use strict';

var express = require('express');
var Promise = require('promise');
var app = express();
var router = express.Router();
var PORT = 3000;
var pool = require('./db.js');

var User = require('./models');

app.use(function (req, res, next) {
  pool.connect(function(error, client, done) {
    // Handle connection errors
    if (error) {
      done(error);
      console.log(error.message);
      return res.status(500)
          .json({success: false, data: error});
    }
    req.client = client;
    req.done = done;
    next();
  });
});

router.get('/topActiveUsers', (req, res) => {
  topActiveUsers(req, res);
});

router.get('/users', (req, res) => {
  userInfo(req, res);
});

app.use(router);

app.get('*', function (req, res) {
  res.status(400).send('Invalid route');
});

app.listen(PORT, function () {
  console.log('App listening on port ' + PORT);
});

var topActiveUsers = function topActiveUsers(req, res) {
  User.topActiveUsers(req)
      .then(function fullfilled(users) {
        return Promise.all(users.map(function (user) {
          return user.applicationListings(req);
        }));
      })
      .then(function fullfilled(users) {
        var result = users.map(function (user) {
          return {
            id: user.id,
            name: user.name,
            count: user._appliedListings.length,
            createdAt: user.createdAt,
            listings: user._appliedListings
          };
        });
        res.json(result);
      })
      .catch(function rejected(error) {
        console.log(error.message);
        throw error;
      })
      .finally(function () {
        res.end();
      });
};

var userInfo = function userInfo(req, res) {
  User.getById(req)
      // run companies/listings/applications in "parallel"
      .then(function fullfilled(user) {
        return Promise.all([
          user.id,
          user.name,
          user.createdAt,
          user.companies(req),
          user.listings(req),
          user.applications(req)
        ]);
      })
      /*
      .then(function fullfilled(user) {
        return user.companies(req);
      })
      .then(function fullfilled(user) {
        return user.listings(req);
      })
      .then(function fullfilled(user) {
        return user.applications(req);
      })
      */
      .then(function fullfilled([
            id, name, createdAt, companies, listings, applications]) {
        res.json({
          id: id,
          name: name,
          createdAt: createdAt,
          companies: companies,
          listings: listings,
          applications: applications
        });
      })
      .catch(function rejected(error) {
        console.log('error', error.message);
        throw error;
      })
      .finally(function () {
        res.end();
      });
};
