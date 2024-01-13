const crypto = require("node:crypto");
const fs = require("node:fs");

// อาจจะเปลี่ยนตอนไหนก็ได้ แต่ต้องหาเอง
// It can be changed at any time so you need to find it yourself.
const encryptPassword = "lcslime14a5";

function decrypt(password, data) {
  const IV = Buffer.alloc(16);
  data.copy(IV, 0, 0, 16);

  const dataToDecrypt = Buffer.alloc(data.length - 16);
  data.copy(dataToDecrypt, 0, 16);

  const k2 = crypto.pbkdf2Sync(password, IV, 100, 16, "sha1");
  const decAlg = crypto.createDecipheriv("aes-128-cbc", k2, IV);

  let decryptedData = decAlg.update(dataToDecrypt, "binary", "utf8");
  decryptedData += decAlg.final("utf8");

  return decryptedData;
}

function encrypt(password, data) {
  const IV = crypto.randomBytes(16);
  const k2 = crypto.pbkdf2Sync(password, IV, 100, 16, "sha1");
  const encAlg = crypto.createCipheriv("aes-128-cbc", k2, IV);

  let encryptedData = encAlg.update(data, "utf8", "binary");
  encryptedData += encAlg.final("binary");

  // Inject IV into the encrypted data
  // เอา IV มาใส่ในข้อมูลที่เข้ารหัสแล้ว
  const ciphertext = Buffer.concat([IV, Buffer.from(encryptedData, "binary")]);

  return ciphertext;
}

/*
  decrypt
  fs.writeFileSync(
    "test.json",
    decrypt(encryptPassword, fs.readFileSync("LCSaveFile1"))
  );
*/

// encrypt แล้วเขียนลงไฟล์
fs.appendFileSync(
  "LCSaveFile1",
  encrypt(encryptPassword, fs.readFileSync("test.json", "utf8"))
);
