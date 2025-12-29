const { search } = require('google-sr');

(async () => {
    try {
        console.log('Searching...');
        const results = await search({ query: 'nodejs tutorial', limit: 5 });
        console.log(JSON.stringify(results, null, 2));
    } catch (e) {
        console.error(e);
    }
})();
