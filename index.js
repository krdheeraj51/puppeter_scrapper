require('dotenv').config();
const { launchBrowser, getPage, closeTabs, isBrowserExists } = require('./services/browser');
const { fetchCountryList } = require('./modules/fetchCountryList');

init()

async function init() {
    try {
        console.log("============ Initializing Application ============");
        await startUp();

    } catch (err) {
        if (err.toString().match(/Session closed/i)) {
            return setTimeout(init(), 1000);
        }

        //wait for 15 secs
        await new Promise(resolve => {
            setTimeout(() => resolve(true), 15000);
        });
    }
}

/**
 * Script initialization
 */
async function startUp() {
    try {
        let browserInstance = await launchBrowser();
        let browser = browserInstance.browser;
        let page = browserInstance.page;
        await page.waitForTimeout(5000);
        console.log("fetch country details ....");

        let getCountyList = await fetchCountryList(page);

        console.log("getCountyList ::",getCountyList);

        await new Promise(resolve => {
            setTimeout(() => resolve(true), 15000);
        });
        /**
         * After processing order close Browser
         */
        if (isBrowserExists()) await browser.close();



        console.log("Cron has been completed all reports. Sleeping for 5 minutes..");

        return await new Promise(resolve => setTimeout(() => {
            resolve(true);
            startUp();
        }, 300000))

    } catch (err) {
        console.log("Error ::",err);
        throw err;
    }
}






