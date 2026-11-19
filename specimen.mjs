#!/usr/bin/env node
// 樣張與內嵌測試：
//   specimens/<id>.png   每個字型（各字重）的樣張；specimens/all.png 全部並列
//   另以 Chrome 輸出一份含所有字型、字重的 PDF（暫存，不保存），確認全部為一般內嵌、沒有 Type 3
// 用法：node specimen.mjs [id ...]      需要 Chrome／Chromium（自動尋找，或以 CHROME_PATH 指定）
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const registry = yaml.load(fs.readFileSync(path.join(DIR, "fonts.yaml"), "utf8"));
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(registry);

function findChrome() {
  const c = [process.env.CHROME_PATH, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium", "/usr/bin/google-chrome", "/usr/bin/chromium"];
  for (const d of [process.env.PLAYWRIGHT_BROWSERS_PATH, "/opt/pw-browsers"].filter(Boolean)) {
    if (fs.existsSync(d)) for (const s of fs.readdirSync(d).filter((x) => /^chromium-\d+$/.test(x))) c.push(path.join(d, s, "chrome-linux", "chrome"));
  }
  const hit = c.find((p) => p && fs.existsSync(p));
  if (!hit) throw new Error("找不到 Chrome／Chromium，請以 CHROME_PATH 指定");
  return hit;
}

// 樣句依語言：標題、內文、易混字形
const SAMPLE = {
  "zh-TW": ["小型企業創新研發計畫", "本計畫預計於 116 年 8 月至 117 年 9 月（共 14 個月）完成，總經費 5,772 千元。", "為爲 裡裏 峰 群 衛 溫 強 說 戶 臺灣 ○○○ 「引號」（括號）、，。：；"],
  "zh-CN": ["中小企业创新研发计划", "本计划预计于 2027 年 8 月至 2028 年 9 月（共 14 个月）完成，总经费 5,772 千元。", "为 里 峰 群 卫 温 强 说 户 「引号」（括号）、，。：；"],
  ja: ["中小企業技術革新研究計画", "本計画は 2027 年 8 月から 2028 年 9 月（14 か月）に実施し、総予算は 5,772 千円です。", "あいうえお アイウエオ 漢字 「引用」（括弧）、。"],
  ko: ["중소기업 혁신 연구개발 계획", "본 계획은 2027년 8월부터 2028년 9월까지(14개월) 수행하며 총예산은 5,772천 원입니다.", "가나다라 마바사 아자차 「인용」(괄호)"],
  und: ["✓ ✗ ✔ ✘ ☐ ☑ ☒ ★ ☆ ◆ ◇ ⬛ ⬜", "➔ ⬆ ⬇ ⮕ ▲ △ ▶ ◀ ⏏ ⏵ ⏸ ⏹ ⏺", "♠ ♥ ♦ ♣ ⚠ ● ○ ⬤ ◯ ⠁⠃⠉"],
  sym: ["⚐ ⚑ ⓵ ⓶ ⓷ ⓸ ⓹ ☽ ♁ ♃ ♄", "⌀ ⌂ ⌈ ⌉ ⌊ ⌋ ⌒ ⌬ ⍼ ⎀ ⎁ ⎂", "⏚ ⏛ ☊ ☋ ☌ ☍ ← ↑ → ↓ ↔ ↕"],
  en: ["Small Business Innovation Research", "Phase 2 project, 14 months (2027-08 to 2028-09), total budget NT$5,772 thousand.", "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 (),.;:%&@"],
};
const faces = (id) => {
  const f = registry[id];
  const list = f.faces ? Object.entries(f.faces) : [[f.files[0], "400"]];
  return list.map(([file, w]) => ({ family: `F-${id}-${w.replace(" ", "-")}`, file: path.join(DIR, registry[id].path, file), w, italic: w.includes("italic") }));
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const block = (id) => {
  const f = registry[id]; const [t, b, g] = SAMPLE[f.languages?.[0]] || SAMPLE.en;
  const rows = faces(id).map((x) => `<div class="w" style="font-family:'${x.family}'"><span class="wl">${x.w.replace(" italic", "i")}</span>${esc(x.italic ? b.split("，")[0] : t)}</div>`).join("");
  return `<section><div class="meta">${esc(f.name)}　<code>${id}</code>　｜　${esc(f.category)}　｜　${esc(f.license)}</div>${rows}
    <div class="b" style="font-family:'${faces(id)[0].family}'">${esc(b)}</div><div class="g" style="font-family:'${faces(id)[0].family}'">${esc(g)}</div></section>`;
};
// 說明文字也只用本庫字型（Liberation Sans＋Noto Sans TC），不讀系統字型
const LABEL = `"F-liberation-sans-ttf-400","F-noto-sans-tc-ttf-400"`;
const css = (list) => [...new Set([...list, "liberation-sans-ttf", "noto-sans-tc-ttf"])].flatMap(faces).map((x) => `@font-face{font-family:"${x.family}";src:url("file://${x.file}")}`).join("") +
  `body{margin:0;background:#fff;color:#000}section{padding:16px 28px;border-bottom:1px solid #ddd;width:844px}
  .meta{font:13px ${LABEL};color:#555;margin-bottom:6px}code{font-family:${LABEL};background:#f2f2f2;padding:0 4px}.w{font-size:26px;line-height:1.35}
  .wl{display:inline-block;width:44px;font:12px ${LABEL};color:#888}.b{font-size:17px;line-height:1.7;margin-top:6px}.g{font-size:21px;margin-top:4px;letter-spacing:1px}`;

const ready = ids.filter((id) => registry[id] && registry[id].files.every((n) => fs.existsSync(path.join(DIR, registry[id].path, n))));
for (const id of ids) if (!ready.includes(id)) console.error(`略過 ${id}：字型檔不存在`);

const { default: puppeteer } = await import("puppeteer-core");
const browser = await puppeteer.launch({ executablePath: findChrome(), args: ["--no-sandbox", "--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.setViewport({ width: 900, height: 400, deviceScaleFactor: 2 });
fs.mkdirSync(path.join(DIR, "specimens"), { recursive: true });
const host = path.join(DIR, "specimens", "_page.html");
async function load(list) {
  fs.writeFileSync(host, `<!doctype html><html><head><meta charset="utf-8"><style>${css(list)}</style></head><body>${list.map(block).join("")}</body></html>`);
  await page.goto(`file://${host}`);
  await page.evaluate(async () => { await document.fonts.ready; });
}
for (const id of ready) {
  await load([id]);
  await (await page.$("body")).screenshot({ path: path.join(DIR, "specimens", `${id}.png`) });
  console.log(`✓ specimens/${id}.png`);
}
if (ready.length > 1) {
  await load(ready);
  await (await page.$("body")).screenshot({ path: path.join(DIR, "specimens", "all.png") });
  console.log("✓ specimens/all.png");
}

// 內嵌測試：所有字型、字重輸出一份 PDF，檢查字型類型
await load(ready);
const pdfPath = path.join(os.tmpdir(), `fonts-tomo-embed-${process.pid}.pdf`);
await page.pdf({ path: pdfPath });
await browser.close();
fs.rmSync(host, { force: true });
const { PDFDocument, PDFName, PDFDict } = await import("pdf-lib");
const pdf = await PDFDocument.load(fs.readFileSync(pdfPath));
const types = {};
for (const p of pdf.getPages()) {
  const fonts = p.node.Resources()?.lookup(PDFName.of("Font"), PDFDict);
  for (const k of fonts?.keys() || []) {
    const d = fonts.lookup(k, PDFDict);
    const name = String(d.get(PDFName.of("BaseFont")) || "").replace(/^\/[A-Z]{6}\+/, "");
    const t = String(d.get(PDFName.of("Subtype")));
    (types[t] ||= new Set()).add(name);
  }
}
fs.rmSync(pdfPath, { force: true });
for (const [t, names] of Object.entries(types)) console.log(`${t}：${[...names].sort().join("、")}`);
if (types["/Type3"]) { console.error("✗ 有字型被存成 Type 3"); process.exit(1); }
console.log("✓ 內嵌測試：沒有 Type 3");
