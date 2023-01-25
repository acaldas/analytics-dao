import { subtle, getRandomValues } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // create file symmetric encryption key
  const key = await subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
  const exportedKey = bufferToStr(await subtle.exportKey("raw", key));
  const iv = getRandomValues(new Uint8Array(12));
  console.log(exportedKey);

  // encrypt secret
  const cipher = await encryptSecret("vamos crlh", exportedKey, iv);
  console.log("Encrypted:", cipher);
  const secret = await decryptSecret(exportedKey, cipher, iv);
  console.log("Secret:", secret);

  // create access key pair
  const wrappingKey = await subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
  );
  const rawWrappingKey = bufferToStr(
    await subtle.exportKey("spki", wrappingKey.publicKey)
  );

  // encrypt symmetric key with public key
  const wrappedKey = await subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    wrappingKey.publicKey,
    strToBuffer(exportedKey)
  );
  const wrappedKey3 = await subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    wrappingKey.publicKey,
    strToBuffer(exportedKey)
  );
  // const wrappedKey = await wrapKey(exportedKey, rawWrappingKey);

  // decrypt symmetric key
  const decryptionKeyStr = await subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    wrappingKey.privateKey,
    wrappedKey
  );

  const wrappedKey2 = await subtle.wrapKey("raw", key, wrappingKey.publicKey, {
    name: "RSA-OAEP",
  });

  console.log("E Key:", bufferToStr(wrappedKey));
  console.log("W Key:", bufferToStr(wrappedKey3));
  console.log(bufferToStr(wrappedKey3) === bufferToStr(wrappedKey2));

  const decryptionKey = await subtle.unwrapKey(
    "raw",
    wrappedKey2,
    wrappingKey.privateKey,
    { name: "RSA-OAEP" },
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"]
  );

  const decryptionKeyStr2 = await subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    wrappingKey.privateKey,
    wrappedKey2
  );
  console.log(
    bufferToStr(decryptionKeyStr2) ===
      bufferToStr(await subtle.exportKey("raw", decryptionKey))
  );

  const secret2 = await decryptSecret(
    bufferToStr(decryptionKeyStr),
    cipher,
    iv
  );
  console.log("Secret2:", secret2);

  const secret3 = await decryptSecret(
    bufferToStr(await subtle.exportKey("raw", decryptionKey)),
    cipher,
    iv
  );
  console.log("Secret3:", secret3);

  // decryptWithPublicKey(exportedKey, wrappedKey, cipher, bufferToStr(iv));

  response.status(200).json(secret);
}

const encryptSecret = async (
  secret: string,
  rawKey: string,
  iv: ArrayBuffer
) => {
  const key = await subtle.importKey(
    "raw",
    strToBuffer(rawKey),
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );

  const enc = new TextEncoder();
  const cipher = await subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(secret)
  );

  return bufferToStr(cipher);
};

const decryptSecret = async (
  rawKey: string,
  cipher: string,
  iv: Uint8Array
) => {
  const key = await subtle.importKey(
    "raw",
    strToBuffer(rawKey),
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );

  const secret = await subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    strToBuffer(cipher)
  );

  return bufferToStr(secret, "utf-8");
};

// const decryptWithPublicKey = async (
//   rawKey: string,
//   rawWrappedKey: string,
//   cipher: string,
//   iv: string
// ) => {
//   const wrappingKey = await subtle.importKey(
//     "raw",
//     strToBuffer(rawKey),
//     {
//       name: "RSA-OAEP",
//       hash: "SHA-256",
//     },
//     true,
//     ["wrapKey", "unwrapKey"]
//   );
//   const wrappingKey = await subtle.importKey(
//     "raw",
//     strToBuffer(rawKey),
//     {
//       name: "RSA-OAEP",
//       hash: "SHA-256",
//     },
//     true,
//     ["wrapKey", "unwrapKey"]
//   );
//   subtle.unwrapKey("raw");
//   decryptSecret();
// };

const wrapKey = async (rawKey: string, rawWrappingKey: string) => {
  const enc = new TextEncoder();
  const key = await subtle.importKey(
    "raw",
    strToBuffer(rawKey),
    "AES-GCM",
    true,
    ["wrapKey"]
  );
  const wrappingKey = await subtle.importKey(
    "spki",
    strToBuffer(rawWrappingKey),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );

  const newKey = await subtle.wrapKey("spki", key, wrappingKey, {
    name: "RSA-OAEP",
  });
  return newKey; //bufferToStr(newKey);
};

const bufferToStr = (
  buffer: ArrayBuffer,
  encoding: BufferEncoding = "base64"
) => Buffer.from(buffer).toString(encoding);

const strToBuffer = (
  str: string,
  encoding: BufferEncoding = "base64"
): ArrayBuffer => Buffer.from(str, encoding);
