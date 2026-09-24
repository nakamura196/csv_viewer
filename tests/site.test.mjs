/**
 * 公開 URL (https://csv.ldas.jp) を決めている箇所を固定する。
 * ドメインを変えるときは、ここと docs/ の該当ファイルを同時に直す。
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SITE = 'https://csv.ldas.jp';
const read = (p) => readFileSync(new URL(`../docs/${p}`, import.meta.url), 'utf8');
const html = read('index.html');
const attr = (re) => html.match(re)?.[1];

test('CNAME はホスト名 1 行だけ (GitHub Pages の独自ドメイン)', () => {
  assert.equal(read('CNAME'), 'csv.ldas.jp\n');
});

test('canonical と og:url が新ホストの / を指す', () => {
  assert.equal(attr(/<link rel="canonical" href="([^"]+)"/), `${SITE}/`);
  assert.equal(attr(/property="og:url" content="([^"]+)"/), `${SITE}/`);
});

test('og:image と twitter:image が新ホストの ogp.png を指す', () => {
  const imgs = [...html.matchAll(/(?:property="og:image"|name="twitter:image")\s+content="([^"]+)"/g)];
  assert.equal(imgs.length, 2);
  for (const m of imgs) assert.equal(m[1], `${SITE}/ogp.png`);
});

test('robots.txt が新ホストの sitemap を示す', () => {
  assert.match(read('robots.txt'), new RegExp(`^Sitemap: ${SITE}/sitemap\\.xml$`, 'm'));
});

test('sitemap.xml は新ホストのトップ 1 件', () => {
  const locs = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.deepEqual(locs, [`${SITE}/`]);
});

test('サイト内の参照は相対パスだけ (/ 始まりはサブパス配信で壊れる)', () => {
  const rootAbs = [...html.matchAll(/\s(?:href|src)="(\/[^/][^"]*)"/g)].map((m) => m[1]);
  assert.deepEqual(rootAbs, []);
});
