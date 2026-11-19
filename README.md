# minna-fonts-tomo

適用於建立文件及其元件（例：表格、圖表）之字型庫，收錄授權允許散布之 TrueType 固定字重字型，作為官方來源之鏡像，供其他專案或 AI 代理存取（例：minna-figure-table-tomo）。工具不讀電腦上安裝的字型，一律從這裡取得固定版本的字型，所以雲端與任何電腦產出的 PDF 及圖片相同。

公開 repo。各字型依其本身授權散布（見各資料夾內的授權文件及下表）；維護用之程式（`*.mjs`）以 MIT 授權釋出，見 [`LICENSE`](LICENSE)。

![字型樣張](specimens/all.png)

## 收錄字型

| id | 名稱 | 類別 | 語言 | 字重 | 授權 | 大小 |
|---|---|---|---|---|---|---|
| `tw-kai-ttf` | 全字庫正楷體 | 楷書（代替標楷體） | 繁中 | 一般（含擴充 B、Plus） | 政府資料開放授權條款第 1 版 | 104 MB |
| `tw-sung-ttf` | 全字庫正宋體 | 明體（代替新細明體） | 繁中 | 一般（含擴充 B、Plus） | 政府資料開放授權條款第 1 版 | 116 MB |
| `noto-sans-tc-ttf` | Noto Sans TC（思源黑體） | 黑體 | 繁中 | 400／500／700／900 | SIL OFL 1.1 | 27 MB |
| `noto-sans-sc-ttf` | Noto Sans SC | 黑體 | 簡中 | 400／500／700／900 | SIL OFL 1.1 | 40 MB |
| `noto-sans-jp-ttf` | Noto Sans JP | 黑體 | 日文 | 400／500／700／900 | SIL OFL 1.1 | 22 MB |
| `noto-sans-kr-ttf` | Noto Sans KR | 黑體 | 韓文 | 400／500／700／900 | SIL OFL 1.1 | 24 MB |
| `noto-serif-tc-ttf` | Noto Serif TC（思源宋體） | 明體 | 繁中 | 400／700 | SIL OFL 1.1 | 19 MB |
| `noto-serif-sc-ttf` | Noto Serif SC | 明體 | 簡中 | 400／700 | SIL OFL 1.1 | 28 MB |
| `noto-serif-jp-ttf` | Noto Serif JP | 明體 | 日文 | 400／700 | SIL OFL 1.1 | 15 MB |
| `noto-serif-kr-ttf` | Noto Serif KR | 明體 | 韓文 | 400／700 | SIL OFL 1.1 | 27 MB |
| `liberation-serif-ttf` | Liberation Serif | 西文（代替 Times New Roman，字寬相同） | 英文 | 一般／斜／粗／粗斜 | SIL OFL 1.1 | 1.4 MB |
| `liberation-sans-ttf` | Liberation Sans | 西文（代替 Arial，字寬相同） | 英文 | 一般／斜／粗／粗斜 | SIL OFL 1.1 | 1.6 MB |
| `liberation-mono-ttf` | Liberation Mono | 西文（代替 Courier New，字寬相同） | 英文 | 一般／斜／粗／粗斜 | SIL OFL 1.1 | 1.1 MB |
| `carlito-ttf` | Carlito | 西文（代替 Calibri，字寬相同） | 英文 | 一般／斜／粗／粗斜 | SIL OFL 1.1 | 2.6 MB |
| `caladea-ttf` | Caladea | 西文（代替 Cambria，字寬相同） | 英文 | 一般／斜／粗／粗斜 | SIL OFL 1.1 | 0.3 MB |
| `noto-sans-ttf` | Noto Sans | 西文（Noto 黑體系列的斜體、粗斜體） | 英文 | 一般／斜／粗／粗斜 | SIL OFL 1.1 | 2.4 MB |
| `noto-serif-ttf` | Noto Serif | 西文（Noto 明體系列的斜體、粗斜體） | 英文 | 一般／斜／粗／粗斜 | SIL OFL 1.1 | 2.0 MB |
| `noto-sans-mono-ttf` | Noto Sans Mono | 等寬（程式碼） | 英文 | 400／700 | SIL OFL 1.1 | 0.8 MB |
| `sarasa-mono-tc-ttf` | 更紗黑體 Mono TC | 等寬中文（一個中文字＝兩個英數字寬） | 繁中 | 400／700 | SIL OFL 1.1 | 27 MB |
| `noto-sans-symbols2-ttf` | Noto Sans Symbols 2 | 符號、幾何圖形（✓ ✗ ☑ ☒ ■ □ ▲ ● ★ 箭頭） | — | 一般 | SIL OFL 1.1 | 1.2 MB |
| `noto-sans-symbols-ttf` | Noto Sans Symbols | 符號（⚐ ⚑ ⓵ ⓶、技術符號等，與上者互補） | — | 一般 | SIL OFL 1.1 | 0.2 MB |

合計約 467 MB。詳細欄位（外觀、適用場合、來源、版本、下載方式）見 [`fonts.yaml`](fonts.yaml)。

## 資料夾

