//@ts-check
const path = require("path");
const puppeteer = require("puppeteer");

class Renderer {
  constructor(browser) {
    this.browser = browser;
  }

  async quote({ quote, name }) {
    const page = await this.browser.newPage();

    await page.goto(`file://${path.join(__dirname, "index.html")}`);
    await page.evaluate(
      ({ quote, name }) => {
        // eslint-disable-next-line no-undef
        let dom = document.querySelector("#text-content");
        dom.innerHTML = `"${quote}", by ${name}`;
      },
      { quote, name }
    );

    return await page.content();
  }
}

async function create() {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox"]
  });
  return new Renderer(browser);
}

module.exports = create;
