import { EmailEventSNSNotification } from "aws-sdk/clients/ses";
import { MailParser } from "mailparser";
import * as mail from "../../fixtures/mail.json";
import receive from "../receive";
import SlackMessage from "../SlackMessage";
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
  describe("main handler", () => {
    it("calls MailParser's constructor and pipes data thru it", async () => {
      await receive(mail);

      expect(MailParser.prototype.constructor).toHaveBeenCalled();
    });

    it("creates a SlackMessage with the proper constructor args", async () => {
      // @ts-ignore 2332
      await receive(mail);

      expect(SlackMessage.prototype.constructor).toHaveBeenCalledWith(
        "decrypted: bodybodybodybodybo",
        expect.any(Map),
      );
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
