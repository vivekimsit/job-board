var Promise = require('promise');

module.exports = User;

/**
 * User m2m Company
 * User o2m Listing
 * User m2m applications
 */
function User(opt_data) {
  var data = opt_data || {};

  this.id = data['id'] || null;
  this.name = data['name'] || '';
  this.createdAt = data['created_at'] || new Date();
  this._companies = [];
  this._listings = [];
  this._applications = [];
  this._appliedListings = [];
}
User._RESOURCE_LIMIT = 5;
var UserProto = User.prototype;

User.topActiveUsers = function topActiveUsers(req) {
  var queryString = "select * from users u inner join "+
      "(select user_id, count(id) cnt from applications "+
      "where id in (select id from applications where "+
      "created_at > current_date - interval '1 week') "+
      "group by user_id) a on u.id = a.user_id order by a.cnt desc";
  return queryPromise(req, queryString)
      .then(function fullfilled(result) {
        return result.rows.map(function(row) {
          return new User(row);
        });
      });
};

User.getById = function getById(req) {
  var queryString = 'select * from users where id = $1::int';
  return queryPromise(req, queryString, [req.query.id])
      .then(function fullfilled(result) {
        return new User(result.rows[0]);
      });
};

UserProto.companies = function companies(req) {
  var queryString = 'select c.id, c.name, t.contact_user '+
      'from companies c, teams t '+
      'where t.user_id = $1::int and t.company_id = c.id '+
      'limit $2::int';
  return queryPromise(req, queryString, [this.id, User._RESOURCE_LIMIT])
    .then(function fullfilled(result) {
      return result.rows.map(function (data) {
        return new Company(data);
      });
    });
};

UserProto.listings = function listings(req) {
  var queryString = 'select * from listings '+
      'where created_by = $1::int '+
      'limit $2::int';
  return queryPromise(req, queryString, [this.id, User._RESOURCE_LIMIT])
    .then(function fullfilled(result) {
      return result.rows.map(function (data) {
        return new Listing(data);
      });
    });
};

UserProto.applicationListings = function applications(req) {
  var queryString = "select * from listings l inner join "+
      "(select listing_id, user_id, created_at from applications) a "+
      "on a.listing_id = l.id "+
      "where a.user_id = $1::int order by a.created_at desc limit 3";
  var self = this;
  return queryPromise(req, queryString, [this.id])
      .then(function fullfilled(result) {
        self._appliedListings = result.rows.map(function (data) {
          return new Listing(data);
        });
        return self;
      });
};

UserProto.applications = function applications(req) {
  var queryString = 'select a.id as app_id, a.created_at, a.cover_letter, '+
    'l.id as list_id, l.name, l.description '+
    'from applications a, listings l '+
    'where a.user_id = $1::int and a.listing_id = l.id '+
    'limit $2::int';
  return queryPromise(req, queryString, [this.id, User._RESOURCE_LIMIT])
      .then(function fullfilled(result) {
        return result.rows.map(function (data) {
          return new Application(data);
        });
      });
};

function Company(opt_data) {
  var data = opt_data || {};
  this.id = data['id'] || null;
  this.createdAt = data['created_at'] || new Date();
  this.name = data['name'] || '';
  this.isContact = false;
}

function Listing(opt_data) {
  var data = opt_data || {};
  this.id = data['id'] || null;
  this.createdAt = data['created_at'] || new Date();
  this.name = data['name'] || '';
  this.description = data['description'] || '';
}

function Application(opt_data) {
  var data = opt_data || {};
  this.id = data['id'] || null;
  this.createdAt = data['created_at'] || new Date();
  this.listing = data['listing'] || null;
  this.coverLetter = data['cover_letter'] || '';
}

function queryPromise(req, queryString, queryParams, debug) {
  if (debug) {
    console.log(queryString, queryParams);
    req.client.connection.on('message', function(msg) {
      console.log(msg)
    });
  }
  return new Promise(function _promise(resolve, reject) {
    req.client.query(
        queryString,
        queryParams || [],
        function result(error, result) {
      req.done(error);

      if (error) {
        console.log('error ' + error.message);
        return reject(error);
      }
      resolve(result);
    });
  });
};
