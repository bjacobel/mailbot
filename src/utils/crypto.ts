import * as assert from "assert";
import * as crypto from "crypto";

export enum JavaCryptoAlgos {
  GCM = "AES/GCM/NoPadding",
}

/**
 * Decrypt a string encoded with a given key, algorithm and encoding into a base64-string
 */
export const decrypt = (
  key: Buffer,
  iv: Buffer,
  algo: JavaCryptoAlgos,
  body: Buffer,
  tag: Buffer,
): Buffer => {
  let nodeCryptoAlgo: string;
  switch (algo) {
    case JavaCryptoAlgos.GCM:
      nodeCryptoAlgo = "aes-256-gcm";
      break;
    default:
      throw new Error(`algorithm ${algo} is not supported`);
  }

  // @ts-ignore 2739
  const decipher: crypto.DecipherGCM = crypto.createDecipheriv(
    nodeCryptoAlgo,
    key,
    iv,
  );
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(body), decipher.final()]);
};

export const separateTag = (
  bodyWithTag: Buffer,
  contentLen: string,
  tagLen: string, // this is BITS not BYTES
) => {
  // length of data.body should be content_len + tag_len
  const contentEnd: number = parseInt(contentLen, 10);
  const contentRange: number[] = [0, contentEnd];
  const tagEnd: number = parseInt(tagLen, 10) / 8;
  const tagRange: number[] = [contentEnd, contentEnd + tagEnd];
  assert(
    Math.max(...contentRange, ...tagRange) === bodyWithTag.length,
    `content+tag buffer length (${bodyWithTag.length}) did not match combined size of content and tag length headers (${contentEnd}, ${tagEnd})`,
  );
  return [bodyWithTag.slice(...contentRange), bodyWithTag.slice(...tagRange)];
};
