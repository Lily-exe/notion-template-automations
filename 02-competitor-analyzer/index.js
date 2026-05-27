import puppeteer from 'puppeteer';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function scrapeWithBrowser(keyword) {
    const searchUrl = `https://gumroad.com/discover?query=${encodeURIComponent(keyword)}`;
    console.log(`\n🚀 Launching background Chrome browser...`);
    console.log(`🕵️‍♂️ Navigating to Gumroad and searching for "${keyword}"...`);

    const browser = await puppeteer.launch({ 
        headless: true 
    });
    
    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        // Auto-scroll logic for lazy loading
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                let distance = 100;
                let timer = setInterval(() => {
                    let scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if(totalHeight >= scrollHeight || totalHeight >= 1000){
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        const competitors = await page.evaluate(() => {
            const products = [];
            const cards = document.querySelectorAll('article, .discover-product-card, [data-testid="product-card"]');
            
            cards.forEach((card, index) => {
                if (products.length >= 5) return;

                const titleEl = card.querySelector('h3, .product-card-title, [data-testid="product-title"]');
                const priceEl = card.querySelector('.price, [data-price], .price-tag');
                const ratingEl = card.querySelector('.rating, .product-card-rating');
                const linkEl = card.querySelector('a');

                if (titleEl) {
                    products.push({
                        title: titleEl.textContent.trim(),
                        price: priceEl ? priceEl.textContent.trim() : 'Free/Variable',
                        rating: ratingEl ? ratingEl.textContent.trim() : 'No ratings',
                        link: linkEl ? linkEl.href : 'No Link'
                    });
                }
            });
            return products;
        });

        console.log("\n================ GUMROAD LIVE COMPETITOR REPORT ================");
        if (competitors.length === 0) {
            console.log("⚠️ No competitors found on the page.");
            console.log("Tip: Try a slightly broader keyword like 'planner' or 'notion study'.");
        } else {
            competitors.forEach((comp, i) => {
                console.log(`\n${i + 1}. Product: ${comp.title}`);
                console.log(`   Price: ${comp.price}`);
                console.log(`   Rating: ${comp.rating}`);
                console.log(`   Link: ${comp.link}`);
            });
        }
        console.log("================================================================");

    } catch (error) {
        console.error("❌ Scraping failed due to an error:", error.message);
    } finally {
        await browser.close();
        rl.close();
    }
}

rl.question('Enter a Notion Template keyword to check competitors: ', (answer) => {
    if (!answer.trim()) {
        console.log("Keyword cannot be empty.");
        rl.close();
    } else {
        scrapeWithBrowser(answer);
    }
});