var pg = require('pg'),
    bcrypt   = require('bcrypt-nodejs'),
    Q = require('q');

pg.defaults.poolIdleTimeout = 12000000;
pg.defaults.poolSize = 20;
var conString = process.env.databaseString;


exports.createUser = function(email, password) {
  password = generateHash(password);
  return Q.promise(function(resolve, reject) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query("INSERT INTO users (email, password) VALUES ($1,$2) RETURNING id, email, created_at;",
      [email, password], function(err, result) {
        //call `done()` to release the client back to the pool
        if (result.rows[0]) {
          resolve(result.rows[0]);
        }
        else if (err) {
          reject(console.error('error running query', err));
        }
        done();
      });
    });
  });
};

exports.findByEmail = function(email) {
  return Q.promise(function(resolve) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT id, email, created_at FROM users where email = $1;',[email], function(err, result) {
        resolve(result.rows);
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
      });
    })
  })
}

exports.authenticateUser = function(email, password) {
  return Q.promise(function(resolve) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT id, email, password, created_at FROM users where email = $1;',[email], function(err, result) {
        if (result.rows[0]) {
          if (validPassword(result.rows[0].password, password)) {
            resolve(result.rows[0])
          } else {reject('incorrect password')}
        }
        else if (err) {
          reject(console.error('error running query', err));
        }
        done();
      });
    })
  })
}

exports.findById = function(id) {
  return Q.promise(function(resolve) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT id, email, created_at FROM users where id = $1;',[id], function(err, result) {
        resolve(result.rows);
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
      });
    })
  })
}

var generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

var validPassword = function(cryptopassword, userpassword) {
  return bcrypt.compareSync(userpassword, cryptopassword);
}
