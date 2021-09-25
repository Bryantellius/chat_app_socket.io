const dotenv = require("dotenv");

if (!dotenv.config()) {
  throw new Error("ENV not found");
}

module.exports = {
  db: {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
  port: parseInt(process.env.PORT)
};
