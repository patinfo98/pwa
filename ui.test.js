const puppeteer = require('puppeteer');
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

    beforeEach(async () => {
        await page.goto('http://127.0.0.1:8082/index.html');
        await new Promise(resolve => setTimeout(resolve, 200));
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
        await page.waitForSelector('#bigCard', { visible: true });
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

    test('should add pin and show pins page', async () => {
        await page.click('#bigCardPinButton');
        await page.$$eval('.bottomNav .bottomNavItem', (items) => items[1].click());
        await page.waitForNavigation();
        const currentURL = page.url();
        expect(currentURL).toBe('http://127.0.0.1:8082/pins.html');
        expect('.smallPinContainer').toBeDefined();
    });

    test('should update profile', async () => {
        await page.$$eval('.bottomNav .bottomNavItem', (items) => items[2].click());
        await page.waitForSelector('#editBtn');
        await page.click('#editBtn');
        await page.waitForSelector('#color4');
        await page.click('#color4');
        await page.click('#saveButton');
        await page.waitForSelector('#profileTopper');
        const backgroundColor = await page.$eval('#profileTopper', (element) => {
            return window.getComputedStyle(element).backgroundColor;
          });
        
          expect(backgroundColor).toBe('rgb(77, 133, 92)');
    });

    test('should delete poll', async () => {
        await page.$$eval('.bottomNav .bottomNavItem', (items) => items[2].click());
        await page.waitForSelector('.myPost');
        const initialPostsLength = await page.$$eval('.myPost', (posts) => posts.length);
        await page.click('#post1');
        const postLength = await page.$$eval('.myPost', (posts) => posts.length);
        expect(postLength).toBe(initialPostsLength - 1);
    });

    test('should add poll', async () => {
        await page.waitForSelector('.addPollButton');
        await page.click('.addPollButton');
        await page.waitForSelector('#question');
        await page.type('#question', 'Test Question');
        await page.type('#answerInput1', 'Test Answer 1');
        await page.type('#answerInput2', 'Test Answer 2');
        await page.click('#submitPoll');
        await page.$$eval('.bottomNav .bottomNavItem', (items) => items[2].click());
        await page.waitForSelector('.postDescription');
        const postDescription = await page.$eval('.postDescription', (el) => el.textContent);
        expect(postDescription).toContain('Test Question');

    });
});
