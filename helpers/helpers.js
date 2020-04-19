const uuidv1 = require("uuid/v1");
const curlify = require("request-as-curl");
const createLogger = require("@hp/logger");
const fs = require("fs");
const path = require("path");
const util = require("util");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const rimraf = require("rimraf");
const promise = require("bluebird");

const rmrf = promise.promisifyAll(rimraf);

const logger = createLogger({
  serviceName: "inOne api autotests",
  useConsole: true,
  useElastic: false,
  useRedis: false
});

const validateResponseAgainstSchema = (response, schema) => {
  const logMessage = `Start validating schema`;
  logger.log(logMessage);
  reporter.startStep(logMessage);

  const { error } = schema.validate(response);

  if (error) {
    reporter.endStep();
    reporter.startStep(`Schema validation failed: ${util.inspect(error)}`);
    reporter.endStep();
    throw new Error(error);
  }

  reporter.endStep();

  const successfulValidation = "Successful schema validation";
  logger.log(successfulValidation);
  reporter.startStep(successfulValidation);
  reporter.endStep();
};

const generateGUID = () => {
  return uuidv1();
};

const toCurl = (req, data) => {
  return curlify(req, data);
};

function normalizeFunctionBodyText(functionBodyText) {
  return functionBodyText.replace(/^\(\) => /, "").trim();
}

const mkDir = dir => {
  fs.mkdirSync(dir);
};

const cleanupDir = async dir => {
  if (fs.existsSync(dir)) {
    const files = await readdir(dir);
    files.forEach(async file => {
      await unlink(path.join(dir, file));
    });
  }
};

const rmDir = async dir => {
  await rmrf(dir, () => {});
};

const log = (msg, logLevel) => {
  reporter.startStep(msg);
  reporter.endStep();
  if (
    typeof logLevel === "string" &&
    logLevel.match(/^fatal|error|warn|info|verbose|debug$/i)
  ) {
    logger[logLevel.toLowerCase()](msg);
  } else {
    logger.info(msg);
  }
};

const I = jestExpect => {
  const logMessage = `${normalizeFunctionBodyText(jestExpect.toString())}`;
  try {
    jestExpect();
    log(logMessage);
  } catch (e) {
    const normalizedError = e
      .toString()
      .replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ""
      );

    it.err.push(`\n${logMessage}. ${normalizedError} \n`);
  }
};

const It = (itName, itCallback, timeout) => {
  if (timeout) {
    it(
      itName,
      async () => {
        it.err = [];
        await itCallback();
        if (it.err.length > 0) {
          throw new Error(it.err.join("\n"));
        }
      },
      timeout
    );
  } else {
    it(itName, async () => {
      it.err = [];
      await itCallback();
      if (it.err.length > 0) {
        throw new Error(it.err.join("\n"));
      }
    });
  }
};

const timeout = time => {
  return new Promise(r => setTimeout(r, time));
};

const GUIDPattern = new RegExp(
  "^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
  "m"
);

module.exports = {
  validateResponseAgainstSchema,
  generateGUID,
  toCurl,
  I,
  It,
  mkDir,
  cleanupDir,
  rmDir,
  log,
  timeout,
  logger,
  GUIDPattern,
  http: "http://",
  https: "https://"
};

global.validateResponseAgainstSchema = validateResponseAgainstSchema;
global.generateGUID = generateGUID;
global.toCurl = toCurl;
global.I = I;
global.It = It;
global.mkDir = mkDir;
global.cleanupDir = cleanupDir;
global.rmDir = rmDir;
global.log = log;
global.logger = logger;
global.GUIDPattern = GUIDPattern;
global.http = "http://";
global.https = "https://";
global.moment = require("moment");
global.timeout = timeout;
global.deasyncPromise = require("deasync-promise");
