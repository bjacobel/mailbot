import { DecryptRequest, DecryptResponse } from "aws-sdk/clients/kms";

// tslint:disable-next-line no-empty
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
