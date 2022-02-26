const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
puppeteer.use(StealthPlugin);
const fs = require('fs');
var browserInstance = false;

async function launchBrowser() {
   
    const { browser, page } = await initBrowser();
    return { browser, page };
}

async function initBrowser(key, target, accountDetails) {
    let browser;
   
        browser = await puppeteer.launch({
            headless: false,
            ignoreHTTPSErrors: true,
            args: [
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--ignore-ssl-errors',

            ],
        });

    

    browser.on('disconnected', () => {
        console.log("<--------- Browser closed ------------->");
    });

    browserInstance = true;

    let page = await getPage(browser);

    return { browser, page };
}

async function getPage(browser) {
    let page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024, deviceScaleFactor: 1 });
  
    page.on('console', msg => {
        if (msg._type == "log")
            console.log(msg._text);
    });
    page.on('error', async (error) => {
        if (error.toString().match(/Page crashed/i)) {
            console.log("<--------- Page crashed ------------->");
            await browser.close();
        }
    });

    return page;
}

async function closeTabs(browser) {
    if (!browser) return;
    let tabs = await browser.pages();
    for (let i = tabs.length - 1; i > 1; i--) {
        tabs[i].close();
    }
}

function isBrowserExists() {
    return browserInstance;
}



module.exports = { launchBrowser, closeTabs, getPage, isBrowserExists };
