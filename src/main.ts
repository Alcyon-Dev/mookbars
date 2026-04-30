import nunjucks from "nunjucks";

// Read env vars with fallbacks
const config = {
    title: Deno.env.get("TITLE") ?? "My Page",
    heading: Deno.env.get("HEADING") ?? "Hello World",
    envName: Deno.env.get("ENV_NAME") ?? "development",
    version: Deno.env.get("VERSION") ?? "0.0.1",
};

// Init Nunjucks pointing at templates dir
const env = nunjucks.configure("../template", {
    autoescape: true,   // XSS protection
    trimBlocks: true,   // cleaner output, removes newline after block tags
    lstripBlocks: true, // cleaner output, removes leading whitespace before block tags
});

// Render
const output = env.render("page.html", config);

// Write to file
await Deno.writeTextFile("../public/index.html", output);

console.log("Done — public/index.html written.");