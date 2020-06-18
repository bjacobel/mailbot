import { SQSEvent } from "aws-lambda";

import log from "./utils/log";

export default async (event: SQSEvent): Promise<string> => {
  try {
    return Promise.resolve(event.Records[0].eventSource);
  } catch (e) {
    log.info(JSON.stringify(event, null, 2));
    log.error(e);
    return Promise.reject(e);
  }
};
