// settings.js
var settings = {
  development: {
    db: {
      host: 'db', // Hostname of the MySQL container
      user: 'root', // MySQL root user
      password: 'password', // MySQL root password
      database: 'notejam' // MySQL database name
    },
    dsn: "mysql://root:password@mysql/notejam"
  },
  test: {
    db: {
      host: 'mysql',
      user: 'root',
      password: 'password',
      database: 'notejam_test'
    },
    dsn: "mysql://root:password@mysql/notejam_test"
  }
};

var env = process.env.NODE_ENV || 'development';
module.exports = settings[env];

