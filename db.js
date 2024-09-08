const mysql = require('mysql2/promise');
const async = require('async');
const settings = require('./settings');

const pool = mysql.createPool({
  host: process.env.DB_HOST || settings.db.host,
  user: process.env.DB_USER || settings.db.user,
  password: process.env.DB_PASSWORD || settings.db.password,
  database: process.env.DB_NAME || settings.db.database,
});

const functions = {
  createTables: async function (next) {
    try {
      const connection = await pool.getConnection();
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(75) NOT NULL,
          password VARCHAR(128) NOT NULL
        );
      `);
      await connection.query(`
        CREATE TABLE IF NOT EXISTS pads (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          user_id INT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);
      await connection.query(`
        CREATE TABLE IF NOT EXISTS notes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          pad_id INT,
          user_id INT NOT NULL,
          name VARCHAR(100) NOT NULL,
          text TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (pad_id) REFERENCES pads(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);
      console.log("Tables created successfully");
      connection.release();
      next();
    } catch (err) {
      console.error("Error creating tables:", err);
      next(err);
    }
  },

  applyFixtures: function (next) {
    this.truncateTables(function () {
      async.series([
        function (callback) {
          pool.query(`INSERT INTO users (email, password) VALUES 
            ('user1@example.com', 'passwordHash'),
            ('user2@example.com', 'passwordHash');`, callback);
        },
        function (callback) {
          pool.query(`INSERT INTO pads (name, user_id) VALUES 
            ('Pad 1', 1),
            ('Pad 2', 1);`, callback);
        },
        function (callback) {
          pool.query(`INSERT INTO notes (pad_id, user_id, name, text) VALUES 
            (1, 1, 'Note 1', 'Text'),
            (1, 1, 'Note 2', 'Text');`, callback);
        }
      ], next);
    });
  },

  truncateTables: function (next) {
    async.series([
      function (callback) {
        pool.query("DELETE FROM users;", callback);
      },
      function (callback) {
        pool.query("DELETE FROM pads;", callback);
      },
      function (callback) {
        pool.query("DELETE FROM notes;", callback);
      }
    ], next);
  }
};

if (require.main === module) {
  functions.createTables(function (err) {
    if (err) {
      console.error("Error initializing DB:", err);
    } else {
      functions.applyFixtures(function (err) {
        if (err) {
          console.error("Error applying fixtures:", err);
        } else {
          console.log("DB successfully initialized");
        }
      });
    }
  });
}

module.exports = functions;
