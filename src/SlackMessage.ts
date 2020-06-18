import { ChatPostMessageArguments /* WebClient */ } from "@slack/web-api";
import { EmailAddress, HeaderValue } from "mailparser";

export type Headers = Map<string, string | HeaderValue>;

export default class SlackMessage {
  private body: string;
  private headers: Headers;
  // private slack: WebClient;

  constructor(emailBody: string, emailHeaders: Headers) {
    this.body = emailBody;
    this.headers = emailHeaders;
    // this.slack = new WebClient();
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
    return Promise.resolve();
    // const args = await this.composeMessage();
    // log.info(JSON.stringify(args));
    // this.slack.chat.postMessage({
    //   ...args,
    // });
  }

  public fullname(): string {
    if (!this.headers.has("from")) {
      return "Unknown sender";
    }

    const fromHeader = this.headers.get("from");
    if (typeof fromHeader === "string") {
      return fromHeader.split("<")[0].trim();
    }

    if (typeof fromHeader === "object" && "value" in fromHeader) {
      return (fromHeader.value[0] as EmailAddress).name;
    }

    return "Unknown sender";
  }

  public async avatar(): Promise<string> {
    return Promise.resolve("");
  }
}
