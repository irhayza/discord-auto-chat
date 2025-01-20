import { configDotenv } from "dotenv";
import { PuppeterCore } from "./src/core/puppeter-core.js";
import { Helper } from "./src/utils/helper.js";
import logger from "./src/utils/logger.js";

async function operation() {
  const puppeter = new PuppeterCore();
  try {
    await puppeter.initializePuppeterBrowser();
    await puppeter.initializingChat();
    const delay = process.env.DELAY_EACH_CHAT_IN_SECONDS * 1000;
    while (true) {
      await puppeter.sendingMessage();
      await Helper.delay(delay, "Delaying before sending next message");
    }
  } catch (error) {
    logger.info(error);
    await Helper.delay(5000);
    await puppeter.closeBrowser();
    await operation();
  }
}

async function startBot() {
  try {
    logger.info(`BOT STARTED\n`);
    await operation();
  } catch (error) {
    logger.info(`BOT STOPPED`);
    logger.error(JSON.stringify(error));
    throw error;
  }
}

(async () => {
  try {
    logger.clear();
    logger.info("");
    logger.info("Application Started");
    logger.info(Helper.botName);
    logger.info();
    logger.info("By : Widiskel");
    logger.info("Follow On : https://github.com/Widiskel");
    logger.info("Join Channel : https://t.me/skeldrophunt");
    logger.info("Dont forget to run git pull to keep up to date");
    logger.info();
    logger.info();
    Helper.showSkelLogo();
    configDotenv();

    await startBot();
  } catch (error) {
    logger.info("Error During executing bot", error);
    await startBot();
  }
})();
