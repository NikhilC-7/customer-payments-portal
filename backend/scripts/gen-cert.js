// Generates backend/certs/server.key and backend/certs/server.crt
// using a self-signed certificate for CN=localhost with SANs.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import selfsigned from "selfsigned";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certDir = path.resolve(__dirname, "..", "certs");
const keyPath = path.join(certDir, "server.key");
const crtPath = path.join(certDir, "server.crt");

if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });

const attrs = [{ name: "commonName", value: "localhost" }];
const pems = selfsigned.generate(attrs, {
  days: 365,
  keySize: 2048,
  algorithm: "sha256",
  extensions: [
    {
      name: "subjectAltName",
      altNames: [
        { type: 2, value: "localhost" },    // DNS
        { type: 7, ip: "127.0.0.1" }        // IP
      ]
    }
  ]
});

fs.writeFileSync(keyPath, pems.private, { encoding: "utf8", flag: "w" });
fs.writeFileSync(crtPath, pems.cert,    { encoding: "utf8", flag: "w" });

console.log("✔ Generated:", keyPath);
console.log("✔ Generated:", crtPath);
