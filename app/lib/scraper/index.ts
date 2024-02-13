import * as cheerio from "cheerio";
import playwright from "playwright";

export async function scrapeTCGPlayerProduct(url: string) {
  if (!url) return;

  //   Brightdata
  // const username = String(process.env.BRIGHT_DATA_USERNAME);
  // const password = String(process.env.BRIGHT_DATA_PASSWORD);
  // const port = 22225;
  // const session_id = (1000000 * Math.random()) | 0;
  // const options = {
  //   auth: {
  //     username: `${username}-session-${session_id}`,
  //     password,
  //   },
  //   host: "brd.superproxy.io",
  //   port,
  //   rejectUnauthorized: false,
  // };

  try {
    // Fetch the product page
    // const response = await axios.get(url, options);
    // const $ = cheerio.load(await response.data);
    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto(url);
    await page.waitForTimeout(2000);
    // const title = await page.getByTestId("lblProductDetailsProductName");

    const content = await page.content();
    const $ = cheerio.load(content);
    const title = $(".product-details__name").text().trim();

    let imageUrl = "";
    $(".v-lazy-image-loaded").each((_, val) => {
      imageUrl = val.attribs.src;
    });

    let marketPrice = 0;
    const table = $(".price-guide__points table");
    table.find("tr").each((i, row) => {
      let foundMarketPriceRow = false;
      $(row)
        .find("td, th")
        .each((j, cell) => {
          if ($(cell).text().trim() === "Market Price")
            foundMarketPriceRow = true;
          if (foundMarketPriceRow && j === 1) {
            marketPrice = parseFloat($(cell).text().slice(1));
            return;
          }
        });
    });

    // // Construct data object with scraped information
    const data = {
      url,
      image: imageUrl,
      title,
      currentPrice: Number(marketPrice),
      priceHistory: [],
      lowestPrice: Number(marketPrice),
      highestPrice: Number(marketPrice),
      averagePrice: Number(marketPrice),
    };

    return data;
  } catch (err: any) {
    throw new Error(`Failed to scrape product: ${err.message}`);
  }
}
