import * as crypto from "crypto";

import { decrypt, JavaCryptoAlgos, separateTag } from "../crypto";

describe("decryption helper", () => {
  describe("decrypt method", () => {
    let iv: Buffer;
    let key: Buffer;
    let encryptedBody: Buffer;
    let unencryptedBody: Buffer;
    let tag: Buffer;

    beforeEach(() => {
      iv = Buffer.from("vectorvectorvect", "utf-8"); // 16 bytes
      key = Buffer.alloc(32, "key", "utf-8"); // 32 bytes

      unencryptedBody = Buffer.from("the body", "utf-8");

      const cipher: crypto.CipherGCM = crypto.createCipheriv(
        "aes-256-gcm",
        key,
        iv,
      );
      encryptedBody = Buffer.concat([
        cipher.update(unencryptedBody),
        cipher.final(),
      ]);
      tag = cipher.getAuthTag();
    });

    it("decrypts a known cipher when fed the correct key, encoding and algo", () => {
      expect(decrypt(key, iv, JavaCryptoAlgos.GCM, encryptedBody, tag)).toEqual(
        unencryptedBody,
      );
    });
  });

  describe("separateTag method", () => {
    let bodyLenHeader: string, tagLenHeader: string, body: Buffer, tag: Buffer;

    beforeEach(() => {
      bodyLenHeader = "4966";
      tagLenHeader = "128";
      body = Buffer.alloc(parseInt(bodyLenHeader, 10), "body", "utf-8");
      tag = Buffer.alloc(parseInt(tagLenHeader, 10) / 8, "tag", "utf-8");
    });

    it("pulls the tag out of the body when it's smushed in", () => {
      expect(
        separateTag(Buffer.concat([body, tag]), bodyLenHeader, tagLenHeader),
      ).toEqual([body, tag]);
    });

    it("yields two values which together equal the original passed value", () => {
      const [separatedBody, separatedTag] = separateTag(
        Buffer.concat([body, tag]),
        bodyLenHeader,
        tagLenHeader,
      );
      expect(separatedBody).toEqual(body);
      expect(separatedTag).toEqual(tag);
    });
  });
});
