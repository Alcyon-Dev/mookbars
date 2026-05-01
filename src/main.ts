import nunjucks from "nunjucks";
import { load } from "@std/dotenv";

try {
    await load({ envPath: "../.env", export: true });
} catch {
    // .env not found, continue with environment as-is
}

// Init Nunjucks pointing at templates dir
const env = nunjucks.configure("../template", {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
});

const errors: string[] = [];

const title = Deno.env.get("MB_TITLE") ?? "Mookbars";

const mbGroups = Deno.env.get("MB_GROUPS");
if (!mbGroups?.trim()) {
    errors.push("MB_GROUPS is missing or empty");
}

const groupKeys = (mbGroups ?? "").split(",").map((k) => k.trim()).filter(Boolean);

const groups = groupKeys.map((key) => {
    const groupTitle = Deno.env.get(`MB_GROUP_${key}_TITLE`);
    if (!groupTitle) errors.push(`MB_GROUP_${key}_TITLE is missing`);

    const rawLinks = Deno.env.get(`MB_GROUP_${key}_LINKS`);
    if (!rawLinks?.trim()) {
        errors.push(`MB_GROUP_${key}_LINKS is missing or empty`);
    }

    const linkKeys = (rawLinks ?? "").split(",").map((k) => k.trim()).filter(Boolean);

    const links = linkKeys.map((linkKey) => {
        const label = Deno.env.get(`MB_LINK_${linkKey}_LABEL`);
        if (!label) errors.push(`MB_LINK_${linkKey}_LABEL is missing`);

        const url = Deno.env.get(`MB_LINK_${linkKey}_URL`);
        if (!url) errors.push(`MB_LINK_${linkKey}_URL is missing`);

        return { label: label ?? linkKey, url: url ?? "#" };
    });

    return { title: groupTitle ?? key, links };
});

let output: string;

if (errors.length > 0) {
    const allEnv = Object.entries(Deno.env.toObject())
        .filter(([k]) => k.startsWith("MB_"))
        .sort(([a], [b]) => a.localeCompare(b));

    output = env.render("error.html", { title: "Configuration Error", errors, allEnv });
} else {
    output = env.render("index.html", { title, groups });
}

await Deno.writeTextFile("../public/index.html", output);

console.log("Done, public/index.html written.");
