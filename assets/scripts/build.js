import esbuild from "esbuild";
import { createHash } from "crypto";
import { mkdirSync, writeFileSync } from "fs";

const outDir = "../../template/assets";
mkdirSync(outDir, { recursive: true });

function hash(content) {
    return createHash("sha256").update(content).digest("hex").slice(0, 8);
}

const [jsResult, cssResult] = await Promise.all([
    esbuild.build({
        entryPoints: ["../scripts.js"],
        bundle: true,
        minify: true,
        write: false,
        logLevel: "info",
    }),
    esbuild.build({
        entryPoints: ["../styles.css"],
        bundle: true,
        minify: true,
        write: false,
        logLevel: "info",
    }),
]);

const jsContent = jsResult.outputFiles[0].contents;
const cssContent = cssResult.outputFiles[0].contents;

const jsName = `scripts.${hash(jsContent)}.js`;
const cssName = `styles.${hash(cssContent)}.css`;

writeFileSync(`${outDir}/${jsName}`, jsContent);
writeFileSync(`${outDir}/${cssName}`, cssContent);

const manifest = { css: cssName, js: jsName };
writeFileSync(`${outDir}/manifest.json`, JSON.stringify(manifest, null, 2) + "\n");

console.log("built:", manifest);
