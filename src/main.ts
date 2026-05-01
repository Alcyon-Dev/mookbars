import nunjucks from "nunjucks";

const title = Deno.env.get("MB_TITLE") ?? "My Bookmarks";

const groupKeys = (Deno.env.get("MB_GROUPS") ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

const groups = groupKeys.map((key) => {
    const groupTitle = Deno.env.get(`MB_GROUP_${key}_TITLE`) ?? key;
    const linkKeys = (Deno.env.get(`MB_GROUP_${key}_LINKS`) ?? "")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

    const links = linkKeys.map((linkKey) => ({
        label: Deno.env.get(`MB_LINK_${linkKey}_LABEL`) ?? linkKey,
        url: Deno.env.get(`MB_LINK_${linkKey}_URL`) ?? "#",
    }));

    return { title: groupTitle, links };
});

const config = { title, groups };

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

console.log("Done, public/index.html written.");
