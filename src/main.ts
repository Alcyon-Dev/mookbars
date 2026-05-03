import nunjucks from "nunjucks";
import { load } from "@std/dotenv";
import { version as rawVersion } from "./version.ts";

try {
    await load({ envPath: "../.env", export: true });
} catch {
    // .env not found, continue with environment as-is
}

let assets: { css?: string; js?: string } = {};
try {
    assets = JSON.parse(await Deno.readTextFile("../template/assets/manifest.json"));
    await Promise.all(
        Object.values(assets).map((file) =>
            Deno.copyFile(`../template/assets/${file}`, `../public/${file}`)
        ),
    );
} catch {
    // no manifest, skip asset injection
}

const version = /^[0-9a-f]+$/.test(rawVersion)
    ? `#${rawVersion}`
    : rawVersion;

const env = nunjucks.configure("../template", {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
});
env.addGlobal("version", version);
env.addGlobal("assets", assets);
env.addGlobal("noHeader", Deno.env.get("MB_NO_HEADER") === "true");
env.addGlobal("noFooter", Deno.env.get("MB_NO_FOOTER") === "true");

await Deno.writeTextFile("../public/index.html", env.render("working.html", {}));

const demo = Deno.env.get("MB_DEMO") === "true";

let output: string;

if (demo) {
    const demoGroups = [
        {
            title: "Mookbars",
            icon: "fa7-solid:bookmark",
            links: [
                { label: "GitHub", url: "https://github.com/alcyon-dev/mookbars", icon: "fa7-brands:github" },
                { label: "Docker Hub", url: "https://hub.docker.com/r/alcyondev/mookbars", icon: "fa7-brands:docker" },
            ],
        },
        {
            title: "Database",
            icon: "fa7-solid:database",
            links: [
                { label: "PgAdmin", url: "https://pgadmin.example.com", icon: "fa7-brands:postgresql" },
                { label: "DbGate", url: "https://dbgate.example.com", icon: "fa7-solid:torii-gate" },
            ],
        },
        {
            title: "Tools",
            icon: "fa7-solid:screwdriver-wrench",
            links: [
                { label: "Console", url: "https://console.example.com", icon: "fa7-solid:terminal" },
            ],
        },
        {
            title: "Sites",
            icon: "fa7-solid:globe",
            links: [
                { label: "AWS", url: "https://aws.amazon.com", icon: "fa7-brands:aws" },
                { label: "Google", url: "https://google.com", icon: "fa7-brands:google" },
            ],
        },
    ];
    output = env.render("content.html", { title: "🔖 Mookbars", groups: demoGroups, demo: true });
} else {
    const delay = Number(Deno.env.get("MB_DELAY") ?? 0);
    if (delay > 0) {
        console.log(`MB_DELAY set, waiting ${delay}s…`);
        await new Promise((r) => setTimeout(r, delay * 1000));
    }

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

            const icon = Deno.env.get(`MB_LINK_${linkKey}_ICON`) ?? null;

            return { label: label ?? linkKey, url: url ?? "#", icon };
        });

        const icon = Deno.env.get(`MB_GROUP_${key}_ICON`) ?? null;

        return { title: groupTitle ?? key, links, icon };
    });

    if (errors.length > 0) {
        const allEnv = Object.entries(Deno.env.toObject())
            .filter(([k]) => k.startsWith("MB_"))
            .sort(([a], [b]) => a.localeCompare(b));

        output = env.render("error.html", { title: "Configuration Error", errors, allEnv });
    } else {
        output = env.render("content.html", { title, groups });
    }
}

await Promise.all([
    Deno.writeTextFile("../public/index.html", output),
    Deno.writeTextFile("../public/missing.html", env.render("missing.html", {})),
]);

console.log("Done, public/index.html written.");
