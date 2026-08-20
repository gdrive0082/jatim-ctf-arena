// Post-build: Vercel menolak menyajikan *.map (403).
// Untuk challenge SOURCEMAP-LEAK, salin map bundle sebagai berkas teks "bocor".
import { cpSync, readdirSync } from "node:fs";
import { join } from "node:path";

const assetsDir = new URL("../dist/assets/", import.meta.url).pathname;
const map = readdirSync(assetsDir).find((f) => f.endsWith(".js.map"));
if (!map) {
  console.warn("[postbuild] tidak ada source map ditemukan");
  process.exit(0);
}
const dest = new URL("../dist/files/leaked-bundle-map.txt", import.meta.url).pathname;
cpSync(join(assetsDir, map), dest);
console.log(`[postbuild] ${map} -> files/leaked-bundle-map.txt`);
