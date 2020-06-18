import * as KMS from "aws-sdk/clients/kms";
import { Transform } from "stream";

import { HEADER } from "../constants";
import { decrypt, JavaCryptoAlgos, separateTag } from "../utils/crypto";
import { Message } from "./download";

export default (): Transform => {
  const trs = new Transform({ objectMode: true });
  const kms = new KMS();

  trs._transform = (
    data: Message,
    encoding,
    callback: (err: Error | undefined, decryptedBody: Buffer) => void,
  ): void => {
    const CiphertextBlob = Buffer.from(data.headers[HEADER.KEY], "base64");
    kms.decrypt(
      {
        CiphertextBlob,
        EncryptionContext: JSON.parse(
          data.headers[HEADER.MATSEC],
        ) as KMS.EncryptionContextType,
      },
      (err: Error, kmsData: KMS.DecryptResponse) => {
        if (err) {
          trs.emit("error", err);
        } else {
          const [unencryptedBody, tag] = separateTag(
            data.body, // this buffer contains the encrypted body and the tag smooshed together
            data.headers[HEADER.CONTENT_LEN], // aws tells us how many bytes of it are body
            data.headers[HEADER.TAG_LEN], // it also tells us how long the tag is (128)
          );
          callback(
            undefined,
            decrypt(
              kmsData.Plaintext as Buffer,
              Buffer.from(data.headers[HEADER.IV], "base64"),
              data.headers[HEADER.ALGO] as JavaCryptoAlgos,
              unencryptedBody,
              tag,
            ),
          );
        }
      },
    );
  };
  return trs;
};
