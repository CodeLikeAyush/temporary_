const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
  console.log(process.env.NODE_ENV);
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
};
