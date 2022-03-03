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
        let elements = await page.$x('//a[text()="Asia"]');
        if (elements && elements.length) {
            console.log("come here .................");
            await helper.clickEvent(page, '//a[text()="Asia"]');
        }
        await page.waitForTimeout(delay);

        let countryList = await getListOfCountries(page);
        await page.waitForTimeout(delay);
        for (let index = 0; index < countryList.length; index++) {
            await clickOnCitiesDetailPage(page, index);
            await page.waitForTimeout(5000);
        }
        return true;

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

let clickOnCitiesDetailPage = async (page, index) => {
    try {
        let elements = await page.$x('//div[@class="mcolboxes"]/ul/li/a');
        console.log("elements length::", elements.length);
        if (elements && elements.length) {
            console.log("Next ........................", index);
            await page.waitForTimeout(5000);
            await page.evaluate(el => el.click(), elements[index]);
            await page.waitForTimeout(5000);
            await performScrapDetails(page);

        }
        return true;
    } catch (err) {
        console.log("throw ::", err);
        throw err;
    }
}

const performScrapDetails = async (page) => {
    try {
        let citiesTitleMatched = await lookForCitiesTitle(page);
        if (citiesTitleMatched) {
            let dataRespo = await grabDataFromPage(page);
            await page.waitForTimeout(5000);
            console.log("dataRespo ::::", dataRespo);
            await page.waitForTimeout(5000);
            let newElements = await page.$x('//span[@itemprop="containedIn"]/a');
            if (newElements && newElements.length) {
                console.log("come here ........................");
                await page.evaluate(el => el.click(), newElements[0]);
                await page.waitForTimeout(5000);
            }
        } else {
            await page.goBack();
            await page.waitForTimeout(5000);
        }
        return true;
    } catch (err) {
        console.log("Error ::", err);
        throw err;
    }
}

const lookForCitiesTitle = async (page) => {
    try {
        let elements = await page.$x("//h3[text()='Provinces & Cities']");
        if (elements && elements.length) {
            await page.evaluate(el => el.click(), elements[0]);
            await page.waitForTimeout(5000);
            return true;
        }
        elements = await page.$x("//h3[text()='Cities and Towns']");
        if (elements && elements.length) {
            await page.evaluate(el => el.click(), elements[0]);
            await page.waitForTimeout(5000);
            return true;
        }
        elements = await page.$x("//h3[text()='Municipalities & Communities']");
        if (elements && elements.length) {
            await page.evaluate(el => el.click(), elements[0]);
            await page.waitForTimeout(5000);
            return true;
        }
        return false;
    } catch (err) {
        console.log("Error ::", err);
        throw err;
    }
}


let grabDataFromPage = async (page) => {
    try {
        let citiesData = [];
        let checkForTableTitle = await lookForTableTitleForScarp(page);
        if (checkForTableTitle) {
            let tableTows = await page.$x('//section[@id="citysection"]/table/tbody/tr');
            if (tableTows && tableTows.length) {
                console.log("table rows data .................")
                for (let index = 1; index <= tableTows.length; index++) {
                    let firstColumn = await page.$x(`//section[@id="citysection"]/table/tbody/tr[${index}]/td[2]`);
                    let secondColumn = await page.$x(`//section[@id="citysection"]/table/tbody/tr[${index}]/td[3]`);
                    let thirdColumn = await page.$x(`//section[@id="citysection"]/table/tbody/tr[${index}]/td[4]`);
                    let fourthColumn = await page.$x(`//section[@id="citysection"]/table/tbody/tr[${index}]/td[5]`)
                    let fifthColumn = await page.$x(`//section[@id="citysection"]/table/tbody/tr[${index}]/td[6]`);
                    let sixthColumn = await page.$x(`//section[@id="citysection"]/table/tbody/tr[${index}]/td[7]`)
                    let dataObj = {
                        'Name': await page.evaluate(el => el.innerText, firstColumn[0]),
                        'Native': await page.evaluate(el => el.innerText, secondColumn[0]),
                        'Adm': await page.evaluate(el => el.innerText, thirdColumn[0]),
                        'Population Census (C)1979-06-23': await page.evaluate(el => el.innerText, fourthColumn[0]),
                        'Population Projection (P) 2006-09-21': await page.evaluate(el => el.innerText, fifthColumn[0]),
                        'Population Projection (P) 2020-09-21': await page.evaluate(el => el.innerText, sixthColumn[0]),
                    }
                    citiesData.push(dataObj);
                }

            }
        }




        return citiesData;
    } catch (err) {
        console.log("Error :::", err);
        throw err;
    }
}

let lookForTableTitleForScarp = async (page) => {
    try {
        let elements = await page.$x("//h2[text()='Cities & Towns']");
        if (elements && elements.length) return true;
        elements = await page.$x("//h2[text()='Municipalities and Communities']");
        if (elements && elements.length) return true;
        return false;
    } catch (err) {
        console.log("Error ::",err);
        throw err;

    }
}

let getListOfCountries = async (page) => {
    try {
        let countryList = [];
        let elements = await page.$x('//div[@class="mcolboxes"]/ul/li/a/h3');
        if (elements && elements.length) {
            for (let elem of elements) {
                let countryName = await page.evaluate(el => el.textContent.trim(), elem);
                countryList.push(countryName);
            }

        } return countryList;

    } catch (err) {
        console.log("Error ::", err);
        throw err;
    }
}

module.exports = {
    fetchCountryList
}
