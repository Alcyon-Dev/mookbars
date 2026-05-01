// TODO

// // Production asset build: minify + hash CSS and JS, write manifest.json
// import esbuild from "esbuild";
// import { createHash } from "crypto";
// import { mkdirSync, writeFileSync } from "fs";

// mkdirSync("dist/assets", { recursive: true });

// function hash(content) {
//   return createHash("sha256").update(content).digest("hex").slice(0, 8);
// }

// const [jsResult, cssResult] = await Promise.all([
//   esbuild.build({
//     entryPoints: ["assets/main.js"],
//     bundle: true,
//     minify: true,
//     write: false,
//     logLevel: "info",
//   }),
//   esbuild.build({
//     entryPoints: ["assets/style.css"],
//     bundle: true,
//     minify: true,
//     write: false,
//     logLevel: "info",
//   }),
// ]);

// const jsContent = jsResult.outputFiles[0].contents;
// const cssContent = cssResult.outputFiles[0].contents;

// const jsName = `main.${hash(jsContent)}.js`;
// const cssName = `style.${hash(cssContent)}.css`;

// writeFileSync(`dist/assets/${jsName}`, jsContent);
// writeFileSync(`dist/assets/${cssName}`, cssContent);

// const manifest = { css: cssName, js: jsName };
// writeFileSync("dist/assets/manifest.json", JSON.stringify(manifest, null, 2) + "\n");

// console.log("built:", manifest);
