#!/usr/bin/env node
/**
 * Credential-free repository gate for the Swarm market-entry foundation.
 * It only inspects tracked files and runs local workspace commands.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { addSwarmSchemaKeywords } from "@pov/schema-validator";

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  throw new Error(message);
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

function trackedFiles() {
  return execFileSync("git", ["ls-files", "-z"], { cwd: repositoryRoot, encoding: "utf8" })
    .split("\0")
    .filter(Boolean);
}

async function text(relativePath) {
  return readFile(path.join(repositoryRoot, relativePath), "utf8");
}

export async function checkSchemasAndVectors() {
  const schemaByKind = {
    publication: "post-publication.schema.json",
    admission: "feed-entry.schema.json",
    lifecycle: "content-lifecycle.schema.json",
    view: "swarm-feed-view.schema.json",
  };
  const schemaNames = ["swarm-account.schema.json", ...new Set(Object.values(schemaByKind))];
  const documents = new Map(await Promise.all(schemaNames.map(async (name) => {
    const schema = JSON.parse(await text(path.join("spec/protocol", name)));
    if (!schema.$id?.includes("proof-of-value.org/schema/") || schema.type !== "object" || !Array.isArray(schema.required)) {
      fail(`schema ${name} is not a versioned Swarm object schema`);
    }
    return [name, schema];
  })));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  addSwarmSchemaKeywords(ajv);
  const validators = Object.fromEntries(Object.entries(schemaByKind).map(([kind, name]) => [kind, ajv.compile(documents.get(name))]));

  const vectorDirectory = path.join(repositoryRoot, "spec/vectors/swarm-feed");
  const vectors = await Promise.all((await readdir(vectorDirectory)).filter((name) => name.endsWith(".json")).map(async (name) => ({
    name,
    value: JSON.parse(await readFile(path.join(vectorDirectory, name), "utf8")),
  })));
  const expectedKinds = new Set(Object.keys(schemaByKind));
  for (const vector of vectors) {
    if (!expectedKinds.has(vector.value.kind) || typeof vector.value.valid !== "boolean" || !("value" in vector.value)) {
      fail(`invalid Swarm feed vector envelope: ${vector.name}`);
    }
  }
  const expectedValidity = { publication: [true, false], admission: [true, false], lifecycle: [true, false], view: [true, false] };
  for (const kind of expectedKinds) {
    const kindVectors = vectors.filter((vector) => vector.value.kind === kind);
    for (const valid of expectedValidity[kind]) if (!kindVectors.some((vector) => vector.value.valid === valid)) {
      fail(`Swarm feed vectors are missing an expected ${valid ? "positive" : "negative"} ${kind} case`);
    }
    for (const vector of kindVectors) {
      const validator = validators[kind];
      const actualValidity = validator(vector.value.value);
      if (actualValidity !== vector.value.valid) {
        fail(`schema validation disagrees with ${vector.name}: expected ${vector.value.valid}, received ${actualValidity}; ${ajv.errorsText(validator.errors)}`);
      }
    }
  }
  if (!vectors.some((vector) => vector.name === "view-secret-invalid.json" && vector.value.valid === false)) {
    fail("the intentional view-secret-invalid.json negative vector is missing");
  }
}

function stripFencedCode(markdown) {
  return markdown.replace(/^```[\s\S]*?^```\s*$/gm, "");
}

export async function checkMarkdownLinks() {
  const markdown = trackedFiles().filter((file) => file.endsWith(".md"));
  const broken = [];
  const linkPattern = /!?\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\)/g;
  for (const file of markdown) {
    const source = stripFencedCode(await text(file));
    for (const match of source.matchAll(linkPattern)) {
      const rawTarget = match[1] ?? match[2];
      const target = rawTarget.split("#", 1)[0].split("?", 1)[0];
      if (!target || target.startsWith("/") || target.startsWith("~") || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.includes("Vault")) continue;
      const resolved = path.resolve(path.dirname(path.join(repositoryRoot, file)), decodeURIComponent(target));
      if (!resolved.startsWith(`${repositoryRoot}${path.sep}`) || !(await exists(resolved))) broken.push(`${file} -> ${rawTarget}`);
    }
  }
  if (broken.length) fail(`broken local Markdown links:\n${broken.join("\n")}`);
}

const requiredPacketFields = ["Maturity:", "## Goal and boundary", "## Prerequisites and owned areas", "## Non-goals and open questions", "## Acceptance examples", "## Verification and coordination"];
const idPattern = /\b(R(?:[1-9]|1[0-9])|F[1-5]|AE[1-8]|KTD(?:[1-9]|1[01]))\b/g;

export async function checkWorkstreamPackets() {
  const packets = [
    "at-account-and-publishing.md",
    "feed-index-and-lifecycle.md",
    "pov-evaluation-and-settlement.md",
    "moderation-and-operations.md",
    "product-and-research.md",
  ];
  for (const packet of packets) {
    const source = await text(path.join("docs/workstreams", packet));
    for (const field of requiredPacketFields) if (!source.includes(field)) fail(`${packet} is missing required field: ${field}`);
    const ids = [...source.matchAll(idPattern)].map((match) => match[1]);
    for (const prefix of ["R", "F", "AE", "KTD"]) if (!ids.some((id) => id.startsWith(prefix))) fail(`${packet} is missing ${prefix} contract IDs`);
  }
}

const truthFiles = ["README.md", "ROADMAP.md", "docs/context/POV_PROJECT_CONTEXT.md", "ARCHITECTURE.md", "docs/product/SWARM_MVP.md", "apps/web/app/page.js"];

export async function checkRepositoryTruth() {
  const sources = Object.fromEntries(await Promise.all(truthFiles.map(async (file) => [file, await text(file)])));
  const combined = Object.values(sources).join("\n");
  for (const maturity of ["Implemented", "Simulated", "Proposed", "Blocked", "Deferred"]) {
    if (!combined.includes(maturity)) fail(`repository truth surfaces do not label ${maturity} work`);
  }
  for (const [file, phrases] of Object.entries({
    "README.md": ["fixture", "Proposed", "Blocked", "Deferred"],
    "ROADMAP.md": ["U7", "Implemented", "Simulated", "Proposed", "Blocked", "Deferred"],
    "docs/context/POV_PROJECT_CONTEXT.md": ["fixture", "proposed", "Blocked", "Deferred"],
    "ARCHITECTURE.md": ["Implemented", "Simulated", "Proposed", "Blocked", "Deferred"],
    "docs/product/SWARM_MVP.md": ["fixtures", "proposed", "does not demonstrate"],
    "apps/web/app/page.js": ["Fixture", "simulated", "no live account provisioning", "not live"],
  })) {
    for (const phrase of phrases) if (!sources[file].includes(phrase)) fail(`${file} is missing maturity truth: ${phrase}`);
  }
  const staleClaims = [
    /live AT (?:integration|client|publishing) (?:is |has been )?(?:built|implemented|available)/i,
    /Swarm accounts? (?:are|is) live/i,
    /developer placeholder, not the Swarm feed/i,
    /dual[- ]marketplace (?:is|are) (?:the|this) MVP/i,
    /(?<!do not authorize a )two[- ]marketplace MVP/i,
  ];
  for (const expression of staleClaims) if (expression.test(combined)) fail(`obsolete product claim: ${expression}`);
}

export async function checkPackageBoundaries() {
  const adapterFiles = trackedFiles().filter((file) => file.startsWith("packages/at-adapter/"));
  const indexFiles = trackedFiles().filter((file) => file.startsWith("packages/app-index/"));
  for (const file of adapterFiles) {
    const source = await text(file);
    if (/\b(?:from|require\()\s*["'][^"']*at-client/i.test(source) || /@pov\/at-client/.test(source) && /(?:import|require\()/.test(source)) {
      fail(`read-only at-adapter imports write client: ${file}`);
    }
  }
  for (const file of indexFiles) {
    const source = await text(file);
    if (/\b(?:is|as|becomes?)\s+(?:the\s+)?canonical (?:content|record|store)/i.test(source) || /(?<!not )canonical[- ]content/i.test(source)) {
      fail(`app-index makes a canonical-content claim: ${file}`);
    }
  }
}

function hasActualSecret(source) {
  const uncommented = source.split("\n").filter((line) => !line.trimStart().startsWith("#")).join("\n");
  const assignment = /(?:access[_-]?token|refresh[_-]?token|authorization[_-]?code|client[_-]?secret|private[_-]?key|wallet[_-]?key|pds[_-]?admin(?:istrator)?|api[_-]?key)\s*[=:]\s*["']?([^\s"',}]+)/ig;
  for (const match of uncommented.matchAll(assignment)) {
    const value = match[1].replace(/["'};,]+$/, "");
    const lineStart = uncommented.lastIndexOf("\n", match.index ?? 0) + 1;
    const line = uncommented.slice(lineStart, uncommented.indexOf("\n", lineStart) < 0 ? undefined : uncommented.indexOf("\n", lineStart));
    const isReference = /^(?:env\.)?[A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*$/.test(value);
    const isDeterministicFixture = /\.repeat\(\d+\)/.test(line);
    if (value && !isReference && !isDeterministicFixture && !/^(?:secret|redacted|example|placeholder|test|<[^>]+>)$/i.test(value)) return true;
  }
  return false;
}

const credentialSourcePattern = /\.(?:[cm]?js|[cm]?ts|jsx?|tsx?|json|ya?ml|toml)$/i;

export function credentialScanCandidates(files = trackedFiles()) {
  return files.filter((file) => {
    if (/(?:^|\/)(?:node_modules|dist|build|\.next)(?:\/|$)/.test(file)) return false;
    if (file === "spec/vectors/swarm-feed/view-secret-invalid.json") return false;
    return credentialSourcePattern.test(file) || /(?:^|\/)\.env(?:\.|$)/i.test(file);
  });
}

export async function checkCredentialHygiene() {
  const candidates = credentialScanCandidates();
  const findings = [];
  for (const file of candidates) {
    const info = await stat(path.join(repositoryRoot, file));
    if (info.size > 1_000_000) continue;
    const source = await text(file);
    if (hasActualSecret(source) || (/(?:^|\/)\.env(?:\.|$)/i.test(file) && /^(?!\s*#)\s*(?:.*(?:TOKEN|SECRET|PRIVATE_KEY|API_KEY|PASSWORD).*)=/im.test(source))) findings.push(file);
  }
  if (findings.length) fail(`tracked artifact contains credential material: ${findings.join(", ")}`);
  const trackedArtifacts = trackedFiles().filter((file) => /(?:^|\/)(?:dist|build|\.next)(?:\/|$)/.test(file));
  if (trackedArtifacts.length) fail(`tracked generated artifacts are forbidden: ${trackedArtifacts.join(", ")}`);
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: repositoryRoot, stdio: "inherit", env: { ...process.env, CI: "1" } });
  if (result.status !== 0) fail(`${command} ${args.join(" ")} failed`);
}

export async function runFoundationChecks({ runCommands = true } = {}) {
  await checkSchemasAndVectors();
  await checkMarkdownLinks();
  await checkWorkstreamPackets();
  await checkRepositoryTruth();
  await checkPackageBoundaries();
  await checkCredentialHygiene();
  if (runCommands) {
    for (const workspace of ["@pov/protocol", "@pov/application-contracts", "@pov/at-client", "@pov/web"]) run("npm", ["test", "--workspace", workspace]);
    run("npm", ["run", "typecheck"]);
    run("npm", ["run", "build"]);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runFoundationChecks().then(() => console.log("Foundation verification passed.")).catch((error) => {
    console.error(`Foundation verification failed: ${error.message}`);
    process.exitCode = 1;
  });
}
