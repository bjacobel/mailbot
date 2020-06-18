import SlackMessage from "../SlackMessage";

jest.mock("../constants", () => ({
  ...jest.requireActual("../constants"),
  IS_PROD: false,
}));

describe("parse function handler", () => {
  describe("basic info", () => {
    it("pulls the fulname from headers when `from` is set", () => {
      expect(
        new SlackMessage(
          "",
          new Map([["from", "Brian Jacobel <bjacobel@gmail.com>"]]),
        ).fullname(),
      ).toEqual("Brian Jacobel");
    });

    it("defaults to a username when from is not set", () => {
      expect(new SlackMessage("", new Map()).fullname()).toEqual(
        "UVDSA Announcements",
      );
    });
  });

  describe("composeMessage method", () => {
    it("matches snapshot for a basic email", async () => {
      const email = "";
      const headers = new Map([["from", "Brian Jacobel <bjacobel@gmail.com>"]]);
      const slack = new SlackMessage(email, headers);
      expect(await slack.composeMessage()).toMatchSnapshot();
    });
  });
});
