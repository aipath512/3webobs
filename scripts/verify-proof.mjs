#!/usr/bin/env node
/**
 * verify-proof.mjs — verificator independent al manifestului de integritate
 *
 * Ruleaza fara nicio dependinta, cu Node 18+:
 *
 *     node scripts/verify-proof.mjs
 *     node scripts/verify-proof.mjs --origin https://3webobs.com
 *     node scripts/verify-proof.mjs --local          (verifica fisierele din repo)
 *
 * Ce face: descarca proof.json, apoi fiecare fisier declarat, calculeaza
 * SHA-256 si compara cu valoarea din manifest. Recalculeaza si agregatul.
 * Iese cu cod 0 daca totul corespunde, 1 daca nu — deci poate fi folosit si
 * intr-un pipeline CI, nu doar manual.
 *
 * Nu are incredere in nimic din manifest in afara de lista de fisiere:
 * hash-urile sunt recalculate local, din bytes.
 */

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const args = process.argv.slice(2);
const LOCAL = args.includes('--local');
const originIdx = args.indexOf('--origin');
const ORIGIN = originIdx !== -1 ? args[originIdx + 1] : 'https://3webobs.com';
const QUIET = args.includes('--quiet');

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

function log(...a) { if (!QUIET) console.log(...a); }

async function getBytes(path) {
  if (LOCAL) {
    const local = '.' + path;
    if (!existsSync(local)) return null;
    return await readFile(local);
  }
  const res = await fetch(ORIGIN + path, { redirect: 'follow' });
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  log(`\nVerific manifestul${LOCAL ? ' fata de fisierele locale' : ' fata de ' + ORIGIN}\n`);

  const manifestBytes = await getBytes('/proof.json');
  if (!manifestBytes) {
    console.error('EROARE: proof.json nu poate fi citit.');
    process.exit(1);
  }

  let manifest;
  try {
    manifest = JSON.parse(manifestBytes.toString('utf8'));
  } catch (e) {
    console.error('EROARE: proof.json nu e JSON valid:', e.message);
    process.exit(1);
  }

  const files = manifest.files || [];
  if (!files.length) {
    console.error('EROARE: manifestul nu declara niciun fisier.');
    process.exit(1);
  }

  log(`Manifest generat la: ${manifest.generated_at || 'nedeclarat'}`);
  log(`Fisiere declarate:   ${files.length}\n`);

  let ok = 0;
  const failed = [];

  for (const entry of files) {
    const bytes = await getBytes(entry.path);
    if (!bytes) {
      failed.push({ path: entry.path, reason: 'inaccesibil' });
      log(`  MISS  ${entry.path}`);
      continue;
    }
    const actual = sha256(bytes);
    if (actual === entry.sha256) {
      ok++;
      log(`  OK    ${entry.path}`);
    } else {
      failed.push({
        path: entry.path,
        reason: `hash diferit (manifest ${entry.sha256.slice(0, 12)}…, real ${actual.slice(0, 12)}…)`,
        declaredBytes: entry.bytes, actualBytes: bytes.length,
      });
      log(`  FAIL  ${entry.path}`);
    }
  }

  // agregatul se recalculeaza din hash-urile DECLARATE, exact cum e definit
  // in manifest.verification — verifica integritatea listei, nu a site-ului
  const concat = files.map(f => f.sha256).sort().join('');
  const aggregate = sha256(Buffer.from(concat));
  const aggregateOk = aggregate === manifest.aggregate_sha256;

  log(`\n${'─'.repeat(60)}`);
  log(`Fisiere verificate:  ${ok}/${files.length}`);
  log(`Agregat:             ${aggregateOk ? 'corespunde' : 'NU corespunde'}`);

  if (failed.length) {
    log(`\nNepotriviri (${failed.length}):`);
    for (const f of failed) log(`  ${f.path}: ${f.reason}`);
  }

  const allGood = failed.length === 0 && aggregateOk;
  log(`\n${allGood ? 'REZULTAT: manifest valid, integritate confirmata.' : 'REZULTAT: verificare ESUATA.'}\n`);

  // Ce NU dovedeste aceasta verificare — spus explicit, ca sa nu fie
  // supralicitata: hash-urile arata ca fisierele nu s-au schimbat fata de
  // manifest. Nu dovedesc cine le-a scris, cand au fost publicate, sau ca
  // ce contin e adevarat sau conform.
  if (allGood && !QUIET) {
    console.log('Ce dovedeste: fisierele live corespund exact manifestului publicat.');
    console.log('Ce NU dovedeste: autorul, momentul publicarii, sau adevarul continutului.');
    console.log('Pentru dovada de moment ar fi nevoie de un timestamp (TSA/OpenTimestamps),');
    console.log('care nu e implementat — manifestul declara onest aceasta limita.\n');
  }

  process.exit(allGood ? 0 : 1);
}

main().catch(e => { console.error('EROARE:', e.message); process.exit(1); });
