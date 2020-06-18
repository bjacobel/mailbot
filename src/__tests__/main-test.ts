import { SQSEvent } from "aws-lambda";

import main from "../main";
import log from "../utils/log";

jest.mock("../utils/log");
jest.mock("../constants", () => ({
  ...jest.requireActual("../constants"),
  IS_PROD: false,
}));

describe("main function handler", () => {
  describe("happy path of boilerplate", () => {
    it("resolves with details from event sent", () => {
      expect(
        main({ Records: [{ eventSource: "s3" }] } as SQSEvent),
      ).resolves.toEqual("s3");
    });
  });
  describe("error handling", () => {
    it("logs the event with INFO level", () => {
      return main(("nope" as unknown) as SQSEvent).catch(() =>
        expect(log.info).toHaveBeenCalledWith('"nope"'),
      );
    });

    it("logs the error with ERROR level", async () => {
      return main(("nope" as unknown) as SQSEvent).catch(() =>
        expect(log.error).toHaveBeenCalledWith(expect.any(TypeError)),
      );
    });

    it("returns a promise rejection", () => {
      return main(("nope" as unknown) as SQSEvent).catch((err: Error) =>
        expect(err).toBeInstanceOf(TypeError),
      );
    });
  });
});
