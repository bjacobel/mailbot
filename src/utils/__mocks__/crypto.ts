export const decrypt = jest.fn(
  (key: Buffer, iv: Buffer, algo: string, body: Buffer): Buffer => {
    return Buffer.concat([Buffer.from("decrypted: ", "utf-8"), body]);
  },
);

export const separateTag = jest.fn(
  (bigBuf: Buffer, contentLenHeader: string, tagLenHeader: string) => {
    return [
      Buffer.alloc(parseInt(contentLenHeader, 10), "body", "utf-8"),
      Buffer.alloc(parseInt(tagLenHeader, 10) || 128, "tag", "utf-8"),
    ];
  },
);
