import * as KMS from "aws-sdk/clients/kms";
import { SESMessage } from "aws-sdk/clients/ses";
import { mocked } from "ts-jest/utils";

import { Readable, Transform } from "stream";

import * as event from "../../../fixtures/encrypted/long/event.json";
import { HEADER } from "../../constants";
import decrypt from "../decrypt";
import { decrypt as decryptHelper } from "../../utils/crypto";
import { Message } from "../download";

jest.mock("aws-sdk/clients/kms");
jest.mock("../../utils/crypto");
jest.mock("../../constants", () => ({
  ...jest.requireActual("../../constants"),
  IS_PROD: false,
}));

const secretMessage = Buffer.from("encrypted content", "utf-8");
const tag = Buffer.from("tagtagtagtagtagt", "utf-8");

const headers = {
  [HEADER.KEY]: "encryption key",
  [HEADER.IV]: "initialization vector",
  [HEADER.ALGO]: "AES/GCM/NoPadding",
  // content includes tag at the end, so it's 16 (128/8) longer than you think
  [HEADER.CONTENT_LEN]: String(secretMessage.length),
  [HEADER.TAG_LEN]: String(tag.length * 8), // for some godforsaken reason this is in BITS
  [HEADER.MATSEC]:
    '{"aws:ses:message-id":"l9qqcrolmee63vbg1ab7p8hr7fd9a3d3lug34301","aws:ses:rule-name":"uvdsa-announce-bot-dev","aws:ses:source-account":"956518986395","kms_cmk_id":"arn:aws:kms:us-east-1:956518986395:key/1379c3ab-4633-4de2-9b66-1b5538fa28a6"}',
};

describe("decrypt pipe", () => {
  let streamSource: Readable;
  let message: SESMessage;

  beforeEach(() => {
    streamSource = new Readable({ objectMode: true });
    streamSource._read = (): void => {
      streamSource.push({
        body: Buffer.concat([secretMessage, tag]),
        headers,
      } as Message);
      streamSource.push(null);
    };
    message = JSON.parse(event.Records[0].Sns.Message);
    mocked(decryptHelper).mockClear();
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

  it("handles case where the whole email fits in one stream queue slot", () => {
    const transformer = decrypt();
    expect(transformer).toBeInstanceOf(Transform);
    streamSource.pipe(transformer).on("data", () => {
      expect(decryptHelper).toHaveBeenCalledTimes(1);
      expect(decryptHelper).toHaveBeenCalledWith(
        expect.any(Buffer),
        expect.any(Buffer),
        expect.any(String),
        secretMessage,
        tag,
      );
    });
  });

  it("handles case where decrypt recieves a partial body", (done) => {
    const firstSegment = Buffer.from("encrypted c", "utf-8");
    const secondSegment = Buffer.from("ontent", "utf-8");
    const totalLength = String(firstSegment.length + secondSegment.length);

    streamSource = new Readable({ objectMode: true });
    streamSource._read = (): void => {
      streamSource.push({
        body: firstSegment,
        headers: {
          ...headers,
          [HEADER.CONTENT_LEN]: totalLength,
        },
      } as Message);
      streamSource.push({
        body: Buffer.concat([secondSegment, tag]),
        headers: {
          ...headers,
          [HEADER.CONTENT_LEN]: totalLength,
        },
      } as Message);
      streamSource.push(null);
    };

    const transformer = decrypt();
    streamSource
      .pipe(transformer)
      .on("error", fail)
      .on("data", () => {
        expect(decryptHelper).toHaveBeenCalledTimes(1);
        expect(decryptHelper).toHaveBeenCalledWith(
          expect.any(Buffer),
          expect.any(Buffer),
          expect.any(String),
          secretMessage,
          tag,
        );
        done();
      });
  });
});
