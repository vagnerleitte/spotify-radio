import server from "./server.js";
import logger from "./utils.js";
import config from "./config.js";

logger.info(config.port)

server.listen(config.port)
  .on('listening', () =>
    logger.info(`server running on port ${config.port}`))