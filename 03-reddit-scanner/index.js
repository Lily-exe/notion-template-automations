import axios from 'axios';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function scanRedditNoAPI(keyword) {
    const url = `https://www.reddit.com/r/Notion/search.json?q=${encodeURIComponent(keyword)}&restrict_sr=1&sort=relevance`;
    
    console.log(`\n🚀 Scanning r/Notion directly via feed for "${keyword}"...`);

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const posts = response.data.data.children;

        console.log("\n================ REDDIT PAIN POINTS FOUND ================");
        if (!posts || posts.length === 0) {
            console.log("⚠️ No posts found for this keyword.");
        } else {
            const topPosts = posts.slice(0, 5);
            topPosts.forEach((item, i) => {
                const post = item.data;
                let bodyText = post.selftext ? post.selftext.replace(/\n/g, ' ') : "";
                let contextSnippet = "[Keyword found in Title, not in description]";

                if (bodyText) {
                    // Keyword ko description mein dhoondo (Case-insensitive)
                    const lowerBody = bodyText.toLowerCase();
                    const lowerKeyword = keyword.toLowerCase();
                    const matchIndex = lowerBody.indexOf(lowerKeyword);

                    if (matchIndex !== -1) {
                        // Keyword jahan mila, uske 60 words pehle aur baad ka hissa kaat lo
                        const start = Math.max(0, matchIndex - 60);
                        const end = Math.min(bodyText.length, matchIndex + keyword.length + 60);
                        
                        contextSnippet = (start > 0 ? "..." : "") + 
                                         bodyText.substring(start, end) + 
                                         (end < bodyText.length ? "..." : "");
                    }
                } else if (!post.selftext) {
                    contextSnippet = "[No text / Image only]";
                }

                console.log(`\n📌 Post ${i + 1}: ${post.title}`);
                console.log(`   👍 Ups: ${post.ups} | 💬 Comments: ${post.num_comments}`);
                console.log(`   🔗 Link: https://www.reddit.com${post.permalink}`);
                // Nayi line jo exact context batayegi!
                console.log(`   🎯 Match Context: "${contextSnippet}"`);
            });
        }
        console.log("\n==========================================================");

    } catch (error) {
        console.error("❌ Scan failed:", error.message);
    } finally {
        rl.close();
    }
}

rl.question('Enter keyword to scan on r/Notion (e.g., research planner): ', (answer) => {
    if (!answer.trim()) {
        console.log("Keyword cannot be empty.");
        rl.close();
    } else {
        scanRedditNoAPI(answer);
    }
});