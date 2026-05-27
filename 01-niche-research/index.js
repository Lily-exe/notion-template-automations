import axios from 'axios';
import dotenv from 'dotenv';
import readline from 'readline';
import googleTrends from 'google-trends-api';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function analyzeNiche(keyword) {
    if (!API_KEY) {
        console.log("❌ ERROR: API Key read nahi ho rahi! .env file check karo.");
        rl.close();
        return;
    }

    console.log(`\n📊 Fetching REAL live data from Google Trends for "${keyword}"...`);
    let trendSummary = "No sufficient search volume data available for this exact keyword on Google Trends. (It might be too specific or niche).";

    try {
        // Google Trends se interest over time nikaal rahe hain
        const trendsResult = await googleTrends.interestOverTime({ keyword: keyword });
        const parsedData = JSON.parse(trendsResult);
        const timeline = parsedData.default.timelineData;

        if (timeline && timeline.length > 0) {
            // Aakhri 6 data points (months/weeks) nikaal kar format kar rahe hain
            const recentData = timeline.slice(-6).map(item => `${item.formattedTime}: Score ${item.value[0]}`).join(' | ');
            trendSummary = `Real Google Trends Data (Recent Scores out of 100): ${recentData}`;
            console.log(`✅ Google Trends Data successfully captured!`);
        } else {
            console.log(`⚠️ Very low search volume on Google Trends for this exact keyword. AI will rely on market context.`);
        }
    } catch (error) {
        console.log(`⚠️ Could not fetch Google Trends data. AI will rely on market context.`);
    }

    console.log(`🔍 Generating Final Market Report... Please wait a moment.`);
    
    // Prompt mein hum explicitly Google Trends ka data AI ko de rahe hain
    const prompt = `You are an expert market researcher for Notion templates. Analyze the following niche or keyword: "${keyword}".
    
    Here is the REAL LIVE Google Trends data I just fetched for this keyword: 
    "${trendSummary}"
    
    Provide a detailed, practical report in clean text format with the following sections:
    1. Real Market Demand (Analyze the Google Trends data I provided. Is the score high, low, growing, or dead? What does this mean for selling a Notion template?)
    2. Top 3 Specific Pain Points target audience faces
    3. Monetization Potential & Suggested Pricing Strategy (in USD)
    4. 3 Unique feature ideas to stand out from competitors.
    Keep the tone highly actionable and clear.`;

    try {
        const response = await axios.post(URL, {
            contents: [{
                parts: [{ text: prompt }]
            }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const resultText = response.data.candidates[0].content.parts[0].text;
        console.log("\n================ MARKET RESEARCH REPORT ================");
        console.log(resultText);
        console.log("========================================================");

    } catch (error) {
        console.error("❌ Error occurred:", error.response ? error.response.data : error.message);
    } finally {
        rl.close();
    }
}

rl.question('Which Notion Template niche would you like to research? : ', (answer) => {
    if (!answer.trim()) {
        console.log("Input cannot be empty. Please enter a valid keyword.");
        rl.close();
    } else {
        analyzeNiche(answer);
    }
});