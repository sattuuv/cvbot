const mysql = require('mysql2/promise');
const { db } = require('./config');

let connection;
async function getConnection() {
  if (!connection) {
    connection = await mysql.createPool(db);
  }
  return connection;
}

module.exports = { getConnection };