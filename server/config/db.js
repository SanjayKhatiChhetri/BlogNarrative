// const { Pool } = require("pg");

// require("dotenv").config();

const { Pool } = require("pg");
require("dotenv").config();

// const pool = new Pool({
//   user: process.env.USERNAME,
//   password: process.env.PASSWORD,
//   host: process.env.HOST,
//   port: process.env.PORT,
//   database: process.env.DATABASE,
// });

console.log("Attempting to connect to database:", process.env.DATABASE_URL);

const pool = new Pool({
  user: "blogapp_user",
  password: "Authorize",
  host: "localhost",
  port: 5432,
  database: "blogapp",
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => {
    console.log("Executing query:", { text, params });
    return pool.query(text, params).catch((error) => {
      console.error("Database query error:", error);
      throw error;
    });
  },
};
