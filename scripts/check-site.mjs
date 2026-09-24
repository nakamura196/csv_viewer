#!/usr/bin/env node
/**
 * 配信するファイル (docs/) の中の参照が、すべて実在するファイルを指しているか確かめる。
 * ビルドは無く docs/ がそのまま GitHub Pages で配られるので、docs/ を直接見る。
 *
 * 使い方: npm run test:site (npm test にも含まれる)
 *
 * 見ること:
 *   1. HTML の href / src / content のうちサイト内を指すもの (相対参照・サイトの絶対 URL) が
 *      docs/ のファイルに解決できる
 *   2. / で始まる参照が無い (旧 URL の /csv_viewer/ 配下でもホスト直下でも同じに動くよう、相対で書く)
 *   3. 旧ホスト (github.io/csv_viewer) を指す文字列が残っていない
 *   4. robots.txt の Sitemap と sitemap.xml の各 URL が実在するページを指す
 *   5. 例の CSV リンク (?u=...) の中身が絶対 URL である
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, posix } from 'node:path';

const DOCS = new URL('../docs/', import.meta.url).pathname;
const siteUrl = 'https://csv.ldas.jp';
const FORBIDDEN = ['nakamura196.github.io/csv_viewer'];

const errors = [];
const fail = (msg) => errors.push(msg);

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files.push(...walk(p));
    else files.push(p);
  }
  return files;
}

/** docs/ 内の配信パスがファイルに解決できるか。GitHub Pages と同じ規則。 */
function resolves(servedPath) {
  let p = decodeURIComponent(servedPath.split(/[?#]/)[0]);
  if (p === '' || p.endsWith('/')) p += 'index.html';
  const abs = join(DOCS, p);
  if (!abs.startsWith(DOCS)) return false;
  if (existsSync(abs) && statSync(abs).isFile()) return true;
  if (existsSync(abs + '.html')) return true;
  return existsSync(join(abs, 'index.html'));
}

const files = walk(DOCS);
let checkedRefs = 0;

function checkRef(ref, file) {
  const where = relative(DOCS, file);
  if (!ref || ref.startsWith('#') || ref.startsWith('data:') || ref.startsWith('mailto:')) return;
  if (/^[a-z][a-z0-9+.-]*:/i.test(ref) || ref.startsWith('//')) {
    // 外部 URL。サイト自身の絶対 URL だけ確かめる (canonical, og:image など)。
    if (ref === siteUrl || ref.startsWith(siteUrl + '/')) {
      checkedRefs++;
      if (!resolves(ref.slice(siteUrl.length).replace(/^\//, ''))) {
        fail(`${where}: サイトの絶対 URL がファイルに解決できない: ${ref}`);
      }
    }
    return;
  }
  checkedRefs++;
  if (ref.startsWith('/')) {
    fail(`${where}: / で始まる参照 (相対で書く): ${ref}`);
    return;
  }
  if (ref.startsWith('?')) {
    // 同じページへのクエリ付きリンク (例の CSV)。u= は外部の絶対 URL のはず。
    const u = new URLSearchParams(ref.slice(1)).get('u');
    if (u !== null && !/^https:\/\//.test(u)) fail(`${where}: 例の CSV の u= が https の絶対 URL でない: ${ref}`);
    return;
  }
  const fromDir = posix.dirname(relative(DOCS, file).split('\\').join('/'));
  const path = ref.split(/[?#]/)[0];
  const target = posix.normalize(posix.join(fromDir, path));
  if (target.startsWith('..')) {
    fail(`${where}: docs/ の外を指す相対参照: ${ref}`);
    return;
  }
  if (!resolves(target + (path.endsWith('/') ? '/' : ''))) fail(`${where}: 相対参照の先のファイルが無い: ${ref}`);
}

for (const file of files) {
  if (!/\.(html|css|js|txt|xml|json|svg)$/.test(file)) continue;
  const where = relative(DOCS, file);
  const text = readFileSync(file, 'utf8');
  for (const bad of FORBIDDEN) {
    if (text.includes(bad)) fail(`${where}: 旧ホストへの参照が残っている: ${bad}`);
  }
  if (!file.endsWith('.html')) continue;
  for (const m of text.matchAll(/\s(href|src|content)="([^"]*)"/g)) {
    const v = m[2].replaceAll('&amp;', '&');
    // content 属性は meta の値。URL らしいものだけを対象にする。
    if (m[1] === 'content' && !(v.startsWith('/') || v.startsWith(siteUrl))) continue;
    checkRef(v, file);
  }
}

if (!existsSync(join(DOCS, 'index.html'))) fail('index.html が無い');

const robotsPath = join(DOCS, 'robots.txt');
if (!existsSync(robotsPath)) fail('robots.txt が無い');
else if (!readFileSync(robotsPath, 'utf8').includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
  fail(`robots.txt に "Sitemap: ${siteUrl}/sitemap.xml" が無い`);
}
const sitemapPath = join(DOCS, 'sitemap.xml');
if (!existsSync(sitemapPath)) fail('sitemap.xml が無い');
else {
  const locs = [...readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) fail('sitemap.xml に URL が 1 件も無い');
  for (const loc of locs) checkRef(loc, sitemapPath);
}

if (errors.length) {
  console.error(`NG: ${errors.length} 件`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`OK: ${files.length} ファイル、サイト内参照 ${checkedRefs} 件 (siteUrl=${siteUrl})`);
