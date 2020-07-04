const crypto = jest.requireActual("../crypto");

module.exports = {
  ...crypto,
  decrypt: jest.fn(
    (key: Buffer, iv: Buffer, algo: string, body: Buffer): Buffer => {
      return Buffer.concat([Buffer.from("decrypted: ", "utf-8"), body]);
    },
  ),
};
