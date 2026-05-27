import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function calculatePricing(basePrice) {
    const price = parseFloat(basePrice);
    
    if (isNaN(price) || price <= 0) {
        console.log("❌ Please enter a valid number greater than 0.");
        rl.close();
        return;
    }

    console.log("\n================ 💰 NOTION TEMPLATE PRICING TIERS ================");
    console.log(`🎯 Base Estimated Value: $${price.toFixed(2)}`);
    console.log("------------------------------------------------------------------");
    console.log(`🟢 Tier 1: Tripwire / Entry Level (Low Friction): $${(price * 0.4).toFixed(2)} - $${(price * 0.6).toFixed(2)}`);
    console.log(`🔵 Tier 2: Sweet Spot (Standard Launch Price):    $${(price * 0.8).toFixed(2)} - $${price.toFixed(2)}`);
    console.log(`🔥 Tier 3: Premium Bundle (With Video/Guide):    $${(price * 1.5).toFixed(2)} - $${(price * 2.0).toFixed(2)}`);
    console.log("==================================================================");
    
    rl.close();
}

rl.question('Enter your template\'s estimated base value in USD (e.g., 15, 29): ', (answer) => {
    calculatePricing(answer);
});