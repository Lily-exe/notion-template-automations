import axios from 'axios';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function findSEOKeywords(keyword) {
    const url = `http://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(keyword + " notion template")}&hl=en`;
    console.log(`\n🔍 Fetching SEO keywords for "${keyword}"...`);

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        const suggestions = response.data[1];
        console.log("\n================ 🔥 GOOGLE SEO SUGGESTIONS ================");
        
        if (!suggestions || suggestions.length === 0) {
            console.log("⚠️ No keywords found. Try another term.");
        } else {
            suggestions.forEach((suggestion, i) => {
                console.log(`📈 Keyword ${i + 1}: ${suggestion}`);
            });
        }
        console.log("\n==========================================================");

    } catch (error) {
        console.error("❌ Failed:", error.message);
    } finally {
        rl.close();
    }
}

rl.question('Enter keyword (e.g., medical, student): ', (answer) => {
    if (!answer.trim()) {
        console.log("Keyword cannot be empty.");
        rl.close();
    } else {
        findSEOKeywords(answer);
    }
});