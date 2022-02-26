const helper = require('../util/helper');

var fetchCountryList = async function (page, timeoutCounter = 0) {
    console.log("fetch country list .......");

    if (timeoutCounter >= 3) {
        return {
            error: "9",
            status: "fail"
        }
    }
    timeoutCounter++;

    try {

        await page.goto('https://www.citypopulation.de/');
        let delay = await helper.generateRandomNumber(4000, 5000);
        await page.waitForTimeout(delay);
        let elements = await page.$x('//a[text()="America"]');
        if (elements && elements.length) {
            console.log("come here .................");
            await helper.clickEvent(page, '//a[text()="America"]');
        }
        await page.waitForTimeout(delay);

        let countryList = await getListOfCountries(page);

        return {
            countryData: countryList
        }
      




    } catch (err) {
        console.log("Error Details :::", err);
        let timeOutError = err.toString().match(/Timeout/i) || err.toString().match(/not visible/i);
        if (timeOutError && timeOutError.length > 0) {
            console.log('Error : Get Time-out Error at Reading email.');
            return new Promise.resolve(fetchCountryList(page, timeoutCounter));

        } else {
            return;
        }
    }


}

let getListOfCountries = async (page) => {
    try {
        let countryList = [];
        let elements = await page.$x('//div[@class="mcolboxes"]/ul/li/a/h3');
        if (elements && elements.length) {
            for(let elem of elements){
                let country = await page.evaluate(el => el.textContent.trim(), elem);
                countryList.push(country);
            }
            
        }return countryList;

    } catch (err) {
        console.log("Error ::", err);
        throw err;
    }
}

module.exports = {
    fetchCountryList
}
