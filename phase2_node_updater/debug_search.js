const axios = require('axios');
const cheerio = require('cheerio');

async function searchDDG(query) {
    console.log(`Searching DDG for: ${query}`);
    try {
        const { data } = await axios.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const links = [];
        $('.result__body').each((i, el) => {
            const a = $(el).find('.result__a');
            const title = a.text();
            const link = a.attr('href');
            console.log(`Found: ${title} -> ${link}`);
            if (title && link) {
                links.push({ title, link });
            }
        });
        return links;
    } catch (e) {
        console.error('Search failed:', e.message);
        return [];
    }
}

searchDDG("Chatbots Magic: Beginner’s Guidebook");
