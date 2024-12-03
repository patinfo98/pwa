const puppeteer = require('puppeteer');

describe('Service Worker', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.goto('http://localhost:8082');
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should register the service worker', async () => {
    const serviceWorkerRegistration = await page.evaluate(() => {
      return navigator.serviceWorker.ready;
    });
    expect(serviceWorkerRegistration).toBeDefined();
  });

  it('should cache the specified files', async () => {
    const cachedFiles = await page.evaluate(() => {
      return caches.open('lab05pwa-cache').then((cache) => {
        return cache.keys().then((requests) => {
          return requests.map(request => request.url);
        });
      });
    });
    expect(cachedFiles).toContainEqual(expect.stringMatching(/\/img\/apple_splash_640.png$/));
  });
  
  it('should serve cached files when offline', async () => {
    await page.setOfflineMode(true);
  
    const response = await page.evaluate(() => {
      return fetch('index.html')
        .then(response => response.text())
        .catch(() => 'offline');
    });
  
    expect(response).not.toBe('offline');
  });
});
