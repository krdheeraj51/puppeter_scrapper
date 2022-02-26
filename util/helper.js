async function generateRandomNumber(min, max) {
    const a = Math.floor(Math.random() * (max - min + 1)) + min;
    return a;
}
const clickEvent = async (page, xpath) => {
    const elements = await page.$x(xpath);
    if (elements && elements.length) {
        await elements[0].click();
        await page.waitForTimeout(4000);
    }
}

module.exports = {
    generateRandomNumber,
    clickEvent
}