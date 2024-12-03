const sum = require('./serviceworker');

describe('Service Worker', () => {

    it('should respond with a greeting', async () => {
        const response = await activate();
        const text = await response.text();
        expect(text).toBe('Hello from the service worker!');
    });
});