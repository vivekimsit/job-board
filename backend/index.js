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
    if(error) {
      done();
      console.log(error.message);
      return res.status(500).json({success: false, data: error});
    }
    req.client = client;
    req.done = done;
    next();
  });
});

router.get('/topActiveUsers', (req, res) => {
  //User.test(req, res);
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
      .then(function fullfilled(user) {
        return user.companies(req);
      })
      .then(function fullfilled(user) {
        return user.listings(req);
      })
      .then(function fullfilled(user) {
        return user.applications(req);
      })
      .then(function fullfilled(user) {
        res.json({
          id: user.id,
          name: user.name,
          createdAt: user.createdAt,
          companies: user._companies,
          listings: user._listings,
          applications: user._applications
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

User.test = function test(req, res) {
  var client = req.client;
  var queryString = "select * from users u inner join (select user_id, count(id) as cnt from "+
      "applications where id in (select id from applications where "+
      "created_at > current_date - interval '1 week') group by user_id) "+
      "a on u.id = a.user_id order by a.cnt desc";
  client.query(queryString, [], function result(error, result) {
    res.json(result.rows);
  });
};
