import { EmailEventSNSNotification, SESMessage } from "aws-sdk/clients/ses";
import { MailParser } from "mailparser";
import { pipeline } from "stream";

import decrypt from "./pipes/decrypt";
import download from "./pipes/download";
import extract from "./pipes/extract";
import SlackMessage from "./SlackMessage";
import log from "./utils/log";

export default async (
  event: EmailEventSNSNotification,
): Promise<void | Error> => {
  try {
    const message: SESMessage = JSON.parse(event.Records[0].Sns.Message);
    const headerArray: ReadonlyArray<[
      string,
      string,
    ]> = message.mail.headers.map((x) => [x.name, x.value] as [string, string]);
    const headerMap: Map<string, string> = new Map(headerArray);
    const { bucketName, objectKey } = message.receipt.action;
    const chunks: string[] = [];
    const bodyEmitter = await pipeline(
      await download(bucketName, objectKey),
      decrypt(),
      new MailParser(),
      extract(),
      (err) => {
        if (err) throw err;
      },
    );

    const emailHtml: string = await new Promise((resolve, reject) => {
      bodyEmitter
        .on("data", (data: string) => {
          chunks.push(data);
        })
        .on("end", () => {
          resolve(chunks.join(""));
        })
        .on("error", reject);
    });

    log.info(emailHtml);

    const slackMessage = new SlackMessage(emailHtml, headerMap);
    return slackMessage.send();
  } catch (e) {
    log.info(JSON.stringify(event));
    log.error(e);
    return Promise.reject(e);
  }
};
