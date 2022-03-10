const fs = require("fs");
let logger;

const createFile = () => {
  let paths = {
    error: "./logs/error.log",
    success: "./logs/success.log",
    info: "./logs/info.log",
  };
  if (
    fs.existsSync(paths.error) &&
    fs.existsSync(paths.success) &&
    fs.existsSync(paths.info)
  ) {
    return paths;
  }
  if (!fs.existsSync("./logs")) {
    fs.mkdirSync("./logs");
  }
  fs.writeFileSync(paths.error, "");
  fs.writeFileSync(paths.success, "");
  fs.writeFileSync(paths.info, "");
  return paths;
};

const createLogger = (block) => {
  const paths = createFile();
  logger = {
    success(data) {
      fs.appendFileSync(paths.success, `${data}\n`);
    },
    /**
     *
     * @param {error object} err
     * @param {log message, debug data} message
     */
    error(err, message) {
      fs.appendFileSync(
        paths.error,
        `${err.message} ${err.stack}\n msg : ${message}`
      );
    },
    info(data) {
      fs.appendFileSync(paths.info, `${data}\n`);
    },
  };
  return logger;
};

const getLogger = () => {
  return logger;
};

module.exports = { createLogger, getLogger };
