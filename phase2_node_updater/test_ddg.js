const { search } = require('duck-duck-scrape');

(async () => {
    try {
        const results = await search('Chatbots Magic: Beginner’s Guidebook');
        console.log(results.results[0]);
    } catch (e) {
        console.error(e);
    }
})();
