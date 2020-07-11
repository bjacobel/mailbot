import { EmailEventSNSNotification } from "aws-sdk/clients/ses";
import { MailParser } from "mailparser";
import { mocked } from "ts-jest/utils";

import * as mail from "../../fixtures/encrypted/long/event.json";
import receive from "../receive";
import log from "../utils/log";

jest.mock("aws-sdk/clients/kms");
jest.mock("aws-sdk/clients/s3");
jest.mock("../utils/crypto");
jest.mock("../utils/log");
jest.mock("../SlackMessage");
jest.mock("mailparser");
jest.mock("../constants", () => ({
  ...jest.requireActual("../constants"),
  IS_PROD: false,
}));

describe("receive function handler", () => {
  beforeEach(() => {
    mocked(log.info).mockClear();
  });

  describe("main handler", () => {
    it("calls MailParser's constructor and pipes data thru it", async () => {
      await receive(mail);

      expect(MailParser.prototype.constructor).toHaveBeenCalled();
    });

    fit("logs out the email body", async () => {
      await receive(mail);

      expect(log.info).toHaveBeenCalledWith("decrypted: bodybodybodybodybo");
    });

    it("resolves", () => {
      expect(receive(mail)).resolves.toBeDefined();
    });
  });

  describe("error handling", () => {
    it("logs the error with ERROR level", async () => {
      return receive({} as EmailEventSNSNotification).catch(() =>
        expect(log.error).toHaveBeenCalledWith(expect.any(TypeError)),
      );
    });

    it("returns a promise rejection", () => {
      return receive({} as EmailEventSNSNotification).catch((err) =>
        expect(err).toBeInstanceOf(TypeError),
      );
    });
  });
});
