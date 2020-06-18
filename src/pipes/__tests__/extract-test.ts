import { Readable } from "stream";

import extract from "../extract";

jest.mock("../../constants", () => ({
  ...jest.requireActual("../../constants"),
  IS_PROD: false,
}));

describe("receive function handler", () => {
  describe("parseEmailBody", () => {
    let content: string, streamSource: Readable;

    beforeEach(() => {
      content = "email body content";
      streamSource = new Readable({ objectMode: true });
      streamSource._read = (): void => {
        streamSource.push({ type: "text", html: content });
        streamSource.push(null);
      };
    });

    it("returns the html member when the readable emits 'data'", (done) => {
      streamSource.pipe(extract()).on("data", (data) => {
        expect(data).toEqual(content);
        done();
      });
    });
  });
});
