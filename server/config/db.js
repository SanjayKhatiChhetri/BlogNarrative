const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
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