依字型類別分資料夾，資料夾名稱用英文（中文路徑在網址、指令與 macOS／Linux 間容易出問題）：

```text
kai/       楷書：tw-kai-ttf
serif/     明體：tw-sung-ttf、noto-serif-tc／sc／jp／kr-ttf
sans/      黑體：noto-sans-tc／sc／jp／kr-ttf
mono/      等寬（程式碼等特殊用途）：sarasa-mono-tc-ttf、noto-sans-mono-ttf
latin/     西文：liberation-serif／sans／mono-ttf、carlito-ttf、caladea-ttf、noto-sans-ttf、noto-serif-ttf
symbols/   符號：noto-sans-symbols-ttf、noto-sans-symbols2-ttf
specimens/ 樣張（每個字型一張，all.png 為總覽）
```

- 每個字型一個資料夾，名稱即 id（結尾 `-ttf` 表示 TrueType），內含官方原始檔名的字型檔與授權文件。
- 字型的位置記在 `fonts.yaml` 的 `path`（例：`kai/tw-kai-ttf`）；工具只寫 id，由 `path` 找資料夾。
- 類別以 `fonts.yaml` 的 `category` 為準，每個字型只屬於一類；`node check.mjs` 會檢查 `path` 與類別一致。

## 收錄條件

1. **TrueType（glyf 外框）、固定字重**。OTF（CFF 外框）與可變字重字型，在 Chromium／Vivliostyle 產生 PDF 時會被存成 Type 3（實測：Mac 內建的標楷體、Noto Sans CJK 的 OTF 版、Google Fonts 的 Noto 可變字重版皆是），文字難以選取複製、檔案暴增。
2. 授權允許商用、嵌入 PDF、隨 repo 散布。
3. 原樣保存：不修改字形、不轉換格式。Noto 取自 Google Fonts 官方下載清單內的固定字重檔；更紗黑體取自官方發行版的未微調（unhinted）TrueType（微調只影響螢幕小字，不影響 PDF 與列印）。

不收：可變字重、彩色 emoji（Chrome 會轉成點陣圖或 Type 3）、沒有 TrueType 版本的字型（例：Noto Sans Mono CJK）。
4. 單一檔案小於 GitHub 上限 100 MiB（`TW-Sung-Ext-B-98_1.ttf` 64 MiB，超過 50 MiB 時 GitHub 只會警告）。

`node check.mjs` 逐檔檢查 1、4 與授權文件；`node specimen.mjs` 實際以 Chrome 輸出 PDF，確認全部為一般內嵌（Type0）、沒有 Type 3。

## 工具如何取用

工具 repo 不保存字型，依**提交編號**只取自己用到的字型資料夾（Git 的部分 clone ＋ sparse checkout），不必下載整個字型庫：

```sh
git init fonts && cd fonts
git remote add origin https://github.com/billy4601/minna-fonts-tomo.git
git sparse-checkout set --no-cone fonts.yaml        # 先取 fonts.yaml，查出各字型的 path
git fetch --depth 1 --filter=blob:none origin <提交編號> && git checkout FETCH_HEAD
git sparse-checkout set --no-cone fonts.yaml kai/tw-kai-ttf/ latin/liberation-serif-ttf/
```

- 以提交編號固定版本（提交編號不會變；雲端的 GitHub 代理不允許建立標籤）。工具 repo 在自己的設定中寫明提交編號，舊文件用舊編號即可重新產生相同的 PDF。版本名稱 `vYYMMDD` 寫在工具的設定中供辨識。
- 字型路徑：`<path>/<files 內的檔名>`；`faces` 列出各字重、字體（`"400"`、`"700 italic"`），未列在 `faces` 的檔案依序作為補字（全字庫的擴充區）。

## 維護

```sh
npm install
node fetch.mjs --list     # 列出字型、大小、授權、是否齊全
node check.mjs            # 收錄檢查
node specimen.mjs         # 重新產生樣張並做內嵌測試（需要 Chrome）
node fetch.mjs <id>       # 從官方來源下載（新增字型時）
```

### 新增或更換字型：會讓 repo 歷史永久變大

Git 會永久保存每一份提交過的字型檔，換版本後舊檔仍留在歷史中（字型檔已壓縮，無法只存差異）。因此：

- 新增或更換字型前，先列出會增加的大小，經維護者確認後才提交。
- 新增字型：在 `fonts.yaml` 加一筆 → `node fetch.mjs <id>` → `node check.mjs` → `node specimen.mjs <id>`，檢查「為、戶、裡」等易混字形 → 更新本檔表格 → 打新版本標籤。
- 只改程式、文件，或字型改名、搬移（內容不變），歷史不會變大。
- 需要清理歷史（改寫歷史＋強制推送）時，安排在沒有未合併 PR 的時候，並通知所有副本重新同步；工具 repo 只依標籤取字型，不受影響。

## Git

- 不直接推送到 `main`；開 `claude/...` 分支提交後開 PR，由維護者合併。
- AI 代理提交時，作者與提交者皆為代理本身（Claude 為 `Claude <noreply@anthropic.com>`）。
