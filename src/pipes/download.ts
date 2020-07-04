import * as S3 from "aws-sdk/clients/s3";
import { Readable, Transform } from "stream";

export interface Message {
  body: Buffer;
  headers: {
    [key: string]: string;
  };
}

export default (Bucket: string, Key: string): Readable => {
  const s3 = new S3();
  let metadata = {};

  const enrichWithHeaders = new Transform({ objectMode: true });
  enrichWithHeaders._transform = (data, encoding, callback): void => {
    callback(undefined, { headers: metadata, body: data } as Message);
  };

  // eslint-disable-next-line
  let result: Readable;

  // @TODO: Bodies that are large enough to get broken over multiple stream events will be fucked up BAD by this
  const s3stream: Readable = s3
    .getObject({ Bucket, Key })
    .on("httpHeaders", (statusCode, headers) => {
      metadata = {
        ...metadata,
        ...Object.entries(headers || {})
          .filter(([key]) => key.startsWith("x-amz-meta-"))
          .reduce((prev, [key, val]) => ({ ...prev, [key]: val }), {}),
      };
    })
    .createReadStream()
    .on("error", (err) => result.emit("error", err));

  result = s3stream.pipe(enrichWithHeaders);
  return result;
};
