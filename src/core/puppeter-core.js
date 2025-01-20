import puppeteer from "puppeteer";
import logger from "../utils/logger.js";
import { Helper } from "../utils/helper.js";

export class PuppeterCore {
  constructor() {
    this.selector = "div[role=textbox]";
  }

  async initializePuppeterBrowser() {
    logger.info(`Initializing Puppeter Browser`);
    const url = "https://discord.com/login";
    this.browser = await puppeteer.launch({
      channel: "chrome",
      headless: process.env.HEADLESS == 1,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    logger.info(`Launching Puppeter Browser to ${url}`);

    this.page = await this.browser.newPage();
    this.page.setJavaScriptEnabled(true);

    await this.page.goto(url, { waitUntil: "load" });

    const email = process.env.DISCORD_EMAIL;
    const password = process.env.DISCORD_PASSWORD;

    if (!email || !password) {
      logger.error("Email or password not found in environment variables");
      throw new Error("Missing email or password in environment variables");
    }

    await this.page.type('input[name="email"]', email);
    await this.page.type('input[name="password"]', password);
    logger.info("Try to login using Provided Email & Password");
    await this.page.click('button[type="submit"]');
    await this.page.waitForNavigation();
    logger.info("Login successful, cookies saved");
  }

  async initializingChat() {
    logger.info(`Initializing Chat Session`);
    const url = process.env.TARGET_CHAT_CHANNEL;
    if (!url) {
      logger.error(
        "Target chat channel URL is not set in environment variables"
      );
      throw new Error(
        "Missing target chat channel URL in environment variables"
      );
    }
    logger.info("Chat session initialized. Navigated to the channel.");

    await this.page.goto(url, { waitUntil: "load" });
    logger.info("Waiting for chat selector");
    await this.page.waitForSelector(this.selector);
    logger.info("Chat selector found");
  }

  async sendingMessage() {
    const message = await Helper.getRandomMessage();
    await this.page.type(this.selector, message);
    await this.page.keyboard.press("Enter");
    logger.info(`Sending Message: "${message}"`);
  }

  async closeBrowser() {
    try {
      if (this.browser) {
        logger.info("Closing Puppeteer Browser");
        await this.browser.close();
      }
    } catch (error) {
      logger.error(`Error while closing browser: ${error.message}`);
    }
  }
}
