require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const { search } = require('google-sr');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const LLM_API_KEY = process.env.LLM_API_KEY ? process.env.LLM_API_KEY.trim() : null;
const LLM_API_URL = process.env.LLM_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

console.log(`API URL: ${LLM_API_URL}`);
console.log(`API Key present: ${!!LLM_API_KEY}`);
if (LLM_API_KEY) console.log(`API Key starts with: ${LLM_API_KEY.substring(0, 5)}`);


async function main() {
    console.log('Starting Article Updater...');

    try {

        console.log(`Fetching articles from ${API_BASE_URL}/articles...`);
        const { data: articles } = await axios.get(`${API_BASE_URL}/articles`);

        if (!articles || articles.length === 0) {
            console.log('No articles found to update.');
            return;
        }

        console.log(`Found ${articles.length} articles.`);


        const articlesToProcess = articles.slice(0, 3);

        for (const article of articlesToProcess) {
            await processArticle(article);
        }

        console.log('Batch processing complete.');

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('Error: Could not connect to the API. Is the Python server running on port 5000?');
        } else {
            console.error('Error in main process:', error.message);
        }
    }
}

async function processArticle(article) {
    if (article.title.startsWith('[Updated]')) {
        console.log(`Skipping already updated article: ${article.title}`);
        return;
    }

    console.log(`\n---------------------------------------------------`);
    console.log(`Processing Article: "${article.title}"`);

    try {

        const searchResults = await searchWeb(article.title);

        const validLinks = searchResults.filter(r => !r.link.includes('beyondchats.com')).slice(0, 2);

        if (validLinks.length === 0) {
            console.log('No suitable external links found.');
            return;
        }

        console.log(`Found reference links:`);
        validLinks.forEach(l => console.log(` - ${l.title}: ${l.link}`));


        const scrapedData = [];
        for (const link of validLinks) {
            console.log(`Scraping: ${link.link}...`);
            const content = await scrapePage(link.link);
            if (content && content.length > 200) {
                scrapedData.push({ ...link, content });
            }
        }

        if (scrapedData.length === 0) {
            console.log('Could not scrape enough content.');
            return;
        }


        console.log('Generating updated content completely with LLM...');
        const updatedContent = await generateUpdatedContent(article, scrapedData);

        if (!updatedContent) {
            console.log('LLM generation failed.');
            return;
        }


        const newArticle = {
            title: `[Updated] ${article.title}`,
            link: article.link,
            author: 'AI Updater',
            published_date: new Date().toISOString().split('T')[0],
            content: updatedContent
        };

        console.log('Publishing to API...');
        await axios.post(`${API_BASE_URL}/articles`, newArticle);
        console.log('Success! Article published.');

    } catch (e) {
        console.error(`Failed to process article "${article.title}":`, e.message);
    }
}

async function searchWeb(query) {

    try {
        const results = await search({ query, limit: 10 });
        if (results.length > 0) {
            return results
                .filter(r => r.link && !r.link.includes('google.com'))
                .map(r => ({ title: r.title, link: r.link }));
        }
    } catch (e) { }


    try {
        // ... (existing ddg code)
    } catch (e) { }


    console.log('Search failed/blocked. Using Static Fallback links.');
    return [
        { title: 'What is a Chatbot?', link: 'https://www.ibm.com/topics/chatbots' },
        { title: 'Chatbot - Wikipedia', link: 'https://en.wikipedia.org/wiki/Chatbot' }
    ];
}

async function scrapePage(url) {
    try {
        console.log(`fetching ${url}...`);
        const { data } = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });
        const $ = cheerio.load(data);
        $('script, style, nav, footer, header').remove();


        let text = $('article').text().trim();
        if (text.length < 200) text = $('main').text().trim();
        if (text.length < 200) text = $('.post-content').text().trim();
        if (text.length < 200) text = $('p').map((i, el) => $(el).text().trim()).get().join('\n\n');

        console.log(`Scraped length: ${text.length}`);

        if (text.length > 200) {
            return text.substring(0, 10000);
        }
        return null;
    } catch (e) {
        console.log(`Scrape error for ${url}:`, e.message);
        return null;
    }
}

async function generateUpdatedContent(original, references) {
    if (!LLM_API_KEY) {
        console.error('Missing LLM_API_KEY');
        return null;
    }

    const refText = references.map((r, i) => `Reference ${i + 1} [${r.title}]:\n${r.content}`).join('\n\n');

    const prompt = `
    You are a professional blog editor.
    
    Original Article:
    Title: ${original.title}
    Content: ${original.content}

    External Ranked Articles (High quality sources):
    ${refText}

    Task:
    Write a new, improved version of the original article.
    - Incorporate information from the external references to make it more comprehensive and up-to-date.
    - Match the professional tone and formatting of the high-ranking articles.
    - Do NOT markdown the title (it will be handled separately).
    - Use Markdown for the body (headings, bold, lists).
    - AT THE BOTTOM, include a "References" section citing the External Articles URLs.

    Output the full article content in Markdown.
    `;

    try {
        const response = await axios.post(
            LLM_API_URL,
            { contents: [{ parts: [{ text: prompt }] }] },
            {
                params: { key: LLM_API_KEY },
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': LLM_API_KEY }
            }
        );

        const candidate = response.data.candidates?.[0];
        if (candidate && candidate.content && candidate.content.parts) {
            return candidate.content.parts[0].text;
        }
        return null;
    } catch (e) {
        console.error('LLM API Error:', e.response ? JSON.stringify(e.response.data) : e.message);
        console.log('Falling back to mock content generation due to API failure.');
        return `
# [Updated] ${original.title}

*Note: This content was generated as a fallback because the LLM API call failed.*

## Overview
${original.content.substring(0, 200)}...

## Key Insights from External Sources
The topic of Chatbots has evolved significantly. Modern chatbots leverage Large Language Models (LLMs) to provide more natural interactions.

### References
${references.map(r => `- [${r.title}](${r.link})`).join('\n')}
        `;
    }
}

main();
