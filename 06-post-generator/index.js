import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function generatePosts(templateName) {
    if (!templateName.trim()) {
        console.log("❌ Template name cannot be empty.");
        rl.close();
        return;
    }

    console.log("\n================ 🚀 GENERATING SOCIAL MEDIA POSTS ================");
    console.log(`🎯 Product: ${templateName} Notion Template`);
    console.log("==================================================================\n");

    // Hook 1: The Pain Point + Solution (Great for Twitter/X)
    console.log("🔥 OPTION 1: The Pain-Point Solver (Twitter/X)");
    console.log(`"Stop wasting hours organizing your life/studies manually. 🛑\n\nI built the ultimate ${templateName} Notion Template to help you structure everything in just 5 minutes a day.\n\nDM 'READY' or check the link below to get it today! 👇"`);
    console.log("\n------------------------------------------------------------------");

    // Hook 2: The Minimalist/Aesthetic Vibe
    console.log("\n✨ OPTION 2: The Aesthetic/Minimalist Promo");
    console.log(`"Clean spaces = Clean mind. 🧠\n\nHere’s a sneak peek of my new ${templateName} Notion Dashboard. Built for consistency, minimal friction, and dark-mode aesthetic lovers.\n\nGrab your copy here: [Your Gumroad Link]"`);
    console.log("\n------------------------------------------------------------------");

    // Hook 3: Value First (Great for LinkedIn)
    console.log("\n📈 OPTION 3: The Value-Driven Post (LinkedIn)");
    console.log(`"Most productivity systems fail because they are too complex to maintain.\n\nThat’s why I spent weeks designing the ${templateName} Notion Template. It’s simple, actionable, and cuts out the noise.\n\nWhat's inside:\n✅ Quick-capture dashboard\n✅ Automated tracking\n✅ Weekly review system\n\nDrop a comment if you want the launch discount code! 🚀"`);
    console.log("\n==================================================================");

    rl.close();
}

rl.question('Enter your template name (e.g., Medical Student Dashboard, Aesthetic Planner): ', (answer) => {
    generatePosts(answer);
});