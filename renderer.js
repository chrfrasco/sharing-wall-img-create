//@ts-check
const path = require("path");
const puppeteer = require("puppeteer");

class Renderer {
  constructor(browser) {
    this.browser = browser;
  }

  async quote({ quote, name }) {
    const page = await this.browser.newPage();
    await page.setViewport({ width: 500, height: 500 });

    await page.goto(`file://${path.join(__dirname, "/template/index.html")}`);
    await page.evaluate(
      ({ quote, name }) => {
        /* eslint-disable no-undef */
        const quoteBody = document.querySelector("#quote-body");
        const quoteName = document.querySelector("#quote-name");
        /* eslint-enable no-undef */

        quoteBody.innerHTML = `&lsquo;${quote}&rsquo;`;
        quoteName.innerHTML = name;
      },
      { quote, name }
    );

    const buff = await page.screenshot({ fullPage: true });
    return `data:image/png;base64,${buff.toString("base64")}`;
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
