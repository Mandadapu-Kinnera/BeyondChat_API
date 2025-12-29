const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeGoogle(query) {
    try {
        const { data } = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });



        const $ = cheerio.load(data);
        const links = [];


        $('a').each((i, el) => {
            const h3 = $(el).find('h3');
            if (h3.length > 0) {
                const title = h3.text();
                const link = $(el).attr('href');

                if (link && link.startsWith('/url?q=')) {
                    links.push({ title, link: link.split('/url?q=')[1].split('&')[0] });
                }
            }
        });
        console.log(links);
    } catch (e) {
        console.error(e.message);
    }
}

scrapeGoogle('Chatbots Magic: Beginner’s Guidebook');
