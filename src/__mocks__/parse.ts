import { ChatPostMessageArguments } from "@slack/client";

export const parseEmailBody = (__body: string): ChatPostMessageArguments => {
  return {
    channel: "general",
    text: "a mocked message",
  };
};
