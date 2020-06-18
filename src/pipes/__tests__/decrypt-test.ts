import * as KMS from "aws-sdk/clients/kms";
import { SESMessage } from "aws-sdk/clients/ses";

import { Readable, Transform } from "stream";

import * as mail from "../../../fixtures/mail.json";
import { HEADER } from "../../constants";
import decrypt from "../decrypt";
import { Message } from "../download";

jest.mock("aws-sdk/clients/kms");
jest.mock("../../utils/crypto");
jest.mock("../../constants", () => ({
  ...jest.requireActual("../../constants"),
  IS_PROD: false,
}));

describe("decrypt pipe", () => {
  let streamSource: Readable;
  let message: SESMessage;

  beforeEach(() => {
    streamSource = new Readable({ objectMode: true });
    streamSource._read = (): void => {
      streamSource.push({
        body: Buffer.from("encrypted content", "utf-8"),
        headers: {
          [HEADER.KEY]: "encryption key",
          [HEADER.IV]: "initialization vector",
          [HEADER.ALGO]: "AES/GCM/NoPadding",
          [HEADER.CONTENT_LEN]: "17",
          [HEADER.MATSEC]:
            '{"aws:ses:message-id":"5cnusq25vfstt0cm5d48u3685n69jgnvsksal501","aws:ses:rule-name":"uvdsa-announce-bot-dev","aws:ses:source-account":"956518986395","kms_cmk_id":"arn:aws:kms:us-east-1:956518986395:key/1379c3ab-4633-4de2-9b66-1b5538fa28a6"}',
        },
      } as Message);
      streamSource.push(null);
    };
    message = JSON.parse(mail.Records[0].Sns.Message);
  });

  it("returns a transform stream", (done) => {
    const transformer = decrypt();
    expect(transformer).toBeInstanceOf(Transform);
    streamSource.pipe(transformer).on("data", (data) => {
      expect(data).not.toBeNull();
      done();
    });
  });

  it("decrypts the kms header key from the headers", (done) => {
    const transformer = decrypt();
    streamSource.pipe(transformer).on("data", () => {
      expect(KMS.prototype.decrypt).toHaveBeenCalledWith(
        expect.objectContaining({
          CiphertextBlob: Buffer.from("encryption key", "base64"),
          EncryptionContext: expect.objectContaining({
            "aws:ses:source-account": expect.stringMatching(/^\d{12}$/),
            "aws:ses:rule-name": "uvdsa-announce-bot-dev",
            "aws:ses:message-id": message.mail.messageId,
          }),
        }),
        expect.any(Function),
      );
      done();
    });
  });
});
