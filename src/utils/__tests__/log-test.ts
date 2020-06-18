import { TransformableInfo } from "logform";
import { MESSAGE } from "triple-beam";
import * as winston from "winston";

import log, { debugFormat } from "../log";

jest.mock("winston");
jest.mock("winston-transport/legacy");

describe("log util", () => {
  it("exports a configured instance of Winston", () => {
    log.error("testing winston");
    expect(winston.transports.Console.prototype.log).toHaveBeenCalled();
  });

  describe("in dev mode", () => {
    it("formats errors like I want", () => {
      const info = debugFormat.transform({
        [Symbol.for("level")]: "error",
        level: "error",
        message: (new Error("format the error please") as unknown) as string,
      }) as TransformableInfo;
      expect(info[MESSAGE].split(__dirname)[0]).toMatchSnapshot();
    });

    it("formats javascript objects like I want", () => {
      const info = debugFormat.transform({
        [Symbol.for("level")]: "info",
        level: "info",
        message: JSON.stringify({ foo: { bar: [1, 2, 3] } }, null, 2),
      }) as TransformableInfo;
      expect(info[MESSAGE]).toMatchSnapshot();
    });
  });
});
