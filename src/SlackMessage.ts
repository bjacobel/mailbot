import { ChatPostMessageArguments } from "@slack/client";
import { EmailAddress, HeaderValue } from "mailparser";

import log from "./utils/log";

export type Headers = Map<string, string | HeaderValue>;

export default class SlackMessage {
  private body: string;
  private headers: Headers;

  constructor(emailBody: string, emailHeaders: Headers) {
    this.body = emailBody;
    this.headers = emailHeaders;
  }

  public async composeMessage(): Promise<ChatPostMessageArguments> {
    return {
      mrkdwn: true,
      username: this.fullname(),
      channel: "",
      text: this.body, // todo: transform html to markdown
    };
  }

  public async send(): Promise<void> {
    const args = await this.composeMessage();
    log.info(JSON.stringify(args));
  }

  public fullname(): string {
    if (!this.headers.has("from")) {
      return "UVDSA Announcements";
    }

    const fromHeader = this.headers.get("from");
    if (typeof fromHeader === "string") {
      return fromHeader.split("<")[0].trim();
    }

    if (typeof fromHeader === "object" && "value" in fromHeader) {
      return (fromHeader.value[0] as EmailAddress).name;
    }

    return "UVDSA Announcements";
  }

  public async avatar(): Promise<string> {
    return Promise.resolve("");
  }
}
