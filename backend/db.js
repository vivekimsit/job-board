var pg = require('pg');

module.exports = function() {
  var config = {
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
  };
  switch (process.env.NODE_ENV) {
    case 'development':
      config.host = 'localhost';
      config.user = 'vivek';
      config.password = 'admin';
      config.database = 'jobbatical';
      break;
    case 'production':
      config.user = 'rragdkrc37';
      config.database = 'rragdkrc37_db';
      config.password = 'cxbrqnn8wp';
      config.host = 'assignment.codsssqklool.eu-central-1.rds.amazonaws.com'
      break;
    default:
      throw new Error('Invalid enviroment');
  }

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

  pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
  });

  return pool;
};
