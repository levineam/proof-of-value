import process from "node:process";

const required = ["KOINOS_HARBINGER_RPC_URL", "KOINOS_HARBINGER_PRIVATE_KEY"];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(JSON.stringify({
    status: "blocked",
    step: "deploy",
    reason: "Harbinger operator credentials are not available in this environment.",
    missing,
    next: "Set a dedicated funded development wallet and API-key RPC URL outside CI, then implement the operator deployment and read-only event retrieval using the current Harbinger chain ID.",
  }, null, 2));
  process.exitCode = 2;
} else {
  console.error(JSON.stringify({
    status: "blocked",
    step: "operator-script",
    reason: "Credential discovery passed, but this repository deliberately has no deployer or event-reader implementation yet.",
    next: "Add and review an operator-only deploy/retrieve script before allowing a Harbinger write.",
  }, null, 2));
  process.exitCode = 2;
}
