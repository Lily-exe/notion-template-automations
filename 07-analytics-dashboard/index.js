import axios from 'axios';
import dotenv from 'dotenv';

// .env file se variables load karne ke liye
dotenv.config();

// Ab yeh automatic aapki .env file se token utha lega safely
const GUMROAD_ACCESS_TOKEN = process.env.GUMROAD_ACCESS_TOKEN; 

async function fetchLiveAnalytics() {
    if (!GUMROAD_ACCESS_TOKEN || GUMROAD_ACCESS_TOKEN.includes("yahan_apna")) {
        console.log("\n⚠️ Setup Incomplete: Please add your real Gumroad Access Token in the .env file.");
        return; // Yeh return function ke andar hai, toh yeh legal hai!
    }
    
    console.log("\n================ 📊 NOTION AUTOMATION LIVE DASHBOARD ================");
    console.log("🔄 Connecting to Gumroad API and fetching real-time sales...");

    try {
        // ✅ API v2 use kar rahe hain aur access_token sahi tarike se bhej rahe hain
        const response = await axios.get('https://api.gumroad.com/v2/products', {
            params: {
                access_token: GUMROAD_ACCESS_TOKEN
            }
        });

        const products = response.data.products;

        if (!products || products.length === 0) {
            console.log("⚠️ No products found on your Gumroad account yet.");
            return;
        }

        let totalRevenue = 0;
        let totalSalesUnits = 0;
        let bestSeller = null;

        console.log("\n📊 LIVE PRODUCT PERFORMANCE:");
        console.log("------------------------------------------------------------------");

        products.forEach(product => {
            const name = product.name;
            const salesCount = parseInt(product.sales_count) || 0;
            
            // ✅ Gumroad v2 ke cents ko dollar mein badla ($5 = 500 cents)
            const price = parseFloat(product.price) / 100; 
            const productRevenue = salesCount * price;

            totalRevenue += productRevenue;
            totalSalesUnits += salesCount;

            console.log(`📦 ${name}:`);
            console.log(`   Units Sold: ${salesCount} | Price: $${price.toFixed(2)} | Revenue: $${productRevenue.toFixed(2)}`);
            console.log("   ------------------------------------------------");

            if (!bestSeller || productRevenue > (bestSeller.sales_count * (parseFloat(bestSeller.price) / 100))) {
                bestSeller = product;
            }
        });

        console.log("\n================ 🔥 LIVE BUSINESS INSIGHTS ================");
        console.log(`💰 Total Live Revenue  : $${totalRevenue.toFixed(2)}`);
        console.log(`📈 Total Products Sold : ${totalSalesUnits} units`);
        if (bestSeller) {
            console.log(`👑 Current Best Seller : ${bestSeller.name}`);
        }
        console.log("============================================================\n");

    } catch (error) {
        console.log(`\n❌ API Connection Failed: ${error.response?.data?.message || error.message}`);
        console.log("============================================================\n");
    }
}

// Function ko call kiya
fetchLiveAnalytics();