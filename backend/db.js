var pg = require('pg');

var config = {
  host: 'localhost',
  user: 'vivek',
  password: 'admin',
  database: 'jobbatical',
};

//var conString = "postgres://" + username + ":" + password + host + database;

//var client = new pg.Client(conString);
//client.connect();

var pool = new pg.Pool(config);

pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
    done(err);

    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].number);
    //output: 1
  });
});

/*
var config = {
  user: 'rragdkrc37', //env var: PGUSER
  database: 'cxbrqnn8wp_db', //env var: PGDATABASE
  password: 'cxbrqnn8wp', //env var: PGPASSWORD
  host: 'assignment.codsssqklool.eu-central-1.rds.amazonaws.com', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
*/

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
});

module.exports = pool;
