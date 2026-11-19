#!/usr/bin/env node
// 字型庫維護工具：依 fonts.yaml 從官方來源下載字型到 <id>/，已存在的檔案略過。
// 字型檔已隨 repo 保存，平常不需執行；只在新增字型或更換版本時使用（換版本會讓 repo 歷史變大，須先確認）。
// 只依賴 Node（js-yaml、adm-zip、xz-decompress、tar-stream），不需要系統工具。
// 用法：node fetch.mjs                 下載全部缺少的字型
//       node fetch.mjs tw-kai-ttf      只下載指定字型
//       node fetch.mjs --list          列出字型、授權、大小、是否齊全
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";
import AdmZip from "adm-zip";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const registry = yaml.load(fs.readFileSync(path.join(DIR, "fonts.yaml"), "utf8"));
const args = process.argv.slice(2);

if (args.includes("--list")) {
  for (const [id, f] of Object.entries(registry)) {
    const ok = f.files.every((n) => fs.existsSync(path.join(DIR, registry[id].path, n)));
    const mb = f.files.reduce((a, n) => a + (fs.existsSync(path.join(DIR, registry[id].path, n)) ? fs.statSync(path.join(DIR, registry[id].path, n)).size : 0), 0) / 1048576;
    console.log(`${ok ? "✓" : "·"} ${id.padEnd(20)} ${String(mb.toFixed(1)).padStart(6)} MB  ${f.name}｜${f.category}｜${f.license}`);
  }
  process.exit(0);
}

async function get(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// .deb 是 ar 封存：依序為檔名(16)…大小(10)、結尾(2)，資料以 2 位元組對齊
function arMember(buf, prefix) {
  let p = 8;
  while (p < buf.length) {
    const name = buf.toString("latin1", p, p + 16).trim().replace(/\/$/, "");
    const size = parseInt(buf.toString("latin1", p + 48, p + 58).trim(), 10);
    if (name.startsWith(prefix)) return { name, data: buf.subarray(p + 60, p + 60 + size) };
    p += 60 + size + (size % 2);
  }
  throw new Error(`deb 中找不到 ${prefix}`);
}

async function untarFile(tarBuf, wanted) {
  const tar = await import("tar-stream");
  const ex = tar.extract();
  let found = null;
  ex.on("entry", (h, stream, next) => {
    const chunks = [];
    stream.on("data", (c) => chunks.push(c));
    stream.on("end", () => { if (h.name.endsWith(wanted)) found = Buffer.concat(chunks); next(); });
  });
  await new Promise((ok, bad) => { ex.on("finish", ok); ex.on("error", bad); ex.end(tarBuf); });
  if (!found) throw new Error(`封存中找不到 ${wanted}`);
  return found;
}

async function unxz(buf) {
  const m = await import("xz-decompress");
  const XzReadableStream = m.XzReadableStream || m.default.XzReadableStream;
  const out = new XzReadableStream(Readable.toWeb(Readable.from(buf)));
  return Buffer.from(await new Response(out).arrayBuffer());
}

const wanted = args.filter((a) => !a.startsWith("--"));
for (const id of wanted.length ? wanted : Object.keys(registry)) {
  const f = registry[id];
  if (!f) { console.error(`未知字型：${id}`); process.exitCode = 1; continue; }
  const dir = path.join(DIR, f.path);
  fs.mkdirSync(dir, { recursive: true });
  if (f.files.every((n) => fs.existsSync(path.join(dir, n)))) { console.log(`✓ ${f.name}（已存在）`); continue; }
  try {
    const d = f.download;
    if (d.zip) {
      const zip = new AdmZip(await get(d.zip));
      for (const e of zip.getEntries()) if (f.files.includes(path.basename(e.entryName))) fs.writeFileSync(path.join(dir, path.basename(e.entryName)), e.getData());
    }
    if (d.deb) {
      const data = arMember(await get(d.deb), "data.tar");
      if (!data.name.endsWith(".xz")) throw new Error(`不支援的壓縮格式：${data.name}`);
      const tarBuf = await unxz(data.data);
      for (const [name, inner] of Object.entries(d.deb_files || {})) fs.writeFileSync(path.join(dir, name), await untarFile(tarBuf, inner));
      if (d.license_path) fs.writeFileSync(path.join(dir, path.basename(d.license_path)), await untarFile(tarBuf, d.license_path));
    }
    for (const [name, url] of Object.entries(d.files || {})) fs.writeFileSync(path.join(dir, name), await get(url));
    if (d["7z"]) {
      // 7-Zip 壓縮檔：以 7zip-bin（npm 套件內附的 7za）解出 files 列的檔案
      const { path7za } = await import("7zip-bin");
      const { execFileSync } = await import("node:child_process");
      fs.chmodSync(path7za, 0o755);
      const tmp = fs.mkdtempSync(path.join(DIR, ".tmp-"));
      try {
        fs.writeFileSync(path.join(tmp, "a.7z"), await get(d["7z"]));
        execFileSync(path7za, ["e", "-y", `-o${tmp}`, path.join(tmp, "a.7z"), ...f.files], { stdio: "ignore" });
        for (const n of f.files) fs.copyFileSync(path.join(tmp, n), path.join(dir, n));
      } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
    }
    if (d.license_url) fs.writeFileSync(path.join(dir, f.license_files[0]), await get(d.license_url));
    if (d.google) {
      // Google Fonts 官方下載清單：static/ 內為固定字重的 TrueType；授權文件（OFL.txt）隨清單提供
      const list = JSON.parse((await get(`https://fonts.google.com/download/list?family=${encodeURIComponent(d.google)}`)).toString("utf8").replace(/^\)\]\}'\n?/, ""));
      const refs = new Map(list.manifest.fileRefs.map((r) => [path.basename(r.filename), r]));
      for (const n of f.files) {
        const r = refs.get(n);
        // 有 static/ 時取固定字重檔；只有單一字重的字型（例：Noto Sans Symbols 2）檔案在最上層。可變字重（VariableFont）一律不取
        if (!r || /VariableFont|\[/.test(r.filename)) throw new Error(`下載清單中沒有固定字重的 ${n}`);
        fs.writeFileSync(path.join(dir, n), await get(r.url));
      }
      for (const lf of list.manifest.files || []) if ((f.license_files || []).includes(lf.filename)) fs.writeFileSync(path.join(dir, lf.filename), lf.contents);
    }
    const missing = f.files.filter((n) => !fs.existsSync(path.join(dir, n)));
    if (missing.length) throw new Error(`下載後仍缺：${missing.join("、")}`);
    console.log(`✓ ${f.name}`);
  } catch (e) { console.error(`✗ ${f.name}：${e.message}`); process.exitCode = 1; }
}
