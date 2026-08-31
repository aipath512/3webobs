import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";

const BASE = "https://3webobs.com";

const PATHS = [
  "/.well-known/agent-card.json",
  "/.well-known/security.txt",
  "/404.html",
  "/actions.json",
  "/adn.json",
  "/ai-act.html",
  "/ai.json",
  "/ai.txt",
  "/aliases.json",
  "/allow-lane-matrix.json",
  "/assets/og-cover.png",
  "/authority.json",
  "/capabilities.json",
  "/changelog.json",
  "/contact.html",
  "/cookies.html",
  "/entities.json",
  "/for-ai-teams.html",
  "/for-compliance-consultants.html",
  "/for-seo-agencies.html",
  "/gdpr.html",
  "/governance.json",
  "/humans.txt",
  "/index.html",
  "/intents.json",
  "/llms.txt",
  "/network.json",
  "/policy.html",
  "/policy.json",
  "/robots.txt",
  "/self-audit.html",
  "/session.json",
  "/site.webmanifest",
  "/sitemap.xml",
  "/terms.html",
].sort();

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function fetchArtifact(path) {
  const url = BASE + path;

  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "3webs-proof-generator/1.1"
    }
  });

  if (!response.ok) {
    throw new Error(
      `${path}: HTTP ${response.status} ${response.statusText}`
    );
  }

  const bytes = Buffer.from(await response.arrayBuffer());

  return {
    path,
    url,
    bytes: bytes.length,
    sha256: sha256(bytes)
  };
}

async function main() {
  const files = [];

  for (const path of PATHS) {
    console.log(`Hashing ${path}`);
    files.push(await fetchArtifact(path));
  }

  files.sort((a, b) => a.path.localeCompare(b.path));

  const canonicalAggregateInput = files
    .map(file => `${file.path}:${file.sha256}`)
    .join("\n");

  const aggregate = sha256(
    Buffer.from(canonicalAggregateInput, "utf8")
  );

  const manifest = {
    "$schema": "https://5thelement.ai/schemas/proof.json",
    "version": "1.1",
    "generated_at": new Date().toISOString(),

    "issuer": {
      "legal_name": "AIVENTURE S.R.L.",
      "cui": "51415878",
      "euid": "ROONRC.J2025016406000",
      "service": "3webs",
      "domain": "3webobs.com",
      "contact": "contact@5thelement.ai"
    },

    "integrity_method": {
      "algorithm": "SHA-256",
      "digest_encoding": "lowercase hexadecimal",
      "file_scope":
        "raw response-body bytes of each designated public artifact as served at generation time",
      "aggregate": {
        "algorithm": "SHA-256",
        "line_format": "<path>:<sha256>",
        "sort": "lexicographic ascending by path",
        "encoding": "UTF-8",
        "line_separator": "LF",
        "trailing_newline": false
      }
    },

    "aggregate_sha256": aggregate,
    "file_count": files.length,
    "files": files,

    "verification": {
      "artifact":
        "Fetch the declared URL as raw bytes, compute SHA-256, encode as lowercase hexadecimal and compare with the recorded sha256.",
      "aggregate":
        "Sort entries lexicographically by path, create path:sha256 lines, join with LF and no trailing newline, then compute SHA-256.",
      "interpretation":
        "A matching artifact digest demonstrates byte-for-byte consistency with the artifact represented by this manifest. A matching aggregate demonstrates internal consistency of the recorded file-digest set."
    },

    "external_anchoring": {
      "timestamp_authority": false,
      "opens_timestamp": false,
      "digital_signature": false,
      "statement":
        "This manifest currently provides cryptographic integrity evidence only."
    },

    "evidence_scope": {
      "proves": [
        "byte-level consistency of an artifact with the digest recorded in this manifest",
        "internal consistency of the recorded file-digest set when the aggregate verifies"
      ],
      "does_not_prove": [
        "truthfulness of the content",
        "regulatory compliance",
        "legal validity",
        "authorship by itself",
        "publication time by itself",
        "third-party endorsement"
      ]
    }
  };

  await writeFile(
    "./proof.json",
    JSON.stringify(manifest, null, 2) + "\n",
    "utf8"
  );

  console.log("");
  console.log(`Files: ${files.length}`);
  console.log(`Aggregate: ${aggregate}`);
  console.log("Generated: proof.json");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
