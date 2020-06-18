jest.dontMock("mailparser");
jest.dontMock("axios");

import * as glob from "glob";
import { HeaderValue, simpleParser } from "mailparser";
import * as path from "path";

import SlackMessage, { Headers } from "../SlackMessage";

describe("fixtures", () => {
  const fixtureDir = path.join(__dirname, "../../fixtures/email");
  glob.sync(path.join(fixtureDir, "**/*.txt")).forEach((fixture) => {
    const relpath = path.relative(__dirname, fixture);

    it.call(
      global,
      path.relative(fixtureDir, fixture),
      async () => {
        const content = await import(relpath);

        const parsedEmail = await simpleParser(content);
        const { html } = parsedEmail;
        const headers: Headers = new Map(
          [...parsedEmail.headers.entries()].map(
            ([key, value]: [string, HeaderValue]) =>
              [key, value] as [string, string],
          ),
        );

        const slack = new SlackMessage(html as string, headers);
        expect(await slack.composeMessage()).toMatchSnapshot();
      },
      10000,
    );
  });
});
