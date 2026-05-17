const fs = require("fs");
const crypto = require("crypto");

function extractPayload(filePath, password) {
  const file = fs.readFileSync(filePath);

  const keyword = "CTF_PAYLOAD\0";
  const keywordBuf = Buffer.from(keyword, "utf8");

  const start = file.indexOf(keywordBuf);

  if (start === -1) {
    throw new Error("Payload não encontrado");
  }

  const payloadStart = start + keywordBuf.length;

  let payloadEnd = payloadStart;

  while (payloadEnd < file.length && file[payloadEnd] !== 0) {
    payloadEnd++;
  }

  const payload = file.slice(payloadStart, payloadEnd).toString("utf8");

  const [ivBase64, encryptedBase64] = payload.split(".");

  const iv = Buffer.from(ivBase64, "base64");

  const encrypted = Buffer.from(encryptedBase64, "base64");

  const key = crypto.scryptSync(password, "ctf_salt", 32);

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

try {
  const result = extractPayload("locked.png", "ohara123");

  console.log("Mensagem:", result);
} catch (err) {
  console.error("Senha incorreta ou payload inválido");
}
