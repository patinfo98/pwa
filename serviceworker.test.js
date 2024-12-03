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
    try {
      await page.goto('http://127.0.0.1:8082', { waitUntil: 'load', timeout: 10000 });
      
      const readyState = await page.evaluate(() => {
        return document.readyState;
      });
      
      if (readyState !== 'complete') {
        throw new Error('Page did not load completely');
      }
  
      console.log('Page loaded and readyState is complete');
    } catch (error) {
      console.error('Error loading page:', error);
      throw error; 
    }
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
