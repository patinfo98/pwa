const puppeteer = require('puppeteer');
jest.useRealTimers();
describe('Polly PWA Tests', () => {
    let page;
    let browser;
  
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        await page.goto('http://127.0.0.1:8082');
    });
  
    afterAll(async () => {
        await browser.close();
    });
    
    test('should load the homepage and display the title', async () => {
        await page.waitForSelector('h1');
        const title = await page.title();
        expect(title).toBe('Polly');
    });

    test('should skip the poll when skip button is clicked', async () => {
        await page.click('#skipButton');
        await page.waitForSelector('#bigCard', { visible: true });  // Wait for the element to be visible again
        const skipButtonVisible = await page.$('#bigCard') !== null;
        expect(skipButtonVisible).toBe(true);
    });
  
    test('should show poll with answers on the homepage', async () => {
        await page.waitForSelector('#bigCard');
        const cardVisible = await page.$('#bigCard') !== null;
        expect(cardVisible).toBe(true);

        const answerOneVisible = await page.$('#bigCardAnswerOne') !== null;
        const answerTwoVisible = await page.$('#bigCardAnswerTwo') !== null;
        expect(answerOneVisible).toBe(true);
        expect(answerTwoVisible).toBe(true);
    });
    
    test('should navigate to the pins page when the pin button is clicked', async () => {
        await page.$$eval('.bottomNav .bottomNavItem', (items) => items[1].click());
        await page.waitForNavigation();
        const currentURL = page.url();
        expect(currentURL).toBe('http://127.0.0.1:8082/pins.html');
    });

});
