#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const version = '3.6.1';

function types(node) {
  return Array.isArray(node?.['@type']) ? node['@type'] : [node?.['@type']];
}

function updateGraph(doc) {
  const graph = Array.isArray(doc?.['@graph']) ? doc['@graph'] : [];
  for (const node of graph) {
    const nodeTypes = types(node);
    if (nodeTypes.includes('SoftwareApplication')) node.softwareVersion = version;
    if (nodeTypes.includes('WebAPI')) node.assemblyVersion = version;

    if (node['@id'] === 'https://3webobs.com/#signal-registry') {
      const variables = Array.isArray(node.variableMeasured) ? node.variableMeasured : [];
      const ai = variables.find(item => item?.name === 'AI Signals');
      if (ai) {
        ai.value = 19;
        ai.description = 'Crawler permissions and machine-readable trust files';
      }
      if (!variables.some(item => item?.name === 'A2A')) {
        variables.push({
          '@type': 'PropertyValue',
          name: 'A2A',
          value: 13,
          description: 'Agent discovery, protocol contract and live invocation'
        });
      }
      node.variableMeasured = variables;
    }

    if (node['@id'] === 'https://3webobs.com/#dimensions') {
      node.name = 'The six audit dimensions';
      node.numberOfItems = 6;
      const items = Array.isArray(node.itemListElement) ? node.itemListElement : [];
      if (!items.some(item => item?.name === 'A2A')) {
        items.push({
          '@type': 'ListItem',
          position: 6,
          name: 'A2A',
          description: '13 signals — Agent-to-Agent discovery, contract and invocation'
        });
      }
      node.itemListElement = items;
    }
  }
  return doc;
}

let files = 0;
let blocks = 0;
for (const file of readdirSync(root).filter(name => name.endsWith('.html'))) {
  const path = join(root, file);
  const original = readFileSync(path, 'utf8');
  const updated = original.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (whole, raw) => {
    let doc;
    try { doc = JSON.parse(raw); } catch { return whole; }
    blocks++;
    return `<script type="application/ld+json">${JSON.stringify(updateGraph(doc))}</script>`;
  });
  if (updated !== original) {
    writeFileSync(path, updated);
    files++;
  }
}

console.log(`Public metadata synchronized to ${version}: ${files} files, ${blocks} JSON-LD blocks.`);
