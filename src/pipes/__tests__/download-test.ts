import * as S3 from "aws-sdk/clients/s3";
import { Readable } from "stream";
import { mocked } from "ts-jest/utils";

import download from "../download";

jest.mock("aws-sdk/clients/s3");
jest.mock("../../constants", () => ({
  ...jest.requireActual("../../constants"),
  IS_PROD: false,
}));

describe("download pipe", () => {
  it("calls S3 with the bucket and key passed", async () => {
    await new Promise((resolve) =>
      download("bucket", "key").on("finish", resolve),
    );
    expect(S3.prototype.getObject).toHaveBeenLastCalledWith({
      Bucket: "bucket",
      Key: "key",
    });
  });

  it("catches the issue when getObject fails before the stream transform", (done) => {
    const accessDenied = new Error("AccessDenied");
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore 2339
    mocked(S3.prototype.createReadStream).mockImplementationOnce(() => {
      const readStream = new Readable();
      readStream._read = (): void => {
        readStream.emit("error", accessDenied);
      };
      return readStream;
    });

    download("bucket", "key").on("error", (error) => {
      expect(error).toEqual(accessDenied);
      done();
    });
  });

  it("returns a stream with header and body data if getObject emitted x-amz-meta headers", async (done) => {
    const headers = {
      "x-amz-meta-hello": "goodbye",
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore 2345
    mocked(S3.prototype.getObject).mockImplementationOnce(() => {
      process.nextTick(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore 2339
        S3.prototype.emit("httpHeaders", 200, headers);
      });
      return S3.prototype;
    });

    download("bucket", "key").on("data", (chunk) => {
      expect(chunk.headers).toEqual(headers);
      done();
    });
  });
});
