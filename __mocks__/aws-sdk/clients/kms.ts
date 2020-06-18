import { DecryptRequest, DecryptResponse } from "aws-sdk/clients/kms";

// eslint-disable-next-line
function KMS() {}

KMS.prototype.decrypt = jest.fn(
  (
    req: DecryptRequest,
    callback: (err: Error | undefined, data: DecryptResponse) => void,
  ) => {
    callback(undefined, {
      Plaintext: Buffer.alloc(32, "key", "utf-8"),
    } as DecryptResponse);
  },
);

module.exports = KMS;
