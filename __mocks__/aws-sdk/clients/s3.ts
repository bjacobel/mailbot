import { GetObjectOutput } from "aws-sdk/clients/s3";
import { EventEmitter } from "events";
import { Readable } from "stream";
import { inherits } from "util";

import { HEADER } from "../../../src/constants";

const S3 = function () {
  // @ts-ignore TS2683
  EventEmitter.call(this);
};
inherits(S3, EventEmitter);

S3.prototype.getObject = jest.fn(() => {
  process.nextTick(() => {
    S3.prototype.emit("httpHeaders", 200, {
      [HEADER.KEY]: "encryption key",
      [HEADER.IV]: "initialization vector",
      [HEADER.ALGO]: "AES/GCM/NoPadding",
      [HEADER.CONTENT_LEN]: "18",
      [HEADER.MATSEC]:
        '{"aws:ses:message-id":"5cnusq25vfstt0cm5d48u3685n69jgnvsksal501","aws:ses:rule-name":"uvdsa-announce-bot-dev","aws:ses:source-account":"956518986395","kms_cmk_id":"arn:aws:kms:us-east-1:956518986395:key/1379c3ab-4633-4de2-9b66-1b5538fa28a6"}',
    });
  });
  return S3.prototype;
});
S3.prototype.createReadStream = jest.fn(
  (): Readable => {
    const readStream = new Readable();
    readStream._read = () => {
      readStream.push("email body content" as GetObjectOutput["Body"]);
      readStream.push(null);
    };

    return readStream;
  },
);

module.exports = S3;
