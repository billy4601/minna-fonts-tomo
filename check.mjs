#!/usr/bin/env node
// 收錄檢查：每個字型檔都必須是 TrueType（glyf）、固定字重（沒有 fvar）、小於 GitHub 單檔上限 100 MiB，
// 且附授權文件。Chromium 產生 PDF 時，CFF（OTF）與可變字重字型會被存成 Type 3，所以一律不收。
// 用法：node check.mjs        檢查全部；有錯誤時結束代碼為 1
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const registry = yaml.load(fs.readFileSync(path.join(DIR, "fonts.yaml"), "utf8"));
const MiB = 1048576;
let errors = 0, warnings = 0;
const bad = (m) => { errors++; console.log(`  ✗ ${m}`); };
const warn = (m) => { warnings++; console.log(`  ! ${m}`); };

function tables(file) {
  const fd = fs.openSync(file, "r");
  const head = Buffer.alloc(12); fs.readSync(fd, head, 0, 12, 0);
  const n = head.readUInt16BE(4);
  const dir = Buffer.alloc(16 * n); fs.readSync(fd, dir, 0, dir.length, 12);
  fs.closeSync(fd);
  return { version: head.readUInt32BE(0), tags: Array.from({ length: n }, (_, i) => dir.toString("latin1", i * 16, i * 16 + 4)) };
}

for (const [id, f] of Object.entries(registry)) {
  console.log(`${id}`);
  if (!id.endsWith("-ttf")) bad("id 須以 -ttf 結尾");
  const CAT = { 楷書: "kai", 明體: "serif", 黑體: "sans", 等寬: "mono", 西文: "latin", 符號: "symbols" };
  if (f.path !== `${CAT[f.category]}/${id}`) bad(`path 須為 ${CAT[f.category] || "（未知類別）"}/${id}（依類別分資料夾）`);
  for (const n of f.files) {
    const p = path.join(DIR, f.path, n);
    if (!fs.existsSync(p)) { bad(`缺少 ${n}`); continue; }
    const size = fs.statSync(p).size;
    const { version, tags } = tables(p);
    if (version !== 0x00010000 || !tags.includes("glyf")) bad(`${n} 不是 TrueType（glyf）`);
    if (tags.includes("CFF ") || tags.includes("CFF2")) bad(`${n} 含 CFF 外框`);
    if (tags.includes("fvar")) bad(`${n} 是可變字重字型`);
    if (size >= 100 * MiB) bad(`${n} ${(size / MiB).toFixed(1)} MiB，超過 GitHub 單檔上限 100 MiB`);
    else if (size >= 50 * MiB) warn(`${n} ${(size / MiB).toFixed(1)} MiB，超過 50 MiB（GitHub 會警告，仍可推送）`);
  }
  for (const [n, v] of Object.entries(f.faces || {})) {
    if (!f.files.includes(n)) bad(`faces 列了不在 files 中的 ${n}`);
    if (!/^[1-9]00( italic)?$/.test(v)) bad(`faces 的 ${n} 值「${v}」須為「字重」或「字重 italic」`);
  }
  for (const n of f.license_files || []) if (!fs.existsSync(path.join(DIR, f.path, n))) bad(`缺少授權文件 ${n}`);
  if (!(f.license_files || []).length) bad("未列授權文件");
}
console.log(`\n${errors} 錯誤、${warnings} 提醒`);
process.exit(errors ? 1 : 0);
