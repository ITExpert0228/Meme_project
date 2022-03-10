const dotnev = require("dotenv-safe");
dotnev.config(
    {
        allowEmptyValues: true
    }
  );
const CONFIG = process.env;
module.exports = CONFIG;
