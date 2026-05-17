// const fs = require("fs");
// const path = require("path");
// const crypto = require("crypto");
// const zlib = require("zlib");

// const secret = "CTF{hidden_string_example}";
// const password = "ohara123"; // senha para a CTF
// const salt = "ctf_salt";

// function buildCrc32Table() {
//   const table = new Uint32Array(256);
//   for (let i = 0; i < 256; i++) {
//     let c = i;
//     for (let j = 0; j < 8; j++) {
//       c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
//     }
//     table[i] = c >>> 0;
//   }
//   return table;
// }

// const crcTable = buildCrc32Table();
// function crc32(buf) {
//   let c = 0xffffffff;
//   for (let i = 0; i < buf.length; i++)
//     c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
//   return (c ^ 0xffffffff) >>> 0;
// }

// function makeChunk(typeStr, dataBuf) {
//   const type = Buffer.from(typeStr, "ascii");
//   const len = Buffer.alloc(4);
//   len.writeUInt32BE(dataBuf.length, 0);
//   const chunk = Buffer.concat([type, dataBuf]);
//   const crcBuf = Buffer.alloc(4);
//   crcBuf.writeUInt32BE(crc32(chunk), 0);
//   return Buffer.concat([len, chunk, crcBuf]);
// }

// // Build a 400x300 RGBA PNG
// const width = 400;
// const height = 300;
// const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// // IHDR
// const ihdr = Buffer.alloc(13);
// ihdr.writeUInt32BE(width, 0);
// ihdr.writeUInt32BE(height, 4);
// ihdr.writeUInt8(8, 8); // bit depth
// ihdr.writeUInt8(6, 9); // color type RGBA
// ihdr.writeUInt8(0, 10); // compression
// ihdr.writeUInt8(0, 11); // filter
// ihdr.writeUInt8(0, 12); // interlace
// const ihdrChunk = makeChunk("IHDR", ihdr);

// // Raw image data: simple solid color background
// const rowBytes = width * 4 + 1; // filter byte + RGBA per pixel
// const raw = Buffer.alloc(rowBytes * height);
// for (let y = 0; y < height; y++) {
//   const rowStart = y * rowBytes;
//   raw[rowStart] = 0; // filter none
//   for (let x = 0; x < width; x++) {
//     const p = rowStart + 1 + x * 4;
//     raw[p] = 200; // R
//     raw[p + 1] = 180; // G
//     raw[p + 2] = 125; // B
//     raw[p + 3] = 255; // A
//   }
// }

// const compressed = zlib.deflateSync(raw);
// const idatChunk = makeChunk("IDAT", compressed);

// // Create tEXt chunk with payload
// const key = crypto.scryptSync(password, salt, 32);
// const iv = crypto.randomBytes(16);
// const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
// const encrypted = Buffer.concat([
//   cipher.update(Buffer.from(secret, "utf8")),
//   cipher.final(),
// ]);
// const payloadStr = iv.toString("base64") + "." + encrypted.toString("base64");
// const keyword = "CTF_PAYLOAD";
// const textData = Buffer.from(keyword + "\0" + payloadStr, "utf8");
// const textChunk = makeChunk("tEXt", textData);

// // IEND
// const iendChunk = makeChunk("IEND", Buffer.alloc(0));

// const outBuf = Buffer.concat([
//   signature,
//   ihdrChunk,
//   idatChunk,
//   textChunk,
//   iendChunk,
// ]);

// const outPath = path.join(
//   __dirname,
//   "..",
//   "public",
//   "images",
//   "ctf_post1_locked.png",
// );
// fs.mkdirSync(path.dirname(outPath), { recursive: true });
// fs.writeFileSync(outPath, outBuf);
// console.log("CTF image written to", outPath);

const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

function buildCrc32Table() {
  const table = new Uint32Array(256);

  for (let i = 0; i < 256; i++) {
    let c = i;

    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }

    table[i] = c >>> 0;
  }

  return table;
}

const crcTable = buildCrc32Table();

function crc32(buf) {
  let c = 0xffffffff;

  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }

  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(typeStr, dataBuf) {
  const type = Buffer.from(typeStr, "ascii");

  const len = Buffer.alloc(4);
  len.writeUInt32BE(dataBuf.length, 0);

  const chunk = Buffer.concat([type, dataBuf]);

  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(chunk), 0);

  return Buffer.concat([len, chunk, crcBuf]);
}

function injectTextChunk({ inputPath, outputPath, secret, password }) {
  const original = fs.readFileSync(inputPath);

  // criptografa payload
  const key = crypto.scryptSync(password, "ctf_salt", 32);

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(secret, "utf8")),
    cipher.final(),
  ]);

  const payload = iv.toString("base64") + "." + encrypted.toString("base64");

  // cria chunk PNG
  const keyword = "CTF_PAYLOAD";

  const textData = Buffer.from(keyword + "\0" + payload, "utf8");

  const textChunk = makeChunk("tEXt", textData);

  // encontra IEND
  const iendOffset = original.lastIndexOf(Buffer.from("IEND"));
  console.log(iendOffset);
  if (iendOffset === -1) {
    throw new Error("PNG inválido");
  }

  // inclui chunk antes do IEND
  const finalPng = Buffer.concat([
    original.slice(0, iendOffset - 4),
    textChunk,
    original.slice(iendOffset - 4),
  ]);

  fs.writeFileSync(outputPath, finalPng);

  console.log("PNG criado:", outputPath);
}

injectTextChunk({
  inputPath: path.join(__dirname, "Poneglyph-Zou.png"),
  outputPath: path.join(__dirname, "Poneglyph-Zou-locked.png"),
  secret: "flag{the_dawn_will_come}",
  password: "joyboy800",
});
