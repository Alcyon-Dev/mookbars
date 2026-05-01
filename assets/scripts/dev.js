import { copyFileSync, writeFileSync } from "fs";

const manifest = { css: "styles.css", js: "scripts.js" };
writeFileSync("../../template/assets/manifest.json", JSON.stringify(manifest, null, 2) + "\n");

copyFileSync("../styles.css", "../../template/assets/styles.css");
copyFileSync("../scripts.js", "../../template/assets/scripts.js");
